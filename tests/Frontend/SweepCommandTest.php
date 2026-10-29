<?php
namespace ChatFlow\Laravel\Tests\Frontend;

use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Tests\Api\VisitorApi;
use ChatFlow\Laravel\Tests\TestCase;
use Illuminate\Support\Facades\Event;

final class SweepCommandTest extends TestCase {
	use VisitorApi;

	public function test_sweep_abandons_idle_sessions_and_prunes(): void {
		$form      = $this->form( array( 'sessions' => array( 'abandonDays' => 2 ) ) );
		$abandoned = array();
		Event::listen( 'chatflow.submission_abandoned', function ( ...$args ) use ( &$abandoned ): void {
			$abandoned[] = $args;
		} );
		$idle   = $this->start( $form )->json();
		$recent = $this->start( $form )->json();
		$fresh  = $this->start( $form )->json();
		Database::query( 'sessions' )->where( 'public_id', $idle['sessionId'] )->update( array( 'last_seen_at' => gmdate( 'Y-m-d H:i:s', time() - 3 * 86400 ) ) );
		Database::query( 'sessions' )->where( 'public_id', $recent['sessionId'] )->update( array( 'last_seen_at' => gmdate( 'Y-m-d H:i:s', time() - 86400 - 60 ) ) );
		Database::query( 'rate_limits' )->insert( array( 'bucket_hash' => str_repeat( 'a', 64 ), 'hits' => 1, 'expires_at' => '2000-01-01 00:00:00' ) );
		Database::query( 'requests' )->insert( array( 'scope_hash' => str_repeat( 'b', 64 ), 'key_hash' => str_repeat( 'c', 64 ), 'request_hash' => str_repeat( 'd', 64 ), 'status' => 'done', 'expires_at' => '2000-01-01 00:00:00' ) );
		Database::query( 'requests' )->insert( array( 'scope_hash' => str_repeat( 'e', 64 ), 'key_hash' => str_repeat( 'c', 64 ), 'request_hash' => str_repeat( 'd', 64 ), 'status' => 'done', 'expires_at' => '9999-12-31 23:59:59' ) );

		$this->artisan( 'chatflow:sweep' )->assertSuccessful();

		$status = Database::query( 'sessions' )->pluck( 'status', 'public_id' );
		$this->assertSame( 'expired', $status[ $idle['sessionId'] ] );
		$this->assertSame( 'active', $status[ $recent['sessionId'] ] );
		$this->assertSame( 'active', $status[ $fresh['sessionId'] ] );
		$submission = Database::query( 'sessions' )->where( 'public_id', $idle['sessionId'] )->value( 'submission_id' );
		$this->assertSame( 'abandoned', Database::query( 'submissions' )->where( 'id', $submission )->value( 'status' ) );
		$this->assertNotNull( Database::query( 'submissions' )->where( 'id', $submission )->value( 'abandoned_at' ) );
		$this->assertCount( 1, $abandoned );
		$this->assertInstanceOf( Submission::class, $abandoned[0][0] );
		$this->assertSame( 'abandoned', $abandoned[0][0]->status() );
		$this->assertSame( 0, Database::query( 'rate_limits' )->where( 'expires_at', '<', Database::now() )->count() );
		$this->assertSame( 0, Database::query( 'requests' )->where( 'scope_hash', str_repeat( 'b', 64 ) )->count() );
		$this->assertSame( 1, Database::query( 'requests' )->where( 'scope_hash', str_repeat( 'e', 64 ) )->count() );

		// A second pass changes nothing.
		$this->artisan( 'chatflow:sweep' )->assertSuccessful();
		$this->assertCount( 1, $abandoned );
	}
}
