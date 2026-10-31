<?php
namespace ChatFlow\Laravel\Sunrice\Ai;

use ChatFlow\Laravel\Submissions\Repository;
use ChatFlow\Laravel\Submissions\Submission;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Admin\Ai\Tool;

#[IsReadOnly]
#[Description( 'List ChatFlow submissions, newest first, with their answers. Optional: formId, status (completed, partial, abandoned, spam, trash; default completed), search (in answers), from and to (YYYY-MM-DD), page.' )]
final class ListSubmissions extends Tool {
	protected string $name = 'chatflow_list_submissions';

	public function handle( Request $request ): Response {
		if ( ! $this->can( 'chatflow.view-submissions' ) ) {
			return $this->denied( 'view submissions' );
		}
		$filters = array_filter(
			array(
				'formId' => $request->get( 'formId' ),
				'status' => $request->get( 'status', 'completed' ),
				'search' => $request->get( 'search' ),
				'from'   => $request->get( 'from' ),
				'to'     => $request->get( 'to' ),
			),
			static fn( $value ): bool => null !== $value && '' !== $value
		);
		try {
			$result = ( new Repository() )->find( $filters, max( 1, (int) $request->get( 'page', 1 ) ), 25 );
		} catch ( \InvalidArgumentException $error ) {
			return Response::error( $error->getMessage() );
		}
		return $this->json(
			array(
				'total'       => $result['total'],
				'submissions' => array_map( static fn( Submission $submission ): array => array_intersect_key( $submission->admin(), array_flip( array( 'id', 'formId', 'formVersion', 'status', 'answers', 'createdAt', 'isRead', 'isStarred', 'progress' ) ) ), $result['items'] ),
			)
		);
	}

	public function schema( JsonSchema $schema ): array {
		return array(
			'formId' => $schema->integer()->min( 1 ),
			'status' => $schema->string()->enum( array( 'completed', 'partial', 'abandoned', 'spam', 'trash' ) ),
			'search' => $schema->string(),
			'from'   => $schema->string(),
			'to'     => $schema->string(),
			'page'   => $schema->integer()->min( 1 ),
		);
	}
}
