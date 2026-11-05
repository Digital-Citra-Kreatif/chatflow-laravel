<?php
namespace ChatFlow\Laravel\Tests\Core;

use ChatFlow\Laravel\ChatFlow;
use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Submissions\Ending;
use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Tests\TestCase;

final class EndingTest extends TestCase {
	use Fixtures;

	/** @param array<string,mixed> $settings */
	private function form( array $settings = array(), ?array $ending = null ): Form {
		$schema = self::schema();
		if ( $ending ) {
			$schema['endings'] = array( $ending );
		}
		return new Form( 1, 'Form', 'form', $schema, $settings, 1, 1, 'publish' );
	}

	public function testRedirectValidation(): void {
		$form = $this->form( array( 'completion' => array( 'allowedRedirectHosts' => array( 'Partner.example' ) ) ) );
		$this->assertSame( 'http://localhost/thanks?x=1', Ending::validateUrl( '/thanks?x=1', $form ) );
		$this->assertSame( 'http://localhost/done', Ending::validateUrl( 'http://localhost/done', $form ) );
		$this->assertSame( 'https://localhost/done', Ending::validateUrl( 'https://localhost/done', $form ) );
		$this->assertSame( 'https://partner.example/a', Ending::validateUrl( 'https://partner.example/a', $form ) );
		$this->assertSame( 'https://wa.me/123', Ending::validateUrl( 'https://wa.me/123', $form ) );
		$this->assertSame( 'https://api.whatsapp.com/send?phone=1', Ending::validateUrl( 'https://api.whatsapp.com/send?phone=1', $form ) );
		foreach ( array( '', '//evil.example/x', 'https://evil.example/', 'http://wa.me/123', 'http://partner.example/a', 'https://partner.example:8443/a', 'https://user:pass@localhost/', 'http://localhost:8080/', '/a\\b', '/a b', '/a%0d%0aSet-Cookie', 'javascript:alert(1)', 'https://localhost.evil.example/' ) as $url ) {
			$this->assertNull( Ending::validateUrl( $url, $form ), $url );
		}
		config()->set( 'app.url', 'https://localhost' );
		app( 'url' )->forceRootUrl( 'https://localhost' );
		app( 'url' )->forceScheme( 'https' );
		$this->assertNull( Ending::validateUrl( 'http://localhost/done', $form ) );
	}

	public function testBuildsRedirectWithQueryAndFilter(): void {
		$form       = $this->form(
			array(),
			array(
				'id'               => 'end_go',
				'type'             => 'redirect',
				'url'              => 'https://wa.me/123?text=hi#top',
				'appendQuery'      => true,
				'queryKeys'        => array( 'name', 'age' ),
				'appendSubmission' => true,
				'messages'         => array( 'Bye [{{name}}]' ),
			)
		);
		$submission = new Submission(
			array(
				'id'           => 9,
				'uuid'         => 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
				'form_id'      => 1,
				'form_version' => 1,
				'status'       => 'completed',
				'answers'      => json_encode( array( 'name' => 'A B*', 'age' => 3, 'color' => array( 'x' ) ) ),
				'meta'         => '{}',
				'ending_id'    => 'end_go',
			),
			$form
		);
		$result     = ( new Ending() )->build( $submission, $form, null );
		$this->assertSame( 'https://wa.me/123?text=hi&name=A%20B%2A&age=3&submission=aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa#top', $result['redirectUrl'] );
		$this->assertSame( array( 'Bye [A B\\*]' ), $result['ending']['messages'] );
		$this->assertSame( 0, $result['ending']['delayMs'] );

		ChatFlow::filter( 'redirect_url', fn( $url, $s, $f ) => 'https://evil.example/?u=' . $s->uuid() );
		$blocked = ( new Ending() )->build( $submission, $form, null );
		$this->assertSame( 'cff_unsafe_redirect', $blocked->code() );
		$this->assertSame( 422, $blocked->status() );

		$this->assertSame( 'cff_invalid_ending', ( new Ending() )->build( $submission, $form, 'missing' )->code() );
	}

	/** @param array<string,mixed> $answers */
	private function submission( Form $form, array $answers ): Submission {
		return new Submission(
			array(
				'id'           => 9,
				'uuid'         => 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
				'form_id'      => 1,
				'form_version' => 1,
				'status'       => 'completed',
				'answers'      => json_encode( $answers ),
				'meta'         => '{}',
				'ending_id'    => 'end_go',
			),
			$form
		);
	}

	/** A line break or a backslash in an answer is the visitor's text: it must not make the form impossible to finish. */
	public function testAnswersWithLineBreaksAndBackslashesReachTheUrl(): void {
		$form       = $this->form(
			array(),
			array(
				'id'          => 'end_go',
				'type'        => 'redirect',
				'url'         => 'https://wa.me/123?text={{name}}',
				'appendQuery' => true,
				'queryKeys'   => array( 'name' ),
				'messages'    => array(),
				'buttons'     => array(
					array( 'id' => 'b1', 'label' => 'Again', 'action' => 'link', 'url' => 'https://wa.me/123?text={{name}}' ),
				),
			)
		);
		$submission = $this->submission( $form, array( 'name' => "line 1\nC:\\temp" ) );
		$result     = ( new Ending() )->build( $submission, $form, null );
		$this->assertIsArray( $result );
		$this->assertSame( 'https://wa.me/123?text=line%201%0AC%3A%5Ctemp&name=line%201%0AC%3A%5Ctemp', $result['redirectUrl'] );
		$this->assertSame( 'https://wa.me/123?text=line%201%0AC%3A%5Ctemp', $result['ending']['buttons'][0]['url'] );
	}

	/** What the form's author wrote, and what a redirect_url hook adds, are still refused them. */
	public function testEncodedLineBreaksOutsideAnswersAreRefused(): void {
		$form = $this->form( array(), array( 'id' => 'end_go', 'type' => 'redirect', 'url' => 'https://wa.me/123?a=%0d%0aSet-Cookie:x&text={{name}}', 'messages' => array() ) );
		$this->assertSame( 'cff_unsafe_redirect', ( new Ending() )->build( $this->submission( $form, array( 'name' => 'A' ) ), $form, null )->code() );

		$form = $this->form(
			array(),
			array(
				'id'       => 'end_go',
				'type'     => 'redirect',
				'url'      => 'https://wa.me/123',
				'messages' => array(),
				'buttons'  => array( array( 'id' => 'b1', 'label' => 'Go', 'action' => 'link', 'url' => 'https://wa.me/1?a=%5c' ) ),
			)
		);
		$this->assertSame( 'cff_unsafe_url', ( new Ending() )->build( $this->submission( $form, array( 'name' => 'A' ) ), $form, null )->code() );

		$form = $this->form( array(), array( 'id' => 'end_go', 'type' => 'redirect', 'url' => 'https://wa.me/123?text={{name}}', 'messages' => array() ) );
		ChatFlow::filter( 'redirect_url', fn( $url ) => $url . '&x=%0aSet-Cookie' );
		$this->assertSame( 'cff_unsafe_redirect', ( new Ending() )->build( $this->submission( $form, array( 'name' => "a\nb" ) ), $form, null )->code() );
	}

	public function testAddQueryArgsReplacesExistingKeys(): void {
		$this->assertSame( '/p?keep=1&a=2', Ending::addQueryArgs( array( 'a' => 2 ), '/p?a=1&keep=1' ) );
		$this->assertSame( '/p?keep=1&t=1', Ending::addQueryArgs( array( 'a' => false, 't' => true, 'n' => null ), '/p?a=1&keep=1' ) );
		$this->assertSame( '?x=y', Ending::addQueryArgs( array( 'x' => 'y' ), '' ) );
	}
}
