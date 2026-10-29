<?php
namespace ChatFlow\Laravel\Tests\Unit;

use ChatFlow\Laravel\Fields\Registry;
use ChatFlow\Laravel\Logic\Diagnostics;
use ChatFlow\Laravel\Logic\Engine;
use ChatFlow\Laravel\Logic\Interpolator;
use ChatFlow\Laravel\Logic\Operators;
use PHPUnit\Framework\TestCase;

final class ParityTest extends TestCase {
	/** @return iterable<string,array{array<string,mixed>}> */
	public static function replays(): iterable {
		foreach ( glob( dirname( __DIR__ ) . '/fixtures/logic/*.json' ) as $file ) {
			$f = json_decode( file_get_contents( $file ), true, 512, JSON_THROW_ON_ERROR );
			foreach ( $f['schema']['steps'] as $step ) {
				if ( 'address' === $step['type'] ) {
					$raw = json_decode( file_get_contents( $file ), false, 512, JSON_THROW_ON_ERROR );
					if ( property_exists( $raw->answers, $step['key'] ) && $raw->answers->{$step['key']} instanceof \stdClass ) {
						$f['answers'][ $step['key'] ] = $raw->answers->{$step['key']};
					}
				}
			}
			yield $f['name'] => array( $f );
		}
	}

	#[\PHPUnit\Framework\Attributes\DataProvider( 'replays' )]
	/**
	 * @param array<string,mixed> $fixture
	 */
	public function testReplay( array $fixture ): void {
		$engine = new Engine( new Registry() );
		$schema = $fixture['schema'];
		if ( isset( $fixture['variant'] ) ) {
			$this->assertSame( array(), \ChatFlow\Laravel\Logic\Diagnostics::diagnoseSchema( $schema ) );
			$variant = array_values( array_filter( $schema['experiments'][0]['variants'], static fn( $v ) => $fixture['variant'] === $v['id'] ) )[0];
			$schema  = \ChatFlow\Laravel\Logic\Experiments::applyVariant( $schema, $variant );
			$this->assertSame( 'Variant age', $schema['steps'][0]['messages'][0] );
		}
		$actual = $engine->replay( $schema, $fixture['answers'], $fixture['context'], $fixture['mode'] );
		$this->assertSame( $fixture['expected'], json_decode( json_encode( $actual, JSON_THROW_ON_ERROR ), true, 512, JSON_THROW_ON_ERROR ) );
		$this->assertSame( json_encode( $actual, JSON_THROW_ON_ERROR ), json_encode( $engine->replay( $schema, $fixture['answers'], $fixture['context'], $fixture['mode'] ), JSON_THROW_ON_ERROR ) );
	}

	/** @return iterable<string,array{array<string,mixed>}> */
	public static function operators(): iterable {
		foreach ( self::checks()['operators'] as $c ) {
			yield $c['name'] => array( $c );
		}
	}

	#[\PHPUnit\Framework\Attributes\DataProvider( 'operators' )]
	/**
	 * @param array<string,mixed> $c
	 */
	public function testOperators( array $c ): void {
		$this->assertSame( $c['expected'], Operators::evaluateCondition( $c['condition'], $c['answers'], $c['variables'], $c['context'] ) );
	}

	/** @return iterable<string,array{array<string,mixed>}> */
	public static function interpolation(): iterable {
		foreach ( self::checks()['interpolation'] as $c ) {
			yield $c['name'] => array( $c );
		}
	}

	#[\PHPUnit\Framework\Attributes\DataProvider( 'interpolation' )]
	/**
	 * @param array<string,mixed> $c
	 */
	public function testInterpolation( array $c ): void {
		$result = $c['url'] ? Interpolator::interpolateUrl( $c['text'], $c['answers'], $c['meta'] ) : Interpolator::interpolate( $c['text'], $c['answers'], $c['meta'] );
		$this->assertSame( $c['expected'], $result );
	}

	/** @return iterable<string,array{array<string,mixed>}> */
	public static function diagnostics(): iterable {
		foreach ( self::checks()['diagnostics'] as $c ) {
			yield $c['name'] => array( $c );
		}
	}

	#[\PHPUnit\Framework\Attributes\DataProvider( 'diagnostics' )]
	/**
	 * @param array<string,mixed> $c
	 */
	public function testDiagnostics( array $c ): void {
		$this->assertSame( $c['expected'], Diagnostics::diagnoseSchema( $c['schema'] ) );
	}

	public function testRegistryRejectsUnknownTypes(): void {
		$this->assertCount( 21, ( new Registry() )->types() );
		$this->expectException( \InvalidArgumentException::class );
		( new Registry() )->get( 'invented' );
	}

	/** @return array<string,mixed> */
	private static function checks(): array {
		return json_decode( file_get_contents( dirname( __DIR__ ) . '/fixtures/logic-checks.json' ), true, 512, JSON_THROW_ON_ERROR );
	}
}
