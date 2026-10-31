<?php
namespace ChatFlow\Laravel\Support;

/**
 * Removes markup from plain text without eating ordinary text. PHP's strip_tags() treats
 * any "<" followed by a non-space as a tag and drops everything after it, so an answer
 * like "I need <5 people" became "I need". Here only real markup goes: script and style
 * blocks, comments, and tags (a "<" followed by a letter, "/" or "!"); "<5", "a < b"
 * and "<3" stay. Output is still escaped wherever it is shown.
 */
final class Text {
	public static function stripTags( string $value ): string {
		$text = preg_replace( '@<(script|style)\b[^>]*>.*?</\1\s*>@si', '', $value ) ?? '';
		$text = preg_replace( '/<!--.*?(?:-->|$)/s', '', $text ) ?? '';
		return preg_replace( '#</?[a-z][^>]*(?:>|$)|<![^>]*>#i', '', $text ) ?? '';
	}
}
