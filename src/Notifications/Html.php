<?php
namespace ChatFlow\Laravel\Notifications;

/**
 * A small allowlist HTML sanitiser for email bodies, standing in for the
 * plugin's wp_kses( $html, Renderer::allowedHtml() ). Disallowed elements are
 * unwrapped (their text is kept); script-like elements are removed with their
 * content; attributes outside the allowlist, unsafe URLs and unsafe inline
 * styles are dropped.
 */
final class Html {
	private const PROTOCOLS = array( 'https', 'http', 'mailto', 'tel' );
	private const DROP      = array( 'script', 'style', 'iframe', 'object', 'embed', 'template', 'noscript', 'svg', 'math', 'head', 'title', 'textarea', 'select', 'form' );

	/** @param array<string,array<string,bool>>|null $allowed */
	public static function clean( string $html, ?array $allowed = null ): string {
		$allowed ??= Renderer::allowedHtml();
		if ( '' === trim( $html ) ) {
			return $html;
		}
		if ( ! mb_check_encoding( $html, 'UTF-8' ) ) {
			return '';
		}
		$document = new \DOMDocument( '1.0', 'UTF-8' );
		$previous = libxml_use_internal_errors( true );
		try {
			$document->loadHTML( '<?xml encoding="UTF-8"?><!DOCTYPE html><html><body><div id="cff-root">' . $html . '</div></body></html>', LIBXML_NONET | LIBXML_HTML_NODEFDTD );
		} finally {
			libxml_clear_errors();
			libxml_use_internal_errors( $previous );
		}
		$root = $document->getElementById( 'cff-root' );
		if ( ! $root ) {
			return '';
		}
		self::walk( $root, $allowed );
		$output = '';
		foreach ( iterator_to_array( $root->childNodes ) as $child ) {
			$output .= (string) $document->saveHTML( $child );
		}
		return $output;
	}

	/** @param array<string,array<string,bool>> $allowed */
	private static function walk( \DOMNode $node, array $allowed ): void {
		foreach ( iterator_to_array( $node->childNodes ) as $child ) {
			if ( $child instanceof \DOMText ) {
				continue;
			}
			if ( ! $child instanceof \DOMElement ) {
				// Comments, processing instructions, CDATA.
				$node->removeChild( $child );
				continue;
			}
			$name = strtolower( $child->nodeName );
			if ( in_array( $name, self::DROP, true ) ) {
				$node->removeChild( $child );
				continue;
			}
			self::walk( $child, $allowed );
			if ( ! isset( $allowed[ $name ] ) ) {
				while ( $child->firstChild ) {
					$node->insertBefore( $child->firstChild, $child );
				}
				$node->removeChild( $child );
				continue;
			}
			foreach ( iterator_to_array( $child->attributes ) as $attribute ) {
				$attr  = strtolower( $attribute->nodeName );
				$value = (string) $attribute->nodeValue;
				$keep  = ! empty( $allowed[ $name ][ $attr ] );
				if ( $keep && in_array( $attr, array( 'href', 'src' ), true ) ) {
					$keep = self::safeUrl( $value );
				} elseif ( $keep && 'style' === $attr ) {
					$keep = self::safeStyle( $value );
				}
				if ( ! $keep ) {
					$child->removeAttribute( $attribute->nodeName );
				}
			}
		}
	}

	public static function safeUrl( string $url ): bool {
		$url = trim( html_entity_decode( $url, ENT_QUOTES | ENT_HTML5, 'UTF-8' ) );
		if ( '' === $url || preg_match( '/[\x00-\x1f\x7f]/', $url ) ) {
			return false;
		}
		if ( preg_match( '/^([a-z][a-z0-9+.-]*):/i', $url, $match ) ) {
			return in_array( strtolower( $match[1] ), self::PROTOCOLS, true );
		}
		// Relative URLs and fragments carry no scheme.
		return ! str_starts_with( $url, '//' ) || false !== filter_var( 'https:' . $url, FILTER_VALIDATE_URL );
	}

	private static function safeStyle( string $style ): bool {
		return strlen( $style ) <= 1000 && ! preg_match( '/expression|javascript|vbscript|url\s*\(|@import|behavior|[\\\\<>]|\/\*/i', $style );
	}

	/** Paragraphs from blank lines and <br> from single newlines, like a minimal wpautop(). */
	public static function autop( string $text ): string {
		$text = str_replace( array( "\r\n", "\r" ), "\n", trim( $text ) );
		if ( '' === $text ) {
			return '';
		}
		$block  = '(?:table|thead|tfoot|caption|tbody|tr|td|th|div|ul|ol|li|pre|blockquote|h[1-6]|hr|p)';
		$chunks = preg_split( '/\n\s*\n/', $text ) ?: array( $text );
		$html   = '';
		foreach ( $chunks as $chunk ) {
			$chunk = trim( $chunk );
			if ( '' === $chunk ) {
				continue;
			}
			if ( preg_match( '#^</?' . $block . '[\s/>]#i', $chunk ) ) {
				$html .= preg_replace( '#(?<!>)\n(?!\s*</?' . $block . '[\s/>])#i', "<br />\n", $chunk ) . "\n";
				continue;
			}
			$html .= '<p>' . str_replace( "\n", "<br />\n", $chunk ) . "</p>\n";
		}
		return $html;
	}

	public static function e( mixed $value ): string {
		return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, 'UTF-8' );
	}

	/** Plain text like wp_strip_all_tags(). */
	public static function strip( string $html ): string {
		return trim( \ChatFlow\Laravel\Support\Text::stripTags( $html ) );
	}
}
