<?php
namespace ChatFlow\Laravel\Tests\Sunrice;

use ChatFlow\Laravel\Spam\RateLimiter;
use ChatFlow\Laravel\Sunrice\ChatFlowSettings;
use ChatFlow\Laravel\Support\Settings;

final class SettingsTest extends SunriceTestCase {
	public function test_empty_fields_follow_the_config_file(): void {
		config()->set( 'chatflow.defaults.privacy.ip', 'none' );
		config()->set( 'chatflow.defaults.retention', array( 'enabled' => true, 'days' => 90 ) );
		$settings = Settings::get();
		$this->assertSame( 'none', $settings['privacy']['ip'] );
		$this->assertTrue( $settings['retention']['enabled'] );
		$this->assertSame( 90, $settings['retention']['days'] );
	}

	public function test_saved_values_override_the_config_file(): void {
		config()->set( 'chatflow.defaults.privacy.ip', 'none' );
		config()->set( 'chatflow.defaults.email.fromName', 'Config name' );
		app( ChatFlowSettings::class )->fill(
			array(
				'privacyIp'        => 'full',
				'storeUserAgent'   => 'on',
				'respectDnt'       => 'off',
				'retentionEnabled' => 'on',
				'retentionDays'    => '30',
				'fromName'         => '  ',
				'startLimit'       => '900',
			)
		)->save();
		$settings = Settings::get();
		$this->assertSame( 'full', $settings['privacy']['ip'] );
		$this->assertTrue( $settings['privacy']['storeUserAgent'] );
		$this->assertFalse( $settings['privacy']['respectDnt'] );
		$this->assertTrue( $settings['retention']['enabled'] );
		$this->assertSame( 30, $settings['retention']['days'] );
		$this->assertSame( 900, $settings['spam']['startLimit'] );
		$this->assertSame( 900, RateLimiter::startLimit() );
		// Blank text keeps the config's value; untouched fields too.
		$this->assertSame( 'Config name', $settings['email']['fromName'] );
		$this->assertTrue( $settings['privacy']['storeMeta'] );
		$this->assertSame( 'none', Settings::fromConfig()['privacy']['ip'] );
	}

	public function test_the_settings_page_saves_through_the_panel(): void {
		$admin = $this->admin( 'chatflow.settings.chatflow' );
		$this->actingAs( $admin )->get( '/admin/settings/chatflow' )->assertOk();
		$this->actingAs( $admin )->withSession( array( '_token' => 't' ) )
			->put( '/admin/settings/chatflow', array( '_token' => 't', 'defaultTheme' => 'dark', 'minSeconds' => 5 ) )
			->assertSessionHasNoErrors();
		$this->assertSame( 'dark', Settings::get()['defaultTheme'] );
		$this->assertSame( 5, Settings::get()['spam']['minSeconds'] );
		// The builder shows them as the inherited defaults.
		$this->actingAs( $this->admin( 'chatflow.manage-forms' ) )->get( '/admin/chatflow/forms/create' )
			->assertInertia( fn( $page ) => $page->where( 'config.defaults.appearance.theme', 'dark' )->where( 'config.defaults.spam.minSeconds', 5 ) );
		$this->actingAs( $this->admin( 'chatflow.manage-forms' ) )->get( '/admin/settings/chatflow' )->assertForbidden();
	}
}
