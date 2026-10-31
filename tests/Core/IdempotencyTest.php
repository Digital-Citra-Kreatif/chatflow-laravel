<?php
namespace ChatFlow\Laravel\Tests\Core;

use ChatFlow\Laravel\Submissions\Idempotency;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Tests\TestCase;

final class IdempotencyTest extends TestCase {
	private const KEY = '3f1c2a4e-9b7d-4c1e-8a2b-0d9e8f7a6b5c';

	private function begin( array $body, string $key = self::KEY ): array|Error {
		return Database::transaction( fn() => ( new Idempotency() )->begin( 'session:abc:submit', $key, $body ) );
	}

	public function testReplayConflictAndPending(): void {
		$first = $this->begin( array( 'b' => 1, 'a' => array( 'y' => 2, 'x' => 1 ) ) );
		$this->assertIsArray( $first );
		$this->assertNull( $first['response'] );

		$pending = $this->begin( array( 'a' => array( 'x' => 1, 'y' => 2 ), 'b' => 1 ) );
		$this->assertSame( 'cff_request_pending', $pending->code() );
		$this->assertSame( 409, $pending->status() );
		$this->assertSame( 1, $pending->data()['retryAfter'] );

		( new Idempotency() )->finish( $first['id'], array( 'ok' => true, 'submission' => array( 'uuid' => 'plaintext-submission-uuid' ) ) );
		$stored = Database::query( 'requests' )->where( 'id', $first['id'] )->first();
		$this->assertStringStartsWith( 'e1.', $stored->response );
		$this->assertStringNotContainsString( 'plaintext-submission-uuid', $stored->response );
		$this->assertSame( Idempotency::scopeHash( 'session:abc:submit' ), $stored->scope_hash );

		// Same key and canonical body: the stored response is replayed.
		$replay = $this->begin( array( 'a' => array( 'x' => 1, 'y' => 2 ), 'b' => 1 ) );
		$this->assertSame( $first['id'], $replay['id'] );
		$this->assertTrue( $replay['response']['ok'] );
		$this->assertSame( 'plaintext-submission-uuid', $replay['response']['submission']->uuid );
		$receipt = ( new Idempotency() )->receipt( 'session:abc:submit', strtoupper( self::KEY ), array( 'b' => 1, 'a' => array( 'x' => 1, 'y' => 2 ) ) );
		$this->assertTrue( $receipt['ok'] );

		$conflict = $this->begin( array( 'b' => 2 ) );
		$this->assertSame( 'cff_idempotency_conflict', $conflict->code() );
		$this->assertSame( 409, $conflict->status() );
		$this->assertSame( 'cff_idempotency_conflict', ( new Idempotency() )->receipt( 'session:abc:submit', self::KEY, array( 'b' => 2 ) )->code() );
		$this->assertNull( ( new Idempotency() )->receipt( 'session:other:submit', self::KEY, array( 'b' => 1 ) ) );

		$this->assertSame( 'cff_invalid_idempotency_key', $this->begin( array(), 'not-a-uuid' )->code() );
	}

	public function testReceiptsAreBoundToTheSecret(): void {
		$first = $this->begin( array( 'a' => 1 ) );
		( new Idempotency() )->finish( $first['id'], array( 'ok' => true ) );
		config()->set( 'chatflow.secret', str_repeat( 'z', 32 ) );
		$this->expectException( \RuntimeException::class );
		( new Idempotency() )->receipt( 'session:abc:submit', self::KEY, array( 'a' => 1 ) );
	}
}
