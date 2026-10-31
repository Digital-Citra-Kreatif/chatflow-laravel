<?php
namespace ChatFlow\Laravel\Tests\Unit;

use ChatFlow\Laravel\Fields\AbstractField;
use ChatFlow\Laravel\Integrations\Payload;
use ChatFlow\Laravel\Notifications\Html;
use ChatFlow\Laravel\Support\Text;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class TextTest extends TestCase {
	/** @return array<string,array{string,string}> */
	public static function cases(): array {
		return array(
			'less than'      => array( 'I need <5 people', 'I need <5 people' ),
			'comparison'     => array( 'a < b and c > d', 'a < b and c > d' ),
			'heart'          => array( 'I <3 you', 'I <3 you' ),
			'tag'            => array( '<b>bold</b> text', 'bold text' ),
			'event handler'  => array( '<img src=x onerror=alert(1)>', '' ),
			'svg'            => array( '<svg/onload=alert(1)>', '' ),
			'script block'   => array( 'x<script>alert(1)</script>y', 'xy' ),
			'style block'    => array( 'x<style>*{}</style>y', 'xy' ),
			'comment'        => array( '<!-- c -->ok', 'ok' ),
			'unterminated'   => array( 'cut <a href="x"', 'cut ' ),
			'doctype'        => array( '<!doctype html>ok', 'ok' ),
		);
	}

	#[DataProvider( 'cases' )]
	public function test_strips_markup_but_not_text( string $input, string $expected ): void {
		$this->assertSame( $expected, Text::stripTags( $input ) );
	}

	public function test_answers_keep_angle_brackets_everywhere(): void {
		$this->assertSame( 'I need <5 people', AbstractField::plainText( 'I need <5 people' ) );
		$this->assertSame( 'I need <5 people', Payload::text( 'I need <5 people' ) );
		$this->assertSame( 'I need <5 people', Html::strip( 'I need <5 people' ) );
	}
}
