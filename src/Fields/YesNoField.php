<?php
namespace ChatFlow\Laravel\Fields;

final class YesNoField extends AbstractField {
	public function type(): string {
		return 'yes_no';
	}
}
