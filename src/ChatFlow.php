<?php
namespace ChatFlow\Laravel;

use ChatFlow\Laravel\Support\Hooks;

/** Public extension API for host applications. */
final class ChatFlow {
	/**
	 * Registers a filter callback. Names match the plugin's filters without the
	 * "cff_" prefix, e.g. "submission_meta", "validate_answer", "redirect_url",
	 * "submission_payload", "email_args", "autoresponder_args".
	 */
	public static function filter( string $name, callable $callback ): void {
		Hooks::addFilter( $name, $callback );
	}
}
