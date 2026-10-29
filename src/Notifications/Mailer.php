<?php
namespace ChatFlow\Laravel\Notifications;

use ChatFlow\Laravel\Forms\Form;
use ChatFlow\Laravel\Submissions\Submission;
use ChatFlow\Laravel\Support\Hooks;
use ChatFlow\Laravel\Support\Settings;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\HtmlString;

/**
 * Sends one notification with Laravel's mailer. Hosts can adjust the message
 * with the "email_args" (admin) and "autoresponder_args" filters; the argument
 * array keeps the plugin's wp_mail() shape: to, subject, message, headers
 * ("Name: value" strings) and attachments (absolute paths inside storage/app).
 * Returns the outcome code stored on the delivery row.
 */
final class Mailer {
	/** @param array<string,mixed> $notification */
	public function send( array $notification, Submission $submission, Form $form, bool $admin = false, ?string $test_recipient = null ): string {
		try {
			$rendered = ( new Renderer() )->render( $notification, $submission, $form, $admin );
			$settings = (array) ( Settings::get()['email'] ?? array() );
			$planner  = new Planner();
			$to       = $admin ? (array) ( $notification['to'] ?? array() ) : array( $planner->recipient( $submission, $form, (string) ( $notification['emailField'] ?? '' ) ) );
			$headers  = array( 'Content-Type: text/html; charset=UTF-8' );
			$from     = (string) ( $notification['fromEmail'] ?? $settings['fromEmail'] ?? '' );
			$name     = Html::strip( (string) ( $notification['fromName'] ?? $settings['fromName'] ?? Settings::siteName() ) );
			if ( self::isEmail( $from ) && ! preg_match( '/[\r\n<>]/', $name . $from ) ) {
				$headers[] = 'From: ' . $name . ' <' . $from . '>';
			}
			$reply = (string) ( $notification['replyTo'] ?? $settings['replyTo'] ?? '' );
			if ( $admin && ! empty( $notification['emailField'] ) ) {
				$reply = $planner->recipient( $submission, $form, (string) $notification['emailField'] );
			}
			if ( self::isEmail( $reply ) ) {
				$headers[] = 'Reply-To: ' . $reply;
			}
			foreach ( array(
				'cc'  => 'Cc',
				'bcc' => 'Bcc',
			) as $key => $header ) {
				foreach ( $admin ? (array) ( $notification[ $key ] ?? array() ) : array() as $email ) {
					if ( ! is_string( $email ) || ! self::isEmail( $email ) ) {
						return 'mail_invalid_recipient';
					}
					$headers[] = $header . ': ' . $email;
				}
			}
			// The media library is not available in this version, so stored attachment IDs cannot resolve.
			if ( ! empty( $notification['attachmentIds'] ) ) {
				return 'mail_invalid_attachment';
			}
			$args = array(
				'to'          => $to,
				'subject'     => $rendered['subject'],
				'message'     => $rendered['html'],
				'headers'     => $headers,
				'attachments' => array(),
			);
			$args = Hooks::filter( $admin ? 'email_args' : 'autoresponder_args', $args, $submission, $form );
			if ( ! is_array( $args ) ) {
				return 'mail_invalid_arguments';
			}
			// Test requests never accidentally contact real recipients, even after filters.
			if ( null !== $test_recipient ) {
				$args['to']      = array( $test_recipient );
				$args['headers'] = array_values( array_filter( (array) ( $args['headers'] ?? array() ), static fn( $header ): bool => is_string( $header ) && ! preg_match( '/^(?:Cc|Bcc):/i', $header ) ) );
			}
			$args['to'] = (array) ( $args['to'] ?? array() );
			if ( ! $args['to'] || ! is_string( $args['subject'] ?? null ) || ! is_string( $args['message'] ?? null ) || preg_match( '/[\r\n]/', $args['subject'] ) || ! is_array( $args['headers'] ?? null ) || ! is_array( $args['attachments'] ?? null ) ) {
				return 'mail_invalid_arguments';
			}
			foreach ( $args['to'] as $recipient ) {
				if ( ! is_string( $recipient ) || ! self::isEmail( $recipient ) ) {
					return 'mail_invalid_recipient';
				}
			}
			$parsed = array();
			foreach ( $args['headers'] as $header ) {
				if ( ! is_string( $header ) || preg_match( '/[\r\n\x00]/', $header ) || ! preg_match( '/^([A-Za-z0-9-]+):\s*(.*)$/', $header, $match ) ) {
					return 'mail_invalid_headers';
				}
				$parsed[] = array( strtolower( $match[1] ), $match[1], trim( $match[2] ) );
			}
			$root = realpath( storage_path( 'app' ) );
			foreach ( $args['attachments'] as $attachment ) {
				$path = is_string( $attachment ) ? realpath( $attachment ) : false;
				if ( ! $path || ! $root || ! str_starts_with( $path, $root . DIRECTORY_SEPARATOR ) || ! is_file( $path ) || ! is_readable( $path ) ) {
					return 'mail_invalid_attachment';
				}
			}
			$plain = $args['message'] === $rendered['html'] ? $rendered['plain'] : Html::strip( $args['message'] );
			Mail::send(
				array(
					'html' => new HtmlString( $args['message'] ),
					'text' => new HtmlString( $plain ),
				),
				array(),
				static function ( Message $message ) use ( $args, $parsed ): void {
					$message->to( $args['to'] )->subject( $args['subject'] );
					foreach ( $parsed as [$key, $name, $value] ) {
						if ( 'content-type' === $key ) {
							continue;
						}
						if ( in_array( $key, array( 'from', 'reply-to', 'cc', 'bcc' ), true ) ) {
							$address = self::address( $value );
							if ( null === $address ) {
								throw new \InvalidArgumentException( 'Invalid address header.' );
							}
							match ( $key ) {
								'from'     => $message->from( $address[0], $address[1] ),
								'reply-to' => $message->replyTo( $address[0], $address[1] ),
								'cc'       => $message->cc( $address[0], $address[1] ),
								'bcc'      => $message->bcc( $address[0], $address[1] ),
							};
							continue;
						}
						$message->getSymfonyMessage()->getHeaders()->addTextHeader( $name, $value );
					}
					foreach ( $args['attachments'] as $attachment ) {
						$message->attach( $attachment );
					}
				}
			);
			return 'sent';
		} catch ( \Throwable $e ) {
			report( $e );
			return 'mail_exception';
		}
	}

	public static function isEmail( string $value ): bool {
		return '' !== $value && strlen( $value ) <= 254 && ! preg_match( '/[\r\n\x00]/', $value ) && false !== filter_var( $value, FILTER_VALIDATE_EMAIL );
	}

	/** "Name <email>" or "email" to [email, name|null]. @return array{string,?string}|null */
	private static function address( string $value ): ?array {
		if ( preg_match( '/^(.*?)\s*<([^<>]+)>$/', $value, $match ) ) {
			$email = trim( $match[2] );
			$name  = trim( $match[1], " \t\"" );
			return self::isEmail( $email ) ? array( $email, '' === $name ? null : $name ) : null;
		}
		return self::isEmail( $value ) ? array( $value, null ) : null;
	}
}
