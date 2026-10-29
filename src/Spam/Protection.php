<?php
namespace ChatFlow\Laravel\Spam;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Support\Settings;

final class Protection {
	/**
	 * Captcha and Akismet checks are not available in this version; only the
	 * honeypot and time-trap reasons are produced.
	 *
	 * @param array<string,mixed> $body
	 * @return list<string> */
	public function reasons( Form $form, array $body, int $started ): array {
		$settings = array_merge( Settings::get()['spam'], $form->settings()['spam'] ?? array() );
		$reasons  = array();
		if ( ( $settings['honeypotEnabled'] ?? true ) && '' !== ( $body['honeypot'] ?? '' ) ) {
			$reasons[] = 'honeypot';
		}
		if ( time() - $started < ( $settings['minSeconds'] ?? 3 ) ) {
			$reasons[] = 'time_trap';
		}
		return $reasons;
	}
}
