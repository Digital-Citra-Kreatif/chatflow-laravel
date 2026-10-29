<?php
namespace ChatFlow\Laravel;

use ChatFlow\Laravel\Support\Error;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class ChatFlowServiceProvider extends ServiceProvider {
	/** Gate abilities, mapped from the plugin's WordPress capabilities. */
	public const ABILITIES = array(
		'manage_forms'       => 'chatflow.manage-forms',
		'view_submissions'   => 'chatflow.view-submissions',
		'edit_submissions'   => 'chatflow.edit-submissions',
		'delete_submissions' => 'chatflow.delete-submissions',
		'export_submissions' => 'chatflow.export-submissions',
	);

	public function register(): void {
		$this->mergeConfigFrom( __DIR__ . '/../config/chatflow.php', 'chatflow' );
	}

	public function boot(): void {
		$this->loadMigrationsFrom( __DIR__ . '/../database/migrations' );
		$this->loadViewsFrom( __DIR__ . '/../resources/views', 'chatflow' );
		$this->registerGates();
		$this->registerRoutes();
		Blade::componentNamespace( 'ChatFlow\\Laravel\\View\\Components', 'chatflow' );
		Blade::directive( 'chatflow', static fn( string $expression ): string => "<?php echo \\ChatFlow\\Laravel\\Frontend\\Renderer::render({$expression}); ?>" );

		if ( $this->app->runningInConsole() ) {
			$this->publishes( array( __DIR__ . '/../config/chatflow.php' => config_path( 'chatflow.php' ) ), 'chatflow-config' );
			$this->publishes( array( __DIR__ . '/../dist' => public_path( 'vendor/chatflow' ) ), array( 'chatflow-assets', 'laravel-assets' ) );
			$this->publishes( array( __DIR__ . '/../resources/views' => resource_path( 'views/vendor/chatflow' ) ), 'chatflow-views' );
			$this->commands( $this->consoleCommands() );
		}
	}

	private function registerGates(): void {
		// Hosts define "viewChatFlow" (or the individual abilities). Like Horizon, local is open by default.
		if ( ! Gate::has( 'viewChatFlow' ) ) {
			Gate::define( 'viewChatFlow', fn( $user = null ): bool => $this->app->environment( 'local' ) );
		}
		foreach ( self::ABILITIES as $ability ) {
			if ( ! Gate::has( $ability ) ) {
				Gate::define( $ability, static fn( $user = null ): bool => Gate::forUser( $user )->allows( 'viewChatFlow' ) );
			}
		}
	}

	private function registerRoutes(): void {
		if ( $this->app->routesAreCached() ) {
			return;
		}
		Route::group(
			array(
				'prefix'     => trim( (string) config( 'chatflow.api.prefix' ), '/' ),
				'middleware' => (array) config( 'chatflow.api.middleware', array() ),
				'as'         => 'chatflow.api.',
			),
			fn() => $this->loadRoutesFrom( __DIR__ . '/../routes/api.php' )
		);
		Route::group(
			array(
				'prefix'     => trim( (string) config( 'chatflow.admin.prefix' ), '/' ),
				'middleware' => (array) config( 'chatflow.admin.middleware', array( 'web', 'auth' ) ),
				'as'         => 'chatflow.admin.',
			),
			fn() => $this->loadRoutesFrom( __DIR__ . '/../routes/admin.php' )
		);
		$this->loadRoutesFrom( __DIR__ . '/../routes/web.php' );
	}

	/** @return list<class-string> */
	private function consoleCommands(): array {
		return array_values( array_filter( array(
			Console\InstallCommand::class,
			Console\SweepCommand::class,
		), 'class_exists' ) );
	}

	/** @internal Converts a service result into an HTTP response with the plugin's error envelope. */
	public static function respond( mixed $result, int $status = 200 ): \Illuminate\Http\JsonResponse {
		if ( Error::is( $result ) ) {
			return response()->json( $result->toArray(), $result->status() );
		}
		return response()->json( $result, $status, array(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION );
	}
}
