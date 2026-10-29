<?php
namespace ChatFlow\Laravel\Http\Controllers\Api;

use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class SessionController extends Controller {
	/** POST sessions (201). */
	public function start( Request $request ): Response {
		return $this->guarded( fn(): Response => $this->respond( $this->sessions( $request )->start( $this->body( $request ), $this->header( $request, 'X-CFF-Start-Token' ), $this->header( $request, 'Idempotency-Key' ) ), 201 ) );
	}

	/** POST sessions/resume. */
	public function resume( Request $request ): Response {
		return $this->guarded(
			function () use ( $request ): Response {
				$form_id = $this->body( $request )['formId'] ?? 0;
				return $this->respond( $this->sessions( $request )->resume( is_numeric( $form_id ) ? abs( (int) $form_id ) : 0, $this->header( $request, 'X-CFF-Resume-Token' ) ) );
			}
		);
	}

	/** GET sessions/{uuid}. */
	public function show( Request $request, string $uuid ): Response {
		return $this->guarded( fn(): Response => $this->respond( $this->sessions( $request )->get( $uuid, $this->header( $request, 'X-CFF-Request-Token' ) ) ) );
	}

	/** PATCH sessions/{uuid}: autosave. */
	public function patch( Request $request, string $uuid ): Response {
		return $this->mutate( $request, 'patch', $uuid );
	}

	/** DELETE sessions/{uuid}: restart. */
	public function destroy( Request $request, string $uuid ): Response {
		return $this->mutate( $request, 'delete', $uuid );
	}

	/** POST sessions/{uuid}/submit. */
	public function submit( Request $request, string $uuid ): Response {
		return $this->mutate( $request, 'submit', $uuid );
	}

	/**
	 * POST sessions/{uuid}/events. Event storage is not available in this version:
	 * the request is validated and authenticated like the plugin, then nothing is stored.
	 */
	public function events( Request $request, string $uuid ): Response {
		return $this->guarded(
			function () use ( $request, $uuid ): Response {
				$cross = $this->crossSite( $request );
				if ( $cross ) {
					return $this->respond( $cross ); }
				$body   = $this->body( $request );
				$events = array( 'view', 'answer', 'back', 'abandon' );
				if ( strlen( Database::json( $body ) ) > 4096 || array_diff( array_keys( $body ), array( 'events', 'optOut', 'consentGranted' ) ) || ! is_bool( $body['optOut'] ?? false ) || ! is_bool( $body['consentGranted'] ?? false ) || ! is_array( $body['events'] ?? null ) || ! array_is_list( $body['events'] ) || count( $body['events'] ) > 10 ) {
					return $this->respond( Database::error( 'cff_events_invalid', 'Invalid events.', 422 ) ); }
				foreach ( $body['events'] as $event ) {
					if ( ! is_array( $event ) || array_diff( array_keys( $event ), array( 'event', 'stepId' ) ) || ! in_array( $event['event'] ?? null, $events, true ) || ! is_string( $event['stepId'] ?? '' ) || strlen( $event['stepId'] ?? '' ) > 64 ) {
						return $this->respond( Database::error( 'cff_events_invalid', 'Invalid events.', 422 ) ); }
				}
				$sessions = $this->sessions( $request );
				$row      = Database::transaction( fn() => $sessions->authenticate( $uuid, $this->header( $request, 'X-CFF-Request-Token' ) ) );
				return $this->respond( Error::is( $row ) ? $row : array( 'stored' => 0 ) );
			}
		);
	}

	/** POST sessions/{uuid}/uploads. Uploads are not available in this version. */
	public function upload( Request $request, string $uuid ): Response {
		return $this->guarded(
			function () use ( $request, $uuid ): Response {
				$cross = $this->crossSite( $request );
				if ( $cross ) {
					return $this->respond( $cross ); }
				if ( ! $request->hasFile( 'file' ) || ! is_string( $request->input( 'fieldId' ) ) ) {
					return $this->respond( Database::error( 'cff_upload_invalid', 'Select an upload field and file.', 422 ) ); }
				$sessions = $this->sessions( $request );
				$row      = Database::transaction( fn() => $sessions->authenticate( $uuid, $this->header( $request, 'X-CFF-Request-Token' ) ) );
				return $this->respond( Error::is( $row ) ? $row : Database::error( 'cff_upload_field', 'Select a configured upload field.', 422 ) );
			}
		);
	}

	/** POST sessions/{uuid}/magic-link. Not available; the plugin's generic answer never reveals why. */
	public function magicLink(): Response {
		return $this->respond( array( 'accepted' => true ) );
	}

	/** POST sessions/magic-resume. Not available: every link is invalid. */
	public function magicResume(): Response {
		return $this->respond( Database::error( 'cff_magic_invalid', 'This resume link is unavailable.', 401 ) );
	}

	private function mutate( Request $request, string $operation, string $uuid ): Response {
		return $this->guarded( fn(): Response => $this->respond( $this->sessions( $request )->mutate( $operation, $uuid, $this->body( $request ), $this->header( $request, 'X-CFF-Request-Token' ), $this->header( $request, 'Idempotency-Key' ) ) ) );
	}

	/** The plugin's UploadSession::guard() extra check for upload and event endpoints. */
	private function crossSite( Request $request ): ?Error {
		return 'cross-site' === $request->headers->get( 'Sec-Fetch-Site' ) ? Database::error( 'cff_cross_origin', 'Same-origin requests are required.', 403 ) : null;
	}
}
