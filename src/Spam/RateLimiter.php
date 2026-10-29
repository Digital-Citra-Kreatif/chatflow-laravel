<?php
namespace ChatFlow\Laravel\Spam;

use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Support\Secret;

/** Fixed-window counter per HMAC-hashed identity bucket. */
final class RateLimiter {
	public function consume( string $identity, int $limit, int $window, ?int $now = null ): bool {
		$now    ??= time();
		$window   = max( 1, min( 86400, $window ) );
		$bucket   = hash_hmac( 'sha256', '1:' . $identity . ':' . intdiv( $now, $window ), Secret::derive( 'cff-rate-limit' ) );
		$expires  = gmdate( 'Y-m-d H:i:s', ( intdiv( $now, $window ) + 1 ) * $window );
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
		return $hits <= $limit;
	}
}
