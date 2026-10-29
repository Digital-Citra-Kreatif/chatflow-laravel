<?php
namespace ChatFlow\Laravel\Submissions;

use ChatFlow\Laravel\Fields\Registry;
use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Forms\FormRepository;
use ChatFlow\Laravel\Forms\PublicProjection;
use ChatFlow\Laravel\Logic\Engine;
use ChatFlow\Laravel\Logic\Experiments;
use ChatFlow\Laravel\Security\CookieSources;
use ChatFlow\Laravel\Security\TokenSigner;
use ChatFlow\Laravel\Spam\Protection;
use ChatFlow\Laravel\Spam\RateLimiter;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Support\Hooks;
use ChatFlow\Laravel\Support\Secret;
use ChatFlow\Laravel\Support\Settings;
use ChatFlow\Laravel\Tracking\IpResolver;
use ChatFlow\Laravel\Tracking\Metadata;
use Illuminate\Support\Str;

/**
 * Visitor sessions: start, resume, read, autosave (patch), restart (delete) and submit.
 *
 * Request data ($_SERVER-style server vars and raw cookies) is passed in by the
 * controller. Lifecycle actions fire as Laravel events after commit:
 * chatflow.session_started, chatflow.submission_partial_saved,
 * chatflow.submission_completed (not for spam) and chatflow.submission_abandoned.
 *
 * limits.requireLogin / limits.perUser use auth()->id() on the default guard. The
 * public API is stateless (no session middleware) unless the host adds
 * middleware to config('chatflow.api.middleware'), so visitors count as logged out.
 */
final class SessionService {
	private TokenSigner $signer;
	private Repository $submissions;
	private Idempotency $requests;
	/**
	 * @var list<array{hook:string,args:array<mixed>}> */
	private array $hooks = array();

	/**
	 * @param array<string,mixed> $server  Server vars ($request->server->all()).
	 * @param array<string,mixed> $cookies Raw request cookies.
	 */
	public function __construct(
		private FormRepository $forms = new FormRepository(),
		private Engine $engine = new Engine(),
		private Registry $fields = new Registry(),
		private array $server = array(),
		private array $cookies = array()
	) {
		$this->signer      = self::signer();
		$this->submissions = new Repository( $forms );
		$this->requests    = new Idempotency();
	}

	/** The visitor token signer (start, request and resume tokens). */
	public static function signer(): TokenSigner {
		return new TokenSigner( Secret::derive( 'cff-tokens' ), Idempotency::SITE_ID );
	}

	/**
	 * @param array<string,mixed> $body
	 * @return array<string,mixed>|Error */
	public function start( array $body, string $token, string $key ): array|Error {
		$form_id = $body['formId'] ?? 0;
		$version = $body['version'] ?? 0;
		if ( ! is_int( $form_id ) || ! is_int( $version ) || ! $this->signer->verify(
			$token,
			'start',
			array(
				'formId'  => $form_id,
				'version' => $version,
			),
			time()
		) ) {
			return $this->unauthorized(); }
		$client  = $body['meta'] ?? array();
		$prefill = $body['prefill'] ?? array();
		if ( ! is_array( $client ) || ! is_array( $prefill ) || strlen( Database::json( $body ) ) > 1048576 ) {
			return Database::error( 'cff_invalid_request', 'Invalid session data.', 422 ); }
		$metadata = new Metadata();
		$client   = $metadata->validate( $client );
		if ( Error::is( $client ) ) {
			return $client; }
		$this->reset();
		$result = Database::transaction(
			function () use ( $body, $token, $key, $form_id, $version, $metadata, $client, $prefill ) {
				$guard = $this->requests->begin( 'start:' . hash( 'sha256', $token ), $key, $body );
				if ( Error::is( $guard ) ) {
					return $guard; }
				if ( null !== $guard['response'] ) {
					return $this->cachedResponse( $guard['response'] ); }
				// Rate-limit actual sessions; handshake quotas alone can be bypassed with new keys.
				// Idempotent retries return before this counter.
				$ip = ( new IpResolver() )->resolve( $this->server, Settings::get()['proxy'] );
				if ( ! ( new RateLimiter() )->consume( 'session-start:' . $form_id . ':' . $ip, 30, 600 ) ) {
					return Database::error( 'cff_rate_limit', 'Please wait before starting again.', 429, array( 'retryAfter' => 600 ) ); }
				$this->lockForm( $form_id );
				$form = $this->forms->getPublished( $form_id, $version );
				if ( ! $form ) {
					return Database::error( 'cff_form_not_found', 'Published form not found.', 404 ); }
				$limit = $this->limits( $form );
				if ( $limit ) {
					return $limit; }
				$meta = $metadata->collect( $form, $client, $this->server );
				$meta = Hooks::filter( 'submission_meta', $meta, $form );
				$meta = is_array( $meta ) ? $meta : array();
				// Build replay context before storage filtering: url_params and custom
				// extension keys are intentionally not persisted as submission metadata.
				$context                    = $metadata->context( $form, $meta, $this->cookies );
				$meta                       = $this->safeMeta( $meta );
				$context['defaultEndingId'] = $form->settings()['completion']['defaultEndingId'] ?? '';
				$variant                    = Experiments::assign( $form );
				$context['_variantId']      = $variant['id'];
				if ( '' !== $variant['id'] ) {
					$context['_variantSchema'] = $variant['schema']; }
				$form   = Experiments::withSchema( $form, $variant['schema'] );
				$replay = $this->replay( $form, $prefill, $context, 'partial' );
				if ( Error::is( $replay ) ) {
					return $replay; }
				$context['_answers']    = $replay['answers'];
				$context['_startScope'] = Idempotency::scopeHash( 'start:' . hash( 'sha256', $token ) );
				$settings               = $form->settings()['sessions'] ?? array();
				$resume                 = ( $settings['resumeEnabled'] ?? true ) && ( $settings['savePartial'] ?? true );
				$days                   = max( 1, min( 90, (int) ( $settings['resumeDays'] ?? 30 ) ) );
				$credential             = $this->signer->issueResume( time(), $days );
				$expiry                 = gmdate( 'Y-m-d H:i:s', time() + ( $resume ? $days * 86400 : 86400 ) );
				$submission             = null;
				$meta['context']        = array_intersect_key( $context, array_flip( array( 'hidden', 'url', 'meta', 'now', 'defaultEndingId' ) ) );
				if ( $settings['savePartial'] ?? true ) {
					$submission = $this->submissions->savePartial( $this->data( $form, $replay, $meta ) ); }
				$context['_meta'] = $meta;
				$now              = Database::now();
				$id               = (int) Database::query( 'sessions' )->insertGetId(
					array(
						'public_id'     => (string) Str::uuid(),
						'resume_hash'   => hash( 'sha256', $credential ),
						'form_id'       => $form_id,
						'form_version'  => $version,
						'variant_id'    => $variant['id'],
						'submission_id' => $submission?->id(),
						'status'        => 'active',
						'revision'      => 0,
						'context'       => Database::json( $context ),
						'started_at'    => $now,
						'last_seen_at'  => $now,
						'expires_at'    => $expiry,
					)
				);
				$row      = $this->row( Database::query( 'sessions' )->where( 'id', $id )->first() );
				$envelope = $this->envelope( $row, $form, $replay );
				if ( $resume ) {
					$envelope['resumeToken']     = $credential;
					$envelope['resumeExpiresAt'] = gmdate( 'c', (int) strtotime( $expiry . ' UTC' ) ); }
				$this->requests->finish( $guard['id'], $envelope, 201 );
				$this->hooks[] = array(
					'hook' => 'session_started',
					'args' => array(
						array(
							'sessionId' => $row['public_id'],
							'formId'    => $form_id,
							'version'   => $version,
							'startedAt' => $row['started_at'],
						),
						$form,
					),
				);
				return $envelope;
			}
		);
		$this->after( $result );
		return $result;
	}

	/**
	 * @return array<string,mixed>|Error */
	public function resume( int $form_id, string $credential ): array|Error {
		if ( ! $this->signer->verifyResume( $credential, time() ) ) {
			return $this->unauthorized(); }
		$row = $this->row( Database::query( 'sessions' )->where( 'resume_hash', hash( 'sha256', $credential ) )->where( 'form_id', $form_id )->first() );
		if ( ! $row || ! hash_equals( (string) $row['resume_hash'], hash( 'sha256', $credential ) ) || 'active' !== $row['status'] || strtotime( $row['expires_at'] . ' UTC' ) <= time() ) {
			return $this->unauthorized(); }
		$form = $this->snapshot( $row );
		if ( Error::is( $form ) ) {
			return $form; }
		if ( ! ( $form->settings()['sessions']['resumeEnabled'] ?? true ) || ! ( $form->settings()['sessions']['savePartial'] ?? true ) ) {
			return $this->unauthorized(); }
		$replay = $this->storedReplay( $row, $form );
		if ( Error::is( $replay ) ) {
			return $replay; }
		$envelope                    = $this->envelope( $row, $form, $replay );
		$envelope['resumeToken']     = $credential;
		$envelope['resumeExpiresAt'] = gmdate( 'c', (int) strtotime( $row['expires_at'] . ' UTC' ) );
		return $envelope;
	}

	/**
	 * @return array<string,mixed>|Error */
	public function get( string $id, string $token ): array|Error {
		$row = $this->row( Database::query( 'sessions' )->where( 'public_id', $id )->first() );
		// Completed, closed or expired sessions no longer expose their answers or mint request tokens.
		if ( ! $row || 'active' !== $row['status'] || strtotime( $row['expires_at'] . ' UTC' ) <= time() || ! $this->verify( $row, $token ) ) {
			return $this->unauthorized(); }
		$form = $this->snapshot( $row );
		if ( Error::is( $form ) ) {
			return $form; }
		$replay = $this->storedReplay( $row, $form );
		return Error::is( $replay ) ? $replay : $this->envelope( $row, $form, $replay );
	}

	/**
	 * Authenticates an active session by its request token, like the plugin's
	 * UploadSession::lock(). Call within a transaction to hold the row lock.
	 *
	 * @return array<string,mixed>|Error */
	public function authenticate( string $id, string $token ): array|Error {
		$row = $this->row( Database::query( 'sessions' )->where( 'public_id', $id )->lockForUpdate()->first() );
		if ( ! $row || 'active' !== $row['status'] || strtotime( $row['expires_at'] . ' UTC' ) <= time() || ! $this->verify( $row, $token ) ) {
			return Database::error( 'cff_unauthorized', 'A valid session is required.', 401 );
		}
		if ( ! $this->forms->getPublished( (int) $row['form_id'] ) || ! $this->forms->getPublished( (int) $row['form_id'], (int) $row['form_version'] ) ) {
			return Database::error( 'cff_form_not_found', 'Published form not found.', 404 ); }
		return $row;
	}

	/**
	 * @param array<string,mixed> $body
	 * @return array<string,mixed>|Error */
	public function mutate( string $operation, string $id, array $body, string $token, string $key ): array|Error {
		$this->reset();
		$result = Database::transaction(
			function () use ( $operation, $id, $body, $token, $key ) {
				$row = $this->row( Database::query( 'sessions' )->where( 'public_id', $id )->lockForUpdate()->first() );
				if ( ! $row ) {
					return $this->unauthorized(); }
				if ( 'submit' === $operation && 'completed' === $row['status'] && $this->verifyReceiptToken( $row, $token ) ) {
					$receipt = $this->requests->receipt( 'session:' . $id . ':submit', $key, $body );
					if ( null !== $receipt ) {
						return Error::is( $receipt ) ? $receipt : $this->cachedResponse( $receipt, $row ); }
				}
				if ( ! $this->verify( $row, $token ) ) {
					return $this->unauthorized(); }
				$guard = $this->requests->begin( 'session:' . $id . ':' . $operation, $key, $body, 'submit' === $operation ? 315360000 : 86400 );
				if ( Error::is( $guard ) ) {
					return $guard; }
				if ( null !== $guard['response'] ) {
					return $this->cachedResponse( $guard['response'], $row ); }
				if ( 'active' !== $row['status'] || strtotime( $row['expires_at'] . ' UTC' ) <= time() ) {
					return $this->unauthorized(); }
				if ( ( $body['version'] ?? null ) !== (int) $row['form_version'] ) {
					return Database::error( 'cff_version_conflict', 'Continue the pinned version or start over.', 409 ); }
				if ( ( $body['revision'] ?? null ) !== (int) $row['revision'] ) {
					return Database::error( 'cff_revision_conflict', 'The session changed. Reload before saving.', 409, array( 'revision' => (int) $row['revision'] ) ); }
				$this->lockForm( (int) $row['form_id'] );
				$form = $this->snapshot( $row );
				if ( Error::is( $form ) ) {
					return $form; }
				$context    = CookieSources::context( $form->schema(), Database::decode( $row['context'] ) );
				$submission = $row['submission_id'] ? $this->submissions->get( (int) $row['submission_id'] ) : null;
				$revision   = (int) $row['revision'] + 1;
				$scrub      = false;
				if ( 'delete' === $operation ) {
					// Nothing durable keeps this session's answers or metadata after a restart without a partial.
					$scrub = ! $submission || ( $form->settings()['sessions']['deletePartialOnRestart'] ?? false );
					if ( $submission ) {
						if ( $form->settings()['sessions']['deletePartialOnRestart'] ?? false ) {
							$this->submissions->removeForRestart( $submission->id() );
						} else {
							$safe_data = array();
							if ( CookieSources::deniedKeys( $form->schema() ) ) {
								$safe_replay = $this->storedReplay( $row, $form );
								if ( Error::is( $safe_replay ) ) {
									return $safe_replay;
								}
								$safe_data = $this->data( $form, $safe_replay, $context['_meta'] ?? array() );
							}
							$submission = $this->submissions->complete(
								$submission->id(),
								array_merge(
									$safe_data,
									array(
										'status'       => 'abandoned',
										'abandoned_at' => Database::now(),
									)
								)
							);
							$this->lifecycle( 'submission_abandoned', $submission, $form );
						}
					}
					$changes  = array(
						'status'    => 'closed',
						'closed_at' => Database::now(),
					);
					$response = array( 'closed' => true );
				} else {
					$answers = $body['answers'] ?? null;
					if ( ! is_array( $answers ) || strlen( Database::json( $body ) ) > 1048576 ) {
						return Database::error( 'cff_invalid_answers', 'An answer map is required.', 422 ); }
					$replay = $this->replay( $form, $answers, $context, 'submit' === $operation ? 'complete' : 'partial' );
					if ( Error::is( $replay ) ) {
						return $replay; }
					$upload_error = $this->uploadAnswers( $form, $replay['answers'] );
					if ( $upload_error ) {
						return $upload_error; }
					$timings = $this->timings( $body['stepTimings'] ?? array(), $replay['visited'] );
					if ( Error::is( $timings ) ) {
						return $timings; }
					$meta                 = $context['_meta'] ?? array();
					$data                 = $this->data( $form, $replay, $meta );
					$data['step_timings'] = $timings;
					$changes              = array();
					if ( 'submit' === $operation ) {
						$limit = $this->limits( $form );
						if ( $limit ) {
							return $limit; }
						$spam = array_merge( Settings::get()['spam'], $form->settings()['spam'] ?? array() );
						$ip   = ( new IpResolver() )->resolve( $this->server, Settings::get()['proxy'] );
						if ( ! ( new RateLimiter() )->consume( 'submit:' . $form->id() . ':' . $ip, (int) ( $spam['rateLimit'] ?? 10 ), (int) ( $spam['rateWindowSeconds'] ?? 600 ) ) ) {
							return Database::error( 'cff_rate_limit', 'Please wait before submitting again.', 429, array( 'retryAfter' => $spam['rateWindowSeconds'] ?? 600 ) ); }
						$reasons = ( new Protection() )->reasons( $form, $body, (int) strtotime( $row['started_at'] . ' UTC' ) );
						if ( in_array( 'captcha_failed', $reasons, true ) || in_array( 'akismet_unavailable', $reasons, true ) ) {
							return Database::error( 'cff_spam_verification', 'Spam verification failed. Please try again.', 422 ); }
						$data['status']              = $reasons ? 'spam' : 'completed';
						$data['spam_reasons']        = $reasons;
						$data['completed_at']        = Database::now();
						$data['duration_ms']         = max( 0, ( time() - (int) strtotime( $row['started_at'] . ' UTC' ) ) * 1000 );
						$data['meta']['duration_ms'] = $data['duration_ms'];
						$submission                  = $submission ? $this->submissions->complete( $submission->id(), $data ) : $this->submissions->savePartial( array_merge( $data, array( 'started_at' => $row['started_at'] ) ) );
						$response                    = ( new Ending() )->build( $submission, $form, $replay['endingId'] );
						if ( Error::is( $response ) ) {
							return $response; }
						$changes = array(
							'status'        => 'completed',
							'closed_at'     => Database::now(),
							'submission_id' => $submission->id(),
						);
						if ( ! $reasons ) {
							$this->lifecycle( 'submission_completed', $submission, $form ); }
					} else {
						if ( $form->settings()['sessions']['savePartial'] ?? true ) {
							$submission               = $submission ? $this->submissions->complete( $submission->id(), $data ) : $this->submissions->savePartial( $data );
							$changes['submission_id'] = $submission->id();
							$this->lifecycle( 'submission_partial_saved', $submission, $form );
						}
						$response = $this->envelope( array_merge( $row, array( 'revision' => $revision ) ), $form, $replay );
					}
				}
				$changes['revision'] = $revision;
				if ( $scrub ) {
					unset( $context['_answers'], $context['_meta'] );
				} elseif ( isset( $replay ) ) {
					$context['_answers'] = $replay['answers'];
				}
				$changes['context']      = Database::json( $context );
				$changes['last_seen_at'] = Database::now();
				Database::query( 'sessions' )->where( 'id', $row['id'] )->update( $changes );
				$this->requests->finish( $guard['id'], $response );
				return $response;
			}
		);
		$this->after( $result );
		return $result;
	}

	/**
	 * @param array<string,mixed> $row */
	private function verify( array $row, string $token ): bool {
		return null !== $this->signer->verify(
			$token,
			'request',
			array(
				'sessionId' => $row['public_id'],
				'formId'    => (int) $row['form_id'],
				'version'   => (int) $row['form_version'],
			),
			time()
		);
	}

	/**
	 * @param array<string,mixed> $row
	 */
	private function verifyReceiptToken( array $row, string $token ): bool {
		$parts = explode( '.', $token );
		if ( count( $parts ) !== 3 || strlen( $token ) > 2048 ) {
			return false; }
		$decoded = base64_decode( strtr( $parts[1], '-_', '+/' ), true );
		if ( false === $decoded ) {
			return false;
		}
		$claims = Database::decode( $decoded );
		// Receipts replay only for a day after the token was issued, not for any token ever minted.
		if ( ! is_int( $claims['iat'] ?? null ) || $claims['iat'] < time() - 86400 ) {
			return false; }
		return null !== $this->signer->verify(
			$token,
			'request',
			array(
				'sessionId' => $row['public_id'],
				'formId'    => (int) $row['form_id'],
				'version'   => (int) $row['form_version'],
			),
			$claims['iat']
		);
	}

	/**
	 * @param array<string,mixed> $row */
	private function snapshot( array $row ): Form|Error {
		if ( ! $this->forms->getPublished( (int) $row['form_id'] ) ) {
			return Database::error( 'cff_form_not_found', 'Published form not found.', 404 ); }
		$form = $this->forms->getPublished( (int) $row['form_id'], (int) $row['form_version'] );
		if ( ! $form ) {
			return Database::error( 'cff_version_conflict', 'The saved version is unavailable. Your partial was kept.', 409 ); }
		$context = Database::decode( $row['context'] );
		return isset( $context['_variantSchema'] ) ? Experiments::withSchema( $form, $context['_variantSchema'] ) : $form;
	}

	private function lockForm( int $id ): void {
		Database::query( 'forms' )->where( 'id', $id )->lockForUpdate()->value( 'id' );
	}

	/** @param array<string,mixed> $response
	 * @param array<string,mixed>|null $row
	 * @return array<string,mixed>|Error */
	private function cachedResponse( array $response, ?array $row = null ): array|Error {
		$form = $this->forms->getVersion( (int) ( $row['form_id'] ?? $response['formId'] ?? 0 ), (int) ( $row['form_version'] ?? $response['version'] ?? 0 ) );
		if ( ! $form ) {
			return Database::error( 'cff_version_conflict', 'The saved version is unavailable.', 409 );
		}
		if ( CookieSources::deniedKeys( $form->schema() ) ) {
			return Database::error( 'cff_restricted_cookie', 'An outdated cookie-source response cannot be replayed. Resume or start a new session.', 409 );
		}
		return $response;
	}

	/**
	 * @param array<string,mixed> $row
	 * @return array<string,mixed>|Error */
	private function storedReplay( array $row, Form $form ): array|Error {
		$submission = $row['submission_id'] ? $this->submissions->get( (int) $row['submission_id'] ) : null;
		$context    = CookieSources::context( $form->schema(), Database::decode( $row['context'] ) );
		return $this->replay( $form, Experiments::inputs( $submission?->answers() ?? $context['_answers'] ?? array(), $form->schema() ), $context, 'partial' );
	}

	/**
	 * @param array<string,mixed> $answers
	 * @param array<string,mixed> $context
	 * @return array<string,mixed>|Error */
	private function replay( Form $form, array $answers, array $context, string $mode ): array|Error {
		$context = CookieSources::context( $form->schema(), $context );
		$replay  = $this->engine->replay( CookieSources::projection( $form->schema() ), CookieSources::answers( $form->schema(), $answers ), $context, $mode );
		$issues  = $replay['errors'];
		foreach ( $form->schema()['steps'] as $step ) {
			if ( in_array( $step['id'], $replay['visited'], true ) && array_key_exists( $step['key'], $replay['answers'] ) ) {
				$this->fields->get( $step['type'] );
				$extra = Hooks::filter( 'validate_answer', array(), $step, $replay['answers'][ $step['key'] ], $form );
				if ( is_array( $extra ) ) {
					$issues = array_merge( $issues, $extra ); }
			}
		}
		return $issues || $replay['discardedKeys'] ? Database::error( 'cff_validation_failed', 'Please check your answers.', 422, array( 'errors' => $issues ) ) : $replay;
	}

	/**
	 * Uploads are not available in this version, so no answer can reference an owned upload.
	 *
	 * @param array<string,mixed> $answers */
	private function uploadAnswers( Form $form, array $answers ): ?Error {
		foreach ( $form->schema()['steps'] as $step ) {
			if ( 'file_upload' === $step['type'] && null !== ( $answers[ $step['key'] ] ?? null ) ) {
				return Database::error( 'cff_upload_owner', 'Select an owned upload.', 422 ); }
		}
		return null;
	}

	/**
	 * @param array<string,mixed> $row
	 * @param array<string,mixed> $replay
	 * @return array<string,mixed> */
	private function envelope( array $row, Form $form, array $replay ): array {
		$context    = CookieSources::context( $form->schema(), Database::decode( $row['context'] ) );
		$variant_id = $context['_variantId'] ?? '';
		$context    = array_intersect_key( $context, array_flip( array( 'hidden', 'url', 'meta', 'now', 'defaultEndingId' ) ) );
		foreach ( array( 'hidden', 'url', 'meta' ) as $key ) {
			$context[ $key ] = (object) ( $context[ $key ] ?? array() ); }
		return array(
			'sessionId'        => $row['public_id'],
			'formId'           => $form->id(),
			'version'          => $form->version(),
			'revision'         => (int) $row['revision'],
			'status'           => strtotime( $row['expires_at'] . ' UTC' ) <= time() ? 'expired' : $row['status'],
			'answers'          => (object) $replay['answers'],
			'visited'          => $replay['visited'],
			'currentStepId'    => $replay['currentStepId'],
			'progress'         => $replay['progress'],
			'context'          => $context,
			'variantId'        => $variant_id,
			'schema'           => PublicProjection::build( $form )['form']['schema'],
			'requestToken'     => $this->signer->issue(
				'request',
				array(
					'sessionId' => $row['public_id'],
					'formId'    => $form->id(),
					'version'   => $form->version(),
				),
				time()
			),
			'requestExpiresAt' => gmdate( 'c', time() + 900 ),
		);
	}

	/**
	 * @param array<string,mixed> $replay
	 * @param array<string,mixed> $meta
	 * @return array<string,mixed> */
	private function data( Form $form, array $replay, array $meta ): array {
		$data = array(
			'form_id'         => $form->id(),
			'form_version'    => $form->version(),
			'answers'         => $replay['answers'],
			'variables'       => $replay['variables'],
			'visited'         => $replay['visited'],
			'ending_id'       => $replay['endingId'] ?? '',
			'current_step_id' => $replay['currentStepId'] ?? '',
			'progress'        => $replay['progress'],
			'meta'            => $meta,
			'consent'         => array(),
		);
		if ( ! empty( $form->settings()['limits']['perUser'] ) ) {
			$data['user_id'] = self::userId(); }
		foreach ( $form->schema()['steps'] as $step ) {
			if ( 'consent' === $step['type'] && true === ( $replay['answers'][ $step['key'] ] ?? null ) ) {
				$data['consent'][] = array(
					'fieldKey'   => $step['key'],
					'text'       => $step['settings']['consentText'] ?? implode( "\n", $step['messages'] ),
					'version'    => $form->version(),
					'acceptedAt' => gmdate( 'c' ),
				); }
		}
		foreach ( array( 'user_id', 'user_agent', 'browser', 'browser_version', 'os', 'os_version', 'device_type', 'device_brand', 'page_url', 'referrer', 'landing_page', 'landing_referrer', 'locale', 'timezone', 'screen', 'country' ) as $key ) {
			if ( isset( $meta[ $key ] ) ) {
				$data[ $key ] = $meta[ $key ]; }
		}
		if ( isset( $meta['ip'] ) ) {
			$data['ip'] = is_string( $meta['ip'] ) && filter_var( $meta['ip'], FILTER_VALIDATE_IP ) ? $meta['ip'] : null; }
		foreach ( $meta['utm'] ?? array() as $key => $value ) {
			$data[ 'utm_' . $key ] = $value; }
		$data['click_ids'] = $meta['click_ids'] ?? array();
		return $data;
	}

	private function limits( Form $form ): ?Error {
		$limits = $form->settings()['limits'] ?? array();
		$user   = self::userId();
		if ( ( $limits['requireLogin'] ?? false ) && ! $user ) {
			return Database::error( 'cff_login_required', 'Please log in to continue.', 401 ); }
		if ( ! empty( $limits['closesAt'] ) && strtotime( $limits['closesAt'] ) <= time() ) {
			return Database::error( 'cff_form_closed', 'This form is closed.', 409 ); }
		if ( ! empty( $limits['total'] ) && Database::query( 'submissions' )->where( 'form_id', $form->id() )->where( 'status', 'completed' )->count() >= $limits['total'] ) {
			return Database::error( 'cff_form_limit', 'This form has reached its limit.', 409 ); }
		if ( ! empty( $limits['perUser'] ) ) {
			if ( ! $user ) {
				return Database::error( 'cff_login_required', 'Log in for this per-user form.', 401 ); }
			if ( Database::query( 'submissions' )->where( 'form_id', $form->id() )->where( 'user_id', $user )->where( 'status', 'completed' )->count() >= $limits['perUser'] ) {
				return Database::error( 'cff_user_limit', 'You have reached this form limit.', 409 ); }
		}
		return null;
	}

	private static function userId(): int {
		$id = auth()->id();
		return is_numeric( $id ) ? (int) $id : 0;
	}

	/**
	 * @param mixed $timings
	 * @param list<string> $visited
	 * @return array<string,int>|Error */
	private function timings( mixed $timings, array $visited ): array|Error {
		if ( is_object( $timings ) ) {
			$timings = (array) $timings; }
		if ( ! is_array( $timings ) || count( $timings ) > 500 ) {
			return Database::error( 'cff_invalid_timings', 'Invalid step timings.', 422 ); }
		$kept = array();
		foreach ( $timings as $id => $ms ) {
			if ( ! is_int( $ms ) || $ms < 0 || $ms > 604800000 ) {
				return Database::error( 'cff_invalid_timings', 'Invalid step timing.', 422 ); }
			// Steps left behind by an edited branch are dropped, not rejected: the visitor can still finish.
			if ( in_array( (string) $id, $visited, true ) ) {
				$kept[ $id ] = $ms; }
		}
		return $kept;
	}

	/**
	 * @param array<string,mixed> $meta
	 * @return array<string,mixed> */
	private function safeMeta( array $meta ): array {
		$allowed = array( 'ip', 'user_id', 'user_agent', 'browser', 'browser_version', 'os', 'os_version', 'device_type', 'device_brand', 'page_url', 'referrer', 'landing_page', 'landing_referrer', 'utm', 'click_ids', 'locale', 'timezone', 'screen', 'country' );
		$meta    = array_intersect_key( $meta, array_flip( $allowed ) );
		foreach ( $meta as $key => $value ) {
			if ( is_string( $value ) ) {
				$meta[ $key ] = substr( Metadata::sanitizeText( $value ), 0, 2000 ); }
		}
		return $meta;
	}

	private function lifecycle( string $hook, Submission $submission, Form $form ): void {
		$this->hooks[] = array(
			'hook' => $hook,
			'args' => array( $submission, $form ),
		); }

	private function reset(): void {
		$this->hooks = array(); }

	private function after( mixed $result ): void {
		$hooks = $this->hooks;
		$this->reset();
		if ( Error::is( $result ) ) {
			return; }
		foreach ( $hooks as $hook ) {
			Database::afterCommit( static fn() => Hooks::action( $hook['hook'], $hook['args'] ) );
		}
	}

	/** @return array<string,mixed>|null */
	private function row( ?object $row ): ?array {
		return $row ? (array) $row : null;
	}

	private function unauthorized(): Error {
		return Database::error( 'cff_invalid_credential', 'Invalid or expired session credential.', 401 ); }
}
