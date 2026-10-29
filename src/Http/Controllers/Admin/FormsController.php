<?php
namespace ChatFlow\Laravel\Http\Controllers\Admin;

use ChatFlow\Laravel\Forms\EditLock;
use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\Statistics;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Templates\Templates;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Builder endpoints: forms CRUD, edit lock, publish, duplicate, templates and pickers. */
final class FormsController extends ApiController {
	public function index( Request $request ): array {
		[$page, $per] = $this->pagination( $request );
		$search       = $request->query( 'search' );
		$result       = $this->forms->paginate(
			array(
				'page'    => $page,
				'perPage' => $per,
				'search'  => is_string( $search ) ? mb_substr( strip_tags( $search ), 0, 200 ) : '',
			)
		);
		return array(
			'items'   => array_map(
				static function ( Form $form ): array {
					$item               = $form->toArray();
					$item['statistics'] = Statistics::get( $form->id() );
					return $item;
				},
				$result['items']
			),
			'total'   => $result['total'],
			'page'    => $page,
			'perPage' => $per,
		);
	}

	public function store( Request $request ): JsonResponse {
		$body = $this->body( $request );
		return $this->respond( $this->forms->create( (string) ( $body['title'] ?? '' ), $body['schema'] ?? array(), $body['settings'] ?? array() ), 201 );
	}

	public function show( int $id ): Form|Error {
		return $this->forms->getDraft( $id ) ?? $this->notFound( 'Form not found.' );
	}

	public function published( int $id ): Form|Error {
		return $this->forms->getPublished( $id ) ?? $this->notFound( 'Published form not found.' );
	}

	public function lock( int $id ): bool|Error {
		return EditLock::acquire( $id );
	}

	public function update( Request $request, int $id ): Form|Error {
		$lock = EditLock::acquire( $id );
		if ( Error::is( $lock ) ) {
			return $lock;
		}
		$body = $this->body( $request );
		return $this->forms->saveDraft( $id, $body['schema'] ?? array(), $body['settings'] ?? array(), (int) ( $body['draftRevision'] ?? 0 ), isset( $body['title'] ) ? (string) $body['title'] : null );
	}

	public function publish( Request $request, int $id ): Form|Error {
		$lock = EditLock::acquire( $id );
		if ( Error::is( $lock ) ) {
			return $lock;
		}
		return $this->forms->publish( $id, (int) ( $this->body( $request )['draftRevision'] ?? 0 ) );
	}

	public function destroy( int $id ): array|Error {
		if ( ! $this->forms->getDraft( $id ) ) {
			return $this->notFound( 'Form not found.' );
		}
		$result = $this->forms->trash( $id );
		return Error::is( $result ) ? $result : array( 'deleted' => true );
	}

	public function duplicate( int $id ): JsonResponse {
		return $this->respond( $this->forms->duplicate( $id ), 201 );
	}

	public function templates(): array {
		return array( 'items' => Templates::catalog() );
	}

	public function template( string $slug ): array|Error {
		return Templates::definition( $slug );
	}

	public function createFromTemplate( string $slug ): JsonResponse {
		return $this->respond( ( new Templates( $this->forms ) )->create( $slug ), 201 );
	}

	/** Page targeting is not available in this version. */
	public function pages(): array {
		return array( 'items' => array() );
	}

	/** Forms for the inbox/analytics form picker: 100 per page, newest first. */
	public function pickerForms( Request $request ): array {
		$page   = max( 1, min( 100000, self::int( $request->query( 'page' ), 1 ) ) );
		$search = $request->query( 'search' );
		$query  = Database::query( 'forms' )->whereIn( 'status', array( 'draft', 'publish' ) );
		if ( is_string( $search ) && '' !== trim( $search ) ) {
			$query->whereRaw( "title LIKE ? ESCAPE '!'", array( '%' . \ChatFlow\Laravel\Forms\FormRepository::escapeLike( trim( mb_substr( $search, 0, 200 ) ) ) . '%' ) );
		}
		$total = ( clone $query )->count();
		$items = $query->orderByDesc( 'id' )->forPage( $page, 100 )->get( array( 'id', 'title' ) );
		return array(
			'items' => array_map(
				static fn( object $row ): array => array(
					'id'    => (int) $row->id,
					'title' => (string) $row->title,
				),
				$items->all()
			),
			'pages' => (int) ceil( $total / 100 ),
		);
	}

	/** Forms for the export picker, by title; ?id= resolves one form. */
	public function exportForms( Request $request ): array {
		[$page, $per] = $this->pagination( $request );
		$id           = self::int( $request->query( 'id' ) );
		$query        = Database::query( 'forms' )->whereIn( 'status', array( 'draft', 'publish' ) );
		if ( $id ) {
			$query->where( 'id', $id );
		}
		$total = ( clone $query )->count();
		$rows  = $query->orderBy( 'title' )->orderBy( 'id' )->forPage( $id ? 1 : $page, $id ? 1 : $per )->get( array( 'id', 'title' ) );
		return array(
			'items'   => array_map(
				static fn( object $row ): array => array(
					'id'    => (int) $row->id,
					'title' => (string) $row->title,
				),
				$rows->all()
			),
			'total'   => $total,
			'page'    => $page,
			'perPage' => $per,
		);
	}
}
