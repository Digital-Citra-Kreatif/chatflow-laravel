<?php
namespace Workbench\App\Providers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Sunrice\Admin\Actions\Permissions\SyncPermissions;
use Workbench\App\Models\User;

/** The host-app glue the browser tests need: a one-click login as a panel super admin. */
final class WorkbenchServiceProvider extends ServiceProvider {
	public function boot(): void {
		// Test-only: signs in a fixed super admin (every panel and ChatFlow permission) and
		// redirects. Named "login" so ChatFlow's standalone admin sends guests here.
		Route::middleware( 'web' )->get(
			'/workbench/login',
			static function () {
				$user = User::query()->where( 'email', 'admin@example.com' )->first();
				if ( ! $user ) {
					$user = ( new User() )->forceFill( array( 'name' => 'Admin', 'email' => 'admin@example.com', 'password' => Hash::make( 'a-strong-password-123' ) ) );
					$user->save();
				}
				app( SyncPermissions::class )->handle();
				$user->assignRole( SyncPermissions::superAdminRole() );
				auth()->login( $user );
				return redirect( (string) request()->query( 'to', '/admin/chatflow/forms' ) );
			}
		)->name( 'login' );
	}
}
