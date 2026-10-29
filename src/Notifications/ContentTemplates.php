<?php
namespace ChatFlow\Laravel\Notifications;

use ChatFlow\Laravel\Support\Database;
use ChatFlow\Laravel\Support\Error;
use Illuminate\Support\Str;

/** Reusable email subject/body templates, stored as one row of the "settings" table. */
final class ContentTemplates {
	private const KEY = 'email_content_templates';

	/** @return list<array{id:string,title:string,subject:string,body:string}> */
	public function all(): array {
		$items = Database::decode( Database::query( 'settings' )->where( 'name', self::KEY )->value( 'value' ) );
		return array_values( array_filter( $items, static fn( $item ): bool => is_array( $item ) && isset( $item['id'], $item['title'], $item['subject'], $item['body'] ) ) );
	}

	/** @param array<string,mixed> $body
	 * @return list<array{id:string,title:string,subject:string,body:string}>|Error */
	public function add( array $body ): array|Error {
		return Database::transaction(
			function () use ( $body ): array|Error {
				Database::query( 'settings' )->where( 'name', self::KEY )->lockForUpdate()->value( 'name' );
				$templates = $this->all();
				if ( array_diff( array_keys( $body ), array( 'title', 'subject', 'body' ) ) || ! is_string( $body['title'] ?? null ) || ! trim( $body['title'] ) || strlen( $body['title'] ) > 200 || ! is_string( $body['subject'] ?? null ) || strlen( $body['subject'] ) > 500 || preg_match( '/[\r\n]/', $body['subject'] ) || ! is_string( $body['body'] ?? null ) || strlen( $body['body'] ) > 100000 || count( $templates ) >= 50 ) {
					return Database::error( 'cff_template_invalid', 'Choose a title and bounded email content (maximum 50 templates).', 422 );
				}
				$templates[] = array(
					'id'      => (string) Str::uuid(),
					'title'   => self::text( $body['title'] ),
					'subject' => self::text( $body['subject'] ),
					'body'    => Html::clean( $body['body'] ),
				);
				$this->save( $templates );
				return $templates;
			}
		);
	}

	/** @return list<array{id:string,title:string,subject:string,body:string}>|Error */
	public function remove( mixed $id ): array|Error {
		if ( ! is_string( $id ) || ! Str::isUuid( $id ) ) {
			return Database::error( 'cff_template_invalid', 'Template ID required.', 422 );
		}
		return Database::transaction(
			function () use ( $id ): array {
				Database::query( 'settings' )->where( 'name', self::KEY )->lockForUpdate()->value( 'name' );
				$templates = array_values( array_filter( $this->all(), static fn( array $template ): bool => $template['id'] !== $id ) );
				$this->save( $templates );
				return $templates;
			}
		);
	}

	/** @param list<array<string,string>> $templates */
	private function save( array $templates ): void {
		Database::query( 'settings' )->upsert(
			array(
				'name'       => self::KEY,
				'value'      => Database::json( $templates ),
				'updated_at' => Database::now(),
			),
			array( 'name' ),
			array( 'value', 'updated_at' )
		);
	}

	/** Single-line plain text, like sanitize_text_field(). */
	private static function text( string $value ): string {
		return trim( preg_replace( '/[\r\n\t ]+/', ' ', Html::strip( $value ) ) ?? '' );
	}
}
