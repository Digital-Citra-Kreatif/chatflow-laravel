<?php
// Admin screens and admin JSON API. Paths are relative to config('chatflow.admin.prefix');
// names are prefixed with "chatflow.admin.".

use ChatFlow\Laravel\Http\Controllers\Admin\PageController;
use Illuminate\Support\Facades\Route;

// Screens: ?page=cff-forms | cff-builder | cff-submissions, like wp-admin/admin.php.
Route::get( '/', array( PageController::class, 'index' ) )->name( 'index' );
Route::post( 'forms/{id}/restore', array( PageController::class, 'restore' ) )->whereNumber( 'id' )->name( 'forms.restore' );
Route::post( 'forms/{id}/delete', array( PageController::class, 'destroy' ) )->whereNumber( 'id' )->name( 'forms.destroy' );

// JSON API used by the React apps: restUrl ({prefix}/api/) + "admin/…".
Route::prefix( 'api/admin' )->name( 'api.' )->group( __DIR__ . '/admin-api.php' );
