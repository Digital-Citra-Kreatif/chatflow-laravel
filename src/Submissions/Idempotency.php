<?php
namespace ChatFlow\Laravel\Submissions;

use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Support\Secret;

final class Idempotency {
	/** Site id mixed into scopes and receipts (the plugin used the multisite blog id). */
	public const SITE_ID = 1;

	/** Called inside a transaction.
	 * @param array<string,mixed> $body
	 *
	 * @return array<string,mixed>|Error
	 */
	public function begin( string $scope, string $key, array $body, int $ttl = 86400 ): array|Error {
		if ( ! preg_match( '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iD', $key ) ) {
			return Database::error( 'cff_invalid_idempotency_key', 'An Idempotency-Key UUID is required.', 422 );
		}
		$scope_hash   = self::scopeHash( $scope );
		$key_hash     = hash( 'sha256', strtolower( $key ) );
		$request_hash = hash( 'sha256', Database::json( self::canonical( $body ) ) );
		$inserted     = Database::query( 'requests' )->insertOrIgnore(
			array(
				'scope_hash'   => $scope_hash,
				'key_hash'     => $key_hash,
				'request_hash' => $request_hash,
				'status'       => 'pending',
				'expires_at'   => $ttl >= 315360000 ? '9999-12-31 23:59:59' : gmdate( 'Y-m-d H:i:s', time() + max( 86400, $ttl ) ),
			)
		);
		$row          = Database::query( 'requests' )->where( 'scope_hash', $scope_hash )->where( 'key_hash', $key_hash )->lockForUpdate()->first();
		if ( ! $row ) {
			throw new \RuntimeException( 'Missing request row.' );
		}
		if ( ! hash_equals( (string) $row->request_hash, $request_hash ) ) {
			return Database::error( 'cff_idempotency_conflict', 'This key was already used for a different request.', 409 );
		}
		if ( 'pending' === $row->status && 1 !== $inserted ) {
			return Database::error( 'cff_request_pending', 'This request is still processing.', 409, array( 'retryAfter' => 1 ) ); }
		return array(
			'id'       => (int) $row->id,
			'response' => 'done' === $row->status ? self::response( (string) $row->response, (int) $row->id ) : null,
		);
	}
	/**
	 * @param array<string,mixed> $body
	 * @return array<string,mixed>|Error|null
	 */
	public function receipt( string $scope, string $key, array $body ): array|Error|null {
		$row = Database::query( 'requests' )->where( 'scope_hash', self::scopeHash( $scope ) )->where( 'key_hash', hash( 'sha256', strtolower( $key ) ) )->first();
		if ( ! $row || 'done' !== $row->status ) {
			return null; }
		if ( ! hash_equals( (string) $row->request_hash, hash( 'sha256', Database::json( self::canonical( $body ) ) ) ) ) {
			return Database::error( 'cff_idempotency_conflict', 'This key was already used for a different request.', 409 ); }
		return self::response( (string) $row->response, (int) $row->id );
	}

	/**
	 * @param array<string,mixed> $response */
	public function finish( int $id, array $response, int $code = 200 ): void {
		Database::query( 'requests' )->where( 'id', $id )->update(
			array(
				'status'        => 'done',
				'response'      => self::encrypt( Database::json( $response ), $id ),
				'response_code' => $code,
			)
		);
	}

	/** The stored scope hash for a scope such as "session:<publicId>:submit". */
	public static function scopeHash( string $scope ): string {
		return hash( 'sha256', self::SITE_ID . ':' . $scope );
	}

	/** @return array<string,mixed> */
	private static function response( string $stored, int $id ): array {
		$bytes = str_starts_with( $stored, 'e1.' ) ? base64_decode( substr( $stored, 3 ), true ) : false;
		if ( false === $bytes || strlen( $bytes ) < 29 ) {
			throw new \RuntimeException( 'Invalid encrypted receipt.' ); }
		$json = openssl_decrypt( substr( $bytes, 28 ), 'aes-256-gcm', self::key(), OPENSSL_RAW_DATA, substr( $bytes, 0, 12 ), substr( $bytes, 12, 16 ), 'cff-receipt:' . self::SITE_ID . ':' . $id );
		if ( false === $json ) {
			throw new \RuntimeException( 'Receipt authentication failed.' ); }
		return (array) json_decode( $json, false, 64, JSON_THROW_ON_ERROR );
	}
	private static function encrypt( string $json, int $id ): string {
		$iv         = random_bytes( 12 );
		$tag        = '';
		$ciphertext = openssl_encrypt( $json, 'aes-256-gcm', self::key(), OPENSSL_RAW_DATA, $iv, $tag, 'cff-receipt:' . self::SITE_ID . ':' . $id );
		if ( false === $ciphertext ) {
			throw new \RuntimeException( 'Receipt encryption failed.' ); }
		return 'e1.' . base64_encode( $iv . $tag . $ciphertext );
	}
	private static function key(): string {
		return Secret::derive( 'cff-receipt-key:' . self::SITE_ID ); }

	private static function canonical( mixed $value ): mixed {
		if ( is_object( $value ) ) {
			$value = (array) $value;
		}
		if ( is_array( $value ) ) {
			if ( ! array_is_list( $value ) ) {
				ksort( $value, SORT_STRING );
			}
			return array_map( array( self::class, 'canonical' ), $value );
		}
		return $value;
	}
}
