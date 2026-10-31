<?php
namespace ChatFlow\Laravel\Frontend;

/**
 * The visitor chat's text, from Laravel's lang files (lang/{locale}/runtime.php in the package,
 * changed by apps in lang/vendor/chatflow/{locale}/runtime.php). The runtime carries the English
 * and Indonesian text itself, so a page only sends what differs from that.
 */
final class Phrases {
	/**
	 * The locale a form speaks: its own language setting, or the app's current locale.
	 *
	 * @param array<string,mixed> $envelope
	 */
	public static function locale( array $envelope ): string {
		$language = (string) ( $envelope['form']['language'] ?? 'site' );
		return 'site' === $language || '' === $language ? app()->getLocale() : $language;
	}

	/** @return array<string,string> */
	public static function all( string $locale ): array {
		$lines = trans( 'chatflow::runtime', array(), $locale );
		return is_array( $lines ) ? array_filter( $lines, 'is_string' ) : array();
	}

	/**
	 * What the runtime lacks for this locale: the app's changes, and locales it has no text for.
	 *
	 * @return array<string,string>
	 */
	public static function forRuntime( string $locale ): array {
		return array_diff_assoc( self::all( $locale ), self::builtIn( $locale ) );
	}

	/**
	 * One phrase as the visitor sees it: the form's own wording, else the translation.
	 *
	 * @param array<string,mixed> $envelope
	 */
	public static function get( string $key, array $envelope ): string {
		$own = ( (array) ( $envelope['form']['phrases'] ?? array() ) )[ $key ] ?? null;
		if ( is_string( $own ) && '' !== $own ) {
			return $own;
		}
		$locale = self::locale( $envelope );
		return self::all( $locale )[ $key ] ?? self::builtIn( $locale )[ $key ] ?? $key;
	}

	/**
	 * The runtime's own copy for a locale (Indonesian for id*, English otherwise).
	 *
	 * @return array<string,string>
	 */
	private static function builtIn( string $locale ): array {
		static $files = array();
		$file = preg_match( '/^id(?:[-_]|$)/i', $locale ) ? 'id' : 'en';
		return $files[ $file ] ??= require dirname( __DIR__, 2 ) . '/lang/' . $file . '/runtime.php';
	}
}
