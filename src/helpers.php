<?php

use ChatFlow\Laravel\Frontend\Renderer;

if ( ! function_exists( 'chatflow' ) ) {
	/**
	 * Renders a published ChatFlow form.
	 *
	 * @param array<string,mixed> $options mode, height, position, theme, auto_open, scroll_percent
	 */
	function chatflow( int $id, array $options = array() ): string {
		return Renderer::render( $id, $options );
	}
}
