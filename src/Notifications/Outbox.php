<?php
namespace ChatFlow\Laravel\Notifications;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Integrations\Payload;
use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Support\Database;
use Illuminate\Support\Facades\DB;

/**
 * Durable delivery rows ("deliveries" table). A row is claimed by one worker,
 * attempted up to three times (retries after 60 s, then 300 s) and ends as
 * sent, failed or cancelled. Each pending row is dispatched as a queued
 * DeliverNotification job; chatflow:retry-deliveries re-dispatches stragglers.
 */
final class Outbox {
	public const MAX_ATTEMPTS = 3;

	/**
	 * Plans and stores the deliveries for a lifecycle event. Callers schedule the returned IDs after commit.
	 *
	 * @return list<int>
	 */
	public function enqueue( Submission $submission, Form $form, string $event, int $revision = 0 ): array {
		if ( 'submission.partial' === $event && $revision < 1 ) {
			throw new \InvalidArgumentException( 'Partial delivery requires a revision.' );
		}
		$payload = Payload::build( $submission, $form, $event );
		$plans   = ( new Planner() )->plan( $submission, $form, $event );
		if ( 'submission.completed' === $event ) {
			$plans[] = array(
				'channel' => 'async',
				'id'      => 'completed',
				'delay'   => 0,
			);
		}
		$ids = array();
		foreach ( $plans as $plan ) {
			$ids[] = $this->insert( $submission->id(), $form->version(), $event, $plan['channel'], $plan['id'], $payload, $revision, $plan['delay'] );
		}
		return $ids;
	}

	/** @param array<string,mixed> $payload */
	public function insert( int $submission_id, int $version, string $event, string $channel, string $destination, array $payload, int|string $identity, int $delay = 0 ): int {
		$hash = hash( 'sha256', implode( '|', array( 'laravel', $submission_id, $version, $event, $channel, $destination, $identity ) ) );
		$now  = Database::now();
		Database::query( 'deliveries' )->insertOrIgnore(
			array(
				'submission_id'   => $submission_id,
				'form_version'    => $version,
				'event'           => $event,
				'channel'         => $channel,
				'destination_id'  => $destination,
				'dedupe_hash'     => $hash,
				'status'          => 'pending',
				'attempts'        => 0,
				'payload'         => Payload::bytes( $payload ),
				'last_error'      => '',
				'next_attempt_at' => gmdate( 'Y-m-d H:i:s', time() + max( 0, $delay ) ),
				'created_at'      => $now,
				'updated_at'      => $now,
			)
		);
		$id = (int) Database::query( 'deliveries' )->where( 'dedupe_hash', $hash )->value( 'id' );
		if ( ! $id ) {
			throw new \RuntimeException( 'Unable to persist delivery.' );
		}
		return $id;
	}

	/**
	 * Queues a DeliverNotification job per pending row, after the current transaction commits.
	 *
	 * @param list<int> $ids
	 */
	public function schedule( array $ids ): void {
		Database::afterCommit(
			function () use ( $ids ): void {
				foreach ( $ids as $id ) {
					$row = $this->get( (int) $id );
					if ( ! $row || 'pending' !== $row['status'] ) {
						continue;
					}
					try {
						$job   = new DeliverNotification( (int) $id );
						$delay = strtotime( $row['next_attempt_at'] . ' UTC' ) - time();
						if ( $delay > 0 ) {
							$job->delay( $delay );
						}
						dispatch( $job );
					} catch ( \Throwable $e ) {
						report( $e );
						Activity::record( (int) $row['submission_id'], 'schedule_failed', (int) $id );
					}
				}
			}
		);
	}

	/** @return array<string,mixed>|null */
	public function get( int $id ): ?array {
		$row = Database::query( 'deliveries' )->where( 'id', $id )->first();
		return $row ? (array) $row : null;
	}

	/** @return array<string,mixed>|null */
	public function claim( int $id ): ?array {
		$now   = Database::now();
		$count = Database::query( 'deliveries' )
			->where( 'id', $id )
			->where( 'status', 'pending' )
			->where( 'attempts', '<', self::MAX_ATTEMPTS )
			->where( 'next_attempt_at', '<=', $now )
			->update(
				array(
					'status'          => 'processing',
					'attempts'        => DB::raw( 'attempts + 1' ),
					'updated_at'      => $now,
					'next_attempt_at' => gmdate( 'Y-m-d H:i:s', time() + 900 ),
				)
			);
		return 1 === $count ? $this->get( $id ) : null;
	}

	/** @param array<string,mixed> $row */
	public function finish( array $row, string $outcome ): void {
		$attempt = (int) $row['attempts'];
		$status  = 'sent' === $outcome || 'cancelled' === $outcome ? $outcome : ( $attempt < self::MAX_ATTEMPTS ? 'pending' : 'failed' );
		$count   = Database::query( 'deliveries' )
			->where( 'id', $row['id'] )
			->where( 'status', 'processing' )
			->where( 'attempts', $attempt )
			->update(
				array(
					'status'          => $status,
					'last_error'      => 'sent' === $outcome ? '' : substr( Activity::key( $outcome ), 0, 255 ),
					'next_attempt_at' => gmdate( 'Y-m-d H:i:s', time() + ( 1 === $attempt ? 60 : 300 ) ),
					'updated_at'      => Database::now(),
				)
			);
		if ( 1 === $count ) {
			Activity::record( (int) $row['submission_id'], $row['channel'] . '_' . $outcome, (int) $row['id'], $attempt );
		}
		if ( 1 === $count && 'pending' === $status ) {
			$this->schedule( array( (int) $row['id'] ) );
		}
	}

	/** Releases interrupted rows, drops old test deliveries and re-queues due rows. Run every few minutes. */
	public function recover(): int {
		Database::query( 'deliveries' )->where( 'submission_id', 0 )->where( 'event', 'notification.test' )->where( 'created_at', '<', gmdate( 'Y-m-d H:i:s', time() - 86400 ) )->delete();
		$now   = Database::now();
		$stale = Database::query( 'deliveries' )->where( 'status', 'processing' )->where( 'next_attempt_at', '<=', $now )->orderBy( 'id' )->limit( 100 )->get( array( 'id', 'submission_id', 'attempts' ) );
		foreach ( $stale as $row ) {
			$count = Database::query( 'deliveries' )->where( 'id', $row->id )->where( 'status', 'processing' )->where( 'next_attempt_at', '<=', $now )->update(
				array(
					'status'     => (int) $row->attempts < self::MAX_ATTEMPTS ? 'pending' : 'failed',
					'last_error' => 'worker_interrupted',
					'updated_at' => $now,
				)
			);
			if ( 1 === $count ) {
				Activity::record( (int) $row->submission_id, 'worker_interrupted', (int) $row->id, (int) $row->attempts );
			}
		}
		$ids = Database::query( 'deliveries' )->where( 'status', 'pending' )->where( 'attempts', '<', self::MAX_ATTEMPTS )->where( 'next_attempt_at', '<=', $now )->orderBy( 'next_attempt_at' )->orderBy( 'id' )->limit( 100 )->pluck( 'id' )->map( 'intval' )->all();
		$this->schedule( $ids );
		return count( $ids );
	}

	public function retry( int $id, int $submission_id ): bool {
		$now   = Database::now();
		$count = Database::query( 'deliveries' )->where( 'id', $id )->where( 'submission_id', $submission_id )->whereIn( 'status', array( 'sent', 'failed' ) )->update(
			array(
				'status'          => 'pending',
				'attempts'        => 0,
				'last_error'      => '',
				'next_attempt_at' => $now,
				'updated_at'      => $now,
			)
		);
		if ( 1 !== $count ) {
			return false;
		}
		Activity::record( $submission_id, 'manual_retry', $id );
		$this->schedule( array( $id ) );
		return true;
	}

	/** Cancels open deliveries of the given submissions. @param list<int> $ids */
	public function cancel( array $ids ): void {
		if ( $ids ) {
			Database::query( 'deliveries' )->whereIn( 'submission_id', $ids )->whereIn( 'status', array( 'pending', 'processing' ) )->update(
				array(
					'status'     => 'cancelled',
					'updated_at' => Database::now(),
				)
			);
		}
	}
}
