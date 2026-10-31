<?php
namespace ChatFlow\Laravel\Tests\Admin;

use ChatFlow\Laravel\Tests\TestCase;
use Illuminate\Support\Facades\Route;

final class SignInTest extends TestCase {
	public function test_guests_go_to_the_configured_sign_in(): void {
		config()->set( 'chatflow.admin.login_url', '/account/sign-in' );
		$this->get( '/chatflow/admin' )->assertRedirect( 'http://localhost/account/sign-in' );
	}

	public function test_guests_go_to_the_apps_login_route(): void {
		Route::get( '/login', static fn() => 'login' )->name( 'login' );
		Route::getRoutes()->refreshNameLookups();
		$this->get( '/chatflow/admin' )->assertRedirect( 'http://localhost/login' );
	}

	public function test_without_any_sign_in_page_guests_get_401_not_an_error(): void {
		$this->get( '/chatflow/admin' )->assertUnauthorized();
	}

	public function test_the_api_answers_guests_with_its_envelope(): void {
		$this->getJson( '/chatflow/admin/api/admin/forms' )->assertUnauthorized()->assertJsonPath( 'code', 'cff_unauthenticated' );
	}
}
