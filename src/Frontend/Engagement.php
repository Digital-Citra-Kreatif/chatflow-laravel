<?php
namespace ChatFlow\Laravel\Frontend;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Support\Settings;

final class Engagement {
	/** Safe uncached projection: private spam settings never leave PHP. Captcha is not available in this version.
	 * @return array<string,mixed> */
	public static function config( Form $form ): array {
		$global = Settings::get();
		return array(
			'captcha'   => array(
				'provider' => 'none',
				'siteKey'  => '',
			),
			'analytics' => array(
				'enabled'         => (bool) $global['tracking']['enabled'],
				'consentRequired' => (bool) $global['tracking']['consentRequired'],
				'respectDnt'      => (bool) ( $global['privacy']['respectDnt'] || ( $form->settings()['privacy']['respectDnt'] ?? false ) ),
			),
		);
	}
}
