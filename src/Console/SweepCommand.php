<?php
namespace ChatFlow\Laravel\Console;

use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Privacy\Export;
use ChatFlow\Laravel\Submissions\Repository;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Support\Hooks;
use ChatFlow\Laravel\Support\Settings;
use Illuminate\Console\Command;

/**
 * Abandoned-session sweep and pruning. Hosts schedule it, for example hourly:
 *
 *     Schedule::command('chatflow:sweep')->hourly()->withoutOverlapping();
 *
 * Idle sessions past their form's abandonDays (or past expiry) become "expired";
 * their partial submissions become "abandoned" and chatflow.submission_abandoned
 * fires after commit. Expired rate-limit and idempotency rows are deleted, as are
 * closed/expired sessions that never produced a submission (after 30 days).
 * Submissions older than their form's retention period are deleted, and expired
 * export files are removed.
 */
final class SweepCommand extends Command {
	protected $signature = 'chatflow:sweep';

	protected $description = 'Mark idle ChatFlow sessions abandoned, apply retention and prune expired rate-limit, request, session and export rows';

	private const DAY = 86400;

	public function handle(): int {
		$abandoned = $this->abandon();
		$retained  = $this->retention();
		$pruned    = $this->prune();
		$sessions  = $this->purgeOrphanSessions();
		( new Export() )->expire();
		$this->info( "Abandoned {$abandoned} submission(s); deleted {$retained} submission(s) past retention; pruned {$pruned} expired row(s) and {$sessions} orphan session(s)." );
		return self::SUCCESS;
	}

	/** The plugin's PrivacyModule::abandon(), run to completion in batches. Returns abandoned submissions. */
	public function abandon(): int {
		$forms       = new FormRepository();
		$submissions = new Repository( $forms );
		$cursor      = 0;
		$count       = 0;
		do {
			$ids = Database::query( 'sessions' )->where( 'id', '>', $cursor )->where( 'status', 'active' )->where( 'last_seen_at', '<=', gmdate( 'Y-m-d H:i:s', time() - self::DAY ) )->orderBy( 'id' )->limit( 100 )->pluck( 'id' )->all();
			foreach ( $ids as $id ) {
				$result = Database::transaction(
					static function () use ( $id, $forms, $submissions ) {
						$row = Database::query( 'sessions' )->where( 'id', $id )->lockForUpdate()->first();
						if ( ! $row || 'active' !== $row->status ) {
							return null; }
						$form = $forms->getVersion( (int) $row->form_id, (int) $row->form_version );
						if ( ! $form ) {
							return null; }
						$days = (int) ( $form->settings()['sessions']['abandonDays'] ?? 30 );
						if ( strtotime( $row->last_seen_at . ' UTC' ) > time() - $days * self::DAY && strtotime( $row->expires_at . ' UTC' ) > time() ) {
							return null; }
						Database::query( 'sessions' )->where( 'id', $row->id )->update(
							array(
								'status'    => 'expired',
								'closed_at' => Database::now(),
							)
						);
						$submission = $row->submission_id ? $submissions->get( (int) $row->submission_id ) : null;
						if ( ! $submission || 'partial' !== $submission->status() ) {
							return null; }
						$submission = $submissions->complete(
							$submission->id(),
							array(
								'status'       => 'abandoned',
								'abandoned_at' => Database::now(),
							)
						);
						Database::afterCommit( static fn() => Hooks::action( 'submission_abandoned', array( $submission, $form ) ) );
						return true;
					}
				);
				if ( Error::is( $result ) ) {
					$this->warn( 'Session ' . $id . ' could not be swept: ' . $result->message() );
				} elseif ( true === $result ) {
					++$count;
				}
				$cursor = (int) $id;
			}
		} while ( count( $ids ) === 100 );
		return $count;
	}

	/**
	 * The plugin's PrivacyModule::retention(): deletes submissions older than the form's
	 * retentionDays (or the global default), and partial/abandoned ones older than
	 * partialRetentionDays when that is shorter. Trashed or deleted forms keep their
	 * submissions under the global policy. Returns deleted submissions.
	 */
	public function retention(): int {
		$global      = Settings::get()['retention'];
		$forms       = new FormRepository();
		$submissions = new Repository( $forms );
		$count       = 0;
		foreach ( Database::query( 'submissions' )->distinct()->orderBy( 'form_id' )->pluck( 'form_id' ) as $form_id ) {
			$form    = $forms->getDraft( (int) $form_id );
			$privacy = $form ? ( $form->settings()['privacy'] ?? array() ) : array();
			if ( ! ( $privacy['retentionEnabled'] ?? $global['enabled'] ?? false ) ) {
				continue; }
			$days    = (int) ( $privacy['retentionDays'] ?? $global['days'] ?? 360 );
			$partial = $privacy['partialRetentionDays'] ?? $global['partialDays'] ?? null;
			$passes  = array( array( $days, array( 'completed', 'partial', 'abandoned', 'spam', 'trash' ) ) );
			if ( is_int( $partial ) && $partial >= 1 && $partial < $days ) {
				$passes[] = array( $partial, array( 'partial', 'abandoned' ) ); }
			foreach ( $passes as [$age, $statuses] ) {
				if ( $age < 1 ) {
					continue; }
				$filters = array(
					'formId'        => (int) $form_id,
					'status'        => $statuses,
					'olderThanDays' => $age,
					'maxId'         => (int) Database::query( 'submissions' )->max( 'id' ),
				);
				do {
					$ids = $submissions->where( $filters )->orderBy( 's.id' )->limit( 100 )->pluck( 's.id' )->all();
					foreach ( $ids as $id ) {
						if ( $submissions->delete( (int) $id ) ) {
							++$count; }
						$filters['afterId'] = (int) $id;
					}
				} while ( count( $ids ) === 100 );
			}
		}
		return $count;
	}

	/** Expired rate-limit buckets and idempotency rows. Completed submit receipts never expire. */
	public function prune(): int {
		$now     = Database::now();
		$deleted = 0;
		foreach ( array( 'rate_limits', 'requests' ) as $table ) {
			$deleted += Database::query( $table )->where( 'expires_at', '<', $now )->delete();
		}
		return $deleted;
	}

	/** Closed or expired sessions that never produced a submission. */
	public function purgeOrphanSessions( int $days = 30 ): int {
		return Database::query( 'sessions' )->whereNull( 'submission_id' )->whereIn( 'status', array( 'closed', 'expired' ) )->whereRaw( 'COALESCE(closed_at, expires_at) < ?', array( gmdate( 'Y-m-d H:i:s', time() - $days * self::DAY ) ) )->delete();
	}
}
