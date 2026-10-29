<?php
namespace ChatFlow\Laravel\Frontend;

use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Support\Database;
use Illuminate\Http\Response;

/** GET /{fullpage_base}/{slug}: a published form on its own page. */
final class FullPageController {
	public function __invoke( string $slug ): Response {
		$id   = Database::query( 'forms' )->where( 'slug', $slug )->where( 'status', 'publish' )->value( 'id' );
		$form = $id ? ( new FormRepository() )->getPublished( (int) $id ) : null;
		if ( ! $form ) {
			abort( 404 );
		}
		$layout   = config( 'chatflow.fullpage_layout' );
		$noindex  = (bool) config( 'chatflow.fullpage_noindex', true );
		$data     = array(
			'form'    => $form,
			'html'    => Renderer::render( $form->id(), array( 'mode' => 'fullpage' ) ),
			'noindex' => $noindex,
			'layout'  => $layout,
		);
		$view     = is_string( $layout ) && '' !== $layout ? 'chatflow::frontend.fullpage-layout' : 'chatflow::frontend.fullpage';
		$response = response()->view( $view, $data );
		if ( $noindex ) {
			$response->header( 'X-Robots-Tag', 'noindex' );
		}
		return $response;
	}
}
