<?php
namespace ChatFlow\Laravel\Tests\Sunrice;

use ChatFlow\Laravel\ChatFlowServiceProvider;
use ChatFlow\Laravel\Tests\Sunrice\Fixtures\TestPanelProvider;
use ChatFlow\Laravel\Tests\Sunrice\Fixtures\User;
use ChatFlow\Laravel\Tests\TestCase;
use Inertia\ServiceProvider as InertiaServiceProvider;
use Laravel\Mcp\Server\McpServiceProvider;
use Spatie\Permission\PermissionServiceProvider;
use Sunrice\Admin\Actions\Permissions\SyncPermissions;
use Sunrice\Admin\AdminServiceProvider;
use Sunrice\Admin\Panel;

use function Orchestra\Testbench\default_migration_path;
use function Orchestra\Testbench\load_migration_paths;

/** ChatFlow as a plugin of a Sunrice admin panel. */
abstract class SunriceTestCase extends TestCase {
	protected function getPackageProviders( $app ): array {
		return array(
			InertiaServiceProvider::class,
			PermissionServiceProvider::class,
			McpServiceProvider::class,
			AdminServiceProvider::class,
			ChatFlowServiceProvider::class,
			TestPanelProvider::class,
		);
	}

	protected function defineEnvironment( $app ): void {
		parent::defineEnvironment( $app );
		$app['config']->set( 'auth.providers.users.model', User::class );
		// Like a local app: ChatFlow's own fallback would let everyone in here.
		$app['env'] = 'local';
		load_migration_paths( $app, default_migration_path() );
	}

	/** A panel user with these permissions (Panel::ACCESS is added). */
	protected function admin( string ...$permissions ): User {
		app( SyncPermissions::class )->handle();
		static $n = 0;
		++$n;
		$user = User::query()->create(
			array(
				'name'     => 'Rina ' . $n,
				'email'    => "rina{$n}@example.com",
				'password' => 'a-strong-password-123',
			)
		);
		$user->givePermissionTo( array( Panel::ACCESS, ...$permissions ) );
		return $user;
	}
}
