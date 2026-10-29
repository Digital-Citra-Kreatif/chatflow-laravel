<?php
namespace ChatFlow\Laravel\Forms;

use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;

/** Builder edit lock, like WordPress post locks: held for 150 seconds and refreshed by the editor's heartbeat. */
final class EditLock {
	public const WINDOW = 150;

	public static function acquire( int $id ): true|Error {
		return Database::transaction(
			static function () use ( $id ): true|Error {
				$row = Database::query( 'forms' )->where( 'id', $id )->lockForUpdate()->first( array( 'id', 'locked_by', 'locked_until' ) );
				if ( ! $row ) {
					return Database::error( 'cff_form_not_found', 'Form not found.', 404 );
				}
				$user = (int) auth()->id();
				$now  = Database::now();
				if ( null !== $row->locked_by && (int) $row->locked_by !== $user && null !== $row->locked_until && (string) $row->locked_until > $now ) {
					return Database::error( 'cff_form_locked', 'Another administrator is editing this form. Your local draft is retained; retry after their editing lock expires.', 409 );
				}
				Database::query( 'forms' )->where( 'id', $id )->update(
					array(
						'locked_by'    => $user,
						'locked_until' => gmdate( 'Y-m-d H:i:s', time() + self::WINDOW ),
					)
				);
				return true;
			}
		);
	}
}
