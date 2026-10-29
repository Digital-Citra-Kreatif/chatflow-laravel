<?php
namespace ChatFlow\Laravel\Tests\Core;

use ChatFlow\Laravel\Forms\EditLock;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Tests\TestCase;

final class EditLockTest extends TestCase {
	use Fixtures;

	public function testLockIsExclusiveForTheWindowAndReentrantForItsOwner(): void {
		$form = ( new FormRepository() )->create( 'Lock', self::schema() );

		$this->actingAs( $this->user( 1 ) );
		$this->assertTrue( EditLock::acquire( $form->id() ) );
		$this->assertTrue( EditLock::acquire( $form->id() ) );

		$this->actingAs( $this->user( 2 ) );
		$locked = EditLock::acquire( $form->id() );
		$this->assertSame( 'cff_form_locked', $locked->code() );
		$this->assertSame( 409, $locked->status() );

		Database::query( 'forms' )->where( 'id', $form->id() )->update( array( 'locked_until' => gmdate( 'Y-m-d H:i:s', time() - 1 ) ) );
		$this->assertTrue( EditLock::acquire( $form->id() ) );
		$row = Database::query( 'forms' )->where( 'id', $form->id() )->first();
		$this->assertSame( 2, (int) $row->locked_by );
		$this->assertGreaterThan( gmdate( 'Y-m-d H:i:s', time() + EditLock::WINDOW - 5 ), $row->locked_until );

		$missing = EditLock::acquire( 999 );
		$this->assertSame( 'cff_form_not_found', $missing->code() );
		$this->assertSame( 404, $missing->status() );
	}
}
