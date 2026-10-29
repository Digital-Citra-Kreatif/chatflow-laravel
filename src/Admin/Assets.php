<?php
namespace ChatFlow\Laravel\Admin;

/** URLs of the published package assets (public/vendor/chatflow), versioned by the package's dist file. */
final class Assets {
	public static function url( string $path ): string {
		$path = ltrim( $path, '/' );
		return asset( 'vendor/chatflow/' . $path ) . '?v=' . self::version( $path );
	}

	public static function version( string $path ): string {
		$file = dirname( __DIR__, 2 ) . '/dist/' . ltrim( $path, '/' );
		if ( ! is_file( $file ) ) {
			return '0';
		}
		$hash = md5_file( $file );
		return false === $hash ? (string) filemtime( $file ) : substr( $hash, 0, 12 );
	}
}
