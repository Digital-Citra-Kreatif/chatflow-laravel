<?php
namespace ChatFlow\Laravel\Tests\Core;

use ChatFlow\Laravel\Spam\RateLimiter;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Tests\TestCase;

final class RateLimiterTest extends TestCase {
	public function testSlidingWindowPerIdentity(): void {
		$limiter = new RateLimiter();
		$now     = intdiv( 1_800_000_000, 600 ) * 600;
		$this->assertTrue( $limiter->consume( 'start:1.2.3.4', 2, 600, $now ) );
		$this->assertTrue( $limiter->consume( 'start:1.2.3.4', 2, 600, $now + 1 ) );
		$this->assertFalse( $limiter->consume( 'start:1.2.3.4', 2, 600, $now + 2 ) );
		$this->assertTrue( $limiter->consume( 'start:5.6.7.8', 2, 600, $now + 2 ) );
		// Just after the boundary the previous window still counts almost fully...
		$this->assertFalse( $limiter->consume( 'start:1.2.3.4', 2, 600, $now + 600 ) );
		// ...and fades as it slides out (refused attempts count too, so hammering doesn't pay).
		$this->assertFalse( $limiter->consume( 'start:1.2.3.4', 2, 600, $now + 1000 ) );
		$this->assertTrue( $limiter->consume( 'start:5.6.7.8', 2, 600, $now + 1000 ) );

		$row = Database::query( 'rate_limits' )->orderByDesc( 'hits' )->first();
		$this->assertSame( 3, (int) $row->hits );
		// Kept until the end of the next window, which still reads it.
		$this->assertSame( gmdate( 'Y-m-d H:i:s', $now + 1200 ), $row->expires_at );
		$this->assertDoesNotMatchRegularExpression( '/1\.2\.3\.4/', $row->bucket_hash );
		$this->assertSame( 4, Database::query( 'rate_limits' )->count() );
	}

	public function testNoDoubleBurstAcrossABoundary(): void {
		$limiter = new RateLimiter();
		$start   = intdiv( 1_800_000_000, 600 ) * 600;
		$allowed = 0;
		// Ten tries at the end of one window and ten at the start of the next.
		foreach ( array( $start + 590, $start + 610 ) as $at ) {
			for ( $i = 0; $i < 10; $i++ ) {
				$allowed += (int) $limiter->consume( 'submit:1:9.9.9.9', 5, 600, $at );
			}
		}
		$this->assertSame( 5, $allowed );
	}
}
