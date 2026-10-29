<?php
namespace ChatFlow\Laravel\Tests\Admin;

use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Support\Database;
use Illuminate\Support\Facades\Gate;

final class PagesTest extends AdminTestCase {
	private const PAGE = '/chatflow/admin';

	/** @return array<string,mixed> */
	private function config( string $html ): array {
		$this->assertSame( 1, preg_match( '/window\.cffAdmin=(\{.*?\});<\/script>/s', $html, $match ), 'Inline config missing.' );
		$config = json_decode( $match[1], true, 512, JSON_THROW_ON_ERROR );
		$this->assertIsArray( $config );
		return $config;
	}

	public function test_forms_list_renders_rows_actions_and_embed_codes(): void {
		$this->signIn();
		$live  = $this->published( array( 'display' => array( 'mode' => 'launcher', 'launcher' => array( 'position' => 'left' ) ) ), 'Launcher & co' );
		$draft = ( new FormRepository() )->create( 'Draft form', self::schema() );
		$html  = $this->get( self::PAGE )->assertOk()->assertHeader( 'Cache-Control' )->getContent();

		$this->assertStringContainsString( 'id="cff-forms-list"', $html );
		$this->assertStringContainsString( 'data-cff-status', $html );
		$this->assertStringContainsString( 'Launcher &amp; co', $html );
		$this->assertStringContainsString( 'data-cff-action="duplicate" data-form-id="' . $live->id() . '"', $html );
		$this->assertStringContainsString( 'data-cff-action="export" data-form-id="' . $draft->id() . '"', $html );
		$this->assertStringContainsString( 'data-cff-action="trash"', $html );
		$this->assertStringContainsString( 'data-cff-shortcode="&lt;x-chatflow::form :id=&quot;' . $live->id() . '&quot; mode=&quot;launcher&quot; position=&quot;left&quot; /&gt;"', $html );
		$this->assertStringContainsString( 'page=cff-builder&amp;formId=' . $draft->id() . '&amp;preview=1', $html );
		$this->assertStringContainsString( 'window.CFFAdmin.builder.mountFormsList(document.getElementById("cff-forms-list"),window.cffAdmin);', $html );
		$this->assertStringContainsString( '/vendor/chatflow/admin/builder.js?v=', $html );
		$this->assertStringContainsString( '/vendor/chatflow/admin/admin-shim.css?v=', $html );
		$this->assertStringNotContainsString( 'submissions.css', $html );
		$this->assertSame( 'forms', $this->config( $html )['screen'] );

		$live_only = $this->get( self::PAGE . '?page=cff-forms&status=publish' )->getContent();
		$this->assertStringContainsString( 'Launcher', $live_only );
		$this->assertStringNotContainsString( 'Draft form', $live_only );
		$this->assertStringContainsString( 'Draft form', $this->get( self::PAGE . '?page=cff-forms&s=Draft' )->getContent() );
		$this->assertStringNotContainsString( 'Launcher', $this->get( self::PAGE . '?page=cff-forms&s=Draft' )->getContent() );
	}

	public function test_trash_restore_and_delete_permanently(): void {
		$this->signIn();
		$form       = $this->published();
		$repository = new FormRepository();
		$repository->trash( $form->id() );
		$html = $this->get( self::PAGE . '?page=cff-forms&status=trash' )->assertOk()->getContent();
		$this->assertStringContainsString( 'Delete permanently', $html );
		$this->assertStringContainsString( 'forms/' . $form->id() . '/restore', $html );

		$this->post( '/chatflow/admin/forms/' . $form->id() . '/restore' )->assertRedirect( route( 'chatflow.admin.index', array( 'page' => 'cff-forms', 'status' => 'trash', 'cff_notice' => 'restored' ) ) );
		$this->assertSame( 'publish', Database::query( 'forms' )->where( 'id', $form->id() )->value( 'status' ) );

		$repository->trash( $form->id() );
		$this->submission( $form );
		$this->post( '/chatflow/admin/forms/' . $form->id() . '/delete' )->assertRedirect( route( 'chatflow.admin.index', array( 'page' => 'cff-forms', 'status' => 'trash', 'cff_notice' => 'has_submissions' ) ) );
		$this->assertStringContainsString( 'still has submissions', $this->get( self::PAGE . '?page=cff-forms&status=trash&cff_notice=has_submissions' )->getContent() );
		Database::query( 'submissions' )->delete();
		$this->post( '/chatflow/admin/forms/' . $form->id() . '/delete' )->assertRedirect();
		$this->assertFalse( Database::query( 'forms' )->where( 'id', $form->id() )->exists() );
		// Only trashed forms.
		$other = $this->published();
		$this->post( '/chatflow/admin/forms/' . $other->id() . '/delete' )->assertNotFound();
	}

	public function test_builder_and_submissions_screens_mount_with_config(): void {
		$this->signIn();
		$form = $this->published();
		$html = $this->get( self::PAGE . '?page=cff-builder&formId=' . $form->id() . '&preview=1' )->assertOk()->getContent();
		$this->assertStringContainsString( 'id="cff-admin-root"', $html );
		$this->assertStringContainsString( 'window.CFFAdmin.builder.mountBuilder(document.getElementById("cff-admin-root"),window.cffAdmin);', $html );
		$config = $this->config( $html );
		foreach ( array( 'restUrl', 'publicRestUrl', 'nonce', 'runtimeUrl', 'pluginUrl', 'screen', 'locale', 'capabilities', 'adminUrl', 'siteUrl', 'timezone', 'themeFrontend', 'fullpageBase', 'tools', 'features', 'defaults', 'formId', 'preview' ) as $key ) {
			$this->assertArrayHasKey( $key, $config );
		}
		$this->assertSame( 'http://localhost/chatflow/admin/api/', $config['restUrl'] );
		$this->assertSame( 'http://localhost/chatflow/api/v1/', $config['publicRestUrl'] );
		$this->assertSame( 'http://localhost/chatflow/admin', $config['adminUrl'] );
		$this->assertSame( 'http://localhost/', $config['siteUrl'] );
		$this->assertSame( 'http://localhost/vendor/chatflow/', $config['pluginUrl'] );
		$this->assertMatchesRegularExpression( '#^http://localhost/vendor/chatflow/runtime/runtime\.js\?v=\w+$#', $config['runtimeUrl'] );
		$this->assertSame( self::TOKEN, $config['nonce'] );
		$this->assertSame( 'builder', $config['screen'] );
		$this->assertSame( $form->id(), $config['formId'] );
		$this->assertTrue( $config['preview'] );
		$this->assertTrue( $config['capabilities']['manage_forms'] );
		$this->assertFalse( $config['capabilities']['purge_submissions'] );
		$this->assertFalse( $config['features']['uploads'] );
		$this->assertNotContains( 'file_upload', $config['features']['fieldTypes'] );
		$this->assertSame( 'light', $config['defaults']['appearance']['theme'] );
		$this->assertSame( 'anonymized', $config['defaults']['privacy']['ipMode'] );

		$this->get( self::PAGE . '?page=cff-builder&blank=1' )->assertOk();
		$this->get( self::PAGE . '?page=cff-builder&formId=999' )->assertNotFound();

		$this->submission( $form );
		$html = $this->get( self::PAGE . '?page=cff-submissions&submission=1&exportId=4' )->assertOk()->getContent();
		$this->assertStringContainsString( 'window.CFFAdmin.submissions.mountSubmissions(document.getElementById("cff-admin-root"),window.cffAdmin);', $html );
		$this->assertStringContainsString( '/vendor/chatflow/admin/submissions.css?v=', $html );
		$this->assertStringContainsString( '/vendor/chatflow/admin/builder.css?v=', $html );
		$this->assertStringContainsString( '<span class="pending-count">1</span>', $html );
		$config = $this->config( $html );
		$this->assertSame( 'submissions', $config['screen'] );
		$this->assertSame( 4, $config['exportId'] );
	}

	public function test_config_is_safe_inside_script(): void {
		$this->signIn();
		$this->app['config']->set( 'chatflow.fullpage_base', '</script><b>' );
		$html = $this->get( self::PAGE . '?page=cff-builder' )->getContent();
		$this->assertStringNotContainsString( '</script><b>', $html );
		$this->assertStringContainsString( '\u003C/script\u003E', $html );
	}

	public function test_screens_check_gates(): void {
		$this->signIn( $this->makeUser( 'someone@example.org' ) );
		$this->get( self::PAGE )->assertForbidden();
		$this->get( self::PAGE . '?page=cff-builder' )->assertForbidden();
		$this->get( self::PAGE . '?page=cff-submissions' )->assertForbidden();
		$this->get( self::PAGE . '?page=unknown' )->assertNotFound();

		Gate::define( 'chatflow.view-submissions', static fn( $user ) => true );
		$this->get( self::PAGE . '?page=cff-submissions' )->assertOk();
		$this->get( self::PAGE . '?page=cff-forms' )->assertForbidden();
		// Without the forms ability the default screen is the inbox.
		$html = $this->get( self::PAGE )->assertOk()->getContent();
		$this->assertSame( 'submissions', $this->config( $html )['screen'] );
		$this->assertStringNotContainsString( 'Add new form', $html );
	}
}
