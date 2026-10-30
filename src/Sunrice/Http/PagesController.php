<?php
namespace ChatFlow\Laravel\Sunrice\Http;

use ChatFlow\Laravel\Admin\Config;
use ChatFlow\Laravel\Admin\FormsList;
use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Forms\Statistics;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Templates\Templates;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Admin\Panel;

/**
 * The ChatFlow pages inside the Sunrice panel. Pages get their first data here;
 * the builder and the inbox then use the admin JSON API, as in the standalone admin.
 * Each route is guarded by its ability in routes/sunrice.php.
 */
final class PagesController extends Controller {
	public const PER_PAGE = 20;

	public function __construct( private FormRepository $forms = new FormRepository() ) {}

	public function forms( Request $request ): Response {
		$status = FormsList::status( $request );
		$search = mb_substr( trim( is_string( $request->query( 'search' ) ) ? strip_tags( $request->query( 'search' ) ) : '' ), 0, 200 );
		$sort   = 'title' === $request->query( 'sort' ) ? 'title' : 'updated_at';
		$order  = 'asc' === $request->query( 'order' ) ? 'asc' : 'desc';
		$page   = max( 1, Config::positiveInt( $request->query( 'page' ) ) );
		$result = $this->forms->paginate(
			array(
				'page'    => $page,
				'perPage' => self::PER_PAGE,
				'search'  => $search,
				'status'  => $status,
				'orderby' => $sort,
				'order'   => $order,
			)
		);
		$counts = array();
		foreach ( Database::query( 'forms' )->selectRaw( 'status, COUNT(*) as total' )->groupBy( 'status' )->pluck( 'total', 'status' ) as $key => $total ) {
			$counts[ (string) $key ] = (int) $total;
		}
		return Inertia::render(
			'ChatFlow/Forms/Index',
			array(
				'forms'   => array(
					'data'  => array_map( static fn( Form $form ): array => self::formItem( $form ), $result['items'] ),
					'total' => $result['total'],
					'page'  => $page,
					'pages' => max( 1, (int) ceil( $result['total'] / self::PER_PAGE ) ),
				),
				'filters' => array(
					'status' => $status,
					'search' => $search,
					'sort'   => $sort,
					'order'  => $order,
				),
				'counts'  => array(
					'all'     => ( $counts['draft'] ?? 0 ) + ( $counts['publish'] ?? 0 ),
					'draft'   => $counts['draft'] ?? 0,
					'publish' => $counts['publish'] ?? 0,
					'trash'   => $counts['trash'] ?? 0,
				),
				'config'  => self::config( 'forms', $request ),
			)
		);
	}

	public function create( Request $request ): Response {
		return Inertia::render(
			'ChatFlow/Forms/Create',
			array(
				'templates' => Templates::catalog(),
				'config'    => self::config( 'builder', $request ),
			)
		);
	}

	public function builder( Request $request, int $id ): Response {
		$form = $this->forms->getDraft( $id );
		if ( ! $form || 'trash' === $form->status() ) {
			abort( 404 );
		}
		$config           = self::config( 'builder', $request );
		$config['formId'] = $id;
		return Inertia::render(
			'ChatFlow/Builder',
			array(
				'formId' => $id,
				'title'  => $form->title(),
				'config' => $config,
			)
		);
	}

	public function submissions( Request $request ): Response {
		return Inertia::render( 'ChatFlow/Submissions/Index', array( 'config' => self::config( 'submissions', $request ) ) );
	}

	public function submission( Request $request, int $id ): Response {
		if ( ! Database::query( 'submissions' )->where( 'id', $id )->exists() ) {
			abort( 404 );
		}
		return Inertia::render(
			'ChatFlow/Submissions/Show',
			array(
				'submissionId' => $id,
				'config'       => self::config( 'submissions', $request ),
			)
		);
	}

	public function duplicate( int $id ): RedirectResponse {
		$this->existing( $id );
		$copy = $this->forms->duplicate( $id );
		return $copy instanceof Form
			? redirect()->route( 'sunrice.admin.chatflow.forms.edit', array( 'id' => $copy->id() ) )->with( 'success', __( 'Form duplicated.' ) )
			: $this->failed( $copy );
	}

	public function trash( int $id ): RedirectResponse {
		$this->existing( $id );
		$result = $this->forms->trash( $id );
		return true === $result
			? back()->with( 'success', __( 'Moved to the trash.' ) )->with(
				'success_action',
				array(
					'label' => __( 'Undo' ),
					'url'   => route( 'sunrice.admin.chatflow.forms.restore', array( 'id' => $id ) ),
				)
			)
			: $this->failed( $result );
	}

	public function restore( int $id ): RedirectResponse {
		$this->existing( $id );
		$result = $this->forms->restore( $id );
		return $result instanceof Form ? back()->with( 'success', __( 'Form restored.' ) ) : $this->failed( $result );
	}

	public function destroy( int $id ): RedirectResponse {
		if ( 'trash' !== $this->existing( $id ) ) {
			abort( 404 );
		}
		$result = $this->forms->deleteForever( $id );
		if ( true === $result ) {
			return back()->with( 'success', __( 'Form deleted permanently.' ) );
		}
		return 'cff_has_submissions' === $result->code()
			? back()->with( 'error', __( 'This form still has submissions. Delete them in Submissions before deleting the form permanently.' ) )
			: $this->failed( $result );
	}

	/**
	 * The admin config the React pages share with the standalone admin (window.cffAdmin),
	 * pointing at the API mounted under the panel.
	 *
	 * @return array<string,mixed>
	 */
	public static function config( string $screen, Request $request ): array {
		$config = ( new Config() )->build( $screen, $request );
		unset( $config['formId'], $config['exportId'], $config['preview'] );
		$config['restUrl']  = url( trim( app( Panel::class )->getPath(), '/' ) . '/chatflow/api' ) . '/';
		$config['adminUrl'] = route( 'sunrice.admin.chatflow.forms.index' );
		$config['nonce']    = csrf_token();
		return $config;
	}

	/** @return array<string,mixed> */
	public static function formItem( Form $form ): array {
		$base = trim( (string) ( config( 'chatflow.fullpage_base' ) ?? '' ), '/' );
		$slug = $form->slug();
		return array_merge(
			array(
				'id'        => $form->id(),
				'name'      => $form->title(),
				'status'    => $form->status(),
				'version'   => $form->version(),
				'embed'     => FormsList::embed( $form ),
				'shareUrl'  => 'publish' === $form->status() && '' !== $base && '' !== $slug ? url( $base . '/' . $slug ) . '/' : null,
			),
			Statistics::get( $form->id() )
		);
	}

	/** The form's status; 404 when there is no such form. */
	private function existing( int $id ): string {
		$status = Database::query( 'forms' )->where( 'id', $id )->value( 'status' );
		if ( ! is_string( $status ) ) {
			abort( 404 );
		}
		return $status;
	}

	private function failed( mixed $result ): RedirectResponse {
		return back()->with( 'error', Error::is( $result ) ? $result->message() : __( 'The form could not be changed. Please try again.' ) );
	}
}
