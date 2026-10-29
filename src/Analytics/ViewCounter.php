<?php
namespace ChatFlow\Laravel\Analytics;

use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Spam\RateLimiter;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Support\Settings;
use ChatFlow\Laravel\Tracking\IpResolver;
use Illuminate\Support\Facades\DB;

/**
 * Anonymous daily impression counters: no visitor identifiers, answers or URLs are persisted.
 * Every opened embed counts as one impression; this does not count unique people.
 */
final class ViewCounter {
	public function __construct( private FormRepository $forms = new FormRepository() ) {}

	/**
	 * @param array<string,mixed> $server Server vars ($request->server->all()).
	 * @return array{recorded:bool}|Error */
	public function record( int $form_id, int $version, bool $do_not_track = false, array $server = array() ): array|Error {
		$form = $this->forms->getPublished( $form_id );
		if ( ! $form ) {
			return Database::error( 'cff_not_found', 'Published form not found.', 404 );
		}
		if ( $form->version() !== $version ) {
			return Database::error( 'cff_version_conflict', 'Load the current published form.', 409 );
		}
		$settings = Settings::get();
		if ( $do_not_track && $settings['privacy']['respectDnt'] ) {
			return array( 'recorded' => false );
		}
		$ip = ( new IpResolver() )->resolve( $server, $settings['proxy'] );
		if ( ! ( new RateLimiter() )->consume( 'form-view:' . $form_id . ':' . $ip, 120, 600 ) ) {
			return Database::error( 'cff_rate_limit', 'Too many form impressions.', 429, array( 'retryAfter' => 600 ) );
		}
		$dimension = '{}';
		Database::query( 'stats_daily' )->upsert(
			array(
				'form_id'        => $form_id,
				'form_version'   => $version,
				// The app's calendar day, so daily views line up with app-time reports.
				'day'            => ( new \DateTimeImmutable( 'now', new \DateTimeZone( (string) config( 'app.timezone', 'UTC' ) ) ) )->format( 'Y-m-d' ),
				'metric'         => 'view',
				'dimension_hash' => hash( 'sha256', $dimension ),
				'dimension'      => $dimension,
				'value'          => 1,
			),
			array( 'form_id', 'form_version', 'day', 'metric', 'dimension_hash' ),
			// Qualified: PostgreSQL treats a bare column as ambiguous next to "excluded".
			array( 'value' => DB::raw( DB::connection()->getQueryGrammar()->wrapTable( Database::table( 'stats_daily' ) ) . '.' . DB::connection()->getQueryGrammar()->wrap( 'value' ) . ' + 1' ) )
		);
		return array( 'recorded' => true );
	}
}
