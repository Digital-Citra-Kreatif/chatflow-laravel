<?php
namespace ChatFlow\Laravel\Http\Controllers\Admin;

use ChatFlow\Laravel\Admin\Assets;
use ChatFlow\Laravel\Admin\Config;
use ChatFlow\Laravel\Admin\FormsList;
use ChatFlow\Laravel\Forms\FormRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Gate;

/**
 * Admin screens. One URL dispatching on ?page= like wp-admin/admin.php, so the
 * React apps keep their routing: cff-forms (list), cff-builder, cff-submissions.
 */
final class PageController extends Controller {
	private const PAGES = array(
		'cff-forms'       => array( 'forms', 'chatflow.manage-forms' ),
		'cff-builder'     => array( 'builder', 'chatflow.manage-forms' ),
		'cff-submissions' => array( 'submissions', 'chatflow.view-submissions' ),
	);

	public function __construct( private FormRepository $forms = new FormRepository() ) {}

	public function index( Request $request ): Response {
		$page = $request->query( 'page' );
		if ( null === $page || '' === $page ) {
			$page = Gate::allows( 'chatflow.manage-forms' ) || ! Gate::allows( 'chatflow.view-submissions' ) ? 'cff-forms' : 'cff-submissions';
		}
		if ( ! is_string( $page ) || ! isset( self::PAGES[ $page ] ) ) {
			abort( 404 );
		}
		[$screen, $ability] = self::PAGES[ $page ];
		if ( ! Gate::allows( $ability ) ) {
			abort( 403, __( 'You are not allowed to access this screen.' ) );
		}
		if ( 'builder' === $screen ) {
			$id = $request->query( 'formId' );
			if ( null !== $id && '' !== $id && ( ! Config::positiveInt( $id ) || ! $this->forms->getDraft( Config::positiveInt( $id ) ) ) ) {
				abort( 404, __( 'Form not found.' ) );
			}
		}
		$entry = 'submissions' === $screen ? 'submissions' : 'builder';
		$data  = array(
			'screen'  => $screen,
			'title'   => array(
				'forms'       => __( 'Forms' ),
				'builder'     => __( 'Form builder' ),
				'submissions' => __( 'Submissions' ),
			)[ $screen ],
			'config'  => Config::script( ( new Config( $this->forms ) )->build( $screen, $request ) ),
			'script'  => Assets::url( 'admin/' . $entry . '.js' ),
			'styles'  => array_values(
				array_filter(
					array(
						Assets::url( 'admin/admin-shim.css' ),
						Assets::url( 'admin/builder.css' ),
						'submissions' === $screen ? Assets::url( 'admin/submissions.css' ) : null,
					)
				)
			),
			'mount'   => 'forms' === $screen
				? 'window.CFFAdmin.builder.mountFormsList(document.getElementById("cff-forms-list"),window.cffAdmin);'
				: 'window.CFFAdmin.' . $entry . '.mount' . ucfirst( $entry ) . '(document.getElementById("cff-admin-root"),window.cffAdmin);',
			'nav'     => $this->nav( $page, $request ),
			'list'    => 'forms' === $screen ? ( new FormsList( $this->forms ) )->prepare( $request ) : null,
			'notice'  => $this->notice( $request ),
		);
		return response()
			->view( 'chatflow::admin.' . ( 'forms' === $screen ? 'forms' : 'app' ), $data )
			->header( 'Cache-Control', 'no-cache, must-revalidate, max-age=0, no-store, private' );
	}

	/** Restores a trashed form (POST from the trash view). */
	public function restore( int $id ): RedirectResponse {
		$this->trashed( $id );
		$result = $this->forms->restore( $id );
		return $this->backToTrash( $result instanceof \ChatFlow\Laravel\Forms\Form ? 'restored' : 'failed' );
	}

	/** Deletes a trashed form permanently; refused while it has submissions. */
	public function destroy( int $id ): RedirectResponse {
		$this->trashed( $id );
		$result = $this->forms->deleteForever( $id );
		if ( true === $result ) {
			return $this->backToTrash( 'deleted' );
		}
		return $this->backToTrash( 'cff_has_submissions' === $result->code() ? 'has_submissions' : 'failed' );
	}

	private function trashed( int $id ): void {
		if ( ! Gate::allows( 'chatflow.manage-forms' ) ) {
			abort( 403, __( 'You are not allowed to manage forms.' ) );
		}
		if ( 'trash' !== \ChatFlow\Laravel\Support\Database::query( 'forms' )->where( 'id', $id )->value( 'status' ) ) {
			abort( 404, __( 'Only trashed forms can be restored or deleted permanently.' ) );
		}
	}

	private function backToTrash( string $notice ): RedirectResponse {
		return redirect()->route(
			'chatflow.admin.index',
			array(
				'page'       => 'cff-forms',
				'status'     => 'trash',
				'cff_notice' => $notice,
			)
		);
	}

	/** @return array{string,string}|null */
	private function notice( Request $request ): ?array {
		$messages = array(
			'restored'        => array( 'success', __( 'Form restored.' ) ),
			'deleted'         => array( 'success', __( 'Form deleted permanently.' ) ),
			'has_submissions' => array( 'error', __( 'This form still has submissions. Delete them in Submissions before deleting the form permanently.' ) ),
			'failed'          => array( 'error', __( 'The form could not be changed. Please try again.' ) ),
		);
		$notice   = $request->query( 'cff_notice' );
		return is_string( $notice ) && isset( $messages[ $notice ] ) ? $messages[ $notice ] : null;
	}

	/** @return list<array{label:string,url:string,current:bool,badge?:int}> */
	private function nav( string $page, Request $request ): array {
		$nav = array();
		if ( Gate::allows( 'chatflow.manage-forms' ) ) {
			$nav[] = array(
				'label'   => __( 'Forms' ),
				'url'     => FormsList::url( array( 'page' => 'cff-forms' ) ),
				'current' => 'cff-forms' === $page,
			);
			$nav[] = array(
				'label'   => __( 'Add new form' ),
				'url'     => FormsList::url( array( 'page' => 'cff-builder' ) ),
				'current' => 'cff-builder' === $page && ! $request->query( 'formId' ),
			);
		}
		if ( Gate::allows( 'chatflow.view-submissions' ) ) {
			$nav[] = array(
				'label'   => __( 'Submissions' ),
				'url'     => FormsList::url( array( 'page' => 'cff-submissions' ) ),
				'current' => 'cff-submissions' === $page,
				'badge'   => FormsList::unread(),
			);
		}
		return $nav;
	}
}
