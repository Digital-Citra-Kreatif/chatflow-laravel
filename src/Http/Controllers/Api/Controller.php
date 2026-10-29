<?php
namespace ChatFlow\Laravel\Http\Controllers\Api;

use ChatFlow\Laravel\ChatFlowServiceProvider;
use ChatFlow\Laravel\Fields\Registry;
use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Logic\Engine;
use ChatFlow\Laravel\Submissions\SessionService;
use ChatFlow\Laravel\Support\Database;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Shared plumbing for the public visitor API: body parsing and the plugin's route error wrapper. */
abstract class Controller {
	/**
	 * Runs an action: malformed input becomes 422 cff_invalid_request, anything
	 * unexpected is reported and becomes 503 cff_storage_error.
	 *
	 * @param callable():Response $action
	 */
	protected function guarded( callable $action ): Response {
		try {
			return $action();
		} catch ( \InvalidArgumentException | \TypeError | \JsonException ) {
			return $this->respond( Database::error( 'cff_invalid_request', 'Invalid request parameters.', 422 ) );
		} catch ( \Throwable $e ) {
			report( $e );
			return $this->respond( Database::error( 'cff_storage_error', 'The request could not be saved.', 503 ) );
		}
	}

	protected function respond( mixed $value, int $status = 200 ): Response {
		if ( $value instanceof Form ) {
			$value = $value->toArray();
		}
		return ChatFlowServiceProvider::respond( $value, $status );
	}

	protected function sessions( Request $request ): SessionService {
		return new SessionService( new FormRepository(), new Engine(), new Registry(), $request->server->all(), $request->cookies->all() );
	}

	protected function header( Request $request, string $name ): string {
		$value = $request->headers->get( $name );
		return is_string( $value ) ? $value : '';
	}

	/**
	 * The JSON object body, with the plugin's map rules: schema/settings/answers/meta/prefill/
	 * filters/criteria must be objects; nested non-empty objects become arrays, empty ones stay objects.
	 *
	 * @return array<string,mixed>
	 */
	protected function body( Request $request ): array {
		$raw_body = trim( (string) $request->getContent() );
		// DELETE requests and some clients legitimately send no body.
		if ( '' === $raw_body ) {
			return array();
		}
		$raw = json_decode( $raw_body, false, 64, JSON_THROW_ON_ERROR );
		if ( ! is_object( $raw ) ) {
			throw new \InvalidArgumentException( 'JSON object body required.' ); }
		foreach ( array( 'schema', 'settings', 'answers', 'meta', 'prefill', 'filters', 'criteria' ) as $key ) {
			if ( property_exists( $raw, $key ) && ! is_object( $raw->$key ) ) {
				throw new \InvalidArgumentException( 'JSON map required.' ); }
		}
		$convert = function ( mixed $value ) use ( &$convert ): mixed {
			if ( is_object( $value ) ) {
				if ( ! get_object_vars( $value ) ) {
					return $value;
				}
				$value = (array) $value;
			}
			return is_array( $value ) ? array_map( $convert, $value ) : $value;
		};
		$body    = (array) $convert( $raw );
		foreach ( array( 'schema', 'settings', 'answers', 'meta', 'prefill', 'filters', 'criteria', 'changes' ) as $key ) {
			if ( isset( $body[ $key ] ) && is_object( $body[ $key ] ) ) {
				$body[ $key ] = (array) $body[ $key ]; }
		}
		return $body;
	}

	protected function invalidVersion( mixed $version ): bool {
		return null !== $version && ( ! is_string( $version ) || ! ctype_digit( $version ) || (int) $version < 1 );
	}
}
