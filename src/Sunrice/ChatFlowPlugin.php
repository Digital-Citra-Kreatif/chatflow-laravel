<?php
namespace ChatFlow\Laravel\Sunrice;

use ChatFlow\Laravel\ChatFlowServiceProvider;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Settings;
use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Sunrice\Admin\Assets\PluginBundle;
use Sunrice\Admin\BasePlugin;
use Sunrice\Admin\Dashboard\Widget;
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
				NavigationItem::make( 'chatflow.forms' )->label( 'Chat forms' )->url( 'chatflow/forms' )
					->icon( 'message-square' )->group( 'ChatFlow' )->sort( 10 )->permission( 'chatflow.manage-forms' ),
				NavigationItem::make( 'chatflow.submissions' )->label( 'Chat submissions' )->url( 'chatflow/submissions' )
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
			// Settings → ChatFlow (permission chatflow.settings.chatflow).
			->settings( ChatFlowSettings::class )
			->privilegedPermissions( 'chatflow.delete-submissions', 'chatflow.export-submissions', 'chatflow.settings.*' )
			->widgets(
				Widget::stat( 'chatflow.unread' )->title( 'Unread chat submissions' )->icon( 'inbox' )
					->link( 'chatflow/submissions?isRead=0', 'Open the inbox' )->permission( 'chatflow.view-submissions' )
					->data( static fn( Authorizable $user ): array => self::unreadStat() ),
				Widget::list( 'chatflow.latest' )->title( 'Latest chat submissions' )->span( 2 )->icon( 'message-square' )
					->link( 'chatflow/submissions', 'All submissions' )->empty( 'No submissions yet.' )->permission( 'chatflow.view-submissions' )
					->data( static fn( Authorizable $user ): array => array( 'rows' => self::latestRows() ) ),
			)
			// Read-only tools for AI agents, used with the token's user's permissions.
			->tools( Ai\ListForms::class, Ai\ListSubmissions::class, Ai\GetSubmission::class )
			->aiInstructions( 'ChatFlow (conversational forms): list forms with chatflow_list_forms, submissions with chatflow_list_submissions (filter by formId, status, search, dates) and read one with chatflow_get_submission. Forms are edited in the panel\'s builder, not by agents.' )
			->docs( 'ChatFlow', dirname( __DIR__, 2 ) . '/docs/sunrice' )
			->guide( 'ChatFlow', dirname( __DIR__, 2 ) . '/guide' );
	}

	public function boot( Panel $panel ): void {
		// Inside the panel only its roles grant ChatFlow abilities: the panel's Gate::before
		// checks (the user's permissions, super admins) run first, so these deny the rest,
		// including ChatFlow's own "viewChatFlow" fallback that allows everyone locally.
		foreach ( ChatFlowServiceProvider::ABILITIES as $ability ) {
			Gate::define( $ability, static fn(): bool => false );
		}
		// Values saved in Settings → ChatFlow override config/chatflow.php's defaults.
		Settings::resolveUsing( static fn(): array => app( ChatFlowSettings::class )->overrides() );
	}

	/** @return array<string,mixed> */
	private static function unreadStat(): array {
		$unread = Database::query( 'submissions' )->where( 'is_read', 0 )->where( 'status', 'completed' );
		$today  = ( clone $unread )->where( 'created_at', '>=', gmdate( 'Y-m-d 00:00:00' ) )->count();
		return array_filter(
			array(
				'value' => $unread->count(),
				'delta' => $today ? '+' . $today . ' today' : null,
				'trend' => $today ? 'up' : null,
			),
			static fn( $value ): bool => null !== $value
		);
	}

	/** @return list<array<string,mixed>> */
	private static function latestRows(): array {
		$forms = array();
		$rows  = Database::query( 'submissions' )->where( 'status', 'completed' )->orderByDesc( 'id' )->limit( 6 )->get( array( 'id', 'form_id', 'is_read', 'created_at' ) );
		return $rows->map(
			static function ( object $row ) use ( &$forms ): array {
				$forms[ $row->form_id ] ??= (string) Database::query( 'forms' )->where( 'id', $row->form_id )->value( 'title' );
				return array(
					'title' => 'Response #' . $row->id,
					'meta'  => $forms[ $row->form_id ],
					'url'   => 'chatflow/submissions/' . $row->id,
					'at'    => gmdate( 'c', (int) strtotime( $row->created_at . ' UTC' ) ),
				) + ( $row->is_read ? array() : array(
					'badge' => 'Unread',
					'tone'  => 'warning',
				) );
			}
		)->all();
	}

	/** The built panel bundle inside the package. */
	public static function dist(): string {
		return dirname( __DIR__, 2 ) . '/dist/sunrice';
	}
}
