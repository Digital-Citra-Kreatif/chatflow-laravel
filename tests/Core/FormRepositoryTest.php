<?php
namespace ChatFlow\Laravel\Tests\Core;

use ChatFlow\Laravel\Fields\Registry;
use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Forms\PublicProjection;
use ChatFlow\Laravel\Forms\Statistics;
use ChatFlow\Laravel\Security\CookieSources;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Templates\Templates;
use ChatFlow\Laravel\Tests\TestCase;
use Illuminate\Support\Facades\Event;

final class FormRepositoryTest extends TestCase {
	use Fixtures;

	private FormRepository $forms;

	protected function setUp(): void {
		parent::setUp();
		$this->forms = new FormRepository();
	}

	public function testCreateStoresADraftWithIdentityMap(): void {
		$this->actingAs( $this->user( 7 ) );
		$form = $this->forms->create( '  <b>Contact</b>  form ', self::schema() );
		$this->assertInstanceOf( Form::class, $form );
		$this->assertSame( 'Contact form', $form->title() );
		$this->assertSame( 'draft', $form->status() );
		$this->assertSame( '', $form->slug() );
		$this->assertSame( 1, $form->draftRevision() );
		$this->assertSame( 0, $form->version() );
		$this->assertSame( self::schema(), $form->schema() );
		$row = Database::query( 'forms' )->where( 'id', $form->id() )->first();
		$this->assertSame( 7, (int) $row->created_by );
		$identity = Database::decode( $row->identity );
		$this->assertSame( 'step_name', $identity['step:name'] );
		$this->assertSame( 'opt_red', $identity['option:step_color:red'] );
		$this->assertSame( 'ending', $identity['entity:end_thanks'] );
		$this->assertSame( '{}', $row->settings );
	}

	public function testInvalidSchemaIsRejectedWith422(): void {
		$schema = self::schema();
		unset( $schema['endings'] );
		$result = $this->forms->create( 'Broken', $schema );
		$this->assertTrue( Error::is( $result ) );
		$this->assertSame( 'cff_invalid_schema', $result->code() );
		$this->assertSame( 422, $result->status() );
		$this->assertNotEmpty( $result->data()['errors'] );
		$this->assertSame( 0, Database::query( 'forms' )->count() );

		$invalid = $this->forms->create( 'Bad settings', self::schema(), array( 'completion' => array( 'defaultEndingId' => 'missing' ) ) );
		$this->assertSame( 'cff_invalid_schema', $invalid->code() );
	}

	public function testSaveDraftDetectsRevisionConflicts(): void {
		$form  = $this->forms->create( 'Draft', self::schema() );
		$saved = $this->forms->saveDraft( $form->id(), self::schema(), array(), 1, 'Renamed' );
		$this->assertInstanceOf( Form::class, $saved );
		$this->assertSame( 2, $saved->draftRevision() );
		$this->assertSame( 'Renamed', $saved->title() );

		$conflict = $this->forms->saveDraft( $form->id(), self::schema(), array(), 1 );
		$this->assertSame( 'cff_revision_conflict', $conflict->code() );
		$this->assertSame( 409, $conflict->status() );
		$this->assertSame( 2, $conflict->data()['draftRevision'] );

		$missing = $this->forms->saveDraft( 999, self::schema(), array(), 0 );
		$this->assertSame( 'cff_form_not_found', $missing->code() );
		$this->assertSame( 404, $missing->status() );
	}

	public function testSaveDraftDropsPerFormCaptchaProviders(): void {
		$form  = $this->forms->create( 'Draft', self::schema() );
		$saved = $this->forms->saveDraft( $form->id(), self::schema(), array( 'spam' => array( 'captcha' => 'turnstile', 'minSeconds' => 1 ) ), 1 );
		$this->assertInstanceOf( Form::class, $saved );
		$this->assertArrayNotHasKey( 'captcha', $saved->settings()['spam'] );
	}

	public function testImmutableIdentifiers(): void {
		$form = $this->forms->create( 'Draft', self::schema() );

		$schema                     = self::schema();
		$schema['steps'][0]['id']   = 'step_other';
		$result                     = $this->forms->saveDraft( $form->id(), $schema, array(), 1 );
		$this->assertSame( 'cff_immutable_id', $result->code() );
		$this->assertSame( 422, $result->status() );

		$schema = self::schema();
		$schema['steps'][2]['options'][0]['id'] = 'opt_other';
		$this->assertSame( 'cff_immutable_id', $this->forms->saveDraft( $form->id(), $schema, array(), 1 )->code() );

		// Remove the "age" step, then try to reuse its ID for a different field.
		$schema = self::schema();
		unset( $schema['steps'][1] );
		$schema['steps'] = array_values( $schema['steps'] );
		$saved           = $this->forms->saveDraft( $form->id(), $schema, array(), 1 );
		$this->assertInstanceOf( Form::class, $saved );
		$schema['steps'][] = array(
			'id'       => 'step_age',
			'key'      => 'years',
			'type'     => 'number',
			'label'    => 'Years',
			'messages' => array( 'Years?' ),
		);
		$this->assertSame( 'cff_immutable_id', $this->forms->saveDraft( $form->id(), $schema, array(), 2 )->code() );
		$this->assertSame( 2, $this->forms->getDraft( $form->id() )->draftRevision() );
	}

	public function testPublishCreatesVersionsAndAStableSlug(): void {
		$published = array();
		Event::listen( 'chatflow.form_published', function ( Form $form ) use ( &$published ) {
			$published[] = $form->version();
		} );
		$this->actingAs( $this->user( 3 ) );
		$form = $this->forms->create( 'Contact Form!', self::schema() );
		$v1   = $this->forms->publish( $form->id(), 1 );
		$this->assertInstanceOf( Form::class, $v1 );
		$this->assertSame( 1, $v1->version() );
		$this->assertSame( 'contact-form', $v1->slug() );
		$this->assertSame( 'publish', $v1->status() );
		$this->assertSame( 2, $v1->draftRevision() );
		$this->assertSame( 'publish', $this->forms->getDraft( $form->id() )->status() );

		$version = Database::query( 'form_versions' )->where( 'form_id', $form->id() )->first();
		$this->assertSame( 'contact-form', $version->form_slug );
		$this->assertSame( 3, (int) $version->created_by );
		$this->assertSame( hash( 'sha256', $version->schema ), $version->schema_hash );

		$schema                         = self::schema();
		$schema['steps'][0]['label']    = 'Full name';
		$this->forms->saveDraft( $form->id(), $schema, array(), 2, 'Renamed form' );
		$this->assertSame( 'Name', $this->forms->getPublished( $form->id() )->schema()['steps'][0]['label'] );
		$v2 = $this->forms->publish( $form->id(), 3 );
		$this->assertSame( 2, $v2->version() );
		$this->assertSame( 'contact-form', $v2->slug() );
		$this->assertSame( 'Renamed form', $v2->title() );
		$this->assertSame( 'Full name', $this->forms->getPublished( $form->id() )->schema()['steps'][0]['label'] );
		$this->assertSame( 'Name', $this->forms->getVersion( $form->id(), 1 )->schema()['steps'][0]['label'] );
		$this->assertSame( array( 1, 2 ), $published );

		$this->assertSame( 'cff_revision_conflict', $this->forms->publish( $form->id(), 3 )->code() );

		$other = $this->forms->create( 'Contact form', self::schema() );
		$this->assertSame( 'contact-form-2', $this->forms->publish( $other->id(), 1 )->slug() );
		$third = $this->forms->create( 'Contact form', self::schema() );
		$this->assertSame( 'contact-form-3', $this->forms->publish( $third->id(), 1 )->slug() );
	}

	public function testPublishRejectsDisabledFieldTypes(): void {
		$schema             = self::schema();
		$schema['steps'][1] = array(
			'id'       => 'step_file',
			'key'      => 'file',
			'type'     => 'file_upload',
			'label'    => 'File',
			'messages' => array( 'Upload' ),
		);
		$form   = $this->forms->create( 'Uploads', $schema );
		$this->assertInstanceOf( Form::class, $form );
		$result = $this->forms->publish( $form->id(), 1 );
		$this->assertSame( 'cff_invalid_schema', $result->code() );
		$this->assertContains( 'unsupported_type', array_column( $result->data()['errors'], 'code' ) );
		$this->assertNull( $this->forms->getPublished( $form->id() ) );

		config()->set( 'chatflow.field_types', array( 'short_text', 'single_choice', 'file_upload' ) );
		$this->assertSame( array( 'short_text', 'single_choice' ), Registry::enabledTypes() );
		$form = $this->forms->create( 'Numbers', self::schema() );
		$this->assertSame( 'cff_invalid_schema', $this->forms->publish( $form->id(), 1 )->code() );
	}

	public function testTrashRestoreAndDeleteForever(): void {
		$form = $this->publishedForm();
		$this->assertTrue( $this->forms->trash( $form->id() ) );
		$this->assertNull( $this->forms->getDraft( $form->id() ) );
		$this->assertNull( $this->forms->getPublished( $form->id() ) );
		$this->assertSame( 'cff_form_not_found', $this->forms->trash( $form->id() )->code() );
		$this->assertSame( 'cff_form_not_found', $this->forms->saveDraft( $form->id(), self::schema(), array(), 2 )->code() );

		$restored = $this->forms->restore( $form->id() );
		$this->assertInstanceOf( Form::class, $restored );
		$this->assertSame( 'publish', $restored->status() );
		$this->assertNotNull( $this->forms->getPublished( $form->id() ) );

		$draft = $this->forms->create( 'Draft', self::schema() );
		$this->forms->trash( $draft->id() );
		$this->assertSame( 'draft', $this->forms->restore( $draft->id() )->status() );

		Database::query( 'submissions' )->insert(
			array(
				'uuid'         => '00000000-0000-4000-8000-000000000001',
				'form_id'      => $form->id(),
				'form_version' => 1,
				'status'       => 'trash',
				'answers'      => '{}',
				'variables'    => '{}',
				'visited'      => '[]',
				'consent'      => '{}',
				'meta'         => '{}',
				'started_at'   => Database::now(),
				'created_at'   => Database::now(),
				'updated_at'   => Database::now(),
			)
		);
		$refused = $this->forms->deleteForever( $form->id() );
		$this->assertSame( 'cff_has_submissions', $refused->code() );
		$this->assertSame( 409, $refused->status() );

		Database::query( 'submissions' )->delete();
		$this->assertTrue( $this->forms->deleteForever( $form->id() ) );
		$this->assertSame( 0, Database::query( 'form_versions' )->where( 'form_id', $form->id() )->count() );
		$this->assertNull( Database::query( 'forms' )->where( 'id', $form->id() )->first() );
		$this->assertSame( 'cff_form_not_found', $this->forms->deleteForever( $form->id() )->code() );
		$this->assertSame( 'cff_form_not_found', $this->forms->restore( $form->id() )->code() );
	}

	public function testDuplicateCreatesANewDraftWithNeutralisedWebhooks(): void {
		$form = $this->publishedForm();
		$this->forms->saveDraft(
			$form->id(),
			self::schema(),
			array(
				'integrations' => array(
					'webhooks' => array(
						array(
							'id'      => 'hook1',
							'enabled' => true,
							'url'     => 'https://example.test/hook',
							'events'  => array( 'completed' ),
							'secret'  => 'super-secret-value-123',
							'headers' => array( 'X-Key' => 'abc' ),
						),
					),
				),
			),
			2
		);
		$copy = $this->forms->duplicate( $form->id() );
		$this->assertInstanceOf( Form::class, $copy );
		$this->assertNotSame( $form->id(), $copy->id() );
		$this->assertSame( 'Contact form (Copy)', $copy->title() );
		$this->assertSame( 'draft', $copy->status() );
		$this->assertSame( 0, $copy->version() );
		$hook = $copy->settings()['integrations']['webhooks'][0];
		$this->assertFalse( $hook['enabled'] );
		$this->assertSame( '', $hook['secret'] );
		$this->assertArrayNotHasKey( 'headers', $hook );
		$this->assertSame( 'cff_form_not_found', $this->forms->duplicate( 999 )->code() );
	}

	public function testPaginateFilters(): void {
		$alpha = $this->forms->create( 'Alpha survey', self::schema() );
		$this->publishedForm( 'Beta contact' );
		$gamma = $this->forms->create( 'Gamma survey', self::schema() );
		$this->forms->trash( $gamma->id() );
		$this->forms->create( '100%_done', self::schema() );

		$all = $this->forms->paginate( array() );
		$this->assertSame( 3, $all['total'] );

		$titles = fn( array $result ) => array_map( fn( Form $f ) => $f->title(), $result['items'] );
		$this->assertSame( array( '100%_done', 'Alpha survey', 'Beta contact' ), $titles( $this->forms->paginate( array( 'orderby' => 'title', 'order' => 'asc' ) ) ) );
		$this->assertSame( array( 'Alpha survey' ), $titles( $this->forms->paginate( array( 'search' => 'survey' ) ) ) );
		$this->assertSame( array( '100%_done' ), $titles( $this->forms->paginate( array( 'search' => '%_' ) ) ) );
		$this->assertSame( array( 'Beta contact' ), $titles( $this->forms->paginate( array( 'status' => 'publish' ) ) ) );
		$this->assertSame( array( 'Gamma survey' ), $titles( $this->forms->paginate( array( 'status' => 'trash' ) ) ) );

		$page = $this->forms->paginate(
			array(
				'perPage' => 2,
				'page'    => 2,
				'orderby' => 'title',
				'order'   => 'desc',
			)
		);
		$this->assertSame( 3, $page['total'] );
		$this->assertSame( array( '100%_done' ), $titles( $page ) );
		$this->assertSame( $alpha->id(), $this->forms->paginate( array( 'search' => 'Alpha' ) )['items'][0]->id() );

		$this->expectException( \InvalidArgumentException::class );
		$this->forms->paginate( array( 'status' => 'private' ) );
	}

	public function testStatisticsAndPublicProjection(): void {
		$form = $this->publishedForm();
		$this->assertSame(
			array(
				'completed'        => 0,
				'started'          => 0,
				'completionRate'   => 0,
				'lastSubmissionAt' => null,
			),
			Statistics::get( $form->id() )
		);
		$envelope = PublicProjection::build( $form );
		$this->assertSame( 'contact-form', $envelope['form']['slug'] );
		$this->assertFalse( $envelope['features']['uploads'] );
		$this->assertNotContains( 'file_upload', $envelope['features']['fieldTypes'] );
		$this->assertEquals( new \stdClass(), $envelope['form']['media'] );
		$this->assertFalse( $envelope['form']['session']['magicLinks']['enabled'] );
	}

	public function testTemplatesCreateDrafts(): void {
		foreach ( Templates::catalog() as $item ) {
			$form = ( new Templates( $this->forms ) )->create( $item['id'] );
			$this->assertInstanceOf( Form::class, $form, $item['id'] );
		}
		$this->assertSame( 'cff_template_not_found', Templates::definition( 'nope' )->code() );
	}

	public function testFrameworkCookiesAreNeverCookieSources(): void {
		$this->assertTrue( CookieSources::allows( 'utm_source' ) );
		$this->assertFalse( CookieSources::allows( 'XSRF-TOKEN' ) );
		config()->set( 'session.cookie', 'tracking' );
		$this->assertFalse( CookieSources::allows( 'tracking' ) );
		$this->assertFalse( CookieSources::allows( 'remember_web_59ba36' ) );
	}
}
