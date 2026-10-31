<?php
namespace ChatFlow\Laravel\Sunrice\Ai;

use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Submissions\Repository;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Admin\Ai\Tool;

#[IsReadOnly]
#[Description( 'One ChatFlow submission by id: its answers with each question\'s label, status, metadata and notes.' )]
final class GetSubmission extends Tool {
	protected string $name = 'chatflow_get_submission';

	public function handle( Request $request ): Response {
		if ( ! $this->can( 'chatflow.view-submissions' ) ) {
			return $this->denied( 'view submissions' );
		}
		$repository = new Repository();
		$submission = $repository->get( (int) $request->get( 'id' ) );
		if ( ! $submission ) {
			return Response::error( 'Submission not found.' );
		}
		$form   = ( new FormRepository() )->getVersion( $submission->formId(), $submission->formVersion() );
		$labels = array();
		foreach ( $form ? $form->schema()['steps'] : array() as $step ) {
			$labels[ $step['key'] ] = (string) ( $step['label'] ?? $step['key'] );
		}
		$data = $submission->admin();
		return $this->json(
			array(
				'id'        => $data['id'],
				'form'      => $form ? array( 'id' => $form->id(), 'title' => $form->title(), 'version' => $form->version() ) : null,
				'status'    => $data['status'],
				'createdAt' => $data['createdAt'],
				'answers'   => array_map( static fn( $key ) => array( 'key' => $key, 'question' => $labels[ $key ] ?? $key, 'answer' => $data['answers'][ $key ] ), array_keys( $data['answers'] ) ),
				'meta'      => $data['meta'],
				'notes'     => array_values( array_filter( $repository->notes( $submission->id() ), static fn( array $note ): bool => 'note' === $note['kind'] ) ),
			)
		);
	}

	public function schema( JsonSchema $schema ): array {
		return array( 'id' => $schema->integer()->min( 1 )->required() );
	}
}
