<?php
namespace ChatFlow\Laravel\Spam;

use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Support\Secret;
use ChatFlow\Laravel\Support\Settings;

/**
 * Sliding-window limit per HMAC-hashed identity: a counter per fixed window, plus the
 * previous window's count weighted by how much of it still overlaps the last $window
 * seconds. A fixed window alone let about twice the limit through around a boundary.
 */
final class RateLimiter {
	/** New chats allowed per form and IP address per 10 minutes (defaults.spam.startLimit). */
	public static function startLimit(): int {
		$limit = Settings::get()['spam']['startLimit'] ?? 300;
		return is_numeric( $limit ) ? max( 1, (int) $limit ) : 300;
	}

	public function consume( string $identity, int $limit, int $window, ?int $now = null ): bool {
		$now    ??= time();
		$window   = max( 1, min( 86400, $window ) );
		$index    = intdiv( $now, $window );
		$bucket   = self::bucket( $identity, $index );
		// Each window's count is kept one window longer: the next window still reads it.
		$expires  = gmdate( 'Y-m-d H:i:s', ( $index + 2 ) * $window );
		$hits     = Database::transaction(
			static function () use ( $bucket, $expires ): int {
				$row = Database::query( 'rate_limits' )->where( 'bucket_hash', $bucket )->lockForUpdate()->first( array( 'hits' ) );
				if ( ! $row ) {
					$inserted = Database::query( 'rate_limits' )->insertOrIgnore(
						array(
							'bucket_hash' => $bucket,
							'hits'        => 1,
							'expires_at'  => $expires,
						)
					);
					if ( 1 === $inserted ) {
						return 1;
					}
					// A concurrent request created the bucket first.
					$row = Database::query( 'rate_limits' )->where( 'bucket_hash', $bucket )->lockForUpdate()->first( array( 'hits' ) );
					if ( ! $row ) {
						throw new \RuntimeException( 'Rate limit bucket missing.' );
					}
				}
				Database::query( 'rate_limits' )->where( 'bucket_hash', $bucket )->increment( 'hits' );
				return (int) $row->hits + 1;
			}
		);
		if ( Error::is( $hits ) ) {
			throw new \RuntimeException( 'ChatFlow storage failed.' );
		}
		$previous = (int) Database::query( 'rate_limits' )->where( 'bucket_hash', self::bucket( $identity, $index - 1 ) )->value( 'hits' );
		$overlap  = 1 - ( $now - $index * $window ) / $window;
		return $hits + (int) floor( $previous * $overlap ) <= $limit;
	}

	private static function bucket( string $identity, int $index ): string {
		return hash_hmac( 'sha256', '1:' . $identity . ':' . $index, Secret::derive( 'cff-rate-limit' ) );
	}
}
