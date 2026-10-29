<?php
namespace ChatFlow\Laravel\Tests\Feature;

use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Tests\TestCase;
use Illuminate\Support\Facades\Schema;

final class BootTest extends TestCase {
	public function test_migrations_create_every_table(): void {
		foreach ( array( 'forms', 'form_versions', 'submissions', 'submission_values', 'submission_notes', 'sessions', 'requests', 'rate_limits', 'deliveries', 'stats_daily', 'exports' ) as $name ) {
			$this->assertTrue( Schema::hasTable( Database::table( $name ) ), $name );
		}
	}

	public function test_failed_transaction_returns_the_error_and_rolls_back(): void {
		$result = Database::transaction(
			static function () {
				Database::query( 'rate_limits' )->insert( array( 'bucket_hash' => str_repeat( 'a', 64 ), 'hits' => 1, 'expires_at' => Database::now() ) );
				return Database::error( 'cff_test', 'Nope', 409 );
			}
		);
		$this->assertSame( 409, $result->status() );
		$this->assertSame( 0, Database::query( 'rate_limits' )->count() );
	}
}
