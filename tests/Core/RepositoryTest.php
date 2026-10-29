<?php
namespace ChatFlow\Laravel\Tests\Core;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Submissions\Repository;
use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;

final class RepositoryTest extends TestCase {
	use Fixtures;

	private Repository $submissions;
	private Form $form;

	protected function setUp(): void {
		parent::setUp();
		$this->submissions = new Repository();
		$this->form        = $this->publishedForm();
	}

	/** @param array<string,mixed> $answers */
	private function partial( array $answers, array $extra = array() ): Submission {
		return $this->submissions->savePartial(
			array_merge(
				array(
					'form_id'      => $this->form->id(),
					'form_version' => $this->form->version(),
					'answers'      => $answers,
				),
				$extra
			)
		);
	}

	public function testSavePartialThenCompleteRebuildsValues(): void {
		$submission = $this->partial( array( 'name' => 'Ada' ), array( 'ip' => '203.0.113.0' ) );
		$this->assertSame( 'partial', $submission->status() );
		$this->assertMatchesRegularExpression( '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $submission->uuid() );
		$this->assertSame( array( 'name' => 'Ada' ), $submission->answers() );
		$this->assertSame( 1, Database::query( 'submission_values' )->where( 'submission_id', $submission->id() )->count() );

		$completed = $this->submissions->complete(
			$submission->id(),
			array(
				'status'       => 'completed',
				'answers'      => array(
					'name'  => 'Ada Lovelace',
					'age'   => 36,
					'color' => 'blue',
				),
				'ending_id'    => 'end_thanks',
				'completed_at' => Database::now(),
			)
		);
		$this->assertSame( 'completed', $completed->status() );
		$this->assertSame( 'end_thanks', $completed->endingId() );
		$values = Database::query( 'submission_values' )->where( 'submission_id', $submission->id() )->orderBy( 'field_key' )->get();
		$this->assertSame( array( 'age', 'color', 'name' ), $values->pluck( 'field_key' )->all() );
		$this->assertSame( '36', $values[0]->value_text );
		$this->assertEquals( 36, (float) $values[0]->value_num );
		$this->assertSame( 'Ada Lovelace', $values[2]->value_text );

		$admin = $completed->admin();
		$this->assertSame( $this->form->id(), $admin['formId'] );
		$this->assertFalse( $admin['isRead'] );
		$payload = $completed->toArray();
		$this->assertSame( 'submission.completed', $payload['event'] );
		$this->assertSame( 'Ada Lovelace', $payload['answers']['name'] );
	}

	public function testFindAppliesTheFilterWhitelist(): void {
		$ada   = $this->partial( array( 'name' => 'Ada', 'age' => 36, 'color' => 'blue' ), array( 'ip' => '198.51.100.0', 'utm_source' => 'news' ) );
		$grace = $this->partial( array( 'name' => 'Grace', 'age' => 85 ) );
		$this->submissions->complete( $grace->id(), array( 'status' => 'completed' ) );
		$spam = $this->partial( array( 'name' => '100% spam_bot' ), array( 'status' => 'spam' ) );
		$this->submissions->update( $spam->id(), array( 'status' => 'trash' ) );

		$ids = fn( array $filters ) => array_map( fn( Submission $s ) => $s->id(), $this->submissions->find( $filters )['items'] );

		$this->assertSame( array( $grace->id(), $ada->id() ), $ids( array( 'sort' => 'id' ) ) );
		$this->assertSame( array( $ada->id(), $grace->id() ), $ids( array( 'sort' => 'id', 'order' => 'asc' ) ) );
		$this->assertSame( 2, $this->submissions->find( array() )['total'] );
		$this->assertSame( array( $grace->id() ), $ids( array( 'status' => 'completed' ) ) );
		$this->assertSame( array( $spam->id() ), $ids( array( 'status' => array( 'trash' ) ) ) );
		$this->assertSame( array( $ada->id() ), $ids( array( 'search' => 'ad' ) ) );
		$this->assertSame( array( $ada->id() ), $ids( array( 'search' => '198.51' ) ) );
		$this->assertSame( array(), $ids( array( 'search' => '%' ) ) );
		$this->assertSame( array( $spam->id() ), $ids( array( 'search' => '0% s', 'status' => 'trash' ) ) );
		$this->assertSame( array( $ada->id() ), $ids( array( 'utmSource' => 'news' ) ) );
		$this->assertSame( array( $grace->id() ), $ids( array( 'fieldKey' => 'age', 'operator' => 'gt', 'value' => '50' ) ) );
		$this->assertSame( array( $ada->id() ), $ids( array( 'fieldKey' => 'name', 'operator' => 'eq', 'value' => 'Ada' ) ) );
		$this->assertSame( array( $grace->id() ), $ids( array( 'fieldKey' => 'name', 'operator' => 'starts_with', 'value' => 'Gr' ) ) );
		$this->assertSame( array( $grace->id() ), $ids( array( 'fieldKey' => 'color', 'operator' => 'is_empty' ) ) );
		$this->assertSame( array( $ada->id() ), $ids( array( 'fieldKey' => 'color', 'operator' => 'is_not_empty' ) ) );
		$this->assertSame( array( $grace->id() ), $ids( array( 'ids' => array( $grace->id() ) ) ) );
		$this->assertSame( array( $grace->id() ), $ids( array( 'afterId' => $ada->id() ) ) );
		$this->assertSame( array( $ada->id(), $grace->id() ), $ids( array( 'formId' => $this->form->id(), 'order' => 'asc' ) ) );
		$this->assertSame( array(), $ids( array( 'formId' => $this->form->id() + 1 ) ) );
		$this->assertSame( array( $grace->id(), $ada->id() ), $ids( array( 'from' => gmdate( 'Y-m-d' ), 'isRead' => 'false' ) ) );
		$page = $this->submissions->find( array( 'sort' => 'id' ), 2, 1 );
		$this->assertSame( 2, $page['total'] );
		$this->assertSame( $ada->id(), $page['items'][0]->id() );

		foreach ( array( array( 'unknown' => 1 ), array( 'status' => 'deleted' ), array( 'fieldKey' => 'Bad Key' ), array( 'fieldKey' => 'age', 'operator' => 'gt', 'value' => 'x' ), array( 'fieldKey' => 'age', 'operator' => 'regex' ), array( 'isRead' => 'maybe' ), array( 'ids' => array( 'x' ) ) ) as $filters ) {
			try {
				$this->submissions->find( $filters );
				$this->fail( 'Accepted invalid filters: ' . json_encode( $filters ) );
			} catch ( \InvalidArgumentException $e ) {
				$this->assertNotSame( '', $e->getMessage() );
			}
		}
	}

	#[DataProvider( 'invalidDates' )]
	public function testInvalidCalendarAndClockFiltersFailClosed( string $date ): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->submissions->where( array( 'from' => $date ) );
	}

	/** @return array<string,array{string}> */
	public static function invalidDates(): array {
		return array(
			'non-leap February' => array( '2025-02-29' ),
			'February rollover' => array( '2026-02-31' ),
			'April rollover'    => array( '2026-04-31T10:00:00Z' ),
			'clock rollover'    => array( '2026-01-01T24:00:00Z' ),
		);
	}

	public function testValidLeapDateAndOffsetDateKeepTheirUtcBounds(): void {
		$this->assertContains( '2024-02-29 00:00:00', $this->submissions->where( array( 'from' => '2024-02-29' ) )->getBindings() );
		$this->assertContains( '2024-02-29 23:59:59', $this->submissions->where( array( 'to' => '2024-02-29' ) )->getBindings() );
		$this->assertContains( '2026-01-01 00:00:00', $this->submissions->where( array( 'from' => '2026-01-01T07:00:00+07:00' ) )->getBindings() );
		config()->set( 'app.timezone', 'Asia/Jakarta' );
		$this->assertContains( '2024-02-28 17:00:00', $this->submissions->where( array( 'from' => '2024-02-29' ) )->getBindings() );
	}

	public function testUpdateReadStarStatusAndNotes(): void {
		$this->actingAs( $this->user( 5 ) );
		$submission = $this->partial( array( 'name' => 'Ada' ) );
		$this->submissions->complete( $submission->id(), array( 'status' => 'completed', 'completed_at' => Database::now() ) );

		$updated = $this->submissions->update(
			$submission->id(),
			array(
				'isRead'    => true,
				'isStarred' => true,
				'note'      => "<b>Call</b> back\nsoon",
			)
		);
		$this->assertTrue( $updated->admin()['isRead'] );
		$this->assertTrue( $updated->admin()['isStarred'] );
		$notes = $this->submissions->notes( $submission->id() );
		$this->assertSame( "Call back\nsoon", $notes[0]['message'] );
		$this->assertSame( 5, $notes[0]['userId'] );
		$this->assertSame( 'note', $notes[0]['kind'] );

		Database::query( 'sessions' )->insert(
			array(
				'public_id'     => '00000000-0000-4000-8000-0000000000aa',
				'resume_hash'   => str_repeat( 'a', 64 ),
				'form_id'       => $this->form->id(),
				'form_version'  => 1,
				'submission_id' => $submission->id(),
				'context'       => '{}',
				'started_at'    => Database::now(),
				'last_seen_at'  => Database::now(),
				'expires_at'    => Database::now(),
			)
		);
		$this->assertSame( 'spam', $this->submissions->update( $submission->id(), array( 'status' => 'spam' ) )->status() );
		$this->assertSame( 'closed', Database::query( 'sessions' )->value( 'status' ) );
		$this->assertSame( 'trash', $this->submissions->update( $submission->id(), array( 'status' => 'trash' ) )->status() );
		$this->assertSame( 'completed', Database::query( 'submissions' )->where( 'id', $submission->id() )->value( 'previous_status' ) );
		$this->assertSame( 'completed', $this->submissions->update( $submission->id(), array( 'status' => 'restore' ) )->status() );
		$this->assertNull( Database::query( 'submissions' )->where( 'id', $submission->id() )->value( 'previous_status' ) );

		// Rows without a remembered status fall back to their lifecycle timestamps.
		$abandoned = $this->partial( array(), array( 'status' => 'trash', 'abandoned_at' => Database::now() ) );
		$this->assertSame( 'abandoned', $this->submissions->update( $abandoned->id(), array( 'status' => 'restore' ) )->status() );

		$this->assertNull( $this->submissions->update( 999, array( 'isRead' => true ) ) );
	}

	public function testTrashAndPermanentDelete(): void {
		$submission = $this->partial( array( 'name' => 'Ada' ) );
		$this->submissions->update( $submission->id(), array( 'note' => 'Hi' ) );
		Database::query( 'sessions' )->insert(
			array(
				'public_id'     => '00000000-0000-4000-8000-0000000000bb',
				'resume_hash'   => str_repeat( 'b', 64 ),
				'form_id'       => $this->form->id(),
				'form_version'  => 1,
				'submission_id' => $submission->id(),
				'context'       => '{}',
				'started_at'    => Database::now(),
				'last_seen_at'  => Database::now(),
				'expires_at'    => Database::now(),
			)
		);

		$this->assertTrue( $this->submissions->delete( $submission->id(), false ) );
		$this->assertSame( 'trash', $this->submissions->get( $submission->id() )->status() );

		$this->assertTrue( $this->submissions->removeForRestart( $submission->id() ) );
		$this->assertNull( $this->submissions->get( $submission->id() ) );
		$this->assertNull( Database::query( 'sessions' )->value( 'submission_id' ) );
		$this->assertSame( 1, Database::query( 'sessions' )->count() );

		$other = $this->partial( array( 'name' => 'Grace' ) );
		Database::query( 'sessions' )->update( array( 'submission_id' => $other->id() ) );
		$this->assertTrue( $this->submissions->delete( $other->id() ) );
		$this->assertNull( $this->submissions->get( $other->id() ) );
		$this->assertSame( 0, Database::query( 'sessions' )->count() );
		$this->assertSame( 0, Database::query( 'submission_values' )->count() );
		$this->assertSame( 0, Database::query( 'submission_notes' )->count() );
		$this->assertFalse( $this->submissions->delete( $other->id() ) );
	}
}
