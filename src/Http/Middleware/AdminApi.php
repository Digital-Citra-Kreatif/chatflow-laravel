<?php
namespace ChatFlow\Laravel\Http\Middleware;

use ChatFlow\Laravel\ChatFlowServiceProvider;
use ChatFlow\Laravel\Support\Database;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

/**
 * Admin JSON API boundary (the plugin's RestModule::authorize + requestBoundary):
 * an authenticated session user, a CSRF token header on writes, a same-origin
 * Origin, the route's gate ability, a 1 MiB body limit and private,no-store.
 * Failures use the {code,message,data:{status}} envelope, never a redirect.
 *
 * Usage: ->middleware('chatflow.admin.api:chatflow.manage-forms')
 */
final class AdminApi {
	public const MAX_BODY = 1048576;

	public function handle( Request $request, Closure $next, ?string $ability = null ): Response {
		$response = $this->guard( $request, $ability ) ?? $next( $request );
		if ( ! $response->headers->has( 'Cache-Control' ) || ! str_contains( (string) $response->headers->get( 'Cache-Control' ), 'no-store' ) ) {
			$response->headers->set( 'Cache-Control', 'private, no-store' );
		}
		return $response;
	}

	private function guard( Request $request, ?string $ability ): ?Response {
		if ( ! $request->user() ) {
			return self::error( 'cff_unauthenticated', 'Sign in to use the ChatFlow admin.', 401 );
		}
		$length = (int) $request->headers->get( 'Content-Length', '0' );
		if ( $length > self::MAX_BODY || strlen( (string) $request->getContent() ) > self::MAX_BODY ) {
			return self::error( 'cff_request_too_large', 'Request too large.', 413 );
		}
		foreach ( array_keys( $request->query() ) as $key ) {
			if ( preg_match( '/token|credential|nonce/i', (string) $key ) ) {
				return self::error( 'cff_credential_location', 'Credentials must be in request headers, not URLs.', 400 );
			}
		}
		if ( ! in_array( $request->getMethod(), array( 'GET', 'HEAD', 'OPTIONS' ), true ) ) {
			$origin = $request->headers->get( 'Origin' );
			if ( is_string( $origin ) && '' !== $origin && 'null' !== $origin && strtolower( rtrim( $origin, '/' ) ) !== strtolower( $request->getSchemeAndHttpHost() ) ) {
				return self::error( 'cff_origin_rejected', 'Request origin is not allowed.', 403 );
			}
			$session = $request->hasSession() ? $request->session()->token() : null;
			$token   = $request->headers->get( 'X-CSRF-TOKEN' );
			if ( ! is_string( $session ) || '' === $session || ! is_string( $token ) || ! hash_equals( $session, $token ) ) {
				return self::error( 'cff_forbidden', 'Cookie authentication, a CSRF token and the correct permission are required.', 403 );
			}
		}
		if ( null !== $ability && ! Gate::allows( $ability ) ) {
			return self::error( 'cff_forbidden', 'Cookie authentication, a CSRF token and the correct permission are required.', 403 );
		}
		return null;
	}

	public static function error( string $code, string $message, int $status ): Response {
		return ChatFlowServiceProvider::respond( Database::error( $code, $message, $status ) );
	}
}
