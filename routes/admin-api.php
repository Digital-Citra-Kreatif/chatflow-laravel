<?php
// The admin JSON API used by the React apps (the plugin's REST routes): restUrl + "admin/…".
// Loaded under "{prefix}/api/admin" by routes/admin.php, and by the Sunrice panel plugin.

use ChatFlow\Laravel\Http\Controllers\Admin\FormsController;
use ChatFlow\Laravel\Http\Controllers\Admin\NotificationsController;
use ChatFlow\Laravel\Http\Controllers\Admin\SubmissionsController;
use Illuminate\Support\Facades\Route;

$manage = 'chatflow.admin.api:chatflow.manage-forms';
$view   = 'chatflow.admin.api:chatflow.view-submissions';
$edit   = 'chatflow.admin.api:chatflow.edit-submissions';
$delete = 'chatflow.admin.api:chatflow.delete-submissions';
$export = 'chatflow.admin.api:chatflow.export-submissions';

Route::get( 'forms', array( FormsController::class, 'index' ) )->middleware( $manage )->name( 'forms.index' );
Route::post( 'forms', array( FormsController::class, 'store' ) )->middleware( $manage )->name( 'forms.store' );
Route::get( 'forms/{id}', array( FormsController::class, 'show' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.show' );
Route::put( 'forms/{id}', array( FormsController::class, 'update' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.update' );
Route::delete( 'forms/{id}', array( FormsController::class, 'destroy' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.destroy' );
Route::post( 'forms/{id}/lock', array( FormsController::class, 'lock' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.lock' );
Route::post( 'forms/{id}/publish', array( FormsController::class, 'publish' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.publish' );
Route::get( 'forms/{id}/published', array( FormsController::class, 'published' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.published' );
Route::post( 'forms/{id}/duplicate', array( FormsController::class, 'duplicate' ) )->whereNumber( 'id' )->middleware( $manage )->name( 'forms.duplicate' );
Route::get( 'templates', array( FormsController::class, 'templates' ) )->middleware( $manage )->name( 'templates.index' );
Route::get( 'templates/{slug}', array( FormsController::class, 'template' ) )->where( 'slug', '[a-z0-9-]+' )->middleware( $manage )->name( 'templates.show' );
Route::post( 'templates/{slug}', array( FormsController::class, 'createFromTemplate' ) )->where( 'slug', '[a-z0-9-]+' )->middleware( $manage )->name( 'templates.create' );
Route::get( 'pages', array( FormsController::class, 'pages' ) )->middleware( $manage )->name( 'pages' );

Route::get( 'notifications/templates', array( NotificationsController::class, 'templates' ) )->middleware( $manage )->name( 'notifications.templates' );
Route::post( 'notifications/templates', array( NotificationsController::class, 'saveTemplate' ) )->middleware( $manage )->name( 'notifications.templates.store' );
Route::delete( 'notifications/templates', array( NotificationsController::class, 'deleteTemplate' ) )->middleware( $manage )->name( 'notifications.templates.destroy' );
Route::post( 'notifications/preview', array( NotificationsController::class, 'preview' ) )->middleware( $manage )->name( 'notifications.preview' );
Route::post( 'notifications/test', array( NotificationsController::class, 'test' ) )->middleware( $manage )->name( 'notifications.test' );

Route::get( 'submissions', array( SubmissionsController::class, 'index' ) )->middleware( $view )->name( 'submissions.index' );
Route::post( 'submissions/bulk', array( SubmissionsController::class, 'bulk' ) )->middleware( $edit )->name( 'submissions.bulk' );
Route::post( 'submissions/export', array( SubmissionsController::class, 'export' ) )->middleware( $export )->name( 'submissions.export' );
Route::get( 'submissions/{id}', array( SubmissionsController::class, 'show' ) )->whereNumber( 'id' )->middleware( $view )->name( 'submissions.show' );
Route::patch( 'submissions/{id}', array( SubmissionsController::class, 'update' ) )->whereNumber( 'id' )->middleware( $edit )->name( 'submissions.update' );
Route::delete( 'submissions/{id}', array( SubmissionsController::class, 'destroy' ) )->whereNumber( 'id' )->middleware( $delete )->name( 'submissions.destroy' );
Route::get( 'submissions/{id}/activity', array( SubmissionsController::class, 'activity' ) )->whereNumber( 'id' )->middleware( $view )->name( 'submissions.activity' );
Route::post( 'submissions/{id}/resend', array( SubmissionsController::class, 'resend' ) )->whereNumber( 'id' )->middleware( $edit )->name( 'submissions.resend' );
Route::post( 'submissions/{id}/retry', array( SubmissionsController::class, 'retry' ) )->whereNumber( 'id' )->middleware( $edit )->name( 'submissions.retry' );
Route::get( 'analytics/forms', array( FormsController::class, 'pickerForms' ) )->middleware( $view )->name( 'analytics.forms' );
Route::get( 'export-forms', array( FormsController::class, 'exportForms' ) )->middleware( $export )->name( 'export-forms' );
Route::get( 'exports/{id}', array( SubmissionsController::class, 'exportStatus' ) )->whereNumber( 'id' )->middleware( $export )->name( 'exports.show' );
Route::get( 'exports/{id}/download', array( SubmissionsController::class, 'download' ) )->whereNumber( 'id' )->middleware( $export )->name( 'exports.download' );

// Anything else under the API answers with the JSON envelope rather than an HTML 404.
Route::any( '{any}', static fn() => \ChatFlow\Laravel\Http\Middleware\AdminApi::error( 'rest_no_route', 'No route was found matching the URL and request method.', 404 ) )->where( 'any', '.*' )->middleware( 'chatflow.admin.api' )->name( 'fallback' );
