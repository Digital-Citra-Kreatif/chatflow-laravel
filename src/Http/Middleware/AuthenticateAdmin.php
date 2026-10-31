<?php
namespace ChatFlow\Laravel\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

/**
 * Sign-in for the standalone admin (alias "chatflow.admin.auth"). Laravel's "auth"
 * sends guests to a route named "login", which not every app has; this one goes to
 * config('chatflow.admin.login_url'), else the app's "login" route, else the Sunrice
 * panel's sign-in, else answers 401. The admin JSON API answers with its error envelope.
 */
final class AuthenticateAdmin {
	public function handle( Request $request, Closure $next, ?string $guard = null ): Response {
		if ( auth()->guard( $guard )->check() ) {
			auth()->shouldUse( $guard ?? auth()->getDefaultDriver() );
			return $next( $request );
		}
		if ( $request->routeIs( 'chatflow.admin.api.*' ) || $request->expectsJson() ) {
			return AdminApi::error( 'cff_unauthenticated', 'Sign in to use the ChatFlow admin.', 401 );
		}
		$target = self::loginUrl();
		if ( null === $target ) {
			abort( 401, __( 'Sign in to use the ChatFlow admin.' ) );
		}
		return redirect()->guest( $target );
	}

	public static function loginUrl(): ?string {
		$configured = config( 'chatflow.admin.login_url' );
		if ( is_string( $configured ) && '' !== trim( $configured ) ) {
			return url( $configured );
		}
		foreach ( array( 'login', 'sunrice.admin.login' ) as $name ) {
			if ( Route::has( $name ) ) {
				return route( $name );
			}
		}
		return null;
	}
}
