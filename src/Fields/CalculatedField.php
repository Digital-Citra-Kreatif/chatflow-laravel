<?php
namespace ChatFlow\Laravel\Fields;

final class CalculatedField extends AbstractField {
	public function type(): string {
		return 'calculated'; }
}
