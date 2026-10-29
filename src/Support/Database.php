<?php
namespace ChatFlow\Laravel\Support;

use Illuminate\Support\Facades\DB;

/** Transaction and JSON helpers with the same surface as the plugin's Submissions\Database. */
final class Database {
	/** Table name with the configured prefix. */
	public static function table( string $name ): string {
		return (string) config( 'chatflow.table_prefix', 'cff_' ) . $name;
	}

	/** @return \Illuminate\Database\Query\Builder */
	public static function query( string $name ) {
		return DB::table( self::table( $name ) );
	}

	/**
	 * Runs $callback in a transaction. A returned Error rolls back and is returned.
	 * Throwables roll back and become a 500 storage error.
	 *
	 * @template T
	 * @param callable():T $callback
	 * @return T|Error
	 */
	public static function transaction( callable $callback ): mixed {
		$failed = null;
		try {
			return DB::transaction(
				static function () use ( $callback, &$failed ) {
					$result = $callback();
					if ( Error::is( $result ) ) {
						$failed = $result;
						throw new RollbackSignal();
					}
					return $result;
				}
			);
		} catch ( RollbackSignal ) {
			return $failed;
		} catch ( \Throwable $e ) {
			report( $e );
			return self::error( 'cff_storage_error', 'The request could not be stored.', 500 );
		}
	}

	/** Runs $callback after the current transaction commits (immediately when none is open). */
	public static function afterCommit( callable $callback ): void {
		DB::afterCommit( $callback );
	}

	/** @param array<string,mixed> $data */
	public static function error( string $code, string $message, int $status, array $data = array() ): Error {
		return new Error( $code, $message, array_merge( array( 'status' => $status ), $data ) );
	}

	/** UTC timestamp in the stored format. */
	public static function now(): string {
		return gmdate( 'Y-m-d H:i:s' );
	}

	public static function json( mixed $value ): string {
		$json = json_encode( $value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION );
		if ( false === $json ) {
			throw new \InvalidArgumentException( 'Value cannot be encoded as JSON.' );
		}
		return $json;
	}

	/** @return array<mixed> */
	public static function decode( mixed $json ): array {
		if ( ! is_string( $json ) || '' === $json ) {
			return array();
		}
		$value = json_decode( $json, true );
		return is_array( $value ) ? $value : array();
	}
}

/** @internal */
final class RollbackSignal extends \RuntimeException {}
