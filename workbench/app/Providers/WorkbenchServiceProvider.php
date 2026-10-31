<?php
namespace Workbench\App\Providers;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Templates\Templates;
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

		// Test-only: publishes a new form from a template, without the time trap so the
		// browser tests can answer it through the public API straight away.
		Route::middleware( 'web' )->get(
			'/workbench/forms/{template}',
			static function ( string $template ) {
				$forms = new FormRepository();
				$form  = ( new Templates( $forms ) )->create( $template );
				abort_unless( $form instanceof Form, 404 );
				$settings                       = $form->settings();
				$settings['spam']['minSeconds'] = 0;
				$form                           = $forms->saveDraft( $form->id(), $form->schema(), $settings, $form->draftRevision() );
				$form                           = $forms->publish( $form->id(), $form->draftRevision() );
				return response()->json( array( 'id' => $form->id(), 'version' => $form->version(), 'title' => $form->title() ) );
			}
		)->where( 'template', '[a-z0-9-]+' );
	}
}
