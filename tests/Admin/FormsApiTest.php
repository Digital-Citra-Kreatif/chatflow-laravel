<?php
namespace ChatFlow\Laravel\Tests\Admin;

use ChatFlow\Laravel\Support\Database;

final class FormsApiTest extends AdminTestCase {
	public function test_builder_flow(): void {
		$this->signIn();
		$created = $this->api( 'POST', 'forms', array( 'title' => 'Survey', 'schema' => self::schema(), 'settings' => array( 'completion' => array( 'defaultEndingId' => 'end_thanks' ) ) ) )->assertStatus( 201 );
		$created->assertHeader( 'Cache-Control' );
		$this->assertStringContainsString( 'no-store', (string) $created->headers->get( 'Cache-Control' ) );
		$id       = (int) $created->json( 'id' );
		$revision = (int) $created->json( 'draftRevision' );
		$this->assertSame( 'draft', $created->json( 'status' ) );

		$this->api( 'GET', 'forms/' . $id )->assertOk()->assertJsonPath( 'title', 'Survey' );
		$this->api( 'GET', 'forms' )->assertOk()->assertJsonPath( 'total', 1 )->assertJsonPath( 'items.0.statistics.completed', 0 )->assertJsonPath( 'perPage', 20 );

		$schema                        = self::schema();
		$schema['steps'][0]['label']   = 'Full name';
		$saved                         = $this->api( 'PUT', 'forms/' . $id, array( 'title' => 'Survey 2', 'schema' => $schema, 'settings' => array( 'completion' => array( 'defaultEndingId' => 'end_thanks' ) ), 'draftRevision' => $revision ) )->assertOk();
		$this->assertSame( $revision + 1, $saved->json( 'draftRevision' ) );
		$this->assertSame( 'Survey 2', $saved->json( 'title' ) );

		$this->api( 'PUT', 'forms/' . $id, array( 'schema' => $schema, 'settings' => (object) array(), 'draftRevision' => $revision ) )
			->assertStatus( 409 )
			->assertJsonPath( 'code', 'cff_revision_conflict' )
			->assertJsonPath( 'data.status', 409 )
			->assertJsonPath( 'data.draftRevision', $revision + 1 );

		$this->api( 'POST', 'forms/' . $id . '/lock' )->assertOk()->assertExactJson( array( true ) );
		Database::query( 'forms' )->where( 'id', $id )->update( array( 'locked_by' => 999, 'locked_until' => gmdate( 'Y-m-d H:i:s', time() + 60 ) ) );
		$this->api( 'POST', 'forms/' . $id . '/lock' )->assertStatus( 409 )->assertJsonPath( 'code', 'cff_form_locked' );
		Database::query( 'forms' )->where( 'id', $id )->update( array( 'locked_by' => null ) );

		$this->api( 'GET', 'forms/' . $id . '/published' )->assertNotFound()->assertJsonPath( 'code', 'cff_not_found' );
		$published = $this->api( 'POST', 'forms/' . $id . '/publish', array( 'draftRevision' => $revision + 1 ) )->assertOk();
		$this->assertSame( 1, $published->json( 'version' ) );
		$this->assertSame( 'publish', $published->json( 'status' ) );
		$this->api( 'GET', 'forms/' . $id . '/published' )->assertOk()->assertJsonPath( 'version', 1 )->assertJsonPath( 'schema.steps.0.label', 'Full name' );

		$copy = $this->api( 'POST', 'forms/' . $id . '/duplicate', array() )->assertStatus( 201 );
		$this->assertSame( 'Survey 2 (Copy)', $copy->json( 'title' ) );
		$this->assertSame( 'draft', $copy->json( 'status' ) );

		$this->api( 'DELETE', 'forms/' . $id )->assertOk()->assertExactJson( array( 'deleted' => true ) );
		$this->api( 'GET', 'forms/' . $id )->assertNotFound();
		$this->api( 'DELETE', 'forms/' . $id )->assertNotFound();
	}

	public function test_invalid_input_uses_the_error_envelope(): void {
		$this->signIn();
		$this->api( 'POST', 'forms', array( 'title' => 'Bad', 'schema' => 'nope' ) )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_request' );
		$this->api( 'POST', 'forms', array( 'title' => 'Bad', 'schema' => array( 'schemaVersion' => 1, 'steps' => array() ) ) )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_schema' );
		$this->call( 'POST', self::API . 'forms', array(), array(), array(), array( 'HTTP_X-CSRF-TOKEN' => self::TOKEN, 'CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json' ), '{bad json' )->assertStatus( 422 );
		$this->api( 'GET', 'nothing/here' )->assertNotFound()->assertJsonPath( 'code', 'rest_no_route' );
		$this->api( 'GET', 'forms?token=x' )->assertStatus( 400 )->assertJsonPath( 'code', 'cff_credential_location' );
		$this->api( 'POST', 'forms', array( 'title' => str_repeat( 'x', 1048577 ) ) )->assertStatus( 413 );
	}

	public function test_templates_pages_and_pickers(): void {
		$this->signIn();
		$items = $this->api( 'GET', 'templates' )->assertOk()->json( 'items' );
		$this->assertContains( 'contact-request', array_column( $items, 'id' ) );
		$this->api( 'GET', 'templates/contact-request' )->assertOk()->assertJsonStructure( array( 'title', 'schema', 'settings' ) );
		$created = $this->api( 'POST', 'templates/contact-request' )->assertStatus( 201 );
		$this->assertSame( 'draft', $created->json( 'status' ) );
		$this->api( 'POST', 'templates/unknown' )->assertNotFound();
		$this->api( 'GET', 'pages' )->assertOk()->assertExactJson( array( 'items' => array() ) );

		$this->published( array(), 'Alpha' );
		$this->api( 'GET', 'analytics/forms?page=1&search=Alp' )->assertOk()->assertJsonPath( 'items.0.title', 'Alpha' )->assertJsonPath( 'pages', 1 );
		$forms = $this->api( 'GET', 'export-forms?page=1&perPage=50' )->assertOk();
		$this->assertSame( 2, $forms->json( 'total' ) );
		$this->assertSame( 'Alpha', $forms->json( 'items.0.title' ) );
		$this->api( 'GET', 'export-forms?id=' . $created->json( 'id' ) )->assertOk()->assertJsonCount( 1, 'items' );
	}

	public function test_authentication_csrf_origin_and_gates(): void {
		$this->getJson( self::API . 'forms' )->assertStatus( 401 )->assertJsonPath( 'code', 'cff_unauthenticated' )->assertJsonPath( 'data.status', 401 );
		$this->postJson( self::API . 'forms', array() )->assertStatus( 401 );

		$this->signIn();
		$this->postJson( self::API . 'forms', array( 'title' => 'x' ) )->assertForbidden()->assertJsonPath( 'code', 'cff_forbidden' );
		$this->postJson( self::API . 'forms', array( 'title' => 'x' ), array( 'X-CSRF-TOKEN' => 'wrong' ) )->assertForbidden();
		$this->api( 'POST', 'forms', array( 'title' => 'x' ), array( 'Origin' => 'https://evil.example' ) )->assertForbidden()->assertJsonPath( 'code', 'cff_origin_rejected' );
		$this->api( 'GET', 'forms' )->assertOk();

		$this->signIn( $this->makeUser( 'someone@example.org' ) );
		$this->api( 'GET', 'forms' )->assertForbidden()->assertJsonPath( 'code', 'cff_forbidden' );
		$this->api( 'GET', 'submissions' )->assertForbidden();
	}
}
