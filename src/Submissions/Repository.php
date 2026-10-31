<?php
namespace ChatFlow\Laravel\Submissions;

use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Support\Hooks;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Str;

final class Repository {
	public function __construct( private FormRepository $forms = new FormRepository() ) {}

	public function get( int $id ): ?Submission {
		$row = Database::query( 'submissions' )->where( 'id', $id )->first();
		return $row ? $this->submission( (array) $row ) : null;
	}

	/**
	 * @param array<string,mixed> $filters
	 * @return array{items:list<Submission>,total:int} */
	public function find( array $filters, int $page = 1, int $per_page = 20 ): array {
		$query    = $this->where( $filters );
		$per_page = max( 1, min( 1000, $per_page ) );
		$sorts    = array(
			'id'        => 's.id',
			'createdAt' => 's.created_at',
			'status'    => 's.status',
		);
		$sort     = is_string( $filters['sort'] ?? null ) ? ( $sorts[ $filters['sort'] ] ?? 's.created_at' ) : 's.created_at';
		$order    = 'asc' === strtolower( is_string( $filters['order'] ?? null ) ? $filters['order'] : 'desc' ) ? 'asc' : 'desc';
		$total    = ( clone $query )->count();
		$rows     = $query->select( 's.*' )->orderBy( $sort, $order )->orderBy( 's.id', $order )->limit( $per_page )->offset( ( max( 1, $page ) - 1 ) * $per_page )->get();
		return array(
			'items' => array_values( array_map( fn( $row ) => $this->submission( (array) $row ), $rows->all() ) ),
			'total' => $total,
		);
	}

	/**
	 * Query over the submissions table (aliased "s") restricted by the inbox filters.
	 * Unknown or malformed filters throw InvalidArgumentException (a 422 for callers).
	 *
	 * @param array<string,mixed> $filters */
	public function where( array $filters ): Builder {
		$allowed = array( 'formId', 'status', 'from', 'to', 'search', 'isRead', 'isStarred', 'utmSource', 'utmCampaign', 'device', 'fieldKey', 'operator', 'value', 'sort', 'order', 'ids', 'afterId', 'beforeId', 'before', 'maxId', 'olderThanDays' );
		if ( array_diff( array_keys( $filters ), $allowed ) ) {
			throw new \InvalidArgumentException( 'Unknown filter.' ); }
		$query = Database::query( 'submissions as s' );
		if ( isset( $filters['maxId'] ) ) {
			$query->where( 's.id', '<=', (int) $filters['maxId'] ); }
		if ( isset( $filters['before'] ) ) {
			$query->where( 's.created_at', '<', (string) $filters['before'] ); }
		if ( isset( $filters['olderThanDays'] ) ) {
			if ( ! is_int( $filters['olderThanDays'] ) || $filters['olderThanDays'] < 1 ) {
				throw new \InvalidArgumentException( 'Invalid age.' ); }
			$query->where( 's.created_at', '<', gmdate( 'Y-m-d H:i:s', time() - $filters['olderThanDays'] * 86400 ) ); }
		foreach ( array(
			'formId'   => 'form_id',
			'afterId'  => 'id',
			'beforeId' => 'id',
		) as $key => $column ) {
			if ( isset( $filters[ $key ] ) ) {
				if ( ! is_numeric( $filters[ $key ] ) || (int) $filters[ $key ] < 0 ) {
					throw new \InvalidArgumentException( 'Invalid identifier.' ); }
				$op = 'afterId' === $key ? '>' : ( 'beforeId' === $key ? '<=' : '=' );
				$query->where( 's.' . $column, $op, (int) $filters[ $key ] );
			}
		}
		$statuses = $filters['status'] ?? array( 'partial', 'completed', 'abandoned', 'spam' );
		$statuses = is_array( $statuses ) ? $statuses : array( $statuses );
		if ( ! $statuses || array_diff( $statuses, array( 'partial', 'completed', 'abandoned', 'spam', 'trash' ) ) ) {
			throw new \InvalidArgumentException( 'Invalid status.' ); }
		$query->whereIn( 's.status', array_values( $statuses ) );
		foreach ( array(
			'from' => '>=',
			'to'   => '<=',
		) as $key => $op ) {
			if ( isset( $filters[ $key ] ) ) {
				$query->where( 's.created_at', $op, self::dateBound( $filters[ $key ], 'to' === $key ) );
			}
		}
		foreach ( array(
			'isRead'    => 'is_read',
			'isStarred' => 'is_starred',
		) as $key => $column ) {
			if ( isset( $filters[ $key ] ) ) {
				$value = filter_var( $filters[ $key ], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE );
				if ( null === $value ) {
					throw new \InvalidArgumentException( 'Invalid boolean.' ); }
				$query->where( 's.' . $column, $value ? 1 : 0 );
			}
		}
		foreach ( array(
			'utmSource'   => 'utm_source',
			'utmCampaign' => 'utm_campaign',
			'device'      => 'device_type',
		) as $key => $column ) {
			if ( isset( $filters[ $key ] ) ) {
				if ( ! is_string( $filters[ $key ] ) || strlen( $filters[ $key ] ) > 255 ) {
					throw new \InvalidArgumentException( 'Invalid metadata filter.' ); }
				$query->where( 's.' . $column, $filters[ $key ] );
			}
		}
		if ( isset( $filters['search'] ) && '' !== $filters['search'] ) {
			if ( ! is_string( $filters['search'] ) || strlen( $filters['search'] ) > 255 ) {
				throw new \InvalidArgumentException( 'Invalid search.' ); }
			$like = '%' . FormRepository::escapeLike( $filters['search'] ) . '%';
			$query->where(
				static function ( Builder $q ) use ( $like ): void {
					$q->whereExists(
						static function ( Builder $v ) use ( $like ): void {
							$v->selectRaw( '1' )->from( Database::table( 'submission_values' ) . ' as v' )->whereColumn( 'v.submission_id', 's.id' )->whereRaw( "v.value_text LIKE ? ESCAPE '!'", array( $like ) );
						}
					)->orWhereRaw( "s.ip LIKE ? ESCAPE '!'", array( $like ) );
				}
			);
		}
		if ( isset( $filters['ids'] ) ) {
			if ( ! is_array( $filters['ids'] ) || ! $filters['ids'] || count( $filters['ids'] ) > 5000 || array_filter( $filters['ids'], fn( $id ) => ! is_int( $id ) || $id < 1 ) ) {
				throw new \InvalidArgumentException( 'Invalid selection.' ); }
			$query->whereIn( 's.id', array_values( array_map( 'intval', $filters['ids'] ) ) );
		}
		if ( isset( $filters['fieldKey'] ) ) {
			if ( ! is_string( $filters['fieldKey'] ) || ! preg_match( '/^[a-z][a-z0-9_]{0,63}$/D', $filters['fieldKey'] ) ) {
				throw new \InvalidArgumentException( 'Invalid field.' ); }
			$op    = $filters['operator'] ?? 'eq';
			$value = $filters['value'] ?? '';
			if ( ! is_scalar( $value ) || strlen( (string) $value ) > 10000 ) {
				throw new \InvalidArgumentException( 'Invalid answer filter.' ); }
			$text      = (string) $value;
			$condition = match ( $op ) {
				'eq' => static fn( Builder $v ) => $v->where( 'v.value_text', '=', $text ),
				'neq' => static fn( Builder $v ) => $v->where( 'v.value_text', '<>', $text ),
				'contains' => static fn( Builder $v ) => $v->whereRaw( "v.value_text LIKE ? ESCAPE '!'", array( '%' . FormRepository::escapeLike( $text ) . '%' ) ),
				'not_contains' => static fn( Builder $v ) => $v->whereRaw( "v.value_text NOT LIKE ? ESCAPE '!'", array( '%' . FormRepository::escapeLike( $text ) . '%' ) ),
				'starts_with' => static fn( Builder $v ) => $v->whereRaw( "v.value_text LIKE ? ESCAPE '!'", array( FormRepository::escapeLike( $text ) . '%' ) ),
				'is_empty' => static fn( Builder $v ) => $v->where( static fn( Builder $w ) => $w->where( 'v.value_text', '=', '' )->orWhereNull( 'v.value_text' ) ),
				'is_not_empty' => static fn( Builder $v ) => $v->where( 'v.value_text', '<>', '' )->whereNotNull( 'v.value_text' ),
				'gt', 'gte', 'lt', 'lte' => $this->numericFilter( $op, $value ),
				default => throw new \InvalidArgumentException( 'Unsupported filter operator.' ),
			};
			$key    = $filters['fieldKey'];
			$exists = static function ( Builder $v ) use ( $key ): Builder {
				return $v->selectRaw( '1' )->from( Database::table( 'submission_values' ) . ' as v' )->whereColumn( 'v.submission_id', 's.id' )->where( 'v.field_key', $key );
			};
			if ( 'is_empty' === $op ) {
				$query->where(
					static function ( Builder $q ) use ( $exists, $condition ): void {
						$q->whereNotExists( $exists )->orWhereExists( static fn( Builder $v ) => $condition( $exists( $v ) ) );
					}
				);
			} else {
				$query->whereExists( static fn( Builder $v ) => $condition( $exists( $v ) ) );
			}
		}
		return $query;
	}

	/** UTC bound for a from/to filter; a calendar day means the app timezone's day. */
	private static function dateBound( mixed $value, bool $end ): string {
		if ( ! is_string( $value ) || ! preg_match( '/^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})?)?$/D', $value ) || false === strtotime( $value . ( 10 === strlen( $value ) ? ' UTC' : '' ) ) ) {
			throw new \InvalidArgumentException( 'Invalid date.' ); }
		// strtotime normalizes impossible dates and 24:00 into a different day.
		$parsed = date_parse( $value );
		if ( $parsed['warning_count'] || $parsed['error_count'] ) {
			throw new \InvalidArgumentException( 'Invalid date.' ); }
		if ( 10 === strlen( $value ) ) {
			$local = new \DateTimeImmutable( $value . ( $end ? ' 23:59:59' : ' 00:00:00' ), new \DateTimeZone( (string) config( 'app.timezone', 'UTC' ) ) );
			return $local->setTimezone( new \DateTimeZone( 'UTC' ) )->format( 'Y-m-d H:i:s' );
		}
		return gmdate( 'Y-m-d H:i:s', (int) strtotime( $value ) );
	}

	/** @return \Closure(Builder):Builder */
	private function numericFilter( string $op, mixed $value ): \Closure {
		if ( ! is_numeric( $value ) ) {
			throw new \InvalidArgumentException( 'Numeric value required.' ); }
		$symbol = array(
			'gt'  => '>',
			'gte' => '>=',
			'lt'  => '<',
			'lte' => '<=',
		)[ $op ];
		$number = (float) $value;
		return static fn( Builder $v ) => $v->where( 'v.value_num', $symbol, $number );
	}

	/** Internal transactional write; caller supplies replay-normalized data.
	 * @param array<string,mixed> $data */
	public function savePartial( array $data ): Submission {
		$now  = Database::now();
		$data = array_merge(
			array(
				'uuid'       => (string) Str::uuid(),
				'status'     => 'partial',
				'answers'    => array(),
				'variables'  => array(),
				'visited'    => array(),
				'consent'    => array(),
				'meta'       => array(),
				'started_at' => $now,
				'created_at' => $now,
				'updated_at' => $now,
			),
			$data
		);
		$id   = $this->write( null, $data );
		return $this->get( $id ) ?? throw new \RuntimeException( 'Submission missing.' );
	}

	/**
	 * @param array<string,mixed> $data */
	public function complete( int $id, array $data ): Submission {
		$this->write( $id, array_merge( $data, array( 'updated_at' => Database::now() ) ) );
		return $this->get( $id ) ?? throw new \RuntimeException( 'Submission missing.' );
	}

	/**
	 * @param array<string,mixed> $data */
	private function write( ?int $id, array $data ): int {
		$current = null === $id ? null : Database::query( 'submissions' )->where( 'id', $id )->first( array( 'form_id', 'form_version' ) );
		$form    = $this->forms->getVersion( (int) ( $data['form_id'] ?? $current?->form_id ), (int) ( $data['form_version'] ?? $current?->form_version ) );
		$answers = $data['answers'] ?? null;
		foreach ( array( 'answers', 'variables', 'visited', 'consent', 'meta', 'click_ids', 'step_timings', 'spam_reasons' ) as $key ) {
			if ( isset( $data[ $key ] ) && ! is_string( $data[ $key ] ) ) {
				$data[ $key ] = Database::json( $data[ $key ] ); }
		}
		if ( null === $id ) {
			$id = (int) Database::query( 'submissions' )->insertGetId( $data );
		} else {
			Database::query( 'submissions' )->where( 'id', $id )->update( $data );
		}
		if ( is_array( $answers ) && $form ) {
			Database::query( 'submission_values' )->where( 'submission_id', $id )->delete();
			$rows = array();
			foreach ( $form->schema()['steps'] as $step ) {
				if ( ! array_key_exists( $step['key'], $answers ) ) {
					continue; }
				$value  = $answers[ $step['key'] ];
				$rows[] = array(
					'submission_id' => $id,
					'field_id'      => $step['id'],
					'field_key'     => $step['key'],
					'value_text'    => is_scalar( $value ) ? ( is_bool( $value ) ? ( $value ? 'true' : 'false' ) : (string) $value ) : ( null === $value ? '' : Database::json( $value ) ),
					'value_num'     => is_int( $value ) || is_float( $value ) ? $value : null,
				);
			}
			if ( $rows ) {
				Database::query( 'submission_values' )->insert( $rows );
			}
		}
		return $id;
	}

	/**
	 * Applies inbox changes: isRead, isStarred, status (a status, or "restore"
	 * to return from trash/spam to the status it had before) and note.
	 *
	 * @param array<string,mixed> $changes */
	public function update( int $id, array $changes ): ?Submission {
		$result = Database::transaction(
			function () use ( $id, $changes ) {
				$row = Database::query( 'submissions' )->where( 'id', $id )->lockForUpdate()->first( array( 'id', 'status', 'previous_status', 'completed_at', 'abandoned_at' ) );
				if ( ! $row ) {
					return null; }
				$data = array( 'updated_at' => Database::now() );
				foreach ( array(
					'isRead'    => 'is_read',
					'isStarred' => 'is_starred',
				) as $key => $column ) {
					if ( isset( $changes[ $key ] ) ) {
						$data[ $column ] = $changes[ $key ] ? 1 : 0; }
				}
				$parked = array( 'trash', 'spam' );
				if ( isset( $changes['status'] ) && 'restore' === $changes['status'] ) {
					// Back to the status remembered when it was trashed/spammed, else the one implied by its lifecycle timestamps.
					$data['status']          = in_array( $row->previous_status, array( 'partial', 'completed', 'abandoned' ), true ) ? $row->previous_status : ( ! empty( $row->completed_at ) ? 'completed' : ( ! empty( $row->abandoned_at ) ? 'abandoned' : 'partial' ) );
					$data['previous_status'] = null;
				} elseif ( isset( $changes['status'] ) ) {
					$data['status'] = $changes['status'];
					if ( in_array( $changes['status'], $parked, true ) ) {
						if ( ! in_array( $row->status, $parked, true ) ) {
							$data['previous_status'] = $row->status; }
					} else {
						$data['previous_status'] = null;
					}
				}
				Database::query( 'submissions' )->where( 'id', $id )->update( $data );
				if ( isset( $changes['note'] ) ) {
					Database::query( 'submission_notes' )->insert(
						array(
							'submission_id' => $id,
							'user_id'       => (int) auth()->id(),
							'type'          => 'note',
							'body'          => self::textarea( (string) $changes['note'] ),
							'created_at'    => Database::now(),
						)
					);
				}
				if ( isset( $changes['status'] ) && in_array( $changes['status'], $parked, true ) ) {
					Database::query( 'sessions' )->where( 'submission_id', $id )->update(
						array(
							'status'    => 'closed',
							'closed_at' => Database::now(),
						)
					); }
				return $this->get( $id );
			}
		);
		if ( Error::is( $result ) ) {
			throw new \RuntimeException( 'Submission update failed.' ); }
		return $result;
	}

	/**
	 * Notes and delivery entries for a submission, newest first.
	 *
	 * @return list<array{id:int,kind:string,message:string,userId:int,createdAt:string}> */
	public function notes( int $id, int $limit = 500 ): array {
		return array_values(
			array_map(
				static fn( object $row ): array => array(
					'id'        => (int) $row->id,
					'kind'      => (string) $row->type,
					'message'   => (string) $row->body,
					'userId'    => (int) $row->user_id,
					'createdAt' => (string) $row->created_at,
				),
				Database::query( 'submission_notes' )->where( 'submission_id', $id )->orderByDesc( 'id' )->limit( $limit )->get()->all()
			)
		);
	}

	/** Deletes permanently by default; with $permanent false the submission is moved to the trash. */
	public function delete( int $id, bool $permanent = true ): bool {
		if ( ! $permanent ) {
			return null !== $this->update( $id, array( 'status' => 'trash' ) );
		}
		return $this->deleteInternal( $id, false ); }
	public function removeForRestart( int $id ): bool {
		return $this->deleteInternal( $id, true ); }
	private function deleteInternal( int $id, bool $preserve_session ): bool {
		$result = Database::transaction(
			function () use ( $id, $preserve_session ) {
				Database::query( 'submissions' )->where( 'id', $id )->lockForUpdate()->value( 'id' );
				$submission = $this->get( $id );
				if ( ! $submission ) {
					return false; }
				$form = $this->forms->getVersion( $submission->formId(), $submission->formVersion() );
				if ( $form ) {
					Hooks::action( 'submission_deleted', array( $submission, $form ) ); }
				$sessions = Database::query( 'sessions' )->where( 'submission_id', $id )->get( array( 'id', 'public_id', 'context' ) );
				foreach ( $sessions as $session ) {
					$context = Database::decode( $session->context );
					if ( ! empty( $context['_startScope'] ) ) {
						Database::query( 'requests' )->where( 'scope_hash', $context['_startScope'] )->delete(); }
					foreach ( array( 'patch', 'delete', 'submit' ) as $op ) {
						if ( $preserve_session && 'delete' === $op ) {
							continue; }
						Database::query( 'requests' )->where( 'scope_hash', hash( 'sha256', Idempotency::SITE_ID . ':session:' . $session->public_id . ':' . $op ) )->delete(); }
				}
				if ( $preserve_session ) {
					Database::query( 'sessions' )->where( 'submission_id', $id )->update(
						array(
							'submission_id' => null,
							'context'       => Database::json( array( 'now' => gmdate( 'c' ) ) ),
						)
					); }
				foreach ( $preserve_session ? array( 'submission_values', 'submission_notes', 'deliveries' ) : array( 'submission_values', 'submission_notes', 'deliveries', 'sessions' ) as $table ) {
					Database::query( $table )->where( 'submission_id', $id )->delete(); }
				Database::query( 'submissions' )->where( 'id', $id )->delete();
				return true;
			}
		);
		if ( Error::is( $result ) ) {
			throw new \RuntimeException( 'Submission deletion failed.' ); }
		return $result;
	}

	/** @param array<string,mixed> $row */
	private function submission( array $row ): Submission {
		return new Submission( $row, $this->forms->getVersion( (int) $row['form_id'], (int) $row['form_version'] ) );
	}

	/** Multi-line plain text, like WordPress's sanitize_textarea_field(). */
	private static function textarea( string $value ): string {
		if ( ! mb_check_encoding( $value, 'UTF-8' ) ) {
			return '';
		}
		return trim( \ChatFlow\Laravel\Support\Text::stripTags( $value ) );
	}
}
