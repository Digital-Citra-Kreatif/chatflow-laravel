<?php
namespace ChatFlow\Laravel\Support;

/**
 * A failed result, shaped like WordPress's WP_Error so ported code keeps its
 * `return new Error(...)` / `Error::is($x)` flow. Renders as the API error
 * envelope `{code, message, data: {status, …}}` the JavaScript clients expect.
 */
final class Error {
	/** @param array<string,mixed> $data */
	public function __construct( private string $code, private string $message, private array $data = array() ) {}

	public static function is( mixed $value ): bool {
		return $value instanceof self;
	}

	public function code(): string {
		return $this->code;
	}

	public function message(): string {
		return $this->message;
	}

	/** @return array<string,mixed> */
	public function data(): array {
		return $this->data;
	}

	public function status(): int {
		return (int) ( $this->data['status'] ?? 500 );
	}

	/** @return array{code:string,message:string,data:array<string,mixed>} */
	public function toArray(): array {
		return array(
			'code'    => $this->code,
			'message' => $this->message,
			'data'    => (object) $this->data,
		);
	}
}
