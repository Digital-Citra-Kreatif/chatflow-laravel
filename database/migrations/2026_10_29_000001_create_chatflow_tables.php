<?php

use ChatFlow\Laravel\Support\Database;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
	public function up(): void {
		Schema::create(
			Database::table( 'forms' ),
			function ( Blueprint $table ) {
				$table->id();
				$table->string( 'title', 500 )->default( '' );
				$table->string( 'slug', 200 )->nullable()->unique();
				$table->string( 'status', 20 )->default( 'draft' ); // draft | publish | trash
				$table->string( 'previous_status', 20 )->nullable();
				$table->longText( 'schema' );
				$table->longText( 'settings' );
				$table->longText( 'identity' )->nullable();
				$table->unsignedBigInteger( 'draft_revision' )->default( 0 );
				$table->unsignedInteger( 'version' )->default( 0 );
				$table->unsignedBigInteger( 'locked_by' )->nullable();
				$table->dateTime( 'locked_until' )->nullable();
				$table->unsignedBigInteger( 'created_by' )->nullable();
				$table->dateTime( 'created_at' );
				$table->dateTime( 'updated_at' );
				$table->index( array( 'status', 'updated_at' ) );
			}
		);

		Schema::create(
			Database::table( 'form_versions' ),
			function ( Blueprint $table ) {
				$table->id();
				$table->unsignedBigInteger( 'form_id' );
				$table->unsignedInteger( 'version' );
				$table->text( 'form_title' );
				$table->string( 'form_slug', 200 );
				$table->longText( 'schema' );
				$table->longText( 'settings' );
				$table->char( 'schema_hash', 64 );
				$table->dateTime( 'created_at' );
				$table->unsignedBigInteger( 'created_by' )->nullable();
				$table->unique( array( 'form_id', 'version' ) );
			}
		);

		Schema::create(
			Database::table( 'submissions' ),
			function ( Blueprint $table ) {
				$table->id();
				$table->char( 'uuid', 36 )->unique();
				$table->unsignedBigInteger( 'form_id' );
				$table->unsignedInteger( 'form_version' );
				$table->string( 'status', 20 )->default( 'partial' ); // partial | completed | abandoned | spam | trash
				$table->string( 'previous_status', 20 )->nullable();
				$table->longText( 'answers' );
				$table->longText( 'variables' );
				$table->longText( 'visited' );
				$table->longText( 'consent' );
				$table->longText( 'meta' );
				$table->string( 'ending_id', 64 )->default( '' );
				$table->string( 'current_step_id', 64 )->default( '' );
				$table->unsignedSmallInteger( 'progress' )->default( 0 );
				$table->boolean( 'is_read' )->default( false );
				$table->boolean( 'is_starred' )->default( false );
				$table->unsignedBigInteger( 'user_id' )->nullable();
				$table->string( 'ip', 45 )->nullable();
				$table->text( 'user_agent' )->nullable();
				$table->string( 'browser', 100 )->default( '' );
				$table->string( 'browser_version', 50 )->default( '' );
				$table->string( 'os', 100 )->default( '' );
				$table->string( 'os_version', 50 )->default( '' );
				$table->string( 'device_type', 32 )->default( '' );
				$table->string( 'device_brand', 100 )->default( '' );
				$table->text( 'page_url' )->nullable();
				$table->text( 'referrer' )->nullable();
				$table->text( 'landing_page' )->nullable();
				$table->text( 'landing_referrer' )->nullable();
				$table->string( 'utm_source', 255 )->default( '' );
				$table->string( 'utm_medium', 255 )->default( '' );
				$table->string( 'utm_campaign', 255 )->default( '' );
				$table->string( 'utm_term', 255 )->default( '' );
				$table->string( 'utm_content', 255 )->default( '' );
				$table->longText( 'click_ids' )->nullable();
				$table->string( 'locale', 32 )->default( '' );
				$table->string( 'timezone', 64 )->default( '' );
				$table->string( 'screen', 32 )->default( '' );
				$table->char( 'country', 2 )->nullable();
				$table->dateTime( 'started_at' );
				$table->dateTime( 'completed_at' )->nullable();
				$table->dateTime( 'abandoned_at' )->nullable();
				$table->unsignedBigInteger( 'duration_ms' )->default( 0 );
				$table->longText( 'step_timings' )->nullable();
				$table->longText( 'spam_reasons' )->nullable();
				$table->dateTime( 'created_at' );
				$table->dateTime( 'updated_at' );
				$table->index( array( 'form_id', 'status', 'created_at' ) );
				$table->index( array( 'status', 'updated_at' ) );
				$table->index( 'utm_source' );
				$table->index( 'utm_campaign' );
				$table->index( 'user_id' );
			}
		);

		Schema::create(
			Database::table( 'submission_values' ),
			function ( Blueprint $table ) {
				$table->id();
				$table->unsignedBigInteger( 'submission_id' );
				$table->string( 'field_id', 64 );
				$table->string( 'field_key', 64 );
				$table->longText( 'value_text' )->nullable();
				$table->decimal( 'value_num', 30, 10 )->nullable();
				$table->unique( array( 'submission_id', 'field_key' ) );
				$table->index( array( 'field_key', 'value_num' ) );
			}
		);

		Schema::create(
			Database::table( 'submission_notes' ),
			function ( Blueprint $table ) {
				$table->id();
				$table->unsignedBigInteger( 'submission_id' );
				$table->unsignedBigInteger( 'user_id' )->default( 0 );
				$table->string( 'type', 32 ); // note | delivery
				$table->longText( 'body' );
				$table->dateTime( 'created_at' );
				$table->index( array( 'submission_id', 'created_at' ) );
			}
		);

		Schema::create(
			Database::table( 'sessions' ),
			function ( Blueprint $table ) {
				$table->id();
				$table->char( 'public_id', 36 )->unique();
				$table->char( 'resume_hash', 64 )->unique();
				$table->unsignedBigInteger( 'form_id' );
				$table->unsignedInteger( 'form_version' );
				$table->string( 'variant_id', 64 )->default( '' );
				$table->unsignedBigInteger( 'submission_id' )->nullable();
				$table->string( 'status', 20 )->default( 'active' ); // active | completed | closed | expired
				$table->unsignedBigInteger( 'revision' )->default( 0 );
				$table->longText( 'context' );
				$table->dateTime( 'started_at' );
				$table->dateTime( 'last_seen_at' );
				$table->dateTime( 'expires_at' );
				$table->dateTime( 'closed_at' )->nullable();
				$table->index( array( 'form_id', 'status' ) );
				$table->index( 'expires_at' );
				$table->index( 'submission_id' );
			}
		);

		Schema::create(
			Database::table( 'requests' ),
			function ( Blueprint $table ) {
				$table->id();
				$table->char( 'scope_hash', 64 );
				$table->char( 'key_hash', 64 );
				$table->char( 'request_hash', 64 );
				$table->string( 'status', 20 )->default( 'pending' ); // pending | done
				$table->longText( 'response' )->nullable();
				$table->unsignedSmallInteger( 'response_code' )->nullable();
				$table->dateTime( 'expires_at' );
				$table->unique( array( 'scope_hash', 'key_hash' ) );
				$table->index( 'expires_at' );
			}
		);

		Schema::create(
			Database::table( 'rate_limits' ),
			function ( Blueprint $table ) {
				$table->char( 'bucket_hash', 64 )->primary();
				$table->unsignedInteger( 'hits' )->default( 0 );
				$table->dateTime( 'expires_at' );
				$table->index( 'expires_at' );
			}
		);

		Schema::create(
			Database::table( 'deliveries' ),
			function ( Blueprint $table ) {
				$table->id();
				$table->unsignedBigInteger( 'submission_id' );
				$table->unsignedInteger( 'form_version' );
				$table->string( 'event', 64 );
				$table->string( 'channel', 32 ); // admin_mail | autoresponder
				$table->string( 'destination_id', 64 );
				$table->char( 'dedupe_hash', 64 )->unique();
				$table->string( 'status', 20 )->default( 'pending' ); // pending | processing | sent | failed | cancelled
				$table->unsignedSmallInteger( 'attempts' )->default( 0 );
				$table->longText( 'payload' );
				$table->string( 'last_error', 255 )->default( '' );
				$table->dateTime( 'next_attempt_at' )->nullable();
				$table->dateTime( 'created_at' );
				$table->dateTime( 'updated_at' );
				$table->index( 'submission_id' );
				$table->index( array( 'status', 'next_attempt_at' ) );
			}
		);

		Schema::create(
			Database::table( 'stats_daily' ),
			function ( Blueprint $table ) {
				$table->id();
				$table->unsignedBigInteger( 'form_id' );
				$table->unsignedInteger( 'form_version' );
				$table->date( 'day' );
				$table->string( 'metric', 32 );
				$table->char( 'dimension_hash', 64 );
				$table->longText( 'dimension' );
				$table->decimal( 'value', 30, 10 )->default( 0 );
				$table->unique( array( 'form_id', 'form_version', 'day', 'metric', 'dimension_hash' ), 'cff_stats_rollup' );
			}
		);

		Schema::create(
			Database::table( 'exports' ),
			function ( Blueprint $table ) {
				$table->id();
				$table->char( 'uuid', 36 )->unique();
				$table->unsignedBigInteger( 'user_id' );
				$table->unsignedBigInteger( 'form_id' );
				$table->string( 'status', 20 ); // queued | running | ready | failed | expired
				$table->string( 'format', 10 )->default( 'csv' );
				$table->longText( 'criteria' );
				$table->string( 'storage_key', 255 )->default( '' );
				$table->char( 'download_hash', 64 )->default( '' );
				$table->unsignedBigInteger( 'row_count' )->default( 0 );
				$table->dateTime( 'created_at' );
				$table->dateTime( 'expires_at' );
				$table->index( array( 'user_id', 'status' ) );
				$table->index( 'expires_at' );
			}
		);
	}

	public function down(): void {
		foreach ( array( 'exports', 'stats_daily', 'deliveries', 'rate_limits', 'requests', 'sessions', 'submission_notes', 'submission_values', 'submissions', 'form_versions', 'forms' ) as $name ) {
			Schema::dropIfExists( Database::table( $name ) );
		}
	}
};
