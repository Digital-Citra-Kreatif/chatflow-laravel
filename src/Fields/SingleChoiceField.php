<?php
namespace ChatFlow\Laravel\Fields;

final class SingleChoiceField extends AbstractField {
	public function type(): string {
		return 'single_choice';
	}
}
