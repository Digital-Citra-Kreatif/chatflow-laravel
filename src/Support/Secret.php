<?php
namespace ChatFlow\Laravel\Support;

/** Key material for signing and encryption; replaces the plugin's wp_salt(). */
final class Secret {
	/** Raw bytes of config('chatflow.secret') when set, otherwise the decoded application key. */
	public static function key(): string {
		$secret = config( 'chatflow.secret' );
		if ( ! is_string( $secret ) || '' === $secret ) {
			$secret = (string) config( 'app.key', '' );
		}
		if ( str_starts_with( $secret, 'base64:' ) ) {
			$decoded = base64_decode( substr( $secret, 7 ), true );
			$secret  = false === $decoded ? $secret : $decoded;
		}
		if ( '' === $secret ) {
			throw new \RuntimeException( 'ChatFlow needs an application key (APP_KEY) or CHATFLOW_SECRET.' );
		}
		return $secret;
	}

	/** A purpose-bound 32-byte key derived from key(). */
	public static function derive( string $purpose ): string {
		return hash_hmac( 'sha256', $purpose, self::key(), true );
	}
}
