<?php
namespace ChatFlow\Laravel\Tests\Core;

use ChatFlow\Laravel\Spam\RateLimiter;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Tests\TestCase;

final class RateLimiterTest extends TestCase {
	public function testFixedWindowPerIdentity(): void {
		$limiter = new RateLimiter();
		$now     = 1_800_000_000;
		$this->assertTrue( $limiter->consume( 'start:1.2.3.4', 2, 600, $now ) );
		$this->assertTrue( $limiter->consume( 'start:1.2.3.4', 2, 600, $now + 1 ) );
		$this->assertFalse( $limiter->consume( 'start:1.2.3.4', 2, 600, $now + 2 ) );
		$this->assertTrue( $limiter->consume( 'start:5.6.7.8', 2, 600, $now + 2 ) );
		// The next window starts a fresh bucket.
		$this->assertTrue( $limiter->consume( 'start:1.2.3.4', 2, 600, $now + 600 ) );

		$row = Database::query( 'rate_limits' )->orderByDesc( 'hits' )->first();
		$this->assertSame( 3, (int) $row->hits );
		$this->assertSame( gmdate( 'Y-m-d H:i:s', ( intdiv( $now, 600 ) + 1 ) * 600 ), $row->expires_at );
		$this->assertDoesNotMatchRegularExpression( '/1\.2\.3\.4/', $row->bucket_hash );
		$this->assertSame( 3, Database::query( 'rate_limits' )->count() );
	}
}
