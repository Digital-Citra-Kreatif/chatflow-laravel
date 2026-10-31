<?php
namespace ChatFlow\Laravel\Http\Controllers\Api;

use ChatFlow\Laravel\Analytics\ViewCounter;
use ChatFlow\Laravel\Fields\Registry;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Forms\PublicProjection;
use ChatFlow\Laravel\Frontend\Engagement;
use ChatFlow\Laravel\Spam\RateLimiter;
use ChatFlow\Laravel\Submissions\SessionService;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Settings;
use ChatFlow\Laravel\Tracking\IpResolver;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class FormController extends Controller {
	public function __construct( private FormRepository $forms = new FormRepository() ) {}

	/** GET forms/{id}: the cacheable public envelope. */
	public function show( Request $request, string $id ): Response {
		return $this->guarded(
			function () use ( $request, $id ): Response {
				$version = $request->query( 'version' );
				if ( $this->invalidVersion( $version ) ) {
					return $this->respond( Database::error( 'cff_invalid_version', 'Invalid version.', 422 ) ); }
				$form = $this->forms->getPublished( (int) $id, null === $version ? null : (int) $version );
				if ( ! $form ) {
					return $this->respond( Database::error( 'cff_not_found', 'Published form not found.', 404 ) ); }
				$envelope = PublicProjection::build( $form, Registry::enabledTypes() );
				$etag     = '"' . hash( 'sha256', Database::json( $envelope ) ) . '"';
				$response = $request->headers->get( 'If-None-Match' ) === $etag ? response( '', 304 ) : $this->respond( $envelope );
				$response->headers->set( 'ETag', $etag );
				$response->headers->set( 'Cache-Control', 'public,max-age=60,must-revalidate' );
				return $response;
			}
		);
	}

	/** GET forms/{id}/engagement: uncached captcha/analytics config. */
	public function engagement( Request $request, string $id ): Response {
		return $this->guarded(
			function () use ( $request, $id ): Response {
				$version = $request->query( 'version' );
				if ( $this->invalidVersion( $version ) ) {
					return $this->respond( Database::error( 'cff_invalid_version', 'Invalid version.', 422 ) ); }
				$form = $this->forms->getPublished( (int) $id, null === $version ? null : (int) $version );
				return $this->respond( $form ? Engagement::config( $form ) : Database::error( 'cff_not_found', 'Published form not found.', 404 ) );
			}
		);
	}

	/** POST forms/{id}/start-token. */
	public function startToken( Request $request, string $id ): Response {
		return $this->guarded(
			function () use ( $request, $id ): Response {
				$id      = (int) $id;
				$version = $this->body( $request )['version'] ?? 0;
				$form    = $this->forms->getPublished( $id );
				if ( ! $form ) {
					return $this->respond( Database::error( 'cff_not_found', 'Published form not found.', 404 ) ); }
				if ( ! is_int( $version ) || $version !== $form->version() ) {
					return $this->respond( Database::error( 'cff_version_conflict', 'Load the current published form before starting.', 409, array( 'version' => $form->version() ) ) ); }
				$ip = ( new IpResolver() )->resolve( $request->server->all(), Settings::get()['proxy'] );
				$limiter = new RateLimiter();
				if ( ! $limiter->consume( 'start:' . $id . ':' . $ip, RateLimiter::startLimit(), 600 ) ) {
					return $this->respond( Database::error( 'cff_start_rate_limit', 'Too many chats started from this address. Please wait before starting again.', 429, array( 'retryAfter' => $limiter->retryAfter ) ) ); }
				return $this->respond(
					array(
						'startToken' => SessionService::signer()->issue(
							'start',
							array(
								'formId'  => $id,
								'version' => $version,
							),
							time()
						),
						'expiresAt'  => gmdate( 'c', time() + 900 ),
						'version'    => $version,
					)
				);
			}
		);
	}

	/** POST forms/{id}/view: an aggregate impression without a visitor session. */
	public function view( Request $request, string $id ): Response {
		return $this->guarded(
			function () use ( $request, $id ): Response {
				$version = $this->body( $request )['version'] ?? null;
				if ( ! is_int( $version ) || $version < 1 ) {
					return $this->respond( Database::error( 'cff_invalid_version', 'A published form version is required.', 422 ) ); }
				$do_not_track = '1' === $request->headers->get( 'DNT' ) || '1' === $request->headers->get( 'Sec-GPC' );
				return $this->respond( ( new ViewCounter( $this->forms ) )->record( (int) $id, $version, $do_not_track, $request->server->all() ) );
			}
		);
	}
}
