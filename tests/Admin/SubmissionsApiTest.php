<?php
namespace ChatFlow\Laravel\Tests\Admin;

use ChatFlow\Laravel\Privacy\Export;
use ChatFlow\Laravel\Support\Database;
use Illuminate\Support\Facades\Gate;

final class SubmissionsApiTest extends AdminTestCase {
	protected function tearDown(): void {
		foreach ( glob( Export::directory() . '/export-*.csv' ) ?: array() as $file ) {
			@unlink( $file );
		}
		parent::tearDown();
	}

	public function test_list_detail_patch_bulk_and_delete(): void {
		$this->signIn();
		$form   = $this->published();
		$first  = $this->submission( $form, array( 'name' => 'Ada' ) );
		$second = $this->submission( $form, array( 'name' => 'Grace' ) );

		$list = $this->api( 'GET', 'submissions?page=1&perPage=20&formId=' . $form->id() )->assertOk();
		$this->assertSame( 2, $list->json( 'total' ) );
		$this->assertSame( $second->id(), $list->json( 'items.0.id' ) );
		$this->assertSame( 'Contact form', $list->json( 'forms.' . $form->id() . ':1.title' ) );
		$this->assertSame( 'Name', $list->json( 'forms.' . $form->id() . ':1.labels.name' ) );
		$this->api( 'GET', 'submissions?search=Grace' )->assertOk()->assertJsonPath( 'total', 1 );
		$this->api( 'GET', 'submissions?bogus=1' )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_request' );

		$this->api( 'PATCH', 'submissions/' . $first->id(), array( 'isRead' => true, 'isStarred' => true, 'note' => 'Called back' ) )->assertOk()->assertJsonPath( 'isRead', true )->assertJsonPath( 'isStarred', true );
		$detail = $this->api( 'GET', 'submissions/' . $first->id() )->assertOk();
		$this->assertSame( 'Ada', $detail->json( 'answers.name' ) );
		$this->assertSame( $form->id(), $detail->json( 'form.id' ) );
		$this->assertSame( 'Called back', $detail->json( 'notes.0.message' ) );
		$this->api( 'PATCH', 'submissions/' . $first->id(), array( 'isRead' => 'yes' ) )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_invalid_changes' );
		$this->api( 'PATCH', 'submissions/' . $first->id(), array( 'other' => 1 ) )->assertStatus( 422 );
		$this->api( 'GET', 'submissions/999' )->assertNotFound();

		$this->api( 'POST', 'submissions/bulk', array( 'ids' => array( $first->id(), $second->id() ), 'changes' => array( 'status' => 'spam' ) ) )->assertOk()->assertExactJson( array( 'updated' => 2 ) );
		$this->assertSame( 2, Database::query( 'submissions' )->where( 'status', 'spam' )->count() );
		$this->api( 'POST', 'submissions/bulk', array( 'ids' => array( $first->id(), $second->id() ), 'changes' => array( 'status' => 'restore' ) ) )->assertOk();
		$this->assertSame( 2, Database::query( 'submissions' )->where( 'status', 'completed' )->count() );
		$this->api( 'POST', 'submissions/bulk', array( 'ids' => array( 'x' ), 'changes' => array( 'isRead' => true ) ) )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_bulk_invalid' );
		$this->api( 'POST', 'submissions/bulk', array( 'ids' => array( $first->id() ), 'permanent' => true ) )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_delete_confirmation' );

		$this->api( 'DELETE', 'submissions/' . $first->id() )->assertOk()->assertExactJson( array( 'deleted' => true ) );
		$this->assertSame( 'trash', Database::query( 'submissions' )->where( 'id', $first->id() )->value( 'status' ) );
		$this->api( 'DELETE', 'submissions/' . $first->id(), array( 'permanent' => true ) )->assertStatus( 422 );
		$this->api( 'DELETE', 'submissions/' . $first->id(), array( 'permanent' => true, 'confirmation' => 'DELETE' ) )->assertOk();
		$this->assertFalse( Database::query( 'submissions' )->where( 'id', $first->id() )->exists() );
		$this->api( 'POST', 'submissions/bulk', array( 'ids' => array( $second->id() ), 'permanent' => true, 'confirmation' => 'DELETE' ) )->assertOk();
		$this->assertSame( 0, Database::query( 'submissions' )->count() );
	}

	public function test_edit_and_delete_abilities_are_separate(): void {
		$form       = $this->published();
		$submission = $this->submission( $form );
		$this->signIn( $this->makeUser( 'viewer@example.org' ) );
		Gate::define( 'chatflow.view-submissions', static fn( $user ) => true );
		Gate::define( 'chatflow.edit-submissions', static fn( $user ) => true );
		$this->api( 'GET', 'submissions/' . $submission->id() )->assertOk();
		$this->api( 'PATCH', 'submissions/' . $submission->id(), array( 'isRead' => true ) )->assertOk();
		$this->api( 'PATCH', 'submissions/' . $submission->id(), array( 'status' => 'trash' ) )->assertForbidden();
		$this->api( 'POST', 'submissions/bulk', array( 'ids' => array( $submission->id() ), 'permanent' => true, 'confirmation' => 'DELETE' ) )->assertForbidden();
		$this->api( 'DELETE', 'submissions/' . $submission->id() )->assertForbidden();
		$this->api( 'POST', 'submissions/export', array( 'formId' => $form->id() ) )->assertForbidden();
	}

	public function test_csv_export_and_private_download(): void {
		$user = $this->signIn();
		$form = $this->published();
		$this->submission( $form, array( 'name' => '=SUM(A1)' ) );
		$this->submission( $form, array( 'name' => 'Grace', 'color' => 'blue' ) );

		$job = $this->api( 'POST', 'submissions/export', array( 'formId' => $form->id(), 'delimiter' => ';', 'headerStyle' => 'keys', 'columns' => array( 'id', 'name', 'color' ) ) )->assertOk();
		$this->assertSame( 'ready', $job->json( 'status' ) );
		$this->assertSame( 2, $job->json( 'rowCount' ) );
		$id  = (int) $job->json( 'exportId' );
		$url = (string) $job->json( 'downloadUrl' );
		$this->assertMatchesRegularExpression( '#^http://localhost/chatflow/admin/api/admin/exports/' . $id . '/download\?ticket=[a-f0-9]{64}$#', $url );
		$row = Database::query( 'exports' )->where( 'id', $id )->first();
		$this->assertSame( (int) $user->id, (int) $row->user_id );
		$this->assertSame( hash( 'sha256', substr( $url, strpos( $url, 'ticket=' ) + 7 ) ), $row->download_hash );
		$this->assertFileExists( Export::directory() . '/' . $row->storage_key );

		$download = $this->get( $url )->assertOk();
		$this->assertStringContainsString( 'attachment; filename=chatflow-' . $id . '.csv', (string) $download->headers->get( 'Content-Disposition' ) );
		$this->assertStringContainsString( 'text/csv', (string) $download->headers->get( 'Content-Type' ) );
		$csv = (string) $download->streamedContent();
		$this->assertStringStartsWith( "\xEF\xBB\xBFid;name;color\n", $csv );
		$this->assertStringContainsString( ";'=SUM(A1);red", $csv );
		$this->assertStringContainsString( ';Grace;blue', $csv );

		$this->get( self::API . 'exports/' . $id . '/download?ticket=' . str_repeat( 'a', 64 ) )->assertNotFound();
		$this->get( self::API . 'exports/' . $id . '/download' )->assertNotFound();
		// A status check issues a fresh ticket.
		$fresh = $this->api( 'GET', 'exports/' . $id )->assertOk()->json( 'downloadUrl' );
		$this->assertNotSame( $url, $fresh );
		$this->get( $url )->assertNotFound();
		$this->get( $fresh )->assertOk();

		$this->signIn( $this->makeUser( 'other@example.org' ) );
		Gate::define( 'chatflow.export-submissions', static fn( $user ) => true );
		$this->get( $fresh )->assertNotFound();
		$this->api( 'GET', 'exports/' . $id )->assertNotFound();

		$this->signIn( $this->makeUser( 'nobody@example.org' ) );
		Gate::define( 'chatflow.export-submissions', static fn( $user ) => false );
		$this->get( $fresh )->assertForbidden();
	}

	public function test_export_validation_and_expiry(): void {
		$this->signIn();
		$form = $this->published();
		$this->api( 'POST', 'submissions/export', array( 'formId' => 'x' ) )->assertStatus( 422 )->assertJsonPath( 'code', 'cff_export_invalid' );
		$this->api( 'POST', 'submissions/export', array( 'formId' => $form->id(), 'columns' => array( 'nope' ) ) )->assertStatus( 422 );
		$this->api( 'POST', 'submissions/export', array( 'formId' => $form->id(), 'format' => 'xlsx' ) )->assertStatus( 503 );
		$this->api( 'POST', 'submissions/export', array( 'formId' => 999 ) )->assertNotFound();
		$job = $this->api( 'POST', 'submissions/export', array( 'formId' => $form->id() ) )->assertOk();
		$this->assertSame( 0, $job->json( 'rowCount' ) );
		Database::query( 'exports' )->update( array( 'expires_at' => gmdate( 'Y-m-d H:i:s', time() - 1 ) ) );
		$this->api( 'GET', 'exports/' . $job->json( 'exportId' ) )->assertOk()->assertJsonPath( 'status', 'expired' )->assertJsonMissingPath( 'downloadUrl' );
		$this->get( (string) $job->json( 'downloadUrl' ) )->assertNotFound();
		( new Export() )->expire();
		$this->assertSame( array(), glob( Export::directory() . '/export-*.csv' ) ?: array() );
	}

	public function test_export_cell_guards_formulas(): void {
		$this->assertSame( "'=1+1", Export::cell( '=1+1' ) );
		$this->assertSame( "' @x", Export::cell( ' @x' ) );
		$this->assertSame( "'-2", Export::cell( -2 ) );
		// Phone numbers stay readable; arithmetic after a plus sign is still neutralised.
		$this->assertSame( '+6281234567890', Export::cell( '+6281234567890' ) );
		$this->assertSame( '+62 812 3456 7890', Export::cell( '+62 812 3456 7890' ) );
		$this->assertSame( "'+1-2", Export::cell( '+1-2' ) );
		$this->assertSame( "'+SUM(A1)", Export::cell( '+SUM(A1)' ) );
		$this->assertSame( 'true', Export::cell( true ) );
		$this->assertSame( '["a"]', Export::cell( array( 'a' ) ) );
	}
}
