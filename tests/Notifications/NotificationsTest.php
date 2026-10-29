<?php
namespace ChatFlow\Laravel\Tests\Notifications;

use ChatFlow\Laravel\ChatFlow;
use ChatFlow\Laravel\Notifications\DeliverNotification;
use ChatFlow\Laravel\Notifications\Html;
use ChatFlow\Laravel\Notifications\Outbox;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Hooks;
use ChatFlow\Laravel\Tests\Admin\AdminTestCase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Symfony\Component\Mime\Email;

final class NotificationsTest extends AdminTestCase {
	/** @return list<Email> */
	private function sent(): array {
		return array_map( static fn( $message ) => $message->getOriginalMessage(), iterator_to_array( $this->app['mailer']->getSymfonyTransport()->messages() ) );
	}

	/** @return array<string,mixed> */
	private static function notifications(): array {
		return array(
			'notifications' => array(
				'admin'          => array(
					array(
						'id'         => 'admin_1',
						'enabled'    => true,
						'to'         => array( 'owner@example.org' ),
						'cc'         => array( 'cc@example.org' ),
						'emailField' => 'email',
						'subject'    => 'New entry from {{name}} on {{form_title}}',
						'body'       => "<p>Hello <script>alert(1)</script><strong>team</strong></p>\n\n{{all_answers}}\n\n{{admin_link}}\n\n[cff_button url=\"https://example.org/?n={{name}}\"]Open[/cff_button]<a href=\"javascript:alert(1)\" onclick=\"x()\">bad</a>",
					),
				),
				'autoresponders' => array(
					array(
						'id'         => 'auto_1',
						'enabled'    => true,
						'emailField' => 'email',
						'subject'    => 'Thanks {{name}}',
						'body'       => 'We received your answers.',
					),
				),
			),
		);
	}

	public function test_completed_event_queues_and_sends_admin_mail_and_autoresponder(): void {
		$form       = $this->published( self::notifications() );
		$submission = $this->submission( $form, array( 'name' => 'Ada' ) );
		Hooks::action( 'submission_completed', array( $submission, $form ) );

		$rows = Database::query( 'deliveries' )->where( 'submission_id', $submission->id() )->orderBy( 'id' )->get();
		$this->assertSame( array( 'admin_mail', 'autoresponder', 'async' ), $rows->pluck( 'channel' )->all() );
		$this->assertSame( array( 'sent', 'sent', 'sent' ), $rows->pluck( 'status' )->all() );
		$this->assertSame( 1, (int) $rows[0]->attempts );

		$sent = $this->sent();
		$this->assertCount( 2, $sent );
		$admin = $sent[0];
		$this->assertSame( 'New entry from Ada on Contact form', $admin->getSubject() );
		$this->assertSame( 'owner@example.org', $admin->getTo()[0]->getAddress() );
		$this->assertSame( 'cc@example.org', $admin->getCc()[0]->getAddress() );
		$this->assertSame( 'ada@example.org', $admin->getReplyTo()[0]->getAddress() );
		$html = (string) $admin->getHtmlBody();
		$this->assertStringContainsString( '<strong>team</strong>', $html );
		$this->assertStringNotContainsString( '<script', $html );
		$this->assertStringNotContainsString( 'javascript:', $html );
		$this->assertStringNotContainsString( 'onclick', $html );
		$this->assertStringContainsString( '<th style="padding:8px;border-bottom:1px solid #ddd;text-align:left">Name</th>', $html );
		$this->assertStringContainsString( 'http://localhost/chatflow/admin?page=cff-submissions&amp;submission=' . $submission->id(), $html );
		$this->assertStringContainsString( 'href="https://example.org/?n=Ada"', $html );
		$this->assertStringContainsString( '<h2>Contact form</h2>', $html );
		$this->assertStringContainsString( 'Name: Ada', (string) $admin->getTextBody() );

		$auto = $sent[1];
		$this->assertSame( 'Thanks Ada', $auto->getSubject() );
		$this->assertSame( 'ada@example.org', $auto->getTo()[0]->getAddress() );
		$this->assertStringNotContainsString( 'page=cff-submissions', (string) $auto->getHtmlBody() );

		$notes = Database::query( 'submission_notes' )->where( 'submission_id', $submission->id() )->where( 'type', 'delivery' )->pluck( 'body' )->all();
		$this->assertContains( 'admin_mail_sent', array_map( static fn( $body ) => json_decode( $body, true )['code'], $notes ) );

		// The same event again is deduplicated.
		Hooks::action( 'submission_completed', array( $submission, $form ) );
		$this->assertSame( 3, Database::query( 'deliveries' )->count() );
		$this->assertCount( 2, $this->sent() );
	}

	public function test_jobs_use_the_configured_queue_and_respect_filters(): void {
		Queue::fake();
		$this->app['config']->set( 'chatflow.queue.connection', 'redis' );
		$this->app['config']->set( 'chatflow.queue.name', 'mail' );
		$form       = $this->published( self::notifications() );
		$submission = $this->submission( $form );
		Hooks::action( 'submission_completed', array( $submission, $form ) );
		Queue::assertPushed( DeliverNotification::class, static fn( DeliverNotification $job ) => 'redis' === $job->connection && 'mail' === $job->queue );
		Queue::assertPushed( DeliverNotification::class, 3 );

		ChatFlow::filter(
			'email_args',
			static function ( array $args ): array {
				$args['subject'] = 'Filtered';
				return $args;
			}
		);
		$id = (int) Database::query( 'deliveries' )->where( 'channel', 'admin_mail' )->value( 'id' );
		( new DeliverNotification( $id ) )->handle();
		$this->assertSame( 'Filtered', $this->sent()[0]->getSubject() );
	}

	public function test_failures_retry_with_backoff_then_fail(): void {
		Queue::fake();
		$settings                                         = self::notifications();
		$settings['notifications']['admin'][0]['to']      = array( 'not-an-email' );
		$settings['notifications']['autoresponders']      = array();
		$form                                             = $this->published( $settings );
		$submission                                       = $this->submission( $form );
		$id = ( new Outbox() )->enqueue( $submission, $form, 'submission.completed' )[0];

		( new DeliverNotification( $id ) )->handle();
		$row = Database::query( 'deliveries' )->where( 'id', $id )->first();
		$this->assertSame( 'pending', $row->status );
		$this->assertSame( 'mail_invalid_recipient', $row->last_error );
		$this->assertEqualsWithDelta( time() + 60, strtotime( $row->next_attempt_at . ' UTC' ), 5 );
		// Not due yet.
		( new DeliverNotification( $id ) )->handle();
		$this->assertSame( 1, (int) Database::query( 'deliveries' )->where( 'id', $id )->value( 'attempts' ) );

		foreach ( array( 2, 3 ) as $attempt ) {
			Database::query( 'deliveries' )->where( 'id', $id )->update( array( 'next_attempt_at' => Database::now() ) );
			( new DeliverNotification( $id ) )->handle();
		}
		$row = Database::query( 'deliveries' )->where( 'id', $id )->first();
		$this->assertSame( 'failed', $row->status );
		$this->assertSame( 3, (int) $row->attempts );
		$this->assertCount( 0, $this->sent() );

		// Manual retry through the API.
		$this->signIn();
		$this->api( 'POST', 'submissions/' . $submission->id() . '/retry', array( 'deliveryId' => $id ) )->assertOk()->assertExactJson( array( 'queued' => true ) );
		$this->assertSame( 'pending', Database::query( 'deliveries' )->where( 'id', $id )->value( 'status' ) );
		$this->api( 'POST', 'submissions/' . $submission->id() . '/retry', array( 'deliveryId' => $id ) )->assertStatus( 409 );
		$activity = $this->api( 'GET', 'submissions/' . $submission->id() . '/activity?page=1&perPage=100' )->assertOk();
		$this->assertContains( $id, array_column( $activity->json( 'deliveries' ), 'id' ) );
		$this->assertNotEmpty( $activity->json( 'items' ) );
	}

	public function test_abandoned_event_notifies_admins_only_when_enabled(): void {
		$settings                                     = self::notifications();
		$settings['notifications']['notifyAbandoned'] = true;
		$form                                         = $this->published( $settings );
		$submission                                   = $this->submission( $form, array(), 'abandoned' );
		Hooks::action( 'submission_abandoned', array( $submission, $form ) );
		$this->assertSame( array( 'admin_mail' ), Database::query( 'deliveries' )->pluck( 'channel' )->all() );

		$quiet = $this->published( self::notifications() );
		Hooks::action( 'submission_abandoned', array( $this->submission( $quiet, array(), 'abandoned' ), $quiet ) );
		$this->assertSame( 1, Database::query( 'deliveries' )->count() );
	}

	public function test_recovery_requeues_interrupted_deliveries(): void {
		$form       = $this->published( self::notifications() );
		$submission = $this->submission( $form );
		Queue::fake();
		$ids = ( new Outbox() )->enqueue( $submission, $form, 'submission.completed' );
		Database::query( 'deliveries' )->where( 'id', $ids[0] )->update( array( 'status' => 'processing', 'attempts' => 1, 'next_attempt_at' => gmdate( 'Y-m-d H:i:s', time() - 1 ) ) );
		$this->artisan( 'chatflow:retry-deliveries' )->assertSuccessful();
		$this->assertSame( 'pending', Database::query( 'deliveries' )->where( 'id', $ids[0] )->value( 'status' ) );
		Queue::assertPushed( DeliverNotification::class, 3 );
	}

	public function test_preview_test_send_resend_and_content_templates(): void {
		$this->signIn();
		$form = $this->published( self::notifications() );
		$preview = $this->api( 'POST', 'notifications/preview', array( 'formId' => $form->id(), 'notificationId' => 'admin_1', 'answers' => array( 'name' => 'Preview person' ) ) )->assertOk();
		$this->assertSame( 'New entry from Preview person on Contact form', $preview->json( 'subject' ) );
		$this->assertStringContainsString( '<!doctype html>', $preview->json( 'html' ) );
		$this->assertStringContainsString( 'Preview person', $preview->json( 'plain' ) );
		$this->api( 'POST', 'notifications/preview', array( 'formId' => $form->id(), 'notificationId' => 'missing' ) )->assertNotFound();
		$this->api( 'POST', 'notifications/preview', array( 'formId' => $form->id(), 'notificationId' => 'admin_1', 'answers' => 'x' ) )->assertStatus( 422 );

		$this->api( 'POST', 'notifications/test', array( 'formId' => $form->id(), 'notificationId' => 'admin_1', 'to' => 'bad' ) )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_email' );
		$queued = $this->api( 'POST', 'notifications/test', array( 'formId' => $form->id(), 'notificationId' => 'admin_1', 'to' => 'tester@example.org' ) )->assertOk();
		$this->assertTrue( $queued->json( 'queued' ) );
		$sent = $this->sent();
		$this->assertCount( 1, $sent );
		$this->assertSame( 'tester@example.org', $sent[0]->getTo()[0]->getAddress() );
		$this->assertSame( array(), $sent[0]->getCc() );
		$this->assertSame( 'sent', Database::query( 'deliveries' )->where( 'id', $queued->json( 'deliveryId' ) )->value( 'status' ) );

		$submission = $this->submission( $form );
		$this->api( 'POST', 'submissions/' . $submission->id() . '/resend', array( 'requestId' => 'nope' ) )->assertStatus( 422 );
		$request = (string) Str::uuid();
		$this->api( 'POST', 'submissions/' . $submission->id() . '/resend', array( 'requestId' => $request ) )->assertStatus( 202 )->assertExactJson( array( 'queued' => 2 ) );
		$this->api( 'POST', 'submissions/' . $submission->id() . '/resend', array( 'requestId' => $request ) )->assertStatus( 202 );
		$this->assertSame( 2, Database::query( 'deliveries' )->where( 'event', 'notification.resend' )->count() );
		$this->assertCount( 3, $this->sent() );

		$this->api( 'GET', 'notifications/templates' )->assertOk()->assertExactJson( array( 'items' => array() ) );
		$saved = $this->api( 'POST', 'notifications/templates', array( 'title' => 'Welcome', 'subject' => 'Hi {{name}}', 'body' => '<p>Hi</p><script>x</script>' ) )->assertOk();
		$this->assertSame( '<p>Hi</p>', $saved->json( 'items.0.body' ) );
		$this->api( 'POST', 'notifications/templates', array( 'title' => '', 'subject' => '', 'body' => '' ) )->assertStatus( 422 );
		$this->api( 'GET', 'notifications/templates' )->assertOk()->assertJsonCount( 1, 'items' );
		$this->api( 'DELETE', 'notifications/templates', array( 'id' => $saved->json( 'items.0.id' ) ) )->assertOk()->assertExactJson( array( 'items' => array() ) );
		$this->api( 'DELETE', 'notifications/templates', array( 'id' => 'x' ) )->assertStatus( 422 );
	}

	public function test_sanitiser_keeps_the_allowlist_only(): void {
		$this->assertSame( '<p style="color:red">Hi <b>there</b> friend</p>', Html::clean( '<p style="color:red" class="x">Hi <b>there</b> <span>friend</span></p><style>p{}</style><!-- c -->' ) );
		$this->assertSame( '<a>x</a><img alt="y">', Html::clean( '<a href="javascript:alert(1)">x</a><img src="data:image/png;base64,AA" alt="y" onerror="z">' ) );
		$this->assertSame( '<p>x</p>', Html::clean( '<p style="background:url(x)">x</p>' ) );
		$this->assertSame( "<p>a<br />\nb</p>\n<p>c</p>\n", Html::autop( "a\nb\n\nc" ) );
	}
}
