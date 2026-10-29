<?php
namespace ChatFlow\Laravel\Notifications;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Integrations\Payload;
use ChatFlow\Laravel\Security\CookieSources;
use ChatFlow\Laravel\Submissions\Repository;
use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

/** Notification lifecycle and admin operations (the plugin's NotificationsModule). */
final class Notifications {
	public function __construct( private FormRepository $forms = new FormRepository() ) {}

	/**
	 * Listener for the chatflow.submission_completed / chatflow.submission_abandoned
	 * events: stores the planned deliveries and queues them after commit.
	 */
	public static function handle( string $event, mixed $submission, mixed $form ): void {
		if ( ! $submission instanceof Submission || ! $form instanceof Form ) {
			return;
		}
		$outbox = new Outbox();
		$outbox->schedule( $outbox->enqueue( $submission, $form, $event ) );
	}

	/** @param array<string,mixed> $input
	 * @return array<string,mixed>|Error */
	public function test( array $input ): array|Error {
		$form = $this->forms->getPublished( (int) ( $input['formId'] ?? 0 ) );
		$to   = $input['to'] ?? null;
		if ( ! $form ) {
			return Database::error( 'cff_form_unpublished', __( 'Publish the form before queuing a test; draft previews are available separately.' ), 422 );
		}
		if ( ! is_string( $to ) || ! Mailer::isEmail( $to ) ) {
			return Database::error( 'cff_invalid_email', __( 'Enter a valid test email address.' ), 422 );
		}
		$found = $this->notification( $form, (string) ( $input['notificationId'] ?? '' ) );
		if ( ! $found ) {
			return $this->missing();
		}
		try {
			$sample  = $this->sample( $form, $input );
			$payload = array(
				'form'      => array( 'id' => $form->id() ),
				'recipient' => $to,
				'sample'    => Payload::build( $sample, $form ),
			);
			$outbox  = new Outbox();
			$id      = $outbox->insert( 0, $form->version(), 'notification.test', $found['channel'], (string) $found['notification']['id'], $payload, (string) Str::uuid() );
			$outbox->schedule( array( $id ) );
			return array(
				'queued'     => true,
				'deliveryId' => $id,
			);
		} catch ( \InvalidArgumentException $e ) {
			throw $e;
		} catch ( \Throwable $e ) {
			report( $e );
			return Database::error( 'cff_test_queue_failed', __( 'The test could not be queued.' ), 500 );
		}
	}

	/** @param array<string,mixed> $input
	 * @return array{subject:string,html:string,plain:string}|Error */
	public function preview( array $input ): array|Error {
		$form  = $this->forms->getDraft( (int) ( $input['formId'] ?? 0 ) );
		$found = $form ? $this->notification( $form, (string) ( $input['notificationId'] ?? '' ) ) : null;
		if ( ! $form || ! $found ) {
			return $this->missing();
		}
		$sample = $this->sample( $form, $input );
		try {
			return ( new Renderer() )->render( $found['notification'], $sample, $form, 'admin_mail' === $found['channel'] );
		} catch ( \Throwable $e ) {
			report( $e );
			return Database::error( 'cff_preview_failed', __( 'The notification could not be previewed.' ), 500 );
		}
	}

	/** @return array{queued:int}|Error */
	public function resend( int $id, mixed $request_id ): array|Error {
		$submission = ( new Repository( $this->forms ) )->get( $id );
		if ( ! is_string( $request_id ) || ! Str::isUuid( $request_id ) ) {
			return Database::error( 'cff_resend_invalid', 'An idempotent request ID is required.', 422 );
		}
		if ( ! $submission || 'completed' !== $submission->status() ) {
			return Database::error( 'cff_resend_unavailable', 'Only completed submissions can resend notifications.', 422 );
		}
		$form = $this->forms->getVersion( $submission->formId(), $submission->formVersion() );
		if ( ! $form ) {
			return Database::error( 'cff_form_missing', 'Submission form version unavailable.', 404 );
		}
		if ( CookieSources::deniedKeys( $form->schema() ) ) {
			return Database::error( 'cff_restricted_cookie', 'Notifications from an outdated credential-cookie schema cannot be resent.', 422 );
		}
		$outbox = new Outbox();
		$ids    = Database::transaction(
			static function () use ( $outbox, $submission, $form, $request_id ): array {
				$ids     = array();
				$payload = Payload::build( $submission, $form, 'submission.completed' );
				foreach ( ( new Planner() )->plan( $submission, $form, 'submission.completed' ) as $plan ) {
					$ids[] = $outbox->insert( $submission->id(), $form->version(), 'notification.resend', $plan['channel'], $plan['id'], $payload, $request_id );
				}
				return $ids;
			}
		);
		if ( Error::is( $ids ) ) {
			return Database::error( 'cff_resend_failed', 'Could not queue notifications.', 500 );
		}
		$outbox->schedule( $ids );
		return array( 'queued' => count( $ids ) );
	}

	/** @return array{queued:true}|Error */
	public function retry( int $id, int $delivery_id ): array|Error {
		$submission = ( new Repository( $this->forms ) )->get( $id );
		if ( ! $submission || in_array( $submission->status(), array( 'spam', 'trash' ), true ) ) {
			return $this->missing();
		}
		if ( ! ( new Outbox() )->retry( $delivery_id, $id ) ) {
			return Database::error( 'cff_retry_conflict', __( 'Only a sent or failed delivery belonging to this submission can be retried.' ), 409 );
		}
		return array( 'queued' => true );
	}

	/** @return array<string,mixed>|Error */
	public function activity( int $id, int $page, int $per_page ): array|Error {
		if ( ! ( new Repository( $this->forms ) )->get( $id ) ) {
			return $this->missing();
		}
		$page     = max( 1, $page );
		$per_page = min( 100, max( 1, $per_page ) );
		$offset   = ( $page - 1 ) * $per_page;
		$items    = Database::query( 'submission_notes' )->where( 'submission_id', $id )->where( 'type', 'delivery' )->orderByDesc( 'id' )->limit( $per_page )->offset( $offset )->get( array( 'id', 'type', 'body', 'created_at' ) );
		$rows     = Database::query( 'deliveries' )->where( 'submission_id', $id )->orderByDesc( 'id' )->limit( $per_page )->offset( $offset )->get( array( 'id', 'event', 'channel', 'destination_id', 'status', 'attempts', 'last_error', 'next_attempt_at', 'created_at', 'updated_at' ) );
		return array(
			'items'      => array_map( static fn( object $row ): array => (array) $row, $items->all() ),
			'deliveries' => array_map( static fn( object $row ): array => (array) $row, $rows->all() ),
			'page'       => $page,
			'perPage'    => $per_page,
		);
	}

	/** @param array<string,mixed> $input */
	private function sample( Form $form, array $input ): Submission {
		$answers = array();
		$past_id = (int) ( $input['submissionId'] ?? 0 );
		if ( $past_id ) {
			$past = ( new Repository( $this->forms ) )->get( $past_id );
			if ( ! $past || $past->formId() !== $form->id() || in_array( $past->status(), array( 'trash', 'spam' ), true ) || ! Gate::allows( 'chatflow.view-submissions' ) ) {
				throw new \InvalidArgumentException( 'Past submission unavailable.' );
			}
			$answers = $past->answers();
		} else {
			$given = $input['answers'] ?? null;
			if ( null !== $given && ( ! is_array( $given ) || strlen( Database::json( $given ) ) > 1048576 ) ) {
				throw new \InvalidArgumentException( 'Invalid sample answers.' );
			}
			foreach ( $form->schema()['steps'] ?? array() as $step ) {
				if ( in_array( $step['type'], array( 'statement', 'summary', 'media', 'hidden' ), true ) ) {
					continue;
				}
				$value                   = match ( $step['type'] ) {
					'email' => 'sample@example.org',
					'phone' => '+628123456789',
					'number' => 1,
					'date' => gmdate( 'Y-m-d' ),
					'yes_no', 'consent' => true,
					'single_choice' => $step['options'][0]['value'] ?? '',
					'multi_choice' => array( $step['options'][0]['value'] ?? '' ),
					default => __( 'Sample answer' ),
				};
				$answers[ $step['key'] ] = Payload::jsonValue( $given[ $step['key'] ] ?? $value );
			}
		}
		return new Submission(
			array(
				'id'           => 0,
				'uuid'         => (string) Str::uuid(),
				'form_id'      => $form->id(),
				'form_version' => $form->version(),
				'status'       => 'completed',
				'answers'      => Database::json( (object) $answers ),
				'variables'    => '{}',
				'meta'         => '{}',
				'ending_id'    => '',
				'created_at'   => gmdate( 'Y-m-d H:i:s' ),
				'updated_at'   => gmdate( 'Y-m-d H:i:s' ),
				'duration_ms'  => 0,
			),
			$form
		);
	}

	/** @return array{channel:string,notification:array<string,mixed>}|null */
	private function notification( Form $form, string $id ): ?array {
		foreach ( array(
			'admin'          => 'admin_mail',
			'autoresponders' => 'autoresponder',
		) as $group => $channel ) {
			foreach ( $form->settings()['notifications'][ $group ] ?? array() as $notification ) {
				if ( is_array( $notification ) && ( $notification['id'] ?? null ) === $id ) {
					return array(
						'channel'      => $channel,
						'notification' => $notification,
					);
				}
			}
		}
		return null;
	}

	private function missing(): Error {
		return Database::error( 'cff_not_found', __( 'Notification or submission not found.' ), 404 );
	}
}
