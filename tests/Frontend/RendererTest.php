<?php
namespace ChatFlow\Laravel\Tests\Frontend;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Forms\PublicProjection;
use ChatFlow\Laravel\Frontend\Phrases;
use ChatFlow\Laravel\Frontend\Renderer;
use ChatFlow\Laravel\Tests\Api\VisitorApi;
use ChatFlow\Laravel\Tests\TestCase;
use Illuminate\Support\Facades\Blade;

final class RendererTest extends TestCase {
	use VisitorApi;

	public function test_markup_matches_the_plugin_and_prints_the_runtime_once(): void {
		$form  = $this->form( array( 'display' => array( 'height' => 480, 'launcher' => array( 'position' => 'left', 'autoOpenSeconds' => 5 ) ) ) );
		$first = Renderer::render( $form->id(), array( 'theme' => 'dark' ) );
		$this->assertStringStartsWith( '<cff-chat data-mode="inline" data-position="left" data-auto-open="5" data-scroll-percent="" data-form-id="' . $form->id() . '" data-rest-url="http://localhost/chatflow/api/v1/" data-locale="en" style="display:block;min-height:480px">', $first );
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
		$this->assertStringContainsString( 'style="display:block;position:fixed;bottom:0;right:0;width:0;height:0;z-index:2147480000"><button type="button" data-cff-placeholder aria-label="Open chat" style="position:fixed;bottom:calc(calc(12px + clamp(0px, (100vw - 480.5px) * 1000, 4px)) + 0px);right:calc(12px + clamp(0px, (100vw - 480.5px) * 1000, 4px));', $second );
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
		$this->assertStringContainsString( 'position:fixed;bottom:calc(calc(12px + clamp(0px, (100vw - 480.5px) * 1000, 4px)) + 0px);left:calc(12px + clamp(0px, (100vw - 480.5px) * 1000, 4px));', $html );
		// A light accent gets a dark icon.
		$this->assertStringContainsString( 'background:#fde047;color:#171717', $html );
		$classic = $this->form();
		$this->assertStringContainsString( 'background:#171717;color:#ffffff', Renderer::render( $classic->id(), array( 'mode' => 'launcher' ) ) );
		// A brand colour shows in the Classic style too.
		$branded = $this->form( array( 'appearance' => array( 'primary' => '#0f766e' ) ) );
		$this->assertStringContainsString( 'background:#0f766e;color:#ffffff', Renderer::render( $branded->id(), array( 'mode' => 'launcher' ) ) );
		app()->setLocale( 'id' );
		$this->assertStringContainsString( 'aria-label="Buka chat"', Renderer::render( $branded->id(), array( 'mode' => 'launcher' ) ) );
		app()->setLocale( 'en' );
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

	public function test_chat_text_comes_from_laravel_lang_files(): void {
		$form = $this->form();
		// English and Indonesian ship with the package, and the runtime carries them too.
		$this->assertSame( 'Buka chat', trans( 'chatflow::runtime.openChat', array(), 'id' ) );
		app()->setLocale( 'id' );
		$html = Renderer::render( $form->id() );
		$this->assertStringContainsString( 'data-locale="id"', $html );
		$this->assertStringContainsString( '<span data-cff-loading>Memuat percakapan…</span>', $html );
		$this->assertStringNotContainsString( 'data-phrases', $html );
		// An app's own wording (lang/vendor/chatflow/id/runtime.php) reaches the runtime.
		app( 'translator' )->addLines( array( 'runtime.retry' => 'Ulangi' ), 'id', 'chatflow' );
		$this->assertStringContainsString( 'data-phrases="{&quot;retry&quot;:&quot;Ulangi&quot;}"', Renderer::render( $form->id() ) );
		app()->setLocale( 'en' );
		// A form set to Indonesian speaks it on an English site; its own wording wins.
		$id = $this->form( array( 'language' => 'id', 'phrases' => array( 'openChat' => 'Tanya kami' ) ) );
		$html = Renderer::render( $id->id(), array( 'mode' => 'launcher' ) );
		$this->assertStringContainsString( 'data-locale="id"', $html );
		$this->assertStringContainsString( 'aria-label="Tanya kami"', $html );
	}

	public function test_lazy_session_start_only_when_nothing_shown_needs_the_server(): void {
		$plain = $this->form();
		$this->assertTrue( PublicProjection::build( $plain )['form']['session']['lazyStart'] );
		$schema            = $plain->schema();
		$schema['steps'][] = array( 'id' => 'step_ref', 'key' => 'ref', 'type' => 'hidden', 'label' => 'Ref', 'messages' => array(), 'settings' => array( 'source' => 'url', 'sourceKey' => 'ref' ) );
		$repository        = new FormRepository();
		$hidden            = $repository->create( 'Hidden', $schema, $plain->settings() );
		$this->assertInstanceOf( Form::class, $hidden );
		$this->assertFalse( PublicProjection::build( $hidden )['form']['session']['lazyStart'] );
	}

	public function test_an_app_can_add_a_language(): void {
		$file = lang_path( 'vendor/chatflow/zh/runtime.php' );
		@mkdir( dirname( $file ), 0777, true );
		file_put_contents( $file, "<?php return array( 'openChat' => '打开聊天', 'continue' => '继续' );" );
		try {
			$this->assertSame( array( 'en', 'id', 'zh' ), Phrases::languages() );
			$form = $this->form( array( 'language' => 'zh' ) );
			$html = Renderer::render( $form->id(), array( 'mode' => 'launcher' ) );
			$this->assertStringContainsString( 'data-locale="zh"', $html );
			$this->assertStringContainsString( 'aria-label="打开聊天"', $html );
			// The runtime gets the Chinese text; phrases the file lacks fall back to English.
			$this->assertStringContainsString( '&quot;continue&quot;:&quot;继续&quot;', $html );
			$this->assertSame( 'zh', PublicProjection::build( $form )['form']['language'] );
		} finally {
			unlink( $file );
			@rmdir( dirname( $file ) );
		}
	}
}
