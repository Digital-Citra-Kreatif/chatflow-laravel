<?php
namespace ChatFlow\Laravel\Tests\Sunrice;

use PHPUnit\Framework\TestCase;

/**
 * The vendored @imajiner/admin-sdk (sunrice/sdk/) is updated together with the
 * sunrice/admin version the tests run against: SUNRICE.md names the tag it
 * came from, which must be of the minor composer.json asks for, and the
 * runtime version it builds for.
 */
final class SdkCopyTest extends TestCase {
	private function root(): string {
		return dirname( __DIR__, 2 );
	}

	public function test_the_sdk_copy_comes_from_the_sunrice_version_the_tests_use(): void {
		$composer = json_decode( (string) file_get_contents( $this->root() . '/composer.json' ), true, 512, JSON_THROW_ON_ERROR );
		$this->assertMatchesRegularExpression( '/^\^0\.(\d+)$/', $composer['require-dev']['sunrice/admin'] );
		$minor = substr( $composer['require-dev']['sunrice/admin'], 1 );

		$doc = (string) file_get_contents( $this->root() . '/SUNRICE.md' );
		$this->assertMatchesRegularExpression( '/vendored from sunrice v' . preg_quote( $minor, '/' ) . '\.\d+ /', $doc );
		$this->assertMatchesRegularExpression( '/^`v' . preg_quote( $minor, '/' ) . '\.\d+` tag of Digital-Citra-Kreatif\/sunrice/m', $doc );
	}

	public function test_the_documented_runtime_is_the_one_the_copy_builds_for(): void {
		$shared = (string) file_get_contents( $this->root() . '/sunrice/sdk/shared.ts' );
		$this->assertSame( 1, preg_match( '/export const SDK_VERSION = (\d+);/', $shared, $version ) );
		$this->assertStringContainsString( "SDK runtime {$version[1]})", (string) file_get_contents( $this->root() . '/SUNRICE.md' ) );
	}

	public function test_composer_json_refuses_the_panel_versions_the_docs_say_it_needs_more_than(): void {
		$composer = json_decode( (string) file_get_contents( $this->root() . '/composer.json' ), true, 512, JSON_THROW_ON_ERROR );
		$this->assertMatchesRegularExpression( '/^<0\.(\d+)$/', $composer['conflict']['sunrice/admin'] );
		$minimum = substr( $composer['conflict']['sunrice/admin'], 1 );
		$this->assertStringContainsString( "Requires `sunrice/admin` {$minimum} or later", (string) file_get_contents( $this->root() . '/SUNRICE.md' ) );
		$this->assertStringContainsString( "{$minimum} or later", $composer['suggest']['sunrice/admin'] );
	}
}
