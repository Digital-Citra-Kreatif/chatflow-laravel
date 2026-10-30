<?php
namespace ChatFlow\Laravel\Sunrice;

use ChatFlow\Laravel\ChatFlowServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Sunrice\Admin\Assets\PluginBundle;
use Sunrice\Admin\BasePlugin;
use Sunrice\Admin\Navigation\NavigationItem;
use Sunrice\Admin\Panel;
use Sunrice\Admin\Permissions\Permission;

/**
 * ChatFlow inside the Sunrice admin panel: the forms list, the builder and the
 * submissions inbox as panel pages, guarded by panel permissions.
 *
 *     // app/Providers/AdminPanelProvider.php
 *     $panel->plugin(\ChatFlow\Laravel\Sunrice\ChatFlowPlugin::make());
 *
 * The pages talk to the same admin JSON API as the standalone admin, mounted under
 * the panel's path. Permissions keep ChatFlow's ability names, so Gate checks inside
 * ChatFlow are answered by the panel's roles.
 */
final class ChatFlowPlugin extends BasePlugin {
	public const ID = 'chatflow';

	/** Ability => [label, short label]. */
	private const PERMISSIONS = array(
		'chatflow.manage-forms'       => array( 'Create, edit and publish forms', 'Manage forms' ),
		'chatflow.view-submissions'   => array( 'View form submissions', 'View submissions' ),
		'chatflow.edit-submissions'   => array( 'Edit form submissions (status, notes, resend emails)', 'Edit submissions' ),
		'chatflow.delete-submissions' => array( 'Delete form submissions', 'Delete submissions' ),
		'chatflow.export-submissions' => array( 'Export form submissions', 'Export submissions' ),
	);

	public function id(): string {
		return self::ID;
	}

	public function register( Panel $panel ): void {
		foreach ( self::PERMISSIONS as $name => [$label, $short] ) {
			$panel->permissions( Permission::make( $name, $label, 'ChatFlow' )->short( $short ) );
		}
		$panel
			->navigation(
				NavigationItem::make( 'chatflow.forms' )->label( 'Forms' )->url( 'chatflow/forms' )
					->icon( 'message-square' )->group( 'ChatFlow' )->sort( 10 )->permission( 'chatflow.manage-forms' ),
				NavigationItem::make( 'chatflow.submissions' )->label( 'Submissions' )->url( 'chatflow/submissions' )
					->icon( 'inbox' )->group( 'ChatFlow' )->sort( 20 )->permission( 'chatflow.view-submissions' ),
			)
			->routes(
				static fn() => Route::prefix( 'chatflow' )->name( 'chatflow.' )->group( dirname( __DIR__, 2 ) . '/routes/sunrice.php' )
			)
			->bundle(
				PluginBundle::make( self::ID )
					->named( 'ChatFlow' )
					->publishedFrom( self::dist(), public_path( 'vendor/chatflow/sunrice' ) )
					->module( 'admin.js' )
					->style( 'admin.css' )
					->pages( 'ChatFlow/' )
			)
			->privilegedPermissions( 'chatflow.delete-submissions', 'chatflow.export-submissions' );
	}

	public function boot( Panel $panel ): void {
		// Inside the panel only its roles grant ChatFlow abilities: the panel's Gate::before
		// checks (the user's permissions, super admins) run first, so these deny the rest,
		// including ChatFlow's own "viewChatFlow" fallback that allows everyone locally.
		foreach ( ChatFlowServiceProvider::ABILITIES as $ability ) {
			Gate::define( $ability, static fn(): bool => false );
		}
	}

	/** The built panel bundle inside the package. */
	public static function dist(): string {
		return dirname( __DIR__, 2 ) . '/dist/sunrice';
	}
}
