<?php
namespace ChatFlow\Laravel\Support;

/**
 * Site-wide defaults from config('chatflow.defaults'), shaped like the plugin's cff_settings
 * option. A host (the Sunrice panel plugin's settings page) can override them with
 * resolveUsing(); its non-null values win over the config file.
 */
final class Settings {
	/** @var (\Closure(): array<string,mixed>)|null */
	private static ?\Closure $resolver = null;

	/** @param (\Closure(): array<string,mixed>)|null $resolver Overrides, shaped like get(); null values are ignored. */
	public static function resolveUsing( ?\Closure $resolver ): void {
		self::$resolver = $resolver;
	}

	/** @return array<string,mixed> */
	public static function get(): array {
		$settings = array_replace_recursive( self::fromConfig(), self::withoutNulls( self::$resolver ? ( self::$resolver )() : array() ) );
		// Captcha providers are not available in this version.
		$settings['spam']['captcha'] = 'none';
		return $settings;
	}

	/**
	 * The defaults from the config file alone, without a host's overrides.
	 *
	 * @return array<string,mixed>
	 */
	public static function fromConfig(): array {
		$defaults = array(
			'fullpageBase' => (string) ( config( 'chatflow.fullpage_base' ) ?? 'chat' ),
			'defaultTheme' => 'light',
			'tracking'     => array(
				'enabled'         => false,
				'consentRequired' => true,
				'days'            => 30,
			),
			'privacy'      => array(
				'ip'             => 'anonymized',
				'storeUserAgent' => false,
				'storeMeta'      => true,
				'respectDnt'     => true,
			),
			'retention'    => array(
				'enabled'     => false,
				'days'        => 360,
				'partialDays' => null,
			),
			'spam'         => array(
				'honeypotEnabled'   => true,
				'minSeconds'        => 2,
				'rateLimit'         => 10,
				'rateWindowSeconds' => 600,
				'startLimit'        => 300,
				'captcha'           => 'none',
				'siteKey'           => '',
				'secretKey'         => '',
				'minScore'          => 0.5,
				'akismetEnabled'    => false,
			),
			'proxy'        => array(
				'mode'          => 'automatic',
				'trustedRanges' => array(),
				'header'        => 'HTTP_X_FORWARDED_FOR',
			),
			'email'        => array(
				'fromName'   => self::siteName(),
				'fromEmail'  => (string) config( 'mail.from.address', '' ),
				'replyTo'    => '',
				'logoUrl'    => '',
				'brandColor' => '#262626',
				'footerText' => '',
			),
		);
		$configured = config( 'chatflow.defaults', array() );
		return array_replace_recursive( $defaults, is_array( $configured ) ? self::withoutNulls( $configured ) : array() );
	}

	public static function siteName(): string {
		return (string) ( config( 'chatflow.site_name' ) ?? config( 'app.name', 'Laravel' ) );
	}

	/**
	 * @param array<mixed> $value
	 * @return array<mixed>
	 */
	private static function withoutNulls( array $value ): array {
		foreach ( $value as $key => $item ) {
			if ( null === $item ) {
				unset( $value[ $key ] );
			} elseif ( is_array( $item ) && ! array_is_list( $item ) ) {
				$value[ $key ] = self::withoutNulls( $item );
			}
		}
		return $value;
	}
}
