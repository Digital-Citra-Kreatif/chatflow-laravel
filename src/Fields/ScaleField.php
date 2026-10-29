<?php
namespace ChatFlow\Laravel\Fields;

final class ScaleField extends AbstractField {
	public function type(): string {
		return 'scale';
	}
}
