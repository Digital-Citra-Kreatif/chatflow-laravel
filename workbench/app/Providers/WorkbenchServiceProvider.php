<?php
namespace Workbench\App\Providers;

use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/** The host-app glue the browser tests need: an admin gate and a one-click login. */
final class WorkbenchServiceProvider extends ServiceProvider {
	public function boot(): void {
		Gate::define( 'viewChatFlow', static fn( $user ): bool => null !== $user );

		// Test-only: signs in a fixed admin and redirects. Named "login" so the
		// admin's auth middleware sends guests here.
		Route::middleware( 'web' )->get(
			'/workbench/login',
			static function () {
				$user = User::query()->where( 'email', 'admin@example.com' )->first();
				if ( ! $user ) {
					$user = ( new User() )->forceFill( array( 'name' => 'Admin', 'email' => 'admin@example.com', 'password' => Hash::make( 'secret' ) ) );
					$user->save();
				}
				auth()->login( $user );
				return redirect( (string) request()->query( 'to', '/chatflow/admin' ) );
			}
		)->name( 'login' );
	}
}
