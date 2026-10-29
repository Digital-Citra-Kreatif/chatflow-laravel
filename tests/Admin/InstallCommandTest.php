<?php
namespace ChatFlow\Laravel\Tests\Admin;

use Illuminate\Support\Facades\File;

final class InstallCommandTest extends AdminTestCase {
	protected function tearDown(): void {
		File::deleteDirectory( public_path( 'vendor/chatflow' ) );
		File::delete( config_path( 'chatflow.php' ) );
		parent::tearDown();
	}

	public function test_install_publishes_migrates_and_prints_next_steps(): void {
		$this->artisan( 'chatflow:install', array( '--force' => true ) )
			->expectsOutputToContain( 'viewChatFlow' )
			->expectsOutputToContain( 'chatflow:sweep' )
			->expectsOutputToContain( 'queue:work' )
			->assertSuccessful();
		$this->assertFileExists( public_path( 'vendor/chatflow/admin/builder.js' ) );
		$this->assertFileExists( public_path( 'vendor/chatflow/runtime/runtime.js' ) );
		$this->assertFileExists( config_path( 'chatflow.php' ) );
	}

	public function test_install_asks_before_migrating(): void {
		$this->artisan( 'chatflow:install' )
			->expectsConfirmation( 'Run the ChatFlow database migrations now?', 'no' )
			->expectsOutputToContain( 'Skipped migrations' )
			->assertSuccessful();
	}
}
