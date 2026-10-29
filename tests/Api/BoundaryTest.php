<?php
namespace ChatFlow\Laravel\Tests\Api;

use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Tests\TestCase;
use Illuminate\Support\Str;

final class BoundaryTest extends TestCase {
	use VisitorApi;

	public function test_oversized_body_is_rejected(): void {
		$form = $this->form();
		$this->call( 'POST', self::API . 'forms/' . $form->id() . '/view', array(), array(), array(), array( 'CONTENT_TYPE' => 'application/json' ), '{"version":1,"pad":"' . str_repeat( 'a', 1048576 ) . '"}' )
			->assertStatus( 413 )->assertJsonPath( 'code', 'cff_request_too_large' )->assertJsonPath( 'data.status', 413 );
	}

	public function test_credentials_in_query_are_rejected(): void {
		$form = $this->form();
		foreach ( array( 'token', 'X_Credential', 'nonce' ) as $key ) {
			$this->getJson( self::API . 'forms/' . $form->id() . '?' . $key . '=1' )->assertStatus( 400 )->assertJsonPath( 'code', 'cff_credential_location' )->assertHeader( 'Cache-Control', 'no-store, private' );
		}
	}

	public function test_cross_origin_mutations_are_rejected(): void {
		$form = $this->form();
		$uri  = self::API . 'forms/' . $form->id() . '/start-token';
		$this->postJson( $uri, array( 'version' => 1 ), array( 'Origin' => 'https://evil.example' ) )->assertForbidden()->assertJsonPath( 'code', 'cff_origin_rejected' );
		$this->postJson( $uri, array( 'version' => 1 ), array( 'Origin' => 'http://localhost:8080' ) )->assertForbidden();
		$this->postJson( $uri, array( 'version' => 1 ), array( 'Origin' => 'http://localhost' ) )->assertOk();
		// Reads are not origin-checked.
		$this->getJson( self::API . 'forms/' . $form->id(), array( 'Origin' => 'https://evil.example' ) )->assertOk();
	}

	public function test_malformed_bodies_are_invalid_requests(): void {
		$form = $this->form();
		$this->call( 'POST', self::API . 'sessions', array(), array(), array(), array( 'CONTENT_TYPE' => 'application/json' ), '{bad' )
			->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_request' );
		$this->call( 'POST', self::API . 'sessions', array(), array(), array(), array( 'CONTENT_TYPE' => 'application/json' ), '[1]' )
			->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_request' );
		$token = $this->startToken( $form );
		foreach ( array( 'meta', 'prefill' ) as $key ) {
			$this->postJson( self::API . 'sessions', array( 'formId' => $form->id(), 'version' => 1, $key => array( 1, 2 ) ), array( 'X-CFF-Start-Token' => $token, 'Idempotency-Key' => (string) Str::uuid() ) )
				->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_request' );
		}
		$session = $this->start( $form )->json();
		$this->mutate( 'PATCH', $session, array( 'version' => 1, 'revision' => 0, 'answers' => array( 'a' ) ) )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_request' );
	}

	public function test_unexpected_failures_become_storage_errors(): void {
		$form = $this->form();
		$this->app['config']->set( 'chatflow.table_prefix', 'missing_' );
		$this->postJson( self::API . 'forms/' . $form->id() . '/view', array( 'version' => 1 ) )->assertStatus( 503 )->assertJsonPath( 'code', 'cff_storage_error' );
	}

	public function test_routes_need_no_session_or_csrf(): void {
		$form  = $this->form();
		$route = app( 'router' )->getRoutes()->getByName( 'chatflow.api.sessions.start' );
		$this->assertNotNull( $route );
		$this->assertNotContains( 'web', $route->gatherMiddleware() );
		$this->postJson( self::API . 'forms/' . $form->id() . '/start-token', array( 'version' => 1 ) )->assertOk()->assertCookieMissing( 'laravel_session' );
	}

	public function test_view_counting(): void {
		$form = $this->form();
		$uri  = self::API . 'forms/' . $form->id() . '/view';
		$this->postJson( $uri, array( 'version' => 1 ) )->assertOk()->assertExactJson( array( 'recorded' => true ) );
		$this->postJson( $uri, array( 'version' => 1 ) )->assertOk();
		$row = Database::query( 'stats_daily' )->first();
		$this->assertSame( 2, (int) $row->value );
		$this->assertSame( 'view', $row->metric );
		$this->assertSame( 1, Database::query( 'stats_daily' )->count() );

		$this->postJson( $uri, array( 'version' => 1 ), array( 'DNT' => '1' ) )->assertOk()->assertExactJson( array( 'recorded' => false ) );
		$this->postJson( $uri, array( 'version' => 1 ), array( 'Sec-GPC' => '1' ) )->assertOk()->assertExactJson( array( 'recorded' => false ) );
		$this->postJson( $uri, array( 'version' => 2 ) )->assertStatus( 409 )->assertJsonPath( 'code', 'cff_version_conflict' );
		$this->postJson( $uri, array( 'version' => '1' ) )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_version' );
		$this->postJson( self::API . 'forms/999/view', array( 'version' => 1 ) )->assertNotFound();
		$this->assertSame( 2, (int) Database::query( 'stats_daily' )->value( 'value' ) );
	}

	public function test_view_rate_limit(): void {
		$form = $this->form();
		$uri  = self::API . 'forms/' . $form->id() . '/view';
		for ( $i = 0; $i < 120; $i++ ) {
			$this->postJson( $uri, array( 'version' => 1 ) )->assertOk();
		}
		$this->postJson( $uri, array( 'version' => 1 ) )->assertStatus( 429 )->assertJsonPath( 'data.retryAfter', 600 );
	}
}
