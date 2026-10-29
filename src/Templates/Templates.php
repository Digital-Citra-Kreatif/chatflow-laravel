<?php
namespace ChatFlow\Laravel\Templates;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;

final class Templates {
	public function __construct( private FormRepository $forms = new FormRepository() ) {}

	/** @return list<array{id:string,title:string,description:string,locale:string}> */
	public static function catalog(): array {
		return array(
			array(
				'id'          => 'imajiner-survey',
				// Proper name of the bundled Indonesian template; kept identical to Imajiner::definition().
				'title'       => 'Survei Website Imajiner',
				'description' => __( 'Qualify website project inquiries, with conditional questions.' ),
				'locale'      => 'id_ID',
			),
			array(
				'id'          => 'contact-request',
				'title'       => Starter::contact()['title'],
				'description' => __( 'Collect a name, email address, topic, message, and permission to reply.' ),
				'locale'      => 'en_US',
			),
			array(
				'id'          => 'customer-feedback',
				'title'       => Starter::feedback()['title'],
				'description' => __( 'Gather experience ratings, suggestions, and recommendation intent without contact details.' ),
				'locale'      => 'en_US',
			),
			...array_map(
				static fn( array $item ): array => array(
					'id'          => $item['slug'],
					'title'       => $item['title'],
					'description' => $item['description'],
					'locale'      => 'en_US',
				),
				array_values( array_filter( Starter::gallery(), static fn( array $item ): bool => 'blank' !== $item['slug'] ) )
			),
		);
	}

	/** @return array{title:string,schema:array<string,mixed>,settings:array<string,mixed>}|Error */
	public static function definition( string $id ): array|Error {
		return match ( $id ) {
			'imajiner-survey'   => Imajiner::definition(),
			'contact-request'   => Starter::contact(),
			'customer-feedback' => Starter::feedback(),
			default             => in_array( $id, array_column( self::catalog(), 'id' ), true ) ? Starter::definition( $id ) : Database::error( 'cff_template_not_found', 'Unknown template.', 404 ),
		};
	}

	public function create( string $id = 'imajiner-survey' ): Form|Error {
		$template = self::definition( $id );
		if ( Error::is( $template ) ) {
			return $template;
		}
		return $this->forms->create( $template['title'], $template['schema'], $template['settings'] );
	}
}
