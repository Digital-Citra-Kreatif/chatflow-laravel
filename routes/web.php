<?php
// Full-page form route: /{config('chatflow.fullpage_base')}/{slug}. Disabled when the base is null.

use ChatFlow\Laravel\Frontend\FullPageController;
use Illuminate\Support\Facades\Route;

$chatflow_base = config( 'chatflow.fullpage_base' );
if ( is_string( $chatflow_base ) && '' !== trim( $chatflow_base, '/' ) ) {
	Route::middleware( 'web' )
		->get( trim( $chatflow_base, '/' ) . '/{slug}', FullPageController::class )
		->where( 'slug', '[a-z0-9-]+' )
		->name( 'chatflow.fullpage' );
}
unset( $chatflow_base );
