<?php
namespace ChatFlow\Laravel\Fields;

final class StatementField extends AbstractField {
	public function type(): string {
		return 'statement';
	}
}
