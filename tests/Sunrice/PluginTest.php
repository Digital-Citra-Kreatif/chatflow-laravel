<?php
namespace ChatFlow\Laravel\Tests\Sunrice;

use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Tests\Core\Fixtures;
use Inertia\Testing\AssertableInertia as Assert;
use Sunrice\Admin\Panel;

final class PluginTest extends SunriceTestCase {
	use Fixtures;

	public function test_it_registers_permissions_and_navigation(): void {
		$permissions = app( Panel::class )->getPermissions();
		foreach ( array( 'chatflow.manage-forms', 'chatflow.view-submissions', 'chatflow.edit-submissions', 'chatflow.delete-submissions', 'chatflow.export-submissions' ) as $name ) {
			$this->assertArrayHasKey( $name, $permissions );
		}
		$nav = json_encode( app( Panel::class )->navigationFor( $this->admin( 'chatflow.view-submissions' ) ), JSON_UNESCAPED_SLASHES );
		$this->assertStringContainsString( 'chatflow/submissions', $nav );
		$this->assertStringNotContainsString( 'chatflow/forms', $nav );
	}

	public function test_pages_need_their_permission(): void {
		$this->get( '/admin/chatflow/forms' )->assertRedirect();
		$form = $this->form();
		foreach ( array( '/admin/chatflow/forms', '/admin/chatflow/forms/create', "/admin/chatflow/forms/{$form}" ) as $url ) {
			$this->actingAs( $this->admin( 'chatflow.view-submissions' ) )->get( $url )->assertForbidden();
		}
		$this->actingAs( $this->admin( 'chatflow.manage-forms' ) )->get( '/admin/chatflow/submissions' )->assertForbidden();
	}

	public function test_only_panel_permissions_grant_access(): void {
		// ChatFlow's "viewChatFlow" fallback allows everyone in the local environment;
		// inside the panel a user without the permission is still refused.
		$this->assertTrue( app()->environment( 'local' ) );
		$this->actingAs( $this->admin() )->getJson( '/admin/chatflow/api/admin/forms' )->assertForbidden();
		$this->actingAs( $this->admin() )->get( '/admin/chatflow/forms' )->assertForbidden();
	}

	public function test_forms_page_lists_forms_with_counts(): void {
		$live  = $this->form( 'Live form', true );
		$draft = $this->form( 'Draft form' );
		$this->actingAs( $this->admin( 'chatflow.manage-forms' ) )
			->get( '/admin/chatflow/forms?search=form' )
			->assertOk()
			->assertInertia(
				fn( Assert $page ) => $page->component( 'ChatFlow/Forms/Index', false )
					->where( 'forms.total', 2 )
					->where( 'counts.all', 2 )
					->where( 'counts.publish', 1 )
					->where( 'filters.search', 'form' )
					->where( 'forms.data.0.id', $draft )
					->where( 'forms.data.1.id', $live )
					->where( 'forms.data.1.shareUrl', fn( $url ) => str_ends_with( (string) $url, '/chat/live-form/' ) )
					->where( 'config.restUrl', 'http://localhost/admin/chatflow/api/' )
					->has( 'config.nonce' )
			);
	}

	public function test_builder_and_inbox_pages(): void {
		$form  = $this->form();
		$admin = $this->admin( 'chatflow.manage-forms', 'chatflow.view-submissions' );
		$this->actingAs( $admin )->get( "/admin/chatflow/forms/{$form}" )
			->assertInertia( fn( Assert $page ) => $page->component( 'ChatFlow/Builder', false )->where( 'formId', $form )->where( 'config.formId', $form ) );
		$this->actingAs( $admin )->get( '/admin/chatflow/forms/999' )->assertNotFound();
		$this->actingAs( $admin )->get( '/admin/chatflow/submissions' )
			->assertInertia( fn( Assert $page ) => $page->component( 'ChatFlow/Submissions/Index', false )->where( 'config.capabilities.view_submissions', true ) );
		$this->actingAs( $admin )->get( '/admin/chatflow/submissions/999' )->assertNotFound();
	}

	public function test_the_admin_api_works_under_the_panel(): void {
		$admin = $this->admin( 'chatflow.manage-forms' );
		$this->actingAs( $admin )->getJson( '/admin/chatflow/api/admin/templates' )->assertOk()->assertJsonStructure( array( 'items' ) );
		// Writes need the session's CSRF token in a header, as in the standalone admin.
		$this->actingAs( $admin )->postJson( '/admin/chatflow/api/admin/templates/lead-capture' )->assertStatus( 419 );
		$this->actingAs( $admin )->withSession( array( '_token' => 'token-1' ) )
			->postJson( '/admin/chatflow/api/admin/templates/lead-capture', array(), array( 'X-CSRF-TOKEN' => 'token-1' ) )
			->assertCreated();
		$this->actingAs( $admin )->getJson( '/admin/chatflow/api/admin/nope' )->assertNotFound()->assertJsonPath( 'code', 'rest_no_route' );
	}

	public function test_list_actions(): void {
		$form  = $this->form();
		$admin = $this->admin( 'chatflow.manage-forms' );
		$this->withSession( array( '_token' => 'token-1' ) )->withHeader( 'X-CSRF-TOKEN', 'token-1' );
		$this->actingAs( $admin )->post( "/admin/chatflow/forms/{$form}/duplicate" )->assertRedirect()->assertSessionHas( 'success' );
		$this->assertSame( 2, Database::query( 'forms' )->count() );

		$this->actingAs( $admin )->post( "/admin/chatflow/forms/{$form}/trash" )->assertSessionHas( 'success_action' );
		$this->assertSame( 'trash', Database::query( 'forms' )->where( 'id', $form )->value( 'status' ) );
		$this->actingAs( $admin )->post( "/admin/chatflow/forms/{$form}/restore" )->assertSessionHas( 'success' );
		$this->assertSame( 'draft', Database::query( 'forms' )->where( 'id', $form )->value( 'status' ) );

		// Only trashed forms can be deleted permanently.
		$this->actingAs( $admin )->delete( "/admin/chatflow/forms/{$form}" )->assertNotFound();
		$this->actingAs( $admin )->post( "/admin/chatflow/forms/{$form}/trash" );
		$this->actingAs( $admin )->delete( "/admin/chatflow/forms/{$form}" )->assertSessionHas( 'success' );
		$this->assertNull( Database::query( 'forms' )->where( 'id', $form )->value( 'id' ) );
	}

	private function form( string $title = 'Contact', bool $publish = false ): int {
		$repository = new FormRepository();
		$form       = $repository->create( $title, self::schema(), array( 'completion' => array( 'defaultEndingId' => 'end_thanks' ) ) );
		$this->assertInstanceOf( \ChatFlow\Laravel\Forms\Form::class, $form );
		if ( $publish ) {
			$repository->publish( $form->id(), $form->draftRevision() );
		}
		return $form->id();
	}
}
