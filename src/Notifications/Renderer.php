<?php
namespace ChatFlow\Laravel\Notifications;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Integrations\Payload;
use ChatFlow\Laravel\Logic\Interpolator;
use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Support\Settings;

final class Renderer {
	/**
	 * @param array<string,mixed> $notification
	 * @return array{subject:string,html:string,plain:string}
	 */
	public function render( array $notification, Submission $submission, Form $form, bool $admin = false ): array {
		$payload    = Payload::build( $submission, $form );
		$plain_tags = array(
			'form_title'    => $form->title(),
			'submission_id' => $submission->uuid(),
			'site_name'     => Settings::siteName(),
			'date'          => $submission->createdAt(),
			'admin_link'    => $admin ? self::adminLink( $submission->id() ) : '',
			'all_answers'   => $this->plainAnswers( $payload['fields'] ),
			'meta_table'    => $this->plainMeta( $payload['meta'] ),
		);
		$subject    = $this->plain( (string) ( $notification['subject'] ?? '' ), $submission->answers(), $payload['meta'], $plain_tags );
		$subject    = trim( preg_replace( '/[\r\n\x00-\x1f\x7f]+/', ' ', Html::strip( $subject ) ) ?? '' );
		$source     = (string) ( $notification['body'] ?? '' );
		$rich       = array(
			'all_answers' => $this->table( $payload['fields'], 'label' ),
			'meta_table'  => $this->metaTable( $payload['meta'] ),
			'admin_link'  => $admin ? '<a href="' . Html::e( $plain_tags['admin_link'] ) . '">' . Html::e( __( 'View submission' ) ) . '</a>' : '',
		);
		$source     = Html::clean( $source );
		$body       = preg_replace_callback(
			'/\[cff_button\s+([^\]]+)\]([^\[]*)\[\/cff_button\]/',
			function ( array $matches ) use ( $submission, $payload, $plain_tags ): string {
				$attributes = self::attributes( $matches[1] );
				$url        = Interpolator::interpolateUrl( html_entity_decode( (string) ( $attributes['url'] ?? '' ), ENT_QUOTES | ENT_HTML5, 'UTF-8' ), $submission->answers(), $payload['meta'] );
				if ( 'https' !== parse_url( $url, PHP_URL_SCHEME ) || false === filter_var( $url, FILTER_VALIDATE_URL ) ) {
					return '';
				}
				return '<p><a href="' . Html::e( $url ) . '" style="display:inline-block;padding:12px 20px;background:#262626;color:#fff;text-decoration:none">' . Html::e( html_entity_decode( $this->plain( $matches[2], $submission->answers(), $payload['meta'], $plain_tags ), ENT_QUOTES | ENT_HTML5, 'UTF-8' ) ) . '</a></p>';
			},
			$source
		) ?? '';
		$body       = preg_replace_callback(
			'/\{\{\s*([^{}]+?)\s*\}\}/',
			static function ( array $matches ) use ( $submission, $payload, $plain_tags, $rich ): string {
				$key = trim( $matches[1] );
				if ( isset( $rich[ $key ] ) ) {
					return $rich[ $key ];
				}
				$value = $plain_tags[ $key ] ?? Interpolator::interpolate( $matches[0], $submission->answers(), $payload['meta'] );
				return Html::e( $value );
			},
			$body
		) ?? '';
		$body       = Html::clean( Html::autop( $body ) );
		$plain      = $this->plain( $source, $submission->answers(), $payload['meta'], $plain_tags );
		$plain      = html_entity_decode( Html::strip( preg_replace( '/\[\/?cff_button[^\]]*\]/', '', $plain ) ?? '' ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
		$branding   = (array) ( Settings::get()['email'] ?? array() );
		$title      = $form->title();
		$content    = view( 'chatflow::emails.' . ( $admin ? 'admin' : 'autoresponder' ), array( 'title' => $title, 'body' => $body ) )->render();
		$color      = is_string( $branding['brandColor'] ?? null ) && preg_match( '/^#(?:[0-9a-f]{3}){1,2}$/i', $branding['brandColor'] ) ? $branding['brandColor'] : '#262626';
		$logo       = is_string( $branding['logoUrl'] ?? null ) && 'https' === parse_url( $branding['logoUrl'], PHP_URL_SCHEME ) ? $branding['logoUrl'] : '';
		$html       = view(
			'chatflow::emails.layout',
			array(
				'title'    => $title,
				'content'  => Html::clean( $content ),
				'color'    => $color,
				'logo'     => $logo,
				'siteName' => Settings::siteName(),
				'footer'   => is_string( $branding['footerText'] ?? null ) && '' !== $branding['footerText'] ? $branding['footerText'] : Settings::siteName(),
			)
		)->render();
		return array(
			'subject' => $subject,
			'html'    => $html,
			'plain'   => $plain,
		);
	}

	/** The admin inbox URL for one submission (the {{admin_link}} merge tag). */
	public static function adminLink( int $id ): string {
		try {
			return route(
				'chatflow.admin.index',
				array(
					'page'       => 'cff-submissions',
					'submission' => $id,
				)
			);
		} catch ( \Throwable ) {
			return url( trim( (string) config( 'chatflow.admin.prefix', 'chatflow/admin' ), '/' ) ) . '?page=cff-submissions&submission=' . $id;
		}
	}

	/** Shortcode-style attributes: url="…", url='…' or url=bare. @return array<string,string> */
	private static function attributes( string $text ): array {
		$result = array();
		if ( preg_match_all( '/([a-z_][a-z0-9_-]*)\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|(\S+))/i', $text, $matches, PREG_SET_ORDER ) ) {
			foreach ( $matches as $match ) {
				$result[ strtolower( $match[1] ) ] = (string) ( $match[4] ?? '' ) !== '' ? $match[4] : ( (string) ( $match[3] ?? '' ) !== '' ? $match[3] : $match[2] );
			}
		}
		return $result;
	}

	/**
	 * @param array<string,mixed> $answers
	 * @param array<string,mixed> $meta
	 * @param array<string,string> $tags
	 */
	private function plain( string $text, array $answers, array $meta, array $tags ): string {
		return preg_replace_callback( '/\{\{\s*([^{}]+?)\s*\}\}/', static fn( array $matches ): string => $tags[ trim( $matches[1] ) ] ?? Interpolator::interpolate( $matches[0], $answers, $meta ), $text ) ?? '';
	}

	/** @param list<array<string,mixed>> $fields */
	private function plainAnswers( array $fields ): string {
		return implode( "\n", array_map( static fn( array $field ): string => $field['label'] . ': ' . Interpolator::interpolate( '{{value}}', array( 'value' => $field['value'] ) ), $fields ) );
	}

	/** @param array<string,mixed> $meta */
	private function plainMeta( array $meta ): string {
		$lines = array();
		foreach ( $meta as $key => $value ) {
			$lines[] = $key . ': ' . Interpolator::interpolate( '{{value}}', array( 'value' => $value ) );
		}
		return implode( "\n", $lines );
	}

	/** @param array<string,mixed> $meta */
	private function metaTable( array $meta ): string {
		$rows = array();
		foreach ( $meta as $key => $value ) {
			$rows[] = array(
				'label' => $key,
				'value' => $value,
			);
		}
		return $this->table( $rows, 'label' );
	}

	/** @param list<array<string,mixed>> $rows */
	private function table( array $rows, string $label ): string {
		$html = '<table style="width:100%;border-collapse:collapse"><tbody>';
		foreach ( $rows as $row ) {
			$value = Interpolator::interpolate( '{{value}}', array( 'value' => $row['value'] ) );
			$html .= '<tr><th style="padding:8px;border-bottom:1px solid #ddd;text-align:left">' . Html::e( $row[ $label ] ) . '</th><td style="padding:8px;border-bottom:1px solid #ddd">' . nl2br( Html::e( $value ) ) . '</td></tr>';
		}
		return $html . '</tbody></table>';
	}

	/** @return array<string,array<string,bool>> */
	public static function allowedHtml(): array {
		return array(
			'p'          => array( 'style' => true ),
			'br'         => array(),
			'strong'     => array(),
			'b'          => array(),
			'em'         => array(),
			'i'          => array(),
			'a'          => array(
				'href'  => true,
				'style' => true,
				'title' => true,
			),
			'ul'         => array(),
			'ol'         => array(),
			'li'         => array(),
			'h1'         => array(),
			'h2'         => array(),
			'h3'         => array(),
			'blockquote' => array(),
			'hr'         => array(),
			'img'        => array(
				'src'    => true,
				'alt'    => true,
				'width'  => true,
				'height' => true,
				'style'  => true,
			),
			'table'      => array( 'style' => true ),
			'tbody'      => array(),
			'tr'         => array(),
			'th'         => array( 'style' => true ),
			'td'         => array( 'style' => true ),
		);
	}
}
