<?php
namespace ChatFlow\Laravel\Console;

use Illuminate\Console\Command;

/** chatflow:install — publishes the config and assets, runs the migrations and prints the next steps. */
final class InstallCommand extends Command {
	protected $signature = 'chatflow:install {--force : Overwrite published files and run migrations without asking}';

	protected $description = 'Install ChatFlow: publish config and assets, run migrations';

	public function handle(): int {
		$force = (bool) $this->option( 'force' );
		$this->components->info( 'Publishing ChatFlow configuration and assets.' );
		$this->call(
			'vendor:publish',
			array(
				'--tag'   => 'chatflow-config',
				'--force' => $force,
			)
		);
		// Assets are always refreshed so the published bundles match the installed package.
		$this->call(
			'vendor:publish',
			array(
				'--tag'   => 'chatflow-assets',
				'--force' => true,
			)
		);
		$migrate = $force || ! $this->input->isInteractive() || $this->confirm( 'Run the ChatFlow database migrations now?', true );
		if ( $migrate ) {
			$this->call( 'migrate', array( '--force' => true ) );
		} else {
			$this->components->warn( 'Skipped migrations. Run "php artisan migrate" before using ChatFlow.' );
		}
		$admin = url( trim( (string) config( 'chatflow.admin.prefix', 'chatflow/admin' ), '/' ) );
		$this->newLine();
		$this->components->info( 'ChatFlow is installed. Next steps:' );
		$this->line( '  1. Authorize admins: define the "viewChatFlow" gate, e.g. in AppServiceProvider::boot():' );
		$this->line( '       Gate::define(\'viewChatFlow\', fn ($user) => $user->is_admin);' );
		$this->line( '     (Only the local environment is allowed by default. Fine-grained abilities:' );
		$this->line( '     chatflow.manage-forms, chatflow.view-submissions, chatflow.edit-submissions,' );
		$this->line( '     chatflow.delete-submissions, chatflow.export-submissions.)' );
		$this->line( '  2. Schedule the maintenance commands in routes/console.php:' );
		$this->line( '       Schedule::command(\'chatflow:sweep\')->hourly();' );
		$this->line( '       Schedule::command(\'chatflow:retry-deliveries\')->everyFiveMinutes();' );
		$this->line( '  3. Run a queue worker for email notifications: php artisan queue:work' );
		$this->line( '     (CHATFLOW_QUEUE_CONNECTION / CHATFLOW_QUEUE select the queue.)' );
		$this->line( '  4. Open the admin at ' . $admin . ' and embed forms with <x-chatflow::form :id="1" />.' );
		return self::SUCCESS;
	}
}
