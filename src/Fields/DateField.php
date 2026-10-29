<?php
namespace ChatFlow\Laravel\Fields;

final class DateField extends AbstractField {
	public function type(): string {
		return 'date';
	}
}
