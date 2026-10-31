<?php
namespace ChatFlow\Laravel\Privacy;

use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Submissions\Repository;
use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

/**
 * Private CSV exports. Built synchronously into storage/app/private/chatflow/exports
 * under a random name and downloaded by their creator only, with a ticket whose
 * SHA-256 is stored in exports.download_hash. Files expire after 24 hours.
 */
final class Export {
	public const TTL = 86400;

	public function __construct( private FormRepository $forms = new FormRepository(), private Repository $submissions = new Repository() ) {}

	public static function directory(): string {
		return storage_path( 'app/private/chatflow/exports' );
	}

	/**
	 * @param array<string,mixed> $options
	 * @return array<string,mixed>|Error
	 */
	public function create( array $options ): array|Error {
		if ( array_diff( array_keys( $options ), array( 'formId', 'filters', 'ids', 'columns', 'headerStyle', 'delimiter', 'format' ) ) || ! is_int( $options['formId'] ?? null ) || ! in_array( $options['format'] ?? 'csv', array( 'csv', 'xlsx' ), true ) || ! in_array( $options['delimiter'] ?? ',', array( ',', ';' ), true ) || ! in_array( $options['headerStyle'] ?? 'labels', array( 'labels', 'keys' ), true ) || ! is_array( $options['filters'] ?? array() ) || ! is_array( $options['columns'] ?? array() ) ) {
			return Database::error( 'cff_export_invalid', 'Invalid export options.', 422 );
		}
		if ( 'xlsx' === ( $options['format'] ?? 'csv' ) ) {
			return Database::error( 'cff_xlsx_unavailable', 'XLSX export is not available in this version.', 503 );
		}
		$form = $this->forms->getDraft( $options['formId'] );
		if ( ! $form ) {
			return Database::error( 'cff_not_found', 'Form not found.', 404 );
		}
		$this->expire();
		$filters           = $options['filters'] ?? array();
		$filters['formId'] = $form->id();
		if ( isset( $options['ids'] ) ) {
			$filters['ids'] = $options['ids'];
		}
		// Malformed filters are a 422 for the caller.
		$this->submissions->where( $filters );
		$filters['beforeId'] = (int) Database::query( 'submissions' )->max( 'id' );
		$columns             = array(
			'id'        => 'ID',
			'uuid'      => 'UUID',
			'createdAt' => 'Date',
			'status'    => 'Status',
			'ending'    => 'Ending',
		);
		foreach ( $form->schema()['steps'] as $step ) {
			if ( ! in_array( $step['type'], array( 'statement', 'summary', 'media' ), true ) ) {
				$columns[ $step['key'] ] = (string) $step['label'];
			}
		}
		$historic = $this->submissions->where( $filters )->join( Database::table( 'submission_values' ) . ' as v', 'v.submission_id', '=', 's.id' )->distinct()->orderBy( 'v.field_key' )->pluck( 'v.field_key' );
		foreach ( $historic as $key ) {
			$columns[ (string) $key ] ??= (string) $key;
		}
		foreach ( array( 'ip', 'browser', 'os', 'device_type', 'page_url', 'referrer', 'landing_page', 'landing_referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid', 'ttclid', 'locale', 'timezone', 'duration_ms' ) as $key ) {
			$columns[ 'meta.' . $key ] = 'Tracking: ' . $key;
		}
		$requested = $options['columns'] ?? array();
		if ( $requested ) {
			if ( count( $requested ) > 1000 || array_filter( $requested, static fn( $key ) => ! is_string( $key ) || ! isset( $columns[ $key ] ) ) ) {
				return Database::error( 'cff_export_invalid', 'Unknown export column.', 422 );
			}
			$columns = array_replace( array_flip( $requested ), array_intersect_key( $columns, array_flip( $requested ) ) );
		}
		$delimiter = $options['delimiter'] ?? ',';
		$storage   = 'export-' . bin2hex( random_bytes( 32 ) ) . '.csv';
		$path      = self::directory() . DIRECTORY_SEPARATOR . $storage;
		$handle    = false;
		try {
			if ( ! is_dir( self::directory() ) && ! mkdir( self::directory(), 0700, true ) && ! is_dir( self::directory() ) ) {
				throw new \RuntimeException( 'Export directory unavailable.' );
			}
			$handle = fopen( $path, 'x+b' );
			if ( false === $handle ) {
				throw new \RuntimeException( 'Private export creation failed.' );
			}
			chmod( $path, 0600 );
			fwrite( $handle, "\xEF\xBB\xBF" );
			fputcsv( $handle, array_map( array( self::class, 'cell' ), 'keys' === ( $options['headerStyle'] ?? 'labels' ) ? array_keys( $columns ) : array_values( $columns ) ), $delimiter, '"', '' );
			$rows    = 0;
			$cursor  = 0;
			$batch   = $filters;
			$batch['sort']  = 'id';
			$batch['order'] = 'asc';
			do {
				$batch['afterId'] = $cursor;
				$items            = $this->submissions->find( $batch, 1, 1000 )['items'];
				foreach ( $items as $submission ) {
					$values = array_map( fn( $key ) => self::cell( $this->value( $submission, (string) $key ) ), array_keys( $columns ) );
					if ( false === fputcsv( $handle, $values, $delimiter, '"', '' ) ) {
						throw new \RuntimeException( 'Export write failed.' );
					}
					$cursor = $submission->id();
					++$rows;
				}
			} while ( 1000 === count( $items ) );
			fclose( $handle );
			$handle = false;
			$id     = (int) Database::query( 'exports' )->insertGetId(
				array(
					'uuid'          => (string) Str::uuid(),
					'user_id'       => (int) auth()->id(),
					'form_id'       => $form->id(),
					'status'        => 'ready',
					'format'        => 'csv',
					'criteria'      => Database::json(
						array(
							'filters'   => $filters,
							'columns'   => $columns,
							'delimiter' => $delimiter,
						)
					),
					'storage_key'   => $storage,
					'download_hash' => '',
					'row_count'     => $rows,
					'created_at'    => Database::now(),
					'expires_at'    => gmdate( 'Y-m-d H:i:s', time() + self::TTL ),
				)
			);
		} catch ( \Throwable $e ) {
			if ( is_resource( $handle ) ) {
				fclose( $handle );
			}
			if ( is_file( $path ) ) {
				@unlink( $path );
			}
			if ( $e instanceof \InvalidArgumentException ) {
				throw $e;
			}
			report( $e );
			return Database::error( 'cff_export_storage', 'Export unavailable. Make storage/app/private writable.', 503 );
		}
		return $this->progress( $id );
	}

	/**
	 * Export status for its owner. A ready export gets a fresh download ticket
	 * (only its hash is stored, so earlier links stop working).
	 *
	 * @return array<string,mixed>|Error
	 */
	public function progress( int $id ): array|Error {
		$row = $this->row( $id );
		if ( ! $row || (int) $row['user_id'] !== (int) auth()->id() ) {
			return Database::error( 'cff_not_found', 'Owned export not found.', 404 );
		}
		if ( strtotime( $row['expires_at'] . ' UTC' ) <= time() ) {
			$row['status'] = 'expired';
		}
		$result = array(
			'exportId'  => $id,
			'status'    => $row['status'],
			'rowCount'  => (int) $row['row_count'],
			'expiresAt' => gmdate( 'c', (int) strtotime( $row['expires_at'] . ' UTC' ) ),
		);
		if ( 'ready' === $row['status'] ) {
			$ticket = bin2hex( random_bytes( 32 ) );
			Database::query( 'exports' )->where( 'id', $id )->update( array( 'download_hash' => hash( 'sha256', $ticket ) ) );
			$result['downloadUrl'] = self::downloadUrl( $id, $ticket );
		}
		return $result;
	}

	/** The download address under the API mount that served this request (the standalone admin's or the panel's). */
	public static function downloadUrl( int $id, string $ticket ): string {
		$route = request()->route();
		$name  = $route instanceof \Illuminate\Routing\Route ? (string) $route->getName() : '';
		foreach ( array( 'sunrice.admin.chatflow.api.', 'chatflow.admin.api.' ) as $prefix ) {
			if ( str_starts_with( $name, $prefix ) && Route::has( $prefix . 'exports.download' ) ) {
				return route( $prefix . 'exports.download', array( 'id' => $id, 'ticket' => $ticket ) );
			}
		}
		return url( trim( (string) config( 'chatflow.admin.prefix', 'chatflow/admin' ), '/' ) . '/api' ) . '/admin/exports/' . $id . '/download?ticket=' . $ticket;
	}

	public function download( int $id, mixed $ticket ): BinaryFileResponse|Error {
		$row = $this->row( $id );
		if ( ! is_string( $ticket ) || '' === $ticket || ! $row || (int) $row['user_id'] !== (int) auth()->id() || 'ready' !== $row['status'] || strtotime( $row['expires_at'] . ' UTC' ) <= time() || '' === (string) $row['download_hash'] || ! hash_equals( (string) $row['download_hash'], hash( 'sha256', $ticket ) ) ) {
			return Database::error( 'cff_not_found', 'Export unavailable or expired.', 404 );
		}
		$path = self::directory() . DIRECTORY_SEPARATOR . basename( (string) $row['storage_key'] );
		if ( '' === (string) $row['storage_key'] || ! is_file( $path ) ) {
			return Database::error( 'cff_export_storage', 'Private storage unavailable.', 503 );
		}
		$response = new BinaryFileResponse( $path, 200, array( 'Content-Type' => 'text/csv; charset=UTF-8' ), false, ResponseHeaderBag::DISPOSITION_ATTACHMENT, false, false );
		$response->setContentDisposition( ResponseHeaderBag::DISPOSITION_ATTACHMENT, 'chatflow-' . $id . '.csv' );
		$response->headers->set( 'Content-Type', 'text/csv; charset=UTF-8' );
		$response->headers->set( 'X-Content-Type-Options', 'nosniff' );
		$response->headers->set( 'Cache-Control', 'private, no-store' );
		return $response;
	}

	/** Deletes expired export files (up to 100 per call). */
	public function expire(): void {
		$rows = Database::query( 'exports' )->where( 'expires_at', '<=', Database::now() )->where( 'storage_key', '<>', '' )->limit( 100 )->get( array( 'id', 'storage_key' ) );
		foreach ( $rows as $row ) {
			$path = self::directory() . DIRECTORY_SEPARATOR . basename( (string) $row->storage_key );
			if ( is_file( $path ) ) {
				@unlink( $path );
			}
			Database::query( 'exports' )->where( 'id', $row->id )->update(
				array(
					'status'        => 'expired',
					'storage_key'   => '',
					'download_hash' => '',
				)
			);
		}
	}

	/** @return array<string,mixed>|null */
	private function row( int $id ): ?array {
		$row = Database::query( 'exports' )->where( 'id', $id )->first();
		return $row ? (array) $row : null;
	}

	private function value( Submission $submission, string $key ): mixed {
		if ( str_starts_with( $key, 'meta.' ) ) {
			$meta = $submission->meta();
			$key  = substr( $key, 5 );
			if ( str_starts_with( $key, 'utm_' ) ) {
				return $meta['utm'][ substr( $key, 4 ) ] ?? $meta[ $key ] ?? '';
			}
			return $meta[ $key ] ?? $meta['click_ids'][ $key ] ?? $submission->storage()[ $key ] ?? '';
		}
		if ( 'createdAt' === $key ) {
			return ( new \DateTimeImmutable( $submission->createdAt(), new \DateTimeZone( 'UTC' ) ) )->setTimezone( new \DateTimeZone( (string) config( 'app.timezone', 'UTC' ) ) )->format( 'c' );
		}
		$value = match ( $key ) {
			'id'     => $submission->id(),
			'uuid'   => $submission->uuid(),
			'status' => $submission->status(),
			'ending' => $submission->endingId(),
			default  => $submission->answers()[ $key ] ?? '',
		};
		$form  = $this->forms->getVersion( $submission->formId(), $submission->formVersion() );
		foreach ( $form?->schema()['steps'] ?? array() as $step ) {
			if ( $step['key'] === $key && 'multi_choice' === $step['type'] && is_array( $value ) && array_is_list( $value ) && ! array_filter( $value, static fn( $entry ) => ! is_scalar( $entry ) ) ) {
				return implode( ', ', array_map( static fn( $entry ) => is_bool( $entry ) ? ( $entry ? 'true' : 'false' ) : (string) $entry, $value ) );
			}
		}
		return $value;
	}

	/** A CSV cell; values that a spreadsheet would run as a formula are prefixed with an apostrophe. */
	public static function cell( mixed $value ): string {
		$value = is_array( $value ) || is_object( $value ) ? Database::json( $value ) : ( is_bool( $value ) ? ( $value ? 'true' : 'false' ) : (string) $value );
		// A phone number in international form (+62 812…) has no operator a spreadsheet could run,
		// so it stays as typed; anything else that starts like a formula is neutralised.
		if ( preg_match( '/^\+\d[\d ]{5,}$/', $value ) ) {
			return $value;
		}
		return preg_match( '/^[\x00-\x20]*[=+@-]/', $value ) ? "'" . $value : $value;
	}
}
