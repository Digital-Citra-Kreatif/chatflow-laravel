<?php
namespace ChatFlow\Laravel\Http\Middleware;

use ChatFlow\Laravel\ChatFlowServiceProvider;
use ChatFlow\Laravel\Support\Database;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Request boundary for the public visitor API (the plugin's requestBoundary and
 * cacheHeaders filters): size limit, no credentials in URLs, same-origin
 * mutations, and private/no-store responses except a successful public form read.
 */
final class PublicBoundary {
	public const MAX_BODY = 1048576;

	public function handle( Request $request, Closure $next ): Response {
		$response = $this->reject( $request ) ?? $next( $request );
		if ( ! ( 'chatflow.api.forms.show' === $request->route()?->getName() && $request->isMethod( 'GET' ) && $response->getStatusCode() < 400 ) ) {
			$response->headers->set( 'Cache-Control', 'private,no-store' );
			$response->headers->remove( 'ETag' );
		}
		return $response;
	}

	private function reject( Request $request ): ?Response {
		$length = (int) $request->server( 'CONTENT_LENGTH', 0 );
		if ( $length > self::MAX_BODY || strlen( (string) $request->getContent() ) > self::MAX_BODY ) {
			return ChatFlowServiceProvider::respond( Database::error( 'cff_request_too_large', 'Request too large.', 413 ) );
		}
		foreach ( $request->query->keys() as $key ) {
			if ( preg_match( '/token|credential|nonce/i', (string) $key ) ) {
				return ChatFlowServiceProvider::respond( Database::error( 'cff_credential_location', 'Credentials must be in request headers, not URLs.', 400 ) );
			}
		}
		$origin = $request->headers->get( 'Origin' );
		if ( in_array( $request->getMethod(), array( 'POST', 'PUT', 'PATCH', 'DELETE' ), true ) && is_string( $origin ) && '' !== $origin && ! self::sameOrigin( $origin, $request ) ) {
			return ChatFlowServiceProvider::respond( Database::error( 'cff_origin_rejected', 'Request origin is not allowed.', 403 ) );
		}
		return null;
	}

	/** The request's own origin or the configured app URL. */
	public static function sameOrigin( string $origin, Request $request ): bool {
		$parts = parse_url( $origin );
		if ( ! is_array( $parts ) || isset( $parts['user'] ) || isset( $parts['pass'] ) ) {
			return false;
		}
		foreach ( array( $request->getSchemeAndHttpHost(), (string) config( 'app.url', '' ) ) as $url ) {
			$site = parse_url( $url );
			if ( ! is_array( $site ) ) {
				continue;
			}
			$port      = $parts['port'] ?? null;
			$site_port = $site['port'] ?? null;
			if ( ( $parts['scheme'] ?? '' ) === ( $site['scheme'] ?? '' ) && strtolower( $parts['host'] ?? '' ) === strtolower( $site['host'] ?? '' ) && $port === $site_port ) {
				return true;
			}
		}
		return false;
	}
}
