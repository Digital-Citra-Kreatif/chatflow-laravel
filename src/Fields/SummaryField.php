<?php
namespace ChatFlow\Laravel\Fields;

final class SummaryField extends AbstractField {
	public function type(): string {
		return 'summary';
	}
}
