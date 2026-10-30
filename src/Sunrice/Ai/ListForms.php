<?php
namespace ChatFlow\Laravel\Sunrice\Ai;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Forms\Statistics;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Admin\Ai\Tool;

#[IsReadOnly]
#[Description( 'List ChatFlow forms (conversational forms) with their status, live version and submission counts. Optional: search (title), status (draft, publish, trash), page.' )]
final class ListForms extends Tool {
	protected string $name = 'chatflow_list_forms';

	public function handle( Request $request ): Response {
		if ( ! $this->can( 'chatflow.manage-forms' ) ) {
			return $this->denied( 'list forms' );
		}
		$status = (string) $request->get( 'status', '' );
		$result = ( new FormRepository() )->paginate(
			array(
				'page'    => max( 1, (int) $request->get( 'page', 1 ) ),
				'perPage' => 50,
				'search'  => mb_substr( (string) $request->get( 'search', '' ), 0, 200 ),
				'status'  => in_array( $status, array( 'draft', 'publish', 'trash' ), true ) ? $status : '',
			)
		);
		return $this->json(
			array(
				'total' => $result['total'],
				'forms' => array_map(
					static fn( Form $form ): array => array(
						'id'      => $form->id(),
						'title'   => $form->title(),
						'status'  => $form->status(),
						'version' => $form->version(),
						'slug'    => $form->slug(),
					) + Statistics::get( $form->id() ),
					$result['items']
				),
			)
		);
	}

	public function schema( JsonSchema $schema ): array {
		return array(
			'search' => $schema->string(),
			'status' => $schema->string()->enum( array( 'draft', 'publish', 'trash' ) ),
			'page'   => $schema->integer()->min( 1 ),
		);
	}
}
