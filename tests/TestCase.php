<?php
namespace ChatFlow\Laravel\Tests;

use ChatFlow\Laravel\ChatFlowServiceProvider;
use ChatFlow\Laravel\Support\Hooks;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Orchestra\Testbench\TestCase as Orchestra;

abstract class TestCase extends Orchestra {
	use RefreshDatabase;

	protected function getPackageProviders( $app ): array {
		return array( ChatFlowServiceProvider::class );
	}

	protected function defineEnvironment( $app ): void {
		$app['config']->set( 'app.key', 'base64:' . base64_encode( str_repeat( 'k', 32 ) ) );
		$app['config']->set( 'app.url', 'http://localhost' );
		$app['config']->set( 'database.default', 'testing' );
		$app['config']->set( 'mail.default', 'array' );
		$app['config']->set( 'queue.default', 'sync' );
	}

	protected function tearDown(): void {
		Hooks::reset();
		parent::tearDown();
	}
}
