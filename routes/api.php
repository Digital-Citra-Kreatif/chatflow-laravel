<?php
// Public visitor API (stateless: no session, no CSRF). Paths are relative to
// config('chatflow.api.prefix'); route names are prefixed with "chatflow.api.".

use ChatFlow\Laravel\Http\Controllers\Api\FormController;
use ChatFlow\Laravel\Http\Controllers\Api\SessionController;
use ChatFlow\Laravel\Http\Middleware\PublicBoundary;
use Illuminate\Support\Facades\Route;

Route::middleware( PublicBoundary::class )->group(
	function (): void {
		$session = '[a-fA-F0-9-]{36}';
		Route::get( 'forms/{id}', array( FormController::class, 'show' ) )->where( 'id', '\d+' )->name( 'forms.show' );
		Route::get( 'forms/{id}/engagement', array( FormController::class, 'engagement' ) )->where( 'id', '\d+' )->name( 'forms.engagement' );
		Route::post( 'forms/{id}/start-token', array( FormController::class, 'startToken' ) )->where( 'id', '\d+' )->name( 'forms.start-token' );
		Route::post( 'forms/{id}/view', array( FormController::class, 'view' ) )->where( 'id', '\d+' )->name( 'forms.view' );
		Route::post( 'sessions', array( SessionController::class, 'start' ) )->name( 'sessions.start' );
		Route::post( 'sessions/resume', array( SessionController::class, 'resume' ) )->name( 'sessions.resume' );
		Route::post( 'sessions/magic-resume', array( SessionController::class, 'magicResume' ) )->name( 'sessions.magic-resume' );
		Route::get( 'sessions/{uuid}', array( SessionController::class, 'show' ) )->where( 'uuid', $session )->name( 'sessions.show' );
		Route::patch( 'sessions/{uuid}', array( SessionController::class, 'patch' ) )->where( 'uuid', $session )->name( 'sessions.patch' );
		Route::delete( 'sessions/{uuid}', array( SessionController::class, 'destroy' ) )->where( 'uuid', $session )->name( 'sessions.destroy' );
		Route::post( 'sessions/{uuid}/submit', array( SessionController::class, 'submit' ) )->where( 'uuid', $session )->name( 'sessions.submit' );
		Route::post( 'sessions/{uuid}/events', array( SessionController::class, 'events' ) )->where( 'uuid', '[a-f0-9-]{36}' )->name( 'sessions.events' );
		Route::post( 'sessions/{uuid}/uploads', array( SessionController::class, 'upload' ) )->where( 'uuid', '[a-f0-9-]{36}' )->name( 'sessions.uploads' );
		Route::post( 'sessions/{uuid}/magic-link', array( SessionController::class, 'magicLink' ) )->where( 'uuid', $session )->name( 'sessions.magic-link' );
	}
);
