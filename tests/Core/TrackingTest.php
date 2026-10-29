<?php
namespace ChatFlow\Laravel\Tests\Core;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Integrations\Payload;
use ChatFlow\Laravel\Spam\Protection;
use ChatFlow\Laravel\Support\Secret;
use ChatFlow\Laravel\Tracking\IpResolver;
use ChatFlow\Laravel\Tracking\Metadata;
use ChatFlow\Laravel\Tests\TestCase;

final class TrackingTest extends TestCase {
	use Fixtures;

	private function form( array $settings = array() ): Form {
		$schema            = self::schema();
		$schema['steps'][] = array(
			'id'       => 'step_src',
			'key'      => 'src',
			'type'     => 'hidden',
			'label'    => 'Source',
			'messages' => array(),
			'settings' => array(
				'source'    => 'cookie',
				'sourceKey' => 'utm_source',
			),
		);
		$schema['steps'][] = array(
			'id'       => 'step_ref',
			'key'      => 'ref',
			'type'     => 'hidden',
			'label'    => 'Ref',
			'messages' => array(),
			'settings' => array( 'source' => 'url' ),
		);
		return new Form( 1, 'Form', 'form', $schema, $settings, 1, 1, 'publish' );
	}

	public function testMetadataValidationCollectionAndContext(): void {
		$metadata = new Metadata();
		$this->assertSame( 'cff_invalid_meta', $metadata->validate( array( 'secret' => 1 ) )->code() );
		$this->assertSame( 'cff_invalid_meta', $metadata->validate( array( 'pageUrl' => 'javascript:alert(1)' ) )->code() );
		$valid = $metadata->validate(
			array(
				'pageUrl'  => 'https://site.test/p?ref=abc',
				'utm'      => array( 'source' => ' <b>news</b>  %41letter ' ),
				'timezone' => 'Asia/Jakarta',
			)
		);
		$this->assertSame( 'news letter', $valid['utm']['source'] );

		$this->actingAs( $this->user( 4 ) );
		$meta = $metadata->collect(
			$this->form(),
			$valid,
			array(
				'REMOTE_ADDR'          => '127.0.0.1',
				'HTTP_X_FORWARDED_FOR' => '203.0.113.77',
			)
		);
		$this->assertSame( '203.0.113.0', $meta['ip'] );
		$this->assertSame( 4, $meta['user_id'] );
		$this->assertArrayNotHasKey( 'user_agent', $meta );
		$this->assertSame( array(), $metadata->collect( $this->form(), $valid, array( 'REMOTE_ADDR' => '1.1.1.1', 'HTTP_DNT' => '1' ) ) );

		$withAgent = $metadata->collect( $this->form( array( 'privacy' => array( 'storeUserAgent' => true, 'ip' => 'full' ) ) ), array(), array( 'REMOTE_ADDR' => '1.1.1.1', 'HTTP_USER_AGENT' => 'Mozilla/5.0 (iPhone) Mobile Safari' ) );
		$this->assertSame( 'mobile', $withAgent['device_type'] );

		$context = $metadata->context( $this->form(), $meta, array( 'utm_source' => 'cookie-news' ) );
		$this->assertSame( 'cookie-news', $context['hidden']['src'] );
		$this->assertSame( 'abc', $context['hidden']['ref'] );
		$this->assertSame( 'news letter', $context['meta']['utm_source'] );
	}

	public function testIpResolverTrustsCloudflareOnlyFromItsRanges(): void {
		$resolver = new IpResolver();
		$this->assertSame( '198.51.100.9', $resolver->resolve( array( 'REMOTE_ADDR' => '173.245.48.1', 'HTTP_CF_CONNECTING_IP' => '198.51.100.9' ) ) );
		$this->assertSame( '8.8.8.8', $resolver->resolve( array( 'REMOTE_ADDR' => '8.8.8.8', 'HTTP_CF_CONNECTING_IP' => '198.51.100.9' ) ) );
		$this->assertSame( '8.8.8.8', $resolver->resolve( array( 'REMOTE_ADDR' => '8.8.8.8', 'HTTP_X_FORWARDED_FOR' => '1.2.3.4' ), array( 'mode' => 'direct' ) ) );
	}

	public function testProtectionReasons(): void {
		$protection = new Protection();
		$this->assertSame( array(), $protection->reasons( $this->form(), array(), time() - 10 ) );
		$this->assertSame( array( 'honeypot', 'time_trap' ), $protection->reasons( $this->form(), array( 'honeypot' => 'x' ), time() ) );
		$this->assertSame( array(), $protection->reasons( $this->form( array( 'spam' => array( 'honeypotEnabled' => false, 'minSeconds' => 0 ) ) ), array( 'honeypot' => 'x' ), time() ) );
	}

	public function testPayloadMetaHelpersAndSecret(): void {
		$this->assertSame( '2001:db8:1:2::', Payload::anonymizeIp( '2001:db8:1:2:3:4:5:6' ) );
		$this->assertSame( 'https://site.test/a', Payload::publicUrl( 'https://site.test/a?token=x' ) );
		$meta = Payload::meta( array( 'ip' => '203.0.113.7', 'pageUrl' => 'https://site.test/p?q=1', 'custom_tier' => 'gold', 'custom_token' => 'x' ), $this->form() );
		$this->assertSame(
			array(
				'page_url'    => 'https://site.test/p',
				'ip'          => '203.0.113.0',
				'custom_tier' => 'gold',
			),
			$meta
		);

		$this->assertSame( str_repeat( 'k', 32 ), Secret::key() );
		config()->set( 'chatflow.secret', 'my-own-secret' );
		$this->assertSame( 'my-own-secret', Secret::key() );
		$this->assertSame( hash_hmac( 'sha256', 'p', 'my-own-secret', true ), Secret::derive( 'p' ) );
	}
}
