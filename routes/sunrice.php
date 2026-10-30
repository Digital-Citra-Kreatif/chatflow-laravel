<?php
// ChatFlow pages in the Sunrice panel, under "{panel path}/chatflow", named
// "sunrice.admin.chatflow.*". The panel already requires sign-in and its access permission.

use ChatFlow\Laravel\Sunrice\Http\PagesController;
use Illuminate\Support\Facades\Route;

$manage = 'can:chatflow.manage-forms';
$view   = 'can:chatflow.view-submissions';

Route::get( 'forms', array( PagesController::class, 'forms' ) )->middleware( $manage )->name( 'forms.index' );
Route::get( 'forms/create', array( PagesController::class, 'create' ) )->middleware( $manage )->name( 'forms.create' );
Route::get( 'forms/{id}', array( PagesController::class, 'builder' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.edit' );
Route::post( 'forms/{id}/duplicate', array( PagesController::class, 'duplicate' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.duplicate' );
Route::post( 'forms/{id}/trash', array( PagesController::class, 'trash' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.trash' );
Route::post( 'forms/{id}/restore', array( PagesController::class, 'restore' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.restore' );
Route::delete( 'forms/{id}', array( PagesController::class, 'destroy' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.destroy' );

Route::get( 'submissions', array( PagesController::class, 'submissions' ) )->middleware( $view )->name( 'submissions.index' );
Route::get( 'submissions/{id}', array( PagesController::class, 'submission' ) )->whereNumber( 'id' )->middleware( $view )->name( 'submissions.show' );

// The admin JSON API the pages use, as in the standalone admin (restUrl + "admin/…").
Route::prefix( 'api/admin' )->name( 'api.' )->group( __DIR__ . '/admin-api.php' );
