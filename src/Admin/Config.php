<?php
namespace ChatFlow\Laravel\Admin;

use ChatFlow\Laravel\ChatFlowServiceProvider;
use ChatFlow\Laravel\Fields\Registry;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Support\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/** Builds window.cffAdmin for the admin React apps (the plugin's AdminModule::config()). */
final class Config {
	public function __construct( private FormRepository $forms = new FormRepository() ) {}

	/** @return array<string,mixed> */
	public function build( string $screen, Request $request ): array {
		$caps = array();
		foreach ( ChatFlowServiceProvider::ABILITIES as $cap => $ability ) {
			$caps[ $cap ] = Gate::allows( $ability );
		}
		$caps['purge_submissions'] = false;
		$caps['manage_settings']   = false;
		$global                    = Settings::get();
		// Global values a form inherits while it has no per-form override. The builder
		// shows them as inherited values and never writes them into the form.
		$defaults = array(
			'appearance' => array( 'theme' => $global['defaultTheme'] ?? 'light' ),
			'privacy'    => array(
				'ipMode'               => $global['privacy']['ip'] ?? 'anonymized',
				'storeMeta'            => (bool) ( $global['privacy']['storeMeta'] ?? true ),
				'storeUserAgent'       => (bool) ( $global['privacy']['storeUserAgent'] ?? false ),
				'respectDnt'           => (bool) ( $global['privacy']['respectDnt'] ?? true ),
				'retentionEnabled'     => (bool) ( $global['retention']['enabled'] ?? false ),
				'retentionDays'        => (int) ( $global['retention']['days'] ?? 360 ),
				'partialRetentionDays' => $global['retention']['partialDays'] ?? null,
			),
			'spam'       => array(),
		);
		foreach ( array( 'honeypotEnabled', 'minSeconds', 'rateLimit', 'rateWindowSeconds', 'captcha', 'akismetEnabled' ) as $key ) {
			if ( isset( $global['spam'][ $key ] ) ) {
				$defaults['spam'][ $key ] = $global['spam'][ $key ];
			}
		}
		$types  = Registry::enabledTypes();
		$config = array(
			'defaults'      => $defaults,
			'restUrl'       => self::restUrl(),
			'publicRestUrl' => url( trim( (string) config( 'chatflow.api.prefix', 'chatflow/api/v1' ), '/' ) ) . '/',
			'nonce'         => csrf_token(),
			'pluginUrl'     => asset( 'vendor/chatflow' ) . '/',
			'runtimeUrl'    => Assets::url( 'runtime/runtime.js' ),
			'screen'        => $screen,
			'locale'        => app()->getLocale(),
			'capabilities'  => $caps,
			'adminUrl'      => route( 'chatflow.admin.index' ),
			'siteUrl'       => url( '/' ) . '/',
			'timezone'      => (string) config( 'app.timezone', 'UTC' ),
			'themeFrontend' => (object) array(),
			'fullpageBase'  => (string) ( config( 'chatflow.fullpage_base' ) ?? 'chat' ),
			'tools'         => false,
			'features'      => array(
				'fieldTypes'    => $types,
				'uploads'       => false,
				'xlsx'          => false,
				'ai'            => false,
				'pageTargeting' => false,
			),
		);
		$id = self::positiveInt( $request->query( 'formId' ) );
		if ( $id && $caps['manage_forms'] && $this->forms->getDraft( $id ) ) {
			$config['formId'] = $id;
		}
		$config['preview'] = '1' === $request->query( 'preview' );
		$export_id         = self::positiveInt( $request->query( 'exportId' ) );
		if ( $export_id && $caps['export_submissions'] ) {
			$config['exportId'] = $export_id;
		}
		return $config;
	}

	/** Base URL of the admin JSON API; the apps call restUrl + "admin/…". */
	public static function restUrl(): string {
		return url( trim( (string) config( 'chatflow.admin.prefix', 'chatflow/admin' ), '/' ) . '/api' ) . '/';
	}

	public static function positiveInt( mixed $value ): int {
		return is_string( $value ) && ctype_digit( $value ) && strlen( $value ) < 19 ? (int) $value : 0;
	}

	/** The config as an inline script assignment, safe inside <script>. */
	public static function script( array $config ): string {
		return 'window.cffAdmin=' . json_encode( $config, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR ) . ';';
	}
}
