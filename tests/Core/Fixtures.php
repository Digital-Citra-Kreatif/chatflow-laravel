<?php
namespace ChatFlow\Laravel\Tests\Core;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use Illuminate\Foundation\Auth\User;

trait Fixtures {
	/** @return array<string,mixed> */
	protected static function schema(): array {
		return array(
			'schemaVersion' => 1,
			'bot'           => array( 'name' => 'Bot' ),
			'steps'         => array(
				array(
					'id'       => 'step_name',
					'key'      => 'name',
					'type'     => 'short_text',
					'label'    => 'Name',
					'messages' => array( 'Your name?' ),
					'required' => true,
				),
				array(
					'id'       => 'step_age',
					'key'      => 'age',
					'type'     => 'number',
					'label'    => 'Age',
					'messages' => array( 'Your age?' ),
				),
				array(
					'id'       => 'step_color',
					'key'      => 'color',
					'type'     => 'single_choice',
					'label'    => 'Color',
					'messages' => array( 'Favourite color?' ),
					'options'  => array(
						array(
							'id'    => 'opt_red',
							'value' => 'red',
							'label' => 'Red',
						),
						array(
							'id'    => 'opt_blue',
							'value' => 'blue',
							'label' => 'Blue',
						),
					),
				),
			),
			'endings'       => array(
				array(
					'id'       => 'end_thanks',
					'type'     => 'message',
					'messages' => array( 'Thanks {{name}}' ),
				),
			),
		);
	}

	protected function publishedForm( string $title = 'Contact form' ): Form {
		$repository = new FormRepository();
		$form       = $repository->create( $title, self::schema(), array( 'completion' => array( 'defaultEndingId' => 'end_thanks' ) ) );
		$this->assertInstanceOf( Form::class, $form );
		$form = $repository->publish( $form->id(), $form->draftRevision() );
		$this->assertInstanceOf( Form::class, $form );
		return $form;
	}

	protected function user( int $id ): User {
		return ( new User() )->forceFill( array( 'id' => $id ) );
	}
}
