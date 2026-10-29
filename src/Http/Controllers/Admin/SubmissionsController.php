<?php
namespace ChatFlow\Laravel\Http\Controllers\Admin;

use ChatFlow\Laravel\Http\Middleware\AdminApi;
use ChatFlow\Laravel\Notifications\Notifications;
use ChatFlow\Laravel\Privacy\Export;
use ChatFlow\Laravel\Submissions\Repository;
use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

/** Inbox endpoints: list, detail, changes, deletion, bulk actions, delivery activity and CSV export. */
final class SubmissionsController extends ApiController {
	private function repository(): Repository {
		return new Repository( $this->forms );
	}

	public function index( Request $request ): array {
		[$page, $per] = $this->pagination( $request );
		$filters      = $request->query();
		unset( $filters['page'], $filters['perPage'] );
		$data = $this->repository()->find( $filters, $page, $per );
		// Frozen title and field labels per form version on this page, so the inbox needs no per-row detail requests.
		$forms = array();
		foreach ( $data['items'] as $submission ) {
			$key = $submission->formId() . ':' . $submission->formVersion();
			if ( array_key_exists( $key, $forms ) ) {
				continue;
			}
			$form          = $this->forms->getVersion( $submission->formId(), $submission->formVersion() );
			$forms[ $key ] = null;
			if ( ! $form ) {
				continue;
			}
			$labels = array();
			foreach ( (array) ( $form->schema()['steps'] ?? array() ) as $step ) {
				if ( is_array( $step ) && isset( $step['key'] ) && '' !== (string) $step['key'] ) {
					$labels[ (string) $step['key'] ] = '' !== (string) ( $step['label'] ?? '' ) ? (string) $step['label'] : (string) $step['key'];
				}
			}
			$forms[ $key ] = array(
				'title'  => $form->title(),
				'labels' => (object) $labels,
			);
		}
		return array(
			'items'   => array_map( static fn( Submission $s ): array => $s->admin(), $data['items'] ),
			'total'   => $data['total'],
			'page'    => $page,
			'perPage' => $per,
			'forms'   => (object) array_filter( $forms ),
		);
	}

	public function show( int $id ): array|Error {
		$submission = $this->repository()->get( $id );
		if ( ! $submission ) {
			return $this->notFound( 'Submission not found.' );
		}
		$data          = $submission->admin();
		$form          = $this->forms->getVersion( $submission->formId(), $submission->formVersion() );
		$data['form']  = $form ? array(
			'id'      => $form->id(),
			'title'   => $form->title(),
			'slug'    => $form->slug(),
			'version' => $form->version(),
			'schema'  => $form->schema(),
		) : null;
		$data['notes'] = $this->repository()->notes( $submission->id() );
		return $data;
	}

	public function update( Request $request, int $id ): array|Error {
		$body = $this->changes( $this->body( $request ) );
		if ( Error::is( $body ) ) {
			return $body;
		}
		if ( 'trash' === ( $body['status'] ?? '' ) && ! Gate::allows( 'chatflow.delete-submissions' ) ) {
			return Database::error( 'cff_forbidden', 'Trashing submissions requires the delete permission.', 403 );
		}
		$submission = $this->repository()->update( $id, $body );
		return $submission ? $submission->admin() : $this->notFound( 'Submission not found.' );
	}

	public function destroy( Request $request, int $id ): array|Error {
		$body = $this->body( $request );
		if ( ! $this->repository()->get( $id ) ) {
			return $this->notFound( 'Submission not found.' );
		}
		if ( $body['permanent'] ?? false ) {
			if ( true !== $body['permanent'] || 'DELETE' !== ( $body['confirmation'] ?? '' ) ) {
				return Database::error( 'cff_delete_confirmation', 'DELETE confirmation required.', 422 );
			}
			$this->repository()->delete( $id );
		} else {
			$this->repository()->update( $id, array( 'status' => 'trash' ) );
		}
		return array( 'deleted' => true );
	}

	public function bulk( Request $request ): array|Error|Response {
		$body = $this->body( $request );
		$ids  = $body['ids'] ?? null;
		if ( ! is_array( $ids ) || ! $ids || count( $ids ) > 100 || array_filter( $ids, static fn( $id ) => ! is_int( $id ) || $id < 1 ) ) {
			return Database::error( 'cff_bulk_invalid', 'Choose up to 100 submission IDs.', 422 );
		}
		if ( isset( $body['permanent'] ) ) {
			if ( ! Gate::allows( 'chatflow.delete-submissions' ) ) {
				return AdminApi::error( 'cff_forbidden', 'Cookie authentication, a CSRF token and the correct permission are required.', 403 );
			}
			if ( true !== $body['permanent'] || 'DELETE' !== ( $body['confirmation'] ?? '' ) ) {
				return Database::error( 'cff_delete_confirmation', 'DELETE confirmation required.', 422 );
			}
			foreach ( $ids as $id ) {
				$this->repository()->delete( $id );
			}
		} else {
			$changes = $this->changes( is_array( $body['changes'] ?? null ) ? $body['changes'] : array() );
			if ( Error::is( $changes ) ) {
				return $changes;
			}
			if ( 'trash' === ( $changes['status'] ?? '' ) && ! Gate::allows( 'chatflow.delete-submissions' ) ) {
				return Database::error( 'cff_forbidden', 'Delete permission required.', 403 );
			}
			foreach ( $ids as $id ) {
				$this->repository()->update( $id, $changes );
			}
		}
		return array( 'updated' => count( $ids ) );
	}

	public function activity( Request $request, int $id ): array|Error {
		return ( new Notifications( $this->forms ) )->activity( $id, self::int( $request->query( 'page' ), 1 ), self::int( $request->query( 'perPage' ), 20 ) );
	}

	public function resend( Request $request, int $id ): JsonResponse {
		$result = ( new Notifications( $this->forms ) )->resend( $id, $this->body( $request )['requestId'] ?? null );
		return $this->respond( $result, 202 );
	}

	public function retry( Request $request, int $id ): array|Error {
		return ( new Notifications( $this->forms ) )->retry( $id, self::int( $this->body( $request )['deliveryId'] ?? null ) );
	}

	public function export( Request $request ): array|Error {
		return ( new Export( $this->forms, $this->repository() ) )->create( $this->body( $request ) );
	}

	public function exportStatus( int $id ): array|Error {
		return ( new Export( $this->forms, $this->repository() ) )->progress( $id );
	}

	public function download( Request $request, int $id ): Response|Error {
		return ( new Export( $this->forms, $this->repository() ) )->download( $id, $request->query( 'ticket' ) );
	}

	/**
	 * @param array<string,mixed> $body
	 * @return array<string,mixed>|Error
	 */
	private function changes( array $body ): array|Error {
		if ( ! $body || array_diff( array_keys( $body ), array( 'isRead', 'isStarred', 'status', 'note' ) ) ) {
			return Database::error( 'cff_invalid_changes', 'Unknown or empty changes.', 422 );
		}
		foreach ( array( 'isRead', 'isStarred' ) as $key ) {
			if ( isset( $body[ $key ] ) && ! is_bool( $body[ $key ] ) ) {
				return Database::error( 'cff_invalid_changes', 'Boolean required.', 422 );
			}
		}
		if ( isset( $body['status'] ) && ! in_array( $body['status'], array( 'completed', 'partial', 'abandoned', 'spam', 'trash', 'restore' ), true ) || isset( $body['note'] ) && ( ! is_string( $body['note'] ) || strlen( $body['note'] ) > 10000 ) ) {
			return Database::error( 'cff_invalid_changes', 'Invalid status or note.', 422 );
		}
		return $body;
	}
}
