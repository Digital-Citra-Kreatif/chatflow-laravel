<?php
namespace ChatFlow\Laravel\Fields;

final class RatingField extends AbstractField {
	public function type(): string {
		return 'rating';
	}
}
