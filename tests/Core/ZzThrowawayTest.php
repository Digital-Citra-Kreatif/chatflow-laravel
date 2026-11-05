<?php
namespace ChatFlow\Laravel\Tests\Core;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Submissions\Ending;
use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Tests\TestCase;

final class ZzThrowawayTest extends TestCase {
	use Fixtures;
	public function testNewline(): void {
		$schema = self::schema();
		$schema['endings'] = array( array( 'id' => 'end_go', 'type' => 'redirect', 'url' => 'https://wa.me/123?text={{name}}', 'messages' => array() ) );
		$form = new Form( 1, 'Form', 'form', $schema, array(), 1, 1, 'publish' );
		$s = new Submission( array( 'id' => 9, 'uuid' => 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'form_id' => 1, 'form_version' => 1, 'status' => 'completed', 'answers' => json_encode( array( 'name' => "line1\nline2" ) ), 'meta' => '{}', 'ending_id' => 'end_go' ), $form );
		$r = ( new Ending() )->build( $s, $form, null );
		var_dump( is_array( $r ) ? $r['redirectUrl'] : $r->code() );
		$s = new Submission( array( 'id' => 9, 'uuid' => 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'form_id' => 1, 'form_version' => 1, 'status' => 'completed', 'answers' => json_encode( array( 'name' => "C:\\x" ) ), 'meta' => '{}', 'ending_id' => 'end_go' ), $form );
		$r = ( new Ending() )->build( $s, $form, null );
		var_dump( is_array( $r ) ? $r['redirectUrl'] : $r->code() );
		$this->assertTrue( true );
	}
}
