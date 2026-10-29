<?php
namespace ChatFlow\Laravel\Forms;

use ChatFlow\Laravel\Fields\Registry;
use ChatFlow\Laravel\Security\CookieSources;
use ChatFlow\Laravel\Support\Hooks;

final class PublicProjection {
	/**
	 * @param list<string>|null $types
	 * @return array<string,mixed> */
	public static function build( Form $form, ?array $types = null ): array {
		$types ??= Registry::enabledTypes();
		$schema  = CookieSources::projection( $form->schema() );
		unset( $schema['experiments'] );
		// Cookie/default hidden sources stay on the server until an uncached handshake.
		foreach ( $schema['steps'] as &$step ) {
			if ( 'hidden' === $step['type'] ) {
				unset( $step['defaultValue'] ); }
		}
		unset( $step );
		$settings = $form->settings();
		$session  = $settings['sessions'] ?? array();
		$envelope = array(
			'form'     => array(
				'id'         => $form->id(),
				'title'      => $form->title(),
				'slug'       => $form->slug(),
				'version'    => $form->version(),
				'schema'     => $schema,
				'appearance' => (object) ( $settings['appearance'] ?? $schema['appearance'] ?? array() ),
				'phrases'    => (object) ( $settings['phrases'] ?? array() ),
				'language'   => in_array( $settings['language'] ?? 'site', array( 'site', 'en', 'id' ), true ) ? ( $settings['language'] ?? 'site' ) : 'site',
				'completion' => array(
					'review' => in_array( $settings['completion']['review'] ?? 'off', array( 'off', 'button', 'show' ), true ) ? $settings['completion']['review'] ?? 'off' : 'off',
				),
				'session'    => array(
					'resumeEnabled' => ( $session['resumeEnabled'] ?? true ) && ( $session['savePartial'] ?? true ),
					'resumePrompt'  => $session['resumePrompt'] ?? true,
					'resumeDays'    => $session['resumeDays'] ?? 30,
					'savePartial'   => $session['savePartial'] ?? true,
					'storageNotice' => (bool) ( $session['storageNotice'] ?? false ),
					// Magic links are not available in this version.
					'magicLinks'    => array(
						'enabled'  => false,
						'whatsapp' => $session['magicLinks']['whatsapp'] ?? false,
					),
				),
			),
			'features' => array(
				'fieldTypes' => $types,
				'uploads'    => false,
				'engagement' => true,
			),
		);
		// The media library is not available in this version.
		$envelope['form']['media'] = (object) array();
		$hook_envelope             = $envelope;
		foreach ( array( 'appearance', 'phrases', 'media' ) as $key ) {
			$hook_envelope['form'][ $key ] = clone $envelope['form'][ $key ];
		}
		$filtered = Hooks::filter( 'public_schema', $hook_envelope, $form );
		// Filters can safely customize display copy; never expand the credential/settings boundary.
		if ( is_array( $filtered ) ) {
			foreach ( array( 'appearance', 'phrases' ) as $key ) {
				$value = $filtered['form'][ $key ] ?? null;
				if ( is_array( $value ) || is_object( $value ) ) {
					$errors = ( new SchemaValidator() )->validateSettings( array( $key => (object) $value ) );
					if ( ! $errors ) {
						$envelope['form'][ $key ] = (object) $value; }
				}
			}
		}
		return $envelope;
	}
}
