<?php
namespace ChatFlow\Laravel\Forms;

use ChatFlow\Laravel\Support\Database;

final class Statistics {
	/** @return array{completed:int,started:int,completionRate:float|int,lastSubmissionAt:?string} */
	public static function get( int $id ): array {
		$summary   = Database::query( 'submissions' )->where( 'form_id', $id )->where( 'status', 'completed' )->selectRaw( 'COUNT(*) AS completed, MAX(completed_at) AS latest' )->first();
		$started   = Database::query( 'sessions' )->where( 'form_id', $id )->count();
		$completed = (int) ( $summary->completed ?? 0 );
		$started   = max( $completed, $started );
		return array(
			'completed'        => $completed,
			'started'          => $started,
			'completionRate'   => $started ? round( 100 * $completed / $started, 1 ) : 0,
			'lastSubmissionAt' => isset( $summary->latest ) ? (string) $summary->latest : null,
		);
	}
}
