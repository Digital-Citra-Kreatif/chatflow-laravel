<?php
namespace ChatFlow\Laravel\Frontend;

use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Forms\PublicProjection;
use ChatFlow\Laravel\Support\Settings;

/**
 * Embed markup for a published form: the <cff-chat> element with its inline
 * public envelope, followed (once per request) by the runtime module script and,
 * when tracking is enabled, the tracking config and script.
 */
final class Renderer {
	private const PRINTED = 'chatflow.runtime_printed';

	/** @var array<string,string> */
	private static array $versions = array();

	/**
	 * @param array<string,mixed> $options mode, height, position, theme, auto_open, scroll_percent, bottom_offset
	 */
	public static function render( int $id, array $options = array() ): string {
		$form = ( new FormRepository() )->getPublished( $id );
		if ( ! $form ) {
			return ''; }
		$envelope = PublicProjection::build( $form );
		if ( in_array( $options['theme'] ?? '', array( 'auto', 'light', 'dark' ), true ) ) {
			$envelope['form']['appearance']->theme = $options['theme'];
		}
		$data           = json_encode( $envelope, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRESERVE_ZERO_FRACTION );
		$height         = max( 200, min( 2000, (int) ( self::given( $options['height'] ?? null ) ?? $form->settings()['display']['height'] ?? 600 ) ) );
		$requested_mode = $options['mode'] ?? 'inline';
		$mode           = in_array( $requested_mode, array( 'inline', 'fullpage', 'launcher', 'popup' ), true ) ? $requested_mode : 'inline';
		$launcher       = $form->settings()['display']['launcher'] ?? array();
		$position       = (string) ( $options['position'] ?? '' );
		$position       = 'left' === ( '' === $position ? ( $launcher['position'] ?? 'right' ) : $position ) ? 'left' : 'right';
		$floating       = in_array( $mode, array( 'launcher', 'popup' ), true );
		// Extra space below a launcher or pop-up button, to clear cookie bars.
		$bottom_offset  = self::given( $options['bottom_offset'] ?? null ) ?? $launcher['bottomOffset'] ?? 0;
		$bottom_offset  = is_numeric( $bottom_offset ) ? max( 0, min( 400, (int) $bottom_offset ) ) : 0;
		// A launcher or pop-up takes no room before the runtime loads: the host is a fixed, empty
		// box and only its placeholder button shows, fixed in the corner. Once the runtime's own
		// styles take over nothing on the page has moved.
		$style          = $floating
			? 'display:block;position:fixed;bottom:0;' . $position . ':0;width:0;height:0;z-index:2147480000'
			: 'display:block;min-height:' . $height . 'px';
		// Options the embed leaves out fall back to the form's own launcher settings.
		$auto_open      = $options['auto_open'] ?? '';
		$auto_open      = '' === $auto_open || null === $auto_open ? ( $launcher['autoOpenSeconds'] ?? '' ) : $auto_open;
		$scroll_percent = $options['scroll_percent'] ?? '';
		$scroll_percent = '' === $scroll_percent || null === $scroll_percent ? ( $launcher['scrollPercent'] ?? '' ) : $scroll_percent;
		$delay          = is_numeric( $auto_open ) ? max( 0, min( 3600, (int) $auto_open ) ) : '';
		$scroll         = is_numeric( $scroll_percent ) ? max( 0, min( 100, (int) $scroll_percent ) ) : '';
		// The chat's text in the form's language, from Laravel's lang files.
		$locale         = Phrases::locale( $envelope );
		$phrases        = Phrases::forRuntime( $locale );
		$rest_url       = url( trim( (string) config( 'chatflow.api.prefix', 'chatflow/api/v1' ), '/' ) ) . '/';
		$markup         = '<cff-chat data-mode="' . e( $mode ) . '" data-position="' . e( $position ) . '" data-auto-open="' . e( (string) $delay ) . '" data-scroll-percent="' . e( (string) $scroll ) . '"' . ( $bottom_offset ? ' data-bottom-offset="' . $bottom_offset . '"' : '' ) . ' data-form-id="' . $id . '" data-rest-url="' . e( $rest_url ) . '" data-locale="' . e( $locale ) . '"' . ( $phrases ? ' data-phrases="' . e( (string) json_encode( $phrases, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) ) . '"' : '' ) . ' style="' . $style . '">' . ( $floating ? self::placeholder( $envelope, $position, 16 + $bottom_offset ) : '<span data-cff-loading>' . e( Phrases::get( 'loading', $envelope ) ) . '</span>' ) . '<script type="application/json" data-cff-schema>' . $data . '</script></cff-chat>';
		return $markup . self::scripts();
	}

	/** Runtime (and tracking) script tags, printed at most once per request. */
	public static function scripts(): string {
		$request = request();
		if ( $request->attributes->get( self::PRINTED ) ) {
			return '';
		}
		$request->attributes->set( self::PRINTED, true );
		$html     = '';
		$settings = Settings::get();
		$tracking = $settings['tracking'];
		if ( ! empty( $tracking['enabled'] ) && ! ( $settings['privacy']['respectDnt'] && '1' === $request->header( 'DNT' ) ) ) {
			$config = json_encode(
				array_merge(
					$tracking,
					array(
						'consentGranted' => false,
						'respectDnt'     => (bool) $settings['privacy']['respectDnt'],
					)
				),
				JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES
			);
			$html  .= '<script>window.cffTracking=' . $config . ';</script>';
			$html  .= self::module( 'tracking.js', 'cff-tracking-js' );
		}
		// The loader brings in the runtime: at once, or for launcher-only pages once the page is idle
		// or the visitor reaches for the button.
		return $html . self::module( 'loader.js', 'cff-runtime-js', array( 'data-runtime' => self::src( 'runtime.js' ) ) );
	}

	/**
	 * The launcher's button before the runtime has loaded, drawn like the runtime's own toggle:
	 * the brand colour when set, else the style's default, with a readable icon colour.
	 *
	 * @param array<string,mixed> $envelope
	 */
	private static function placeholder( array $envelope, string $side, int $bottom ): string {
		$appearance = (array) ( $envelope['form']['appearance'] ?? array() );
		$messaging  = 'messaging' === ( $appearance['style'] ?? '' );
		$brand      = is_string( $appearance['primary'] ?? null ) && preg_match( '/^#[0-9a-f]{6}$/i', $appearance['primary'] ) ? $appearance['primary'] : null;
		$background = $brand ?? ( $messaging ? '#3390ec' : '#171717' );
		$icon       = self::luminance( $background ) > 0.45 ? '#171717' : '#ffffff';
		return '<button type="button" data-cff-placeholder aria-label="' . e( Phrases::get( 'openChat', $envelope ) ) . '" style="position:fixed;bottom:' . $bottom . 'px;' . $side . ':16px;display:grid;place-items:center;width:60px;height:60px;padding:0;border:0;border-radius:50%;background:' . $background . ';color:' . $icon . ';box-shadow:0 6px 24px #0003;cursor:pointer">'
			. '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 3C6.5 3 2 6.9 2 11.7c0 2.4 1.1 4.6 3 6.2L4.2 22l4.5-2.2c1 .3 2.1.5 3.3.5 5.5 0 10-3.9 10-8.6S17.5 3 12 3z"/></svg></button>';
	}

	/** Relative luminance of a #rrggbb colour (WCAG). */
	private static function luminance( string $hex ): float {
		$channel = static function ( string $part ): float {
			$value = hexdec( $part ) / 255;
			return $value <= 0.03928 ? $value / 12.92 : ( ( $value + 0.055 ) / 1.055 ) ** 2.4;
		};
		return 0.2126 * $channel( substr( $hex, 1, 2 ) ) + 0.7152 * $channel( substr( $hex, 3, 2 ) ) + 0.0722 * $channel( substr( $hex, 5, 2 ) );
	}

	/** @param array<string,string> $attributes */
	private static function module( string $file, string $id, array $attributes = array() ): string {
		$extra = '';
		foreach ( $attributes as $name => $value ) {
			$extra .= ' ' . $name . '="' . e( $value ) . '"';
		}
		return '<script type="module" data-no-optimize="1" data-cfasync="false" src="' . e( self::src( $file ) ) . '" id="' . $id . '"' . $extra . '></script>';
	}

	private static function src( string $file ): string {
		return asset( 'vendor/chatflow/runtime/' . $file ) . '?v=' . self::version( $file );
	}

	private static function version( string $file ): string {
		if ( ! isset( self::$versions[ $file ] ) ) {
			$path                   = __DIR__ . '/../../dist/runtime/' . $file;
			$public                 = public_path( 'vendor/chatflow/runtime/' . $file );
			$path                   = is_readable( $public ) ? $public : $path;
			$hash                   = is_readable( $path ) ? hash_file( 'sha256', $path ) : false;
			self::$versions[ $file ] = false === $hash ? '1' : substr( $hash, 0, 12 );
		}
		return self::$versions[ $file ];
	}

	private static function given( mixed $value ): mixed {
		return null === $value || '' === $value ? null : $value;
	}
}
