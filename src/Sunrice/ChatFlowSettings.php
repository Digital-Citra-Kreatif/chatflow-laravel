<?php
namespace ChatFlow\Laravel\Sunrice;

use ChatFlow\Laravel\Support\Settings as SiteSettings;
use Sunrice\Admin\Resources\Forms\Form;
use Sunrice\Admin\Resources\Forms\NumberInput;
use Sunrice\Admin\Resources\Forms\Section;
use Sunrice\Admin\Resources\Forms\Select;
use Sunrice\Admin\Resources\Forms\TextInput;
use Sunrice\Admin\Settings\Settings;

/**
 * Settings → ChatFlow: the site-wide defaults every form starts from (forms can override
 * most of them in the builder). Each field left empty follows config/chatflow.php, whose
 * value its placeholder shows, so installing the plugin changes nothing until an admin
 * saves a value here. Read through ChatFlow\Laravel\Support\Settings::get().
 */
final class ChatFlowSettings extends Settings {
	public ?string $defaultTheme = null;

	public ?string $privacyIp      = null;
	public ?string $storeMeta      = null;
	public ?string $storeUserAgent = null;
	public ?string $respectDnt     = null;

	public ?string $retentionEnabled = null;
	public ?int $retentionDays       = null;
	public ?int $partialDays         = null;

	public ?string $honeypotEnabled = null;
	public ?int $minSeconds         = null;
	public ?int $rateLimit          = null;
	public ?int $rateWindowSeconds  = null;

	public ?string $fromName   = null;
	public ?string $fromEmail  = null;
	public ?string $replyTo    = null;
	public ?string $logoUrl    = null;
	public ?string $brandColor = null;
	public ?string $footerText = null;

	private const ON_OFF = array(
		'on'  => 'On',
		'off' => 'Off',
	);

	public static function key(): string {
		return 'chatflow';
	}

	public static function label(): string {
		return 'ChatFlow';
	}

	public static function description(): ?string {
		return 'Defaults for every form. Forms can override most of them in the builder. Empty fields follow the config file (config/chatflow.php).';
	}

	public static function form( Form $form ): Form {
		$config = SiteSettings::fromConfig();
		return $form->schema(
			array(
				Section::make( 'Appearance' )->columns( 2 )->schema(
					array(
						Select::make( 'defaultTheme' )->label( 'Chat theme' )->options(
							array(
								'light' => 'Light',
								'dark'  => 'Dark',
								'auto'  => 'Follow the visitor\'s device',
							)
						)->placeholder( self::inherit( $config['defaultTheme'] ) ),
					)
				),
				Section::make( 'Privacy' )->columns( 2 )->schema(
					array(
						Select::make( 'privacyIp' )->label( 'IP addresses' )->options(
							array(
								'full'       => 'Store in full',
								'anonymized' => 'Store anonymized',
								'none'       => 'Do not store',
							)
						)->placeholder( self::inherit( $config['privacy']['ip'] ) ),
						self::onOff( 'storeMeta', 'Store tracking details (page, referrer, UTM)', $config['privacy']['storeMeta'] ),
						self::onOff( 'storeUserAgent', 'Store browser and device', $config['privacy']['storeUserAgent'] ),
						self::onOff( 'respectDnt', 'Respect Do Not Track', $config['privacy']['respectDnt'] ),
					)
				),
				Section::make( 'Retention' )->description( 'Submissions older than this are deleted by the hourly chatflow:sweep command.' )->columns( 2 )->schema(
					array(
						self::onOff( 'retentionEnabled', 'Delete old submissions automatically', $config['retention']['enabled'] ),
						NumberInput::make( 'retentionDays' )->label( 'Keep submissions for (days)' )->integer()->min( 1 )->max( 36500 )
							->placeholder( self::inherit( $config['retention']['days'] ) ),
						NumberInput::make( 'partialDays' )->label( 'Keep partial and abandoned ones for (days)' )->integer()->min( 1 )->max( 36500 )
							->placeholder( self::inherit( $config['retention']['partialDays'] ?? 'as long as the others' ) ),
					)
				),
				Section::make( 'Spam protection' )->columns( 2 )->schema(
					array(
						self::onOff( 'honeypotEnabled', 'Hidden honeypot field', $config['spam']['honeypotEnabled'] ),
						NumberInput::make( 'minSeconds' )->label( 'Minimum seconds to answer' )->integer()->min( 0 )->max( 3600 )
							->placeholder( self::inherit( $config['spam']['minSeconds'] ) ),
						NumberInput::make( 'rateLimit' )->label( 'Submissions per visitor IP per window' )->integer()->min( 1 )->max( 10000 )
							->placeholder( self::inherit( $config['spam']['rateLimit'] ) ),
						NumberInput::make( 'rateWindowSeconds' )->label( 'Rate window (seconds)' )->integer()->min( 1 )->max( 86400 )
							->placeholder( self::inherit( $config['spam']['rateWindowSeconds'] ) ),
					)
				),
				Section::make( 'Emails' )->description( 'Sender and look of notification emails and autoresponders.' )->columns( 2 )->schema(
					array(
						TextInput::make( 'fromName' )->label( 'From name' )->maxLength( 100 )->placeholder( self::inherit( $config['email']['fromName'] ) ),
						TextInput::make( 'fromEmail' )->label( 'From address' )->email()->maxLength( 190 )->placeholder( self::inherit( $config['email']['fromEmail'] ) ),
						TextInput::make( 'replyTo' )->label( 'Reply-to address' )->email()->maxLength( 190 )->placeholder( self::inherit( $config['email']['replyTo'] ) ),
						TextInput::make( 'logoUrl' )->label( 'Logo URL' )->url()->maxLength( 2000 )->placeholder( self::inherit( $config['email']['logoUrl'] ) ),
						TextInput::make( 'brandColor' )->label( 'Brand colour' )->color()->placeholder( (string) $config['email']['brandColor'] ),
						TextInput::make( 'footerText' )->label( 'Footer text' )->maxLength( 300 )->placeholder( self::inherit( $config['email']['footerText'] ) ),
					)
				),
			)
		);
	}

	/**
	 * The saved values in ChatFlow's site settings shape; unset ones are null.
	 *
	 * @return array<string,mixed>
	 */
	public function overrides(): array {
		return array(
			'defaultTheme' => $this->defaultTheme,
			'privacy'      => array(
				'ip'             => $this->privacyIp,
				'storeMeta'      => self::bool( $this->storeMeta ),
				'storeUserAgent' => self::bool( $this->storeUserAgent ),
				'respectDnt'     => self::bool( $this->respectDnt ),
			),
			'retention'    => array(
				'enabled'     => self::bool( $this->retentionEnabled ),
				'days'        => $this->retentionDays,
				'partialDays' => $this->partialDays,
			),
			'spam'         => array(
				'honeypotEnabled'   => self::bool( $this->honeypotEnabled ),
				'minSeconds'        => $this->minSeconds,
				'rateLimit'         => $this->rateLimit,
				'rateWindowSeconds' => $this->rateWindowSeconds,
			),
			'email'        => array(
				'fromName'   => self::text( $this->fromName ),
				'fromEmail'  => self::text( $this->fromEmail ),
				'replyTo'    => self::text( $this->replyTo ),
				'logoUrl'    => self::text( $this->logoUrl ),
				'brandColor' => self::text( $this->brandColor ),
				'footerText' => self::text( $this->footerText ),
			),
		);
	}

	private static function onOff( string $name, string $label, mixed $inherited ): Select {
		return Select::make( $name )->label( $label )->options( self::ON_OFF )->placeholder( self::inherit( $inherited ? 'On' : 'Off' ) );
	}

	private static function inherit( mixed $value ): string {
		$value = is_bool( $value ) ? ( $value ? 'On' : 'Off' ) : (string) ( $value ?? '' );
		return '' === $value ? 'Config file: empty' : 'Config file: ' . $value;
	}

	private static function bool( ?string $value ): ?bool {
		return null === $value ? null : 'on' === $value;
	}

	private static function text( ?string $value ): ?string {
		return null === $value || '' === trim( $value ) ? null : trim( $value );
	}
}
