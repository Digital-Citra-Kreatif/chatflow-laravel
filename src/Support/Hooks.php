<?php
namespace ChatFlow\Laravel\Support;

use Illuminate\Support\Facades\Event;

/**
 * Extension points. Actions are Laravel events named "chatflow.<name>" (for
 * example chatflow.submission_completed) with positional payloads; filters are
 * callbacks registered with ChatFlow\Laravel\ChatFlow::filter(). A failing
 * listener is reported and never breaks the visitor's request.
 */
final class Hooks {
	/** @var array<string, list<callable>> */
	private static array $filters = array();

	public static function addFilter( string $name, callable $callback ): void {
		self::$filters[ $name ][] = $callback;
	}

	public static function filter( string $name, mixed $value, mixed ...$args ): mixed {
		foreach ( self::$filters[ $name ] ?? array() as $callback ) {
			try {
				$value = $callback( $value, ...$args );
			} catch ( \Throwable $e ) {
				report( $e );
			}
		}
		return $value;
	}

	/** @param list<mixed> $args */
	public static function action( string $name, array $args = array() ): void {
		try {
			Event::dispatch( 'chatflow.' . $name, $args );
		} catch ( \Throwable $e ) {
			report( $e );
		}
	}

	/** @internal For tests. */
	public static function reset(): void {
		self::$filters = array();
	}
}
