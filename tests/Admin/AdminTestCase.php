<?php
namespace ChatFlow\Laravel\Tests\Admin;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Submissions\Repository;
use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Tests\Core\Fixtures;
use ChatFlow\Laravel\Tests\TestCase;
use Illuminate\Foundation\Auth\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Testing\TestResponse;

abstract class AdminTestCase extends TestCase {
	use Fixtures;

	protected const API = '/chatflow/admin/api/admin/';
	protected const TOKEN = 'test-csrf-token';

	protected function defineEnvironment( $app ): void {
		parent::defineEnvironment( $app );
		$app['config']->set( 'auth.providers.users.model', User::class );
	}

	protected function setUp(): void {
		parent::setUp();
		if ( ! Schema::hasTable( 'users' ) ) {
			Schema::create(
				'users',
				static function ( Blueprint $table ): void {
					$table->id();
					$table->string( 'name' );
					$table->string( 'email' )->unique();
					$table->string( 'password' );
					$table->rememberToken();
					$table->timestamps();
				}
			);
		}
		Gate::define( 'viewChatFlow', static fn( $user = null ): bool => null !== $user && 'admin@example.org' === $user->email );
	}

	protected function admin(): User {
		return $this->makeUser( 'admin@example.org' );
	}

	protected function makeUser( string $email ): User {
		$user = ( new User() )->forceFill(
			array(
				'name'     => 'User',
				'email'    => $email,
				'password' => 'secret',
			)
		);
		$user->save();
		return $user;
	}

	/** Signs in as $user (an admin by default) with a known CSRF token in the session. */
	protected function signIn( ?User $user = null ): User {
		$user ??= $this->admin();
		$this->actingAs( $user )->withSession( array( '_token' => self::TOKEN ) );
		return $user;
	}

	/** @param array<string,mixed>|null $body */
	protected function api( string $method, string $path, ?array $body = null, array $headers = array() ): TestResponse {
		return $this->json( $method, self::API . $path, $body ?? array(), array_merge( array( 'X-CSRF-TOKEN' => self::TOKEN ), $headers ) );
	}

	/** @param array<string,mixed> $settings */
	protected function published( array $settings = array(), string $title = 'Contact form' ): Form {
		$repository = new FormRepository();
		$form       = $repository->create( $title, self::emailSchema(), array_replace_recursive( array( 'completion' => array( 'defaultEndingId' => 'end_thanks' ) ), $settings ) );
		$this->assertInstanceOf( Form::class, $form, is_object( $form ) && method_exists( $form, 'message' ) ? $form->message() . json_encode( $form->data() ) : '' );
		$form = $repository->publish( $form->id(), $form->draftRevision() );
		$this->assertInstanceOf( Form::class, $form, is_object( $form ) && method_exists( $form, 'message' ) ? $form->message() . json_encode( $form->data() ) : '' );
		return $form;
	}

	/** @return array<string,mixed> */
	protected static function emailSchema(): array {
		$schema            = self::schema();
		$schema['steps'][] = array(
			'id'       => 'step_email',
			'key'      => 'email',
			'type'     => 'email',
			'label'    => 'Email',
			'messages' => array( 'Your email?' ),
		);
		return $schema;
	}

	/** @param array<string,mixed> $answers */
	protected function submission( Form $form, array $answers = array(), string $status = 'completed' ): Submission {
		$answers += array(
			'name'  => 'Ada',
			'age'   => 36,
			'color' => 'red',
			'email' => 'ada@example.org',
		);
		return ( new Repository() )->savePartial(
			array(
				'form_id'      => $form->id(),
				'form_version' => $form->version(),
				'status'       => $status,
				'answers'      => $answers,
				'completed_at' => 'completed' === $status ? gmdate( 'Y-m-d H:i:s' ) : null,
			)
		);
	}
}
