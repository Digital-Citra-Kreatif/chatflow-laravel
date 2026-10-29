<?php
namespace ChatFlow\Laravel\Forms;

use ChatFlow\Laravel\Fields\AbstractField;
use ChatFlow\Laravel\Fields\Registry;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Support\Hooks;
use Illuminate\Support\Str;

/**
 * Forms live in the "forms" table (the plugin used the cff_form post type and
 * post meta); published versions are immutable snapshots in "form_versions".
 */
final class FormRepository {
	public function __construct( private SchemaValidator $validator = new SchemaValidator() ) {}

	public function getDraft( int $id ): ?Form {
		$row = $this->row( $id );
		if ( ! $row || 'trash' === $row->status ) {
			return null;
		}
		return $this->toForm( $row );
	}

	public function getPublished( int $id, ?int $version = null ): ?Form {
		$row = $this->row( $id );
		if ( ! $row || 'publish' !== $row->status ) {
			return null;
		}
		$version ??= (int) $row->version;
		return $this->getVersion( $id, $version );
	}

	public function getVersion( int $id, int $version ): ?Form {
		$row = Database::query( 'form_versions' )->where( 'form_id', $id )->where( 'version', $version )->first( array( 'schema', 'settings', 'form_title', 'form_slug' ) );
		if ( ! $row ) {
			return null;
		}
		$revision = (int) Database::query( 'forms' )->where( 'id', $id )->value( 'draft_revision' );
		return new Form( $id, (string) $row->form_title, (string) $row->form_slug, $this->decode( $row->schema ), $this->decode( $row->settings ), $version, $revision, 'publish' );
	}

	/** @param array<string,mixed> $schema
	 *  @param array<string,mixed> $settings
	 */
	public function create( string $title, array $schema, array $settings = array() ): Form|Error {
		$errors = array_merge( $this->validator->validate( $schema ), $this->validator->validateSettings( $settings, $schema ) );
		if ( $errors ) {
			return $this->invalid( $errors );
		}
		return Database::transaction(
			function () use ( $title, $schema, $settings ): Form|Error {
				$now = Database::now();
				$id  = (int) Database::query( 'forms' )->insertGetId(
					array(
						'title'          => self::title( $title ),
						'status'         => 'draft',
						'schema'         => '{}',
						'settings'       => '{}',
						'identity'       => '{}',
						'draft_revision' => 0,
						'version'        => 0,
						'created_by'     => auth()->id(),
						'created_at'     => $now,
						'updated_at'     => $now,
					)
				);
				return $this->saveDraft( $id, $schema, $settings, 0, $title );
			}
		);
	}

	/** @param array<string,mixed> $schema
	 *  @param array<string,mixed> $settings
	 */
	public function saveDraft( int $id, array $schema, array $settings, int $expected_revision, ?string $title = null ): Form|Error {
		$settings = self::normalizeSettings( $settings );
		$errors   = array_merge( $this->validator->validate( $schema ), $this->validator->validateSettings( $settings, $schema ) );
		if ( $errors ) {
			return $this->invalid( $errors );
		}
		return $this->withLock(
			$id,
			$expected_revision,
			function ( Form $draft, object $row ) use ( $id, $schema, $settings, $title ): Form|Error {
				$identity     = $this->decode( $row->identity );
				$old_entities = $this->entities( $draft->schema() );
				foreach ( $this->entities( $schema ) as $entity_id => $entity ) {
					$key = 'entity:' . $entity_id;
					if ( isset( $identity[ $key ] ) && $identity[ $key ] !== $entity && ! isset( $old_entities[ $entity_id ] ) ) {
						return Database::error( 'cff_immutable_id', 'A removed ID cannot be reassigned to another entity.', 422 );
					}
					if ( isset( $old_entities[ $entity_id ] ) && explode( ':', $old_entities[ $entity_id ] )[0] !== explode( ':', $entity )[0] ) {
						return Database::error( 'cff_immutable_id', 'An ID cannot change entity kind.', 422 );
					}
					$identity[ $key ] = $entity;
				}
				foreach ( $schema['steps'] as $step ) {
					$key = 'step:' . $step['key'];
					if ( isset( $identity[ $key ] ) && $identity[ $key ] !== $step['id'] ) {
						return Database::error( 'cff_immutable_id', 'Existing field keys must keep their immutable step IDs.', 422 );
					}
					$identity[ $key ] = $step['id'];
					foreach ( $step['options'] ?? array() as $option ) {
						$key = 'option:' . $step['id'] . ':' . $option['value'];
						if ( isset( $identity[ $key ] ) && $identity[ $key ] !== $option['id'] ) {
							return Database::error( 'cff_immutable_id', 'Existing options must keep their immutable IDs.', 422 );
						}
						$identity[ $key ] = $option['id'];
					}
				}
				$data = array(
					'schema'         => self::encode( $schema ),
					'settings'       => self::encode( (object) $settings ),
					'identity'       => self::encode( (object) $identity ),
					'draft_revision' => $draft->draftRevision() + 1,
					'updated_at'     => Database::now(),
				);
				if ( null !== $title ) {
					$data['title'] = self::title( $title );
				}
				Database::query( 'forms' )->where( 'id', $id )->update( $data );
				return $this->getDraft( $id ) ?? Database::error( 'cff_storage_error', 'Unable to reload draft.', 500 );
			}
		);
	}

	public function publish( int $id, int $expected_revision ): Form|Error {
		$result = $this->withLock(
			$id,
			$expected_revision,
			function ( Form $draft, object $row ) use ( $id ): Form|Error {
				$errors = array_merge( $this->validator->validatePublishable( $draft->schema(), Registry::enabledTypes() ), $this->validator->validateSettings( $draft->settings(), $draft->schema() ), $this->captchaIssues( $draft->settings() ) );
				if ( $errors ) {
					return $this->invalid( $errors );
				}
				$version  = $draft->version() + 1;
				$slug     = '' !== (string) $row->slug ? (string) $row->slug : $this->uniqueSlug( $draft->title(), $id );
				$schema   = self::encode( $draft->schema() );
				$settings = self::encode( (object) $draft->settings() );
				$now      = Database::now();
				Database::query( 'form_versions' )->insert(
					array(
						'form_id'     => $id,
						'version'     => $version,
						'form_title'  => $draft->title(),
						'form_slug'   => $slug,
						'schema'      => $schema,
						'settings'    => $settings,
						'schema_hash' => hash( 'sha256', $schema ),
						'created_at'  => $now,
						'created_by'  => auth()->id(),
					)
				);
				Database::query( 'forms' )->where( 'id', $id )->update(
					array(
						'slug'           => $slug,
						'status'         => 'publish',
						'version'        => $version,
						'draft_revision' => $draft->draftRevision() + 1,
						'updated_at'     => $now,
					)
				);
				return $this->getPublished( $id, $version ) ?? Database::error( 'cff_storage_error', 'Unable to reload snapshot.', 500 );
			}
		);
		if ( $result instanceof Form ) {
			Hooks::action( 'form_published', array( $result ) );
		}
		return $result;
	}

	/**
	 * A form may only turn the site-wide captcha off. Any other per-form provider
	 * is dropped so the form inherits the global provider.
	 *
	 * @param array<string,mixed> $settings
	 * @return array<string,mixed>
	 */
	public static function normalizeSettings( array $settings ): array {
		if ( isset( $settings['spam'] ) && is_array( $settings['spam'] ) && array_key_exists( 'captcha', $settings['spam'] ) && 'none' !== $settings['spam']['captcha'] ) {
			unset( $settings['spam']['captcha'] );
		}
		return $settings;
	}

	/**
	 * Admin list of forms.
	 *
	 * @param array{page?:int,perPage?:int,search?:string,status?:string,orderby?:string,order?:string} $args
	 *        status: draft | publish | trash | '' (draft and publish); orderby: title | updated_at (default); order: asc | desc (default).
	 * @return array{items:list<Form>,total:int}
	 */
	public function paginate( array $args ): array {
		$page     = max( 1, (int) ( $args['page'] ?? 1 ) );
		$per_page = max( 1, min( 100, (int) ( $args['perPage'] ?? 20 ) ) );
		$status   = (string) ( $args['status'] ?? '' );
		if ( ! in_array( $status, array( '', 'draft', 'publish', 'trash' ), true ) ) {
			throw new \InvalidArgumentException( 'Invalid status.' );
		}
		$query = Database::query( 'forms' );
		if ( '' === $status ) {
			$query->whereIn( 'status', array( 'draft', 'publish' ) );
		} else {
			$query->where( 'status', $status );
		}
		$search = trim( (string) ( $args['search'] ?? '' ) );
		if ( '' !== $search ) {
			$query->whereRaw( "title LIKE ? ESCAPE '!'", array( '%' . self::escapeLike( $search ) . '%' ) );
		}
		$total   = ( clone $query )->count();
		$orderby = 'title' === ( $args['orderby'] ?? '' ) ? 'title' : 'updated_at';
		$order   = 'asc' === strtolower( (string) ( $args['order'] ?? 'desc' ) ) ? 'asc' : 'desc';
		$rows    = $query->orderBy( $orderby, $order )->orderBy( 'id', $order )->forPage( $page, $per_page )->get();
		return array(
			'items' => array_values( array_map( fn( object $row ): Form => $this->toForm( $row ), $rows->all() ) ),
			'total' => $total,
		);
	}

	/** Moves a form to the trash, remembering its status for restore(). */
	public function trash( int $id ): true|Error {
		return Database::transaction(
			function () use ( $id ): true|Error {
				$row = Database::query( 'forms' )->where( 'id', $id )->lockForUpdate()->first();
				if ( ! $row || 'trash' === $row->status ) {
					return $this->notFound();
				}
				Database::query( 'forms' )->where( 'id', $id )->update(
					array(
						'status'          => 'trash',
						'previous_status' => $row->status,
						'updated_at'      => Database::now(),
					)
				);
				return true;
			}
		);
	}

	/** Restores a trashed form to the status it had before it was trashed. */
	public function restore( int $id ): Form|Error {
		return Database::transaction(
			function () use ( $id ): Form|Error {
				$row = Database::query( 'forms' )->where( 'id', $id )->lockForUpdate()->first();
				if ( ! $row ) {
					return $this->notFound();
				}
				if ( 'trash' === $row->status ) {
					$status = in_array( $row->previous_status, array( 'draft', 'publish' ), true ) ? $row->previous_status : 'draft';
					if ( 'publish' === $status && (int) $row->version < 1 ) {
						$status = 'draft';
					}
					Database::query( 'forms' )->where( 'id', $id )->update(
						array(
							'status'          => $status,
							'previous_status' => null,
							'updated_at'      => Database::now(),
						)
					);
				}
				return $this->getDraft( $id ) ?? $this->notFound();
			}
		);
	}

	/**
	 * Deletes a form, its versions, statistics and visitor sessions. Refused while
	 * any submission (in any status, including trash) belongs to the form.
	 */
	public function deleteForever( int $id ): true|Error {
		return Database::transaction(
			function () use ( $id ): true|Error {
				$row = Database::query( 'forms' )->where( 'id', $id )->lockForUpdate()->first();
				if ( ! $row ) {
					return $this->notFound();
				}
				if ( Database::query( 'submissions' )->where( 'form_id', $id )->exists() ) {
					return Database::error( 'cff_has_submissions', 'This form has submissions. Delete its submissions before deleting the form permanently.', 409 );
				}
				Database::query( 'form_versions' )->where( 'form_id', $id )->delete();
				Database::query( 'stats_daily' )->where( 'form_id', $id )->delete();
				Database::query( 'sessions' )->where( 'form_id', $id )->delete();
				Database::query( 'forms' )->where( 'id', $id )->delete();
				return true;
			}
		);
	}

	/** Copies a form's draft into a new draft; webhooks are disabled and their secrets dropped. */
	public function duplicate( int $id ): Form|Error {
		$form = $this->getDraft( $id );
		if ( ! $form ) {
			return $this->notFound();
		}
		return $this->create( $form->title() . ' (' . __( 'Copy' ) . ')', $form->schema(), self::safeSettings( $form->settings() ) );
	}

	/** @param array<string,mixed> $settings
	 * @return array<string,mixed> */
	public static function safeSettings( array $settings ): array {
		if ( isset( $settings['integrations']['webhooks'] ) && is_array( $settings['integrations']['webhooks'] ) ) {
			foreach ( $settings['integrations']['webhooks'] as &$hook ) {
				if ( is_array( $hook ) ) {
					$hook['enabled'] = false;
					$hook['secret']  = '';
					// Dropped rather than emptied: an empty list would fail the object schema.
					unset( $hook['headers'] );
				}
			}
			unset( $hook );
		}
		return $settings;
	}

	/** @param array<string,mixed> $settings
	 * @return list<array{path:string,code:string,message:string}>
	 */
	private function captchaIssues( array $settings ): array {
		$provider = $settings['spam']['captcha'] ?? null;
		if ( null === $provider || 'none' === $provider ) {
			return array();
		}
		return array(
			array(
				'path'    => '/spam/captcha',
				'code'    => 'captcha_provider_mismatch',
				'message' => 'Captcha providers are not available. Choose "Use global setting" or turn captcha off for this form.',
			),
		);
	}

	/** @param callable(Form,object):(Form|Error) $callback */
	private function withLock( int $id, int $expected_revision, callable $callback ): Form|Error {
		return Database::transaction(
			function () use ( $id, $expected_revision, $callback ): Form|Error {
				$row = Database::query( 'forms' )->where( 'id', $id )->lockForUpdate()->first();
				if ( ! $row || 'trash' === $row->status ) {
					return $this->notFound();
				}
				$draft = $this->toForm( $row );
				if ( $draft->draftRevision() !== $expected_revision ) {
					return Database::error( 'cff_revision_conflict', 'The draft changed. Reload before saving.', 409, array( 'draftRevision' => $draft->draftRevision() ) );
				}
				return $callback( $draft, $row );
			}
		);
	}

	/** A unique slug from the title, like WordPress post names: lowercase-hyphen, -2, -3 … on collision. */
	private function uniqueSlug( string $title, int $id ): string {
		$base = Str::limit( Str::slug( $title ), 190, '' );
		$base = trim( $base, '-' );
		if ( '' === $base ) {
			$base = (string) $id;
		}
		$slug   = $base;
		$suffix = 2;
		while ( Database::query( 'forms' )->where( 'slug', $slug )->where( 'id', '<>', $id )->exists() ) {
			$slug = $base . '-' . $suffix++;
		}
		return $slug;
	}

	/**
	 * @param array<string,mixed> $schema
	 * @return array<string,string>
	 */
	private function entities( array $schema ): array {
		$entities = array();
		foreach ( $schema['steps'] ?? array() as $step ) {
			$entities[ $step['id'] ] = 'step:' . $step['key'];
			foreach ( $step['options'] ?? array() as $option ) {
				$entities[ $option['id'] ] = 'option:' . $step['id'] . ':' . $option['value'];
			}
		}
		foreach ( $schema['endings'] ?? array() as $ending ) {
			$entities[ $ending['id'] ] = 'ending';
			foreach ( $ending['buttons'] ?? array() as $button ) {
				$entities[ $button['id'] ] = 'button:' . $ending['id'];
			}
		}
		foreach ( $schema['groups'] ?? array() as $group ) {
			$entities[ $group['id'] ] = 'group';
		}
		return $entities;
	}

	private function row( int $id ): ?object {
		return Database::query( 'forms' )->where( 'id', $id )->first();
	}

	private function toForm( object $row ): Form {
		return new Form( (int) $row->id, (string) $row->title, (string) ( $row->slug ?? '' ), $this->decode( $row->schema ), $this->decode( $row->settings ), (int) $row->version, (int) $row->draft_revision, (string) $row->status );
	}

	private function notFound(): Error {
		return Database::error( 'cff_form_not_found', 'Form not found.', 404 );
	}

	private static function title( string $title ): string {
		return mb_substr( AbstractField::plainText( $title ), 0, 500 );
	}

	private static function encode( mixed $value ): string {
		return json_encode( $value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
	}

	public static function escapeLike( string $value ): string {
		return str_replace( array( '!', '%', '_' ), array( '!!', '!%', '!_' ), $value );
	}

	/** @return array<string,mixed> */
	private function decode( mixed $json ): array {
		if ( ! is_string( $json ) || '' === $json ) {
			return array();
		}
		$value = json_decode( $json, true, 512, JSON_THROW_ON_ERROR );
		return is_array( $value ) ? $value : array();
	}

	/** @param list<array{path:string,code:string,message:string}> $errors */
	private function invalid( array $errors ): Error {
		return Database::error( 'cff_invalid_schema', 'Schema validation failed.', 422, array( 'errors' => $errors ) );
	}
}
