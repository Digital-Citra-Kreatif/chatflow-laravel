<?php
namespace ChatFlow\Laravel\Submissions;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Logic\Interpolator;
use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use ChatFlow\Laravel\Support\Hooks;

final class Ending {
	/** @return array<string,mixed>|Error */
	public function build( Submission $submission, Form $form, ?string $id ): array|Error {
		$endings = $form->schema()['endings'];
		$id      = $id ? $id : ( $form->settings()['completion']['defaultEndingId'] ?? ( $endings[0]['id'] ?? '' ) );
		$ending  = null;
		foreach ( $endings as $candidate ) {
			if ( $candidate['id'] === $id ) {
				$ending = $candidate;
				break; }
		}
		if ( ! $ending ) {
			return Database::error( 'cff_invalid_ending', 'No valid completion ending.', 422 ); }
		$answers = $submission->answers();
		$meta    = $submission->meta();
		$public  = array(
			'id'       => $ending['id'],
			'type'     => $ending['type'],
			// Messages render as Markdown in the chat: substituted values must stay literal text.
			'messages' => array_map( fn( $text ) => Interpolator::interpolate( $text, self::escapeMarkdown( $answers ), self::escapeMarkdown( $meta ) ), $ending['messages'] ?? array() ),
			'buttons'  => array(),
		);
		foreach ( $ending['buttons'] ?? array() as $button ) {
			$item = array(
				'id'     => $button['id'],
				'label'  => Interpolator::interpolate( $button['label'], $answers, $meta ),
				'action' => $button['action'],
			);
			if ( 'link' === $button['action'] ) {
				$url = Interpolator::interpolateUrl( $button['url'] ?? '', $answers, $meta );
				$url = self::validateUrl( $url, $form );
				if ( null === $url ) {
					return Database::error( 'cff_unsafe_url', 'A completion link is not allowed.', 422 ); }
				$item['url'] = $url;
			}
			$public['buttons'][] = $item;
		}
		$response = array(
			'submission' => array(
				'uuid'   => $submission->uuid(),
				'status' => 'completed',
			),
			'ending'     => $public,
		);
		if ( 'redirect' === $ending['type'] ) {
			$url = Interpolator::interpolateUrl( $ending['url'] ?? '', $answers, $meta );
			if ( $ending['appendQuery'] ?? false ) {
				$values = array_intersect_key( $answers, array_flip( $ending['queryKeys'] ?? array() ) );
				foreach ( $values as $key => $value ) {
					if ( ! is_scalar( $value ) ) {
						unset( $values[ $key ] ); }
				}
				$url = self::addQueryArgs( $values, $url );
			}
			if ( $ending['appendSubmission'] ?? false ) {
				$url = self::addQueryArgs( array( 'submission' => $submission->uuid() ), $url ); }
			$url = Hooks::filter( 'redirect_url', $url, $submission, $form );
			$url = is_string( $url ) ? self::validateUrl( $url, $form ) : null;
			if ( null === $url ) {
				return Database::error( 'cff_unsafe_redirect', 'The completion redirect is not allowed.', 422 ); }
			$response['redirectUrl']       = $url;
			$response['ending']['delayMs'] = $ending['delayMs'] ?? 0;
		}
		return $response;
	}

	public static function validateUrl( string $url, Form $form ): ?string {
		if ( '' === $url || strlen( $url ) > 8000 || preg_match( '/[\x00-\x20\x7f\\\\]/', $url ) || preg_match( '/%(?:0[ad]|5c)/i', $url ) ) {
			return null; }
		$home = rtrim( url( '/' ), '/' );
		if ( str_starts_with( $url, '/' ) && ! str_starts_with( $url, '//' ) ) {
			return $home . $url; }
		$parts = parse_url( $url );
		$site  = parse_url( $home );
		if ( ! is_array( $parts ) || empty( $parts['host'] ) || isset( $parts['user'] ) || isset( $parts['pass'] ) ) {
			return null; }
		$site  = is_array( $site ) ? $site : array();
		$same  = strtolower( $parts['host'] ) === strtolower( $site['host'] ?? '' ) && ( $parts['port'] ?? null ) === ( $site['port'] ?? null );
		// Official WhatsApp click-to-chat hosts are always allowed (https only, below).
		$hosts = array_merge( array( 'wa.me', 'api.whatsapp.com' ), array_map( 'strtolower', $form->settings()['completion']['allowedRedirectHosts'] ?? array() ) );
		if ( ! $same && ( ! in_array( strtolower( $parts['host'] ), $hosts, true ) || isset( $parts['port'] ) ) ) {
			return null; }
		if ( 'https' !== strtolower( $parts['scheme'] ?? '' ) && ! ( $same && 'http' === ( $parts['scheme'] ?? '' ) && 'http' === ( $site['scheme'] ?? '' ) ) ) {
			return null; }
		return $url;
	}

	/**
	 * Adds or replaces query arguments, like WordPress's add_query_arg(), except
	 * that the new values are URL-encoded. false removes a key; null is skipped.
	 *
	 * @param array<string,mixed> $args
	 */
	public static function addQueryArgs( array $args, string $url ): string {
		$fragment = '';
		$hash     = strpos( $url, '#' );
		if ( false !== $hash ) {
			$fragment = substr( $url, $hash );
			$url      = substr( $url, 0, $hash );
		}
		$query = '';
		$mark  = strpos( $url, '?' );
		if ( false !== $mark ) {
			$query = substr( $url, $mark + 1 );
			$url   = substr( $url, 0, $mark );
		}
		$pairs = array();
		foreach ( '' === $query ? array() : explode( '&', $query ) as $pair ) {
			$name = urldecode( explode( '=', $pair, 2 )[0] );
			if ( '' !== $pair && ! array_key_exists( $name, $args ) ) {
				$pairs[] = $pair;
			}
		}
		foreach ( $args as $name => $value ) {
			if ( false === $value || null === $value ) {
				continue;
			}
			$pairs[] = rawurlencode( (string) $name ) . '=' . rawurlencode( true === $value ? '1' : (string) $value );
		}
		return $url . ( $pairs ? '?' . implode( '&', $pairs ) : '' ) . $fragment;
	}

	/** Backslash-escape the runtime's Markdown syntax ([]()*\\) in every string value. */
	public static function escapeMarkdown( mixed $value ): mixed {
		if ( is_string( $value ) ) {
			return preg_replace( '/[\\\\\[\]()*]/', '\\\\$0', $value ) ?? $value;
		}
		if ( is_array( $value ) ) {
			return array_map( array( self::class, 'escapeMarkdown' ), $value );
		}
		return $value;
	}
}
