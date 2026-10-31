<?php
namespace ChatFlow\Laravel\Tests\Frontend;

use ChatFlow\Laravel\Frontend\Renderer;
use ChatFlow\Laravel\Tests\Api\VisitorApi;
use ChatFlow\Laravel\Tests\TestCase;
use Illuminate\Support\Facades\Blade;

final class RendererTest extends TestCase {
	use VisitorApi;

	public function test_markup_matches_the_plugin_and_prints_the_runtime_once(): void {
		$form  = $this->form( array( 'display' => array( 'height' => 480, 'launcher' => array( 'position' => 'left', 'autoOpenSeconds' => 5 ) ) ) );
		$first = Renderer::render( $form->id(), array( 'theme' => 'dark' ) );
		$this->assertStringStartsWith( '<cff-chat data-mode="inline" data-position="left" data-auto-open="5" data-scroll-percent="" data-form-id="' . $form->id() . '" data-rest-url="http://localhost/chatflow/api/v1/" style="display:block;min-height:480px">', $first );
		$this->assertStringContainsString( '<span data-cff-loading>Loading chat…</span><script type="application/json" data-cff-schema>', $first );
		$this->assertStringContainsString( '"appearance":{"theme":"dark"}', $first );
		// Interpolation markers in messages stay literal and the JSON cannot close the script element.
		$this->assertStringContainsString( 'Thanks {{name}}', $first );
		// The small loader brings in the runtime, whose versioned address it carries.
		$this->assertMatchesRegularExpression( '#</cff-chat><script type="module" [^>]*src="http://localhost/vendor/chatflow/runtime/loader\.js\?v=[a-f0-9]{12}" id="cff-runtime-js" data-runtime="http://localhost/vendor/chatflow/runtime/runtime\.js\?v=[a-f0-9]{12}"></script>$#', $first );
		$this->assertStringNotContainsString( 'cffTracking', $first );

		$second = Renderer::render( $form->id(), array( 'mode' => 'launcher', 'position' => 'right', 'height' => 99999, 'auto_open' => 99999, 'scroll_percent' => 150 ) );
		$this->assertStringNotContainsString( 'runtime.js', $second );
		$this->assertStringContainsString( 'data-mode="launcher" data-position="right" data-auto-open="3600" data-scroll-percent="100"', $second );
		// Fixed from the start, with a button to press before the runtime arrives: nothing shifts.
		$this->assertStringContainsString( 'style="display:block;position:fixed;bottom:0;right:0;width:0;height:0;z-index:2147480000"><button type="button" data-cff-placeholder aria-label="Open chat" style="position:fixed;bottom:16px;right:16px;', $second );
		$this->assertStringNotContainsString( 'Loading chat', $second );

		$this->assertSame( '', Renderer::render( 999 ) );
	}

	public function test_clamps_and_falls_back(): void {
		$form = $this->form();
		$html = Renderer::render( $form->id(), array( 'mode' => 'bogus', 'height' => 10 ) );
		$this->assertStringContainsString( 'data-mode="inline" data-position="right" data-auto-open="" data-scroll-percent=""', $html );
		$this->assertStringContainsString( 'min-height:200px', $html );
	}

	public function test_tracking_config_precedes_the_modules(): void {
		config()->set( 'chatflow.defaults.tracking.enabled', true );
		$form = $this->form();
		$html = Renderer::render( $form->id() );
		$this->assertMatchesRegularExpression( '#</cff-chat><script>window\.cffTracking=\{"enabled":true,"consentRequired":true,"days":30,"consentGranted":false,"respectDnt":true\};</script><script type="module" [^>]*tracking\.js\?v=[a-f0-9]{12}"[^>]*></script><script type="module" [^>]*runtime\.js#', $html );
	}

	public function test_launcher_placeholder_matches_the_accent(): void {
		$messaging = $this->form( array( 'appearance' => array( 'style' => 'messaging', 'primary' => '#fde047' ) ) );
		$html      = Renderer::render( $messaging->id(), array( 'mode' => 'popup', 'position' => 'left' ) );
		$this->assertStringContainsString( 'position:fixed;bottom:16px;left:16px;', $html );
		// A light accent gets a dark icon.
		$this->assertStringContainsString( 'background:#fde047;color:#171717', $html );
		$classic = $this->form();
		$this->assertStringContainsString( 'background:#171717;color:#ffffff', Renderer::render( $classic->id(), array( 'mode' => 'launcher' ) ) );
	}

	public function test_blade_component_and_directive(): void {
		$form = $this->form();
		$html = Blade::render( '<x-chatflow::form :id="$id" mode="inline" height="600" position="left" theme="auto" />', array( 'id' => $form->id() ) );
		$this->assertStringContainsString( 'data-position="left"', $html );
		$this->assertStringContainsString( 'min-height:600px', $html );
		$this->assertStringContainsString( '"theme":"auto"', $html );
		$this->assertStringContainsString( 'Thanks {{name}}', $html );
		$this->assertSame( 1, substr_count( $html, 'runtime.js' ) );

		$directive = Blade::render( '@chatflow(' . $form->id() . ', ["mode" => "popup"])' );
		$this->assertStringContainsString( 'data-mode="popup"', $directive );
		$this->assertStringNotContainsString( 'runtime.js', $directive );
	}

	public function test_fullpage_route(): void {
		$form     = $this->form( array(), 'Talk to us' );
		$response = $this->get( '/chat/' . $form->slug() );
		$response->assertOk()->assertSee( '<title>Talk to us</title>', false )->assertSee( 'data-mode="fullpage"', false )->assertSee( '<meta name="robots" content="noindex">', false )->assertSee( 'name="viewport"', false );
		$this->assertSame( 1, substr_count( $response->getContent(), 'runtime.js' ) );
		$this->get( '/chat/missing-form' )->assertNotFound();
		$this->get( '/chat/Bad_Slug' )->assertNotFound();
	}

	public function test_fullpage_layout(): void {
		$this->app['view']->addNamespace( 'host', __DIR__ . '/views' );
		config()->set( 'chatflow.fullpage_layout', 'host::layout' );
		$form = $this->form( array(), 'Layout form' );
		$this->get( '/chat/' . $form->slug() )->assertOk()->assertSee( '<div id="host">', false )->assertSee( 'data-mode="fullpage"', false );
	}
}
