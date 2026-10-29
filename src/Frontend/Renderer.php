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
	 * @param array<string,mixed> $options mode, height, position, theme, auto_open, scroll_percent
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
		$style          = in_array( $mode, array( 'launcher', 'popup' ), true ) ? 'display:block' : 'display:block;min-height:' . $height . 'px';
		// Options the embed leaves out fall back to the form's own launcher settings.
		$auto_open      = $options['auto_open'] ?? '';
		$auto_open      = '' === $auto_open || null === $auto_open ? ( $launcher['autoOpenSeconds'] ?? '' ) : $auto_open;
		$scroll_percent = $options['scroll_percent'] ?? '';
		$scroll_percent = '' === $scroll_percent || null === $scroll_percent ? ( $launcher['scrollPercent'] ?? '' ) : $scroll_percent;
		$delay          = is_numeric( $auto_open ) ? max( 0, min( 3600, (int) $auto_open ) ) : '';
		$scroll         = is_numeric( $scroll_percent ) ? max( 0, min( 100, (int) $scroll_percent ) ) : '';
		$rest_url       = url( trim( (string) config( 'chatflow.api.prefix', 'chatflow/api/v1' ), '/' ) ) . '/';
		$markup         = '<cff-chat data-mode="' . e( $mode ) . '" data-position="' . e( $position ) . '" data-auto-open="' . e( (string) $delay ) . '" data-scroll-percent="' . e( (string) $scroll ) . '" data-form-id="' . $id . '" data-rest-url="' . e( $rest_url ) . '" style="' . $style . '"><span data-cff-loading>' . e( __( 'Loading chat…' ) ) . '</span><script type="application/json" data-cff-schema>' . $data . '</script></cff-chat>';
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
		return $html . self::module( 'runtime.js', 'cff-runtime-js' );
	}

	private static function module( string $file, string $id ): string {
		$src = asset( 'vendor/chatflow/runtime/' . $file ) . '?v=' . self::version( $file );
		return '<script type="module" data-no-optimize="1" data-cfasync="false" src="' . e( $src ) . '" id="' . $id . '"></script>';
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
