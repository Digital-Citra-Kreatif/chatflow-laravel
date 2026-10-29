<?php
namespace ChatFlow\Laravel\Fields;

final class NumberField extends AbstractField {
	public function type(): string {
		return 'number';
	}
}
