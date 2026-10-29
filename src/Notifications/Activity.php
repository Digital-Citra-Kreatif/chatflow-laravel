<?php
namespace ChatFlow\Laravel\Notifications;

use ChatFlow\Laravel\Support\Database;

/** Delivery entries in a submission's activity log (submission_notes of type "delivery"). */
final class Activity {
	public static function record( int $submission_id, string $code, int $delivery_id = 0, int $attempt = 0 ): void {
		if ( $submission_id < 1 ) {
			return;
		}
		try {
			Database::query( 'submission_notes' )->insert(
				array(
					'submission_id' => $submission_id,
					'user_id'       => 0,
					'type'          => 'delivery',
					'body'          => Database::json(
						array(
							'code'       => self::key( $code ),
							'deliveryId' => $delivery_id,
							'attempt'    => $attempt,
						)
					),
					'created_at'    => Database::now(),
				)
			);
		} catch ( \Throwable ) {
			// Activity is best-effort and cannot change a committed visitor outcome.
		}
	}

	/** Lowercase alphanumerics, dashes and underscores, like sanitize_key(). */
	public static function key( string $value ): string {
		return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( $value ) ) ?? '';
	}
}
