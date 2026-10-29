<?php
namespace ChatFlow\Laravel\Notifications;

use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Security\CookieSources;
use ChatFlow\Laravel\Submissions\Repository;
use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Hooks;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;

/**
 * Attempts one delivery row. Retries are owned by the Outbox (attempt count and
 * backoff live in the row), so the queue job itself never retries.
 */
final class DeliverNotification implements ShouldQueue {
	use Dispatchable, InteractsWithQueue, Queueable;

	public int $tries = 1;

	public function __construct( public int $deliveryId ) {
		$connection = config( 'chatflow.queue.connection' );
		$queue      = config( 'chatflow.queue.name' );
		if ( is_string( $connection ) && '' !== $connection ) {
			$this->onConnection( $connection );
		}
		if ( is_string( $queue ) && '' !== $queue ) {
			$this->onQueue( $queue );
		}
	}

	public function handle(): void {
		$outbox = new Outbox();
		$row    = $outbox->claim( $this->deliveryId );
		if ( ! $row ) {
			return;
		}
		try {
			$outcome = $this->deliver( $row );
		} catch ( \Throwable $e ) {
			report( $e );
			$outcome = 'worker_exception';
		}
		$outbox->finish( $row, $outcome );
	}

	/** @param array<string,mixed> $row */
	private function deliver( array $row ): string {
		$payload = json_decode( (string) $row['payload'], true, 16, JSON_THROW_ON_ERROR );
		if ( ! is_array( $payload ) || ! isset( $payload['form']['id'] ) ) {
			return 'invalid_payload';
		}
		$form = ( new FormRepository() )->getVersion( (int) $payload['form']['id'], (int) $row['form_version'] );
		if ( ! $form || CookieSources::deniedKeys( $form->schema() ) ) {
			return 'cancelled';
		}
		$is_test = 'notification.test' === $row['event'] && 0 === (int) $row['submission_id'];
		$stored  = $is_test ? null : ( new Repository() )->get( (int) $row['submission_id'] );
		if ( ! $is_test && ( ! $stored || in_array( $stored->status(), array( 'trash', 'spam' ), true ) ) ) {
			return 'cancelled';
		}
		$sample     = $is_test ? $payload['sample'] : $payload;
		$data       = array_merge(
			$stored ? $stored->storage() : array( 'variables' => '{}' ),
			array(
				'_cff_payload_frozen' => true,
				'id'                  => (int) $row['submission_id'],
				'uuid'                => $sample['submission']['uuid'],
				'form_id'             => $form->id(),
				'form_version'        => $form->version(),
				'status'              => $sample['submission']['status'],
				'answers'             => Database::json( (object) ( $sample['answers'] ?? array() ) ),
				'meta'                => Database::json( (object) ( $sample['meta'] ?? array() ) ),
				'ending_id'           => $sample['submission']['ending'] ?? '',
				'created_at'          => ( new \DateTimeImmutable( $sample['submission']['created_at'] ) )->setTimezone( new \DateTimeZone( 'UTC' ) )->format( 'Y-m-d H:i:s' ),
				'duration_ms'         => $sample['submission']['duration_ms'],
			)
		);
		$submission = new Submission( $data, $form );
		if ( 'async' === $row['channel'] ) {
			if ( ! $is_test ) {
				Hooks::action( 'submission_completed_async', array( $submission, $form ) );
			}
			return 'sent';
		}
		if ( ! in_array( $row['channel'], array( 'admin_mail', 'autoresponder' ), true ) ) {
			return 'destination_missing';
		}
		$group = $form->settings()['notifications'][ 'admin_mail' === $row['channel'] ? 'admin' : 'autoresponders' ] ?? array();
		foreach ( $group as $destination ) {
			if ( ( $destination['id'] ?? null ) === $row['destination_id'] ) {
				return ( new Mailer() )->send( $destination, $submission, $form, 'admin_mail' === $row['channel'], $is_test ? (string) $payload['recipient'] : null );
			}
		}
		return 'destination_missing';
	}
}
