<?php
namespace ChatFlow\Laravel\View\Components;

use ChatFlow\Laravel\Frontend\Renderer;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

/**
 * <x-chatflow::form :id="5" mode="inline" height="600" position="left" theme="auto" bottom-offset="80" />
 *
 * Options left out fall back to the form's own display settings.
 */
final class Form extends Component {
	public function __construct(
		public int $id,
		public string $mode = 'inline',
		public mixed $height = null,
		public string $position = '',
		public ?string $theme = null,
		public mixed $autoOpen = '',
		public mixed $scrollPercent = '',
		public mixed $bottomOffset = ''
	) {}

	public function render(): View {
		return view(
			'chatflow::frontend.component',
			array(
				'html' => Renderer::render(
					$this->id,
					array(
						'mode'           => $this->mode,
						'height'         => $this->height,
						'position'       => $this->position,
						'theme'          => $this->theme,
						'auto_open'      => $this->autoOpen,
						'scroll_percent' => $this->scrollPercent,
						'bottom_offset'  => $this->bottomOffset,
					)
				),
			)
		);
	}
}
