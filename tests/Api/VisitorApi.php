<?php
namespace ChatFlow\Laravel\Tests\Api;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Tests\Core\Fixtures;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;

/** Helpers for driving the public visitor API like the runtime does. */
trait VisitorApi {
	use Fixtures;

	protected const API = '/chatflow/api/v1/';

	/** @param array<string,mixed> $settings */
	protected function form( array $settings = array(), string $title = 'Contact form' ): Form {
		$repository = new FormRepository();
		$form       = $repository->create(
			$title,
			self::schema(),
			array_replace_recursive(
				array(
					'completion' => array( 'defaultEndingId' => 'end_thanks' ),
					'spam'       => array( 'minSeconds' => 0 ),
				),
				$settings
			)
		);
		$this->assertInstanceOf( Form::class, $form, is_object( $form ) && method_exists( $form, 'message' ) ? $form->message() . json_encode( $form->data() ) : '' );
		$form = $repository->publish( $form->id(), $form->draftRevision() );
		$this->assertInstanceOf( Form::class, $form );
		return $form;
	}

	protected function startToken( Form $form ): string {
		$response = $this->postJson( self::API . 'forms/' . $form->id() . '/start-token', array( 'version' => $form->version() ) );
		$response->assertOk();
		return (string) $response->json( 'startToken' );
	}

	/** @param array<string,mixed> $prefill */
	protected function start( Form $form, ?string $token = null, ?string $key = null, array $prefill = array() ): TestResponse {
		return $this->postJson(
			self::API . 'sessions',
			array(
				'formId'  => $form->id(),
				'version' => $form->version(),
				'meta'    => array( 'pageUrl' => 'http://localhost/contact?utm_source=x' ),
				'prefill' => (object) $prefill,
			),
			array(
				'X-CFF-Start-Token' => $token ?? $this->startToken( $form ),
				'Idempotency-Key'   => $key ?? (string) Str::uuid(),
			)
		);
	}

	/**
	 * @param array<string,mixed> $session
	 * @param array<string,mixed> $body
	 */
	protected function mutate( string $method, array $session, array $body, ?string $key = null ): TestResponse {
		$uri = self::API . 'sessions/' . $session['sessionId'] . ( 'POST' === $method ? '/submit' : '' );
		return $this->json(
			$method,
			$uri,
			$body,
			array(
				'X-CFF-Request-Token' => $session['requestToken'],
				'Idempotency-Key'     => $key ?? (string) Str::uuid(),
			)
		);
	}

	/**
	 * @param array<string,mixed> $session
	 * @param array<string,mixed> $answers
	 * @param array<string,mixed> $extra
	 */
	protected function submit( array $session, array $answers, array $extra = array(), ?string $key = null ): TestResponse {
		return $this->mutate( 'POST', $session, array_merge( array( 'version' => $session['version'], 'revision' => $session['revision'], 'answers' => (object) $answers ), $extra ), $key );
	}

	/** @return array<string,mixed> */
	protected static function answers(): array {
		return array(
			'name'  => 'Ann',
			'age'   => 30,
			'color' => 'red',
		);
	}
}
