<?php
namespace ChatFlow\Laravel\Fields;

final class PhoneField extends AbstractField {
	public function type(): string {
		return 'phone';
	}
}
