<?php
namespace ChatFlow\Laravel\Tests\Api;

use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;

final class VisitorJourneyTest extends TestCase {
	use VisitorApi;

	public function test_public_form_is_cacheable_with_etag(): void {
		$form     = $this->form();
		$response = $this->getJson( self::API . 'forms/' . $form->id() );
		$response->assertOk()->assertHeader( 'Cache-Control', 'max-age=60, must-revalidate, public' );
		$etag = $response->headers->get( 'ETag' );
		$this->assertMatchesRegularExpression( '/^"[a-f0-9]{64}"$/', $etag );
		$this->assertSame( $form->version(), $response->json( 'form.version' ) );
		$this->assertStringContainsString( '"appearance":{}', $response->getContent() );
		$this->assertStringContainsString( '"phrases":{}', $response->getContent() );
		$this->assertStringContainsString( '"media":{}', $response->getContent() );

		$this->getJson( self::API . 'forms/' . $form->id(), array( 'If-None-Match' => $etag ) )->assertStatus( 304 )->assertHeader( 'ETag', $etag );
		$this->getJson( self::API . 'forms/' . $form->id() . '?version=1' )->assertOk();
		$this->getJson( self::API . 'forms/' . $form->id() . '?version=abc' )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_version' )->assertHeader( 'Cache-Control', 'no-store, private' );
		$this->getJson( self::API . 'forms/999' )->assertNotFound()->assertJsonPath( 'code', 'cff_not_found' )->assertJsonPath( 'data.status', 404 );
		$this->getJson( self::API . 'forms/' . $form->id() . '/' )->assertOk();
	}

	public function test_engagement_and_start_token(): void {
		$form = $this->form();
		$this->getJson( self::API . 'forms/' . $form->id() . '/engagement' )->assertOk()
			->assertExactJson( array( 'captcha' => array( 'provider' => 'none', 'siteKey' => '' ), 'analytics' => array( 'enabled' => false, 'consentRequired' => true, 'respectDnt' => true ) ) )
			->assertHeader( 'Cache-Control', 'no-store, private' );
		$this->postJson( self::API . 'forms/' . $form->id() . '/start-token', array( 'version' => 9 ) )->assertStatus( 409 )->assertJsonPath( 'data.version', 1 );
		$token = $this->postJson( self::API . 'forms/' . $form->id() . '/start-token', array( 'version' => 1 ) )->assertOk()->assertJsonPath( 'version', 1 );
		$this->assertStringStartsWith( 's1.', $token->json( 'startToken' ) );
	}

	public function test_full_visitor_journey(): void {
		$form      = $this->form();
		$completed = array();
		Event::listen(
			'chatflow.submission_completed',
			function ( ...$args ) use ( &$completed ): void {
				$completed[] = array( $args, DB::transactionLevel() );
			}
		);
		$partials = 0;
		Event::listen( 'chatflow.submission_partial_saved', function () use ( &$partials ): void {
			++$partials;
		} );
		$started = 0;
		Event::listen( 'chatflow.session_started', function () use ( &$started ): void {
			++$started;
		} );

		$token    = $this->startToken( $form );
		$key      = (string) Str::uuid();
		$response = $this->start( $form, $token, $key );
		$response->assertCreated()->assertHeader( 'Cache-Control', 'no-store, private' );
		$session = $response->json();
		$this->assertMatchesRegularExpression( '/^[a-f0-9-]{36}$/', $session['sessionId'] );
		$this->assertSame( 0, $session['revision'] );
		$this->assertSame( 'active', $session['status'] );
		$this->assertStringStartsWith( 's1.', $session['requestToken'] );
		$this->assertStringStartsWith( 'r1.', $session['resumeToken'] );
		$this->assertSame( 'step_name', $session['currentStepId'] );
		$raw = $response->getContent();
		$this->assertStringContainsString( '"answers":{}', $raw );
		$this->assertStringContainsString( '"hidden":{}', $raw );
		$this->assertStringContainsString( '"url":{"utm_source":"x"}', $raw );
		$this->assertSame( 1, $started );

		// Idempotent replay of the start returns the same session.
		$this->start( $form, $token, $key )->assertCreated()->assertJsonPath( 'sessionId', $session['sessionId'] );
		$this->assertSame( 1, Database::query( 'sessions' )->count() );

		$this->getJson( self::API . 'sessions/' . $session['sessionId'], array( 'X-CFF-Request-Token' => $session['requestToken'] ) )->assertOk()->assertJsonPath( 'sessionId', $session['sessionId'] );
		$this->getJson( self::API . 'sessions/' . $session['sessionId'], array( 'X-CFF-Request-Token' => 'bad' ) )->assertUnauthorized()->assertJsonPath( 'code', 'cff_invalid_credential' );

		$patched = $this->mutate( 'PATCH', $session, array( 'version' => 1, 'revision' => 0, 'answers' => array( 'name' => 'Ann' ), 'stepTimings' => array( 'step_name' => 1200 ) ) );
		$patched->assertOk()->assertJsonPath( 'revision', 1 )->assertJsonPath( 'answers.name', 'Ann' )->assertJsonPath( 'currentStepId', 'step_age' );
		$this->assertSame( 1, $partials );

		$this->mutate( 'PATCH', $session, array( 'version' => 1, 'revision' => 0, 'answers' => array( 'name' => 'Bob' ) ) )
			->assertStatus( 409 )->assertJsonPath( 'code', 'cff_revision_conflict' )->assertJsonPath( 'data.revision', 1 );
		$this->mutate( 'PATCH', $session, array( 'version' => 2, 'revision' => 1, 'answers' => array( 'name' => 'Bob' ) ) )
			->assertStatus( 409 )->assertJsonPath( 'code', 'cff_version_conflict' );
		$this->mutate( 'PATCH', $session, array( 'version' => 1, 'revision' => 1, 'answers' => array( 'age' => 'old' ) ) )
			->assertStatus( 422 )->assertJsonPath( 'code', 'cff_validation_failed' );

		$session = $patched->json();
		$key     = (string) Str::uuid();
		$done    = $this->submit( $session, self::answers(), array( 'honeypot' => '' ), $key );
		$done->assertOk()->assertJsonPath( 'submission.status', 'completed' )->assertJsonPath( 'ending.id', 'end_thanks' )->assertJsonPath( 'ending.messages.0', 'Thanks Ann' );
		$uuid = $done->json( 'submission.uuid' );
		$row  = Database::query( 'submissions' )->where( 'uuid', $uuid )->first();
		$this->assertSame( 'completed', $row->status );
		$this->assertSame( array( 'name' => 'Ann', 'age' => 30, 'color' => 'red' ), json_decode( $row->answers, true ) );
		$this->assertSame( '127.0.0.0', $row->ip );
		$this->assertSame( 'x', json_decode( $row->meta, true )['utm'] ?? 'x' );
		$this->assertSame( 'completed', Database::query( 'sessions' )->value( 'status' ) );

		// The receipt replays after completion; the session itself is closed for reads.
		$this->submit( $session, self::answers(), array( 'honeypot' => '' ), $key )->assertOk()->assertJsonPath( 'submission.uuid', $uuid );
		$this->submit( $session, self::answers(), array( 'honeypot' => '' ) )->assertUnauthorized();
		$this->getJson( self::API . 'sessions/' . $session['sessionId'], array( 'X-CFF-Request-Token' => $session['requestToken'] ) )->assertUnauthorized();

		$this->assertCount( 1, $completed );
		[ $args, $level ] = $completed[0];
		$this->assertInstanceOf( Submission::class, $args[0] );
		$this->assertInstanceOf( Form::class, $args[1] );
		$this->assertSame( $uuid, $args[0]->uuid() );
		$this->assertSame( 'completed', $args[0]->status() );
		$this->assertLessThanOrEqual( 1, $level ); // The test's own wrapping transaction only.
	}

	public function test_resume_and_restart(): void {
		$form      = $this->form();
		$abandoned = array();
		Event::listen( 'chatflow.submission_abandoned', function ( ...$args ) use ( &$abandoned ): void {
			$abandoned[] = $args;
		} );
		$session = $this->start( $form )->assertCreated()->json();
		$resume  = $session['resumeToken'];
		$session = $this->mutate( 'PATCH', $session, array( 'version' => 1, 'revision' => 0, 'answers' => array( 'name' => 'Ann' ) ) )->assertOk()->json();
		$this->assertArrayNotHasKey( 'resumeToken', $session );

		$resumed = $this->postJson( self::API . 'sessions/resume', array( 'formId' => $form->id() ), array( 'X-CFF-Resume-Token' => $resume ) );
		$resumed->assertOk()->assertJsonPath( 'sessionId', $session['sessionId'] )->assertJsonPath( 'answers.name', 'Ann' )->assertJsonPath( 'revision', 1 );
		$this->postJson( self::API . 'sessions/resume', array( 'formId' => $form->id() ), array( 'X-CFF-Resume-Token' => 'r1.bad' ) )->assertUnauthorized();

		$closed = $this->mutate( 'DELETE', $session, array( 'version' => 1, 'revision' => 1 ) );
		$closed->assertOk()->assertExactJson( array( 'closed' => true ) );
		$this->assertSame( 'abandoned', Database::query( 'submissions' )->value( 'status' ) );
		$this->assertNotNull( Database::query( 'submissions' )->value( 'abandoned_at' ) );
		$this->assertSame( 'closed', Database::query( 'sessions' )->value( 'status' ) );
		$this->assertCount( 1, $abandoned );
		$this->assertInstanceOf( Submission::class, $abandoned[0][0] );
		$this->postJson( self::API . 'sessions/resume', array( 'formId' => $form->id() ), array( 'X-CFF-Resume-Token' => $resumed->json( 'resumeToken' ) ) )->assertUnauthorized();
	}

	public function test_spam_is_stored_but_answered_like_success(): void {
		$form      = $this->form( array( 'spam' => array( 'minSeconds' => 60 ) ) );
		$completed = 0;
		Event::listen( 'chatflow.submission_completed', function () use ( &$completed ): void {
			++$completed;
		} );

		$session = $this->start( $form )->json();
		$this->submit( $session, self::answers() )->assertOk()->assertJsonPath( 'submission.status', 'completed' );
		$row = Database::query( 'submissions' )->first();
		$this->assertSame( 'spam', $row->status );
		$this->assertSame( array( 'time_trap' ), json_decode( $row->spam_reasons, true ) );

		$form    = $this->form( array(), 'Second' );
		$session = $this->start( $form )->json();
		$this->submit( $session, self::answers(), array( 'honeypot' => 'https://spam.example' ) )->assertOk()->assertJsonPath( 'submission.status', 'completed' );
		$row = Database::query( 'submissions' )->where( 'form_id', $form->id() )->first();
		$this->assertSame( 'spam', $row->status );
		$this->assertSame( array( 'honeypot' ), json_decode( $row->spam_reasons, true ) );
		$this->assertSame( 0, $completed );
	}

	public function test_submit_rate_limit(): void {
		$form  = $this->form( array( 'spam' => array( 'rateLimit' => 1, 'rateWindowSeconds' => 300 ) ) );
		$first = $this->start( $form )->json();
		$this->submit( $first, self::answers() )->assertOk();
		$second = $this->start( $form )->json();
		$this->submit( $second, self::answers() )->assertStatus( 429 )->assertJsonPath( 'code', 'cff_rate_limit' )->assertJsonPath( 'data.retryAfter', 300 );
		$this->assertSame( 'active', Database::query( 'sessions' )->where( 'public_id', $second['sessionId'] )->value( 'status' ) );
	}

	public function test_start_requires_valid_token_and_key(): void {
		$form = $this->form();
		$this->start( $form, 'bad' )->assertUnauthorized()->assertJsonPath( 'code', 'cff_invalid_credential' );
		$this->start( $form, null, 'not-a-uuid' )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_idempotency_key' );
	}

	public function test_login_limits_use_the_auth_guard(): void {
		$form = $this->form( array( 'limits' => array( 'requireLogin' => true ) ) );
		$this->start( $form )->assertUnauthorized()->assertJsonPath( 'code', 'cff_login_required' );
		$this->actingAs( $this->user( 7 ) );
		$this->start( $form )->assertCreated();
	}

	public function test_unavailable_features(): void {
		$form    = $this->form();
		$session = $this->start( $form )->json();
		$headers = array( 'X-CFF-Request-Token' => $session['requestToken'] );
		$this->postJson( self::API . 'sessions/' . $session['sessionId'] . '/magic-link', array( 'channel' => 'email', 'consent' => true ), $headers )->assertOk()->assertExactJson( array( 'accepted' => true ) );
		$this->postJson( self::API . 'sessions/magic-resume', array( 'formId' => $form->id() ), array( 'X-CFF-Magic-Token' => 'x' ) )->assertUnauthorized()->assertJsonPath( 'code', 'cff_magic_invalid' );
		$this->post( self::API . 'sessions/' . $session['sessionId'] . '/uploads', array( 'fieldId' => 'f', 'file' => \Illuminate\Http\UploadedFile::fake()->create( 'a.txt', 1 ) ), $headers )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_upload_field' );
		$this->post( self::API . 'sessions/' . $session['sessionId'] . '/uploads', array( 'fieldId' => 'f', 'file' => \Illuminate\Http\UploadedFile::fake()->create( 'a.txt', 1 ) ), array( 'X-CFF-Request-Token' => 'bad' ) )->assertUnauthorized();

		$events = self::API . 'sessions/' . $session['sessionId'] . '/events';
		$this->postJson( $events, array( 'events' => array( array( 'event' => 'view', 'stepId' => '' ) ) ), $headers )->assertOk()->assertExactJson( array( 'stored' => 0 ) );
		$this->postJson( $events, array( 'events' => array( array( 'event' => 'nope' ) ) ), $headers )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_events_invalid' );
		$this->postJson( $events, array( 'events' => array() ), array( 'X-CFF-Request-Token' => 'bad' ) )->assertUnauthorized()->assertJsonPath( 'code', 'cff_unauthorized' );
	}
}
