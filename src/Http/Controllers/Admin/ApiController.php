<?php
namespace ChatFlow\Laravel\Http\Controllers\Admin;

use ChatFlow\Laravel\ChatFlowServiceProvider;
use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\Response;

/** Shared plumbing for the admin JSON API controllers (the plugin's RestModule route wrapper). */
abstract class ApiController extends Controller {
	public function __construct( protected FormRepository $forms = new FormRepository() ) {}

	/**
	 * Wraps every action: invalid input becomes 422 cff_invalid_request and any
	 * other failure a reported 503 cff_storage_error, like the plugin's routes.
	 *
	 * @param array<mixed> $parameters
	 */
	public function callAction( $method, $parameters ): Response {
		try {
			$result = $this->{$method}( ...array_values( $parameters ) );
		} catch ( \InvalidArgumentException | \TypeError | \JsonException $e ) {
			return $this->respond( Database::error( 'cff_invalid_request', 'Invalid request parameters.', 422 ) );
		} catch ( \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface $e ) {
			throw $e;
		} catch ( \Throwable $e ) {
			report( $e );
			return $this->respond( Database::error( 'cff_storage_error', 'The request could not be saved.', 503 ) );
		}
		return $result instanceof Response ? $result : $this->respond( $result );
	}

	protected function respond( mixed $value, int $status = 200 ): JsonResponse {
		if ( $value instanceof Form ) {
			$value = $value->toArray();
		}
		return ChatFlowServiceProvider::respond( $value, Error::is( $value ) ? 200 : $status );
	}

	/**
	 * The JSON object body. Maps in known keys must be JSON objects; empty nested
	 * objects stay objects so they round-trip as {}.
	 *
	 * @return array<string,mixed>
	 */
	protected function body( Request $request ): array {
		$raw_body = trim( (string) $request->getContent() );
		if ( '' === $raw_body ) {
			return array();
		}
		$raw = json_decode( $raw_body, false, 64, JSON_THROW_ON_ERROR );
		if ( array() === $raw ) {
			return array();
		}
		if ( ! is_object( $raw ) ) {
			throw new \InvalidArgumentException( 'JSON object body required.' );
		}
		foreach ( array( 'schema', 'settings', 'answers', 'meta', 'prefill', 'filters', 'criteria' ) as $key ) {
			if ( property_exists( $raw, $key ) && ! is_object( $raw->$key ) ) {
				throw new \InvalidArgumentException( 'JSON map required.' );
			}
		}
		$convert = static function ( mixed $value ) use ( &$convert ): mixed {
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
				$body[ $key ] = (array) $body[ $key ];
			}
		}
		return $body;
	}

	/** @return array{int,int} */
	protected function pagination( Request $request, int $max = 100 ): array {
		return array( max( 1, self::int( $request->query( 'page' ), 1 ) ), max( 1, min( $max, self::int( $request->query( 'perPage' ), 20 ) ) ) );
	}

	protected static function int( mixed $value, int $default = 0 ): int {
		if ( null === $value || '' === $value ) {
			return $default;
		}
		return is_string( $value ) && ctype_digit( $value ) && strlen( $value ) < 10 ? (int) $value : ( is_int( $value ) ? abs( $value ) : $default );
	}

	protected function notFound( string $message = 'Not found.' ): Error {
		return Database::error( 'cff_not_found', $message, 404 );
	}
}
