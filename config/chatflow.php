<?php

return [

	/*
	| Database table prefix for every ChatFlow table.
	*/
	'table_prefix' => env( 'CHATFLOW_TABLE_PREFIX', 'cff_' ),

	/*
	| Public visitor API used by the chat runtime. Stateless: no session,
	| no CSRF. The runtime only talks to the same origin.
	*/
	'api' => [
		'prefix'     => 'chatflow/api/v1',
		'middleware' => [],
	],

	/*
	| Admin screens and the admin JSON API. They need an authenticated user
	| (session + CSRF), plus the ChatFlow gates below. Apps that use the
	| Sunrice admin panel plugin can turn the standalone admin off.
	*/
	'admin' => [
		'enabled'    => env( 'CHATFLOW_ADMIN_ENABLED', true ),
		'prefix'     => 'chatflow/admin',
		'middleware' => [ 'web', 'auth' ],
	],

	/*
	| Full-page forms are served at /{fullpage_base}/{slug}.
	| Set to null to disable the route.
	*/
	'fullpage_base' => 'chat',

	/*
	| Layout used by the full-page form view. Null uses the package's minimal layout.
	*/
	'fullpage_layout' => null,

	/*
	| Secret used to sign visitor tokens and encrypt idempotency receipts.
	| Defaults to the application key.
	*/
	'secret' => env( 'CHATFLOW_SECRET' ),

	/*
	| Queue used for email deliveries. Null uses the default connection/queue.
	*/
	'queue' => [
		'connection' => env( 'CHATFLOW_QUEUE_CONNECTION' ),
		'name'       => env( 'CHATFLOW_QUEUE' ),
	],

	/*
	| Site-wide defaults. Per-form settings override these where the form
	| settings allow it (same rules as the WordPress plugin).
	*/
	'defaults' => [
		'defaultTheme' => 'light',
		'privacy'      => [
			'ip'             => 'anonymized', // full | anonymized | none
			'storeUserAgent' => false,
			'storeMeta'      => true,
			'respectDnt'     => true,
		],
		// Automatic deletion by chatflow:sweep. Forms can override these in their
		// privacy settings. partialDays (int|null) deletes partial and abandoned
		// submissions sooner than completed ones.
		'retention'    => [
			'enabled'     => false,
			'days'        => 360,
			'partialDays' => null,
		],
		'spam'         => [
			'honeypotEnabled'   => true,
			'minSeconds'        => 2,
			'rateLimit'         => 10,
			'rateWindowSeconds' => 600,
			'captcha'           => 'none',
		],
		'proxy'        => [
			// automatic: trust X-Forwarded-For from private networks and CF-Connecting-IP from Cloudflare.
			// direct: REMOTE_ADDR only. Laravel's TrustProxies middleware is respected either way.
			'mode'          => 'automatic',
			'trustedRanges' => [],
		],
		'email'        => [
			'fromName'   => env( 'MAIL_FROM_NAME' ),
			'fromEmail'  => env( 'MAIL_FROM_ADDRESS' ),
			'replyTo'    => '',
			'logoUrl'    => '',
			'brandColor' => '#262626',
			'footerText' => '',
		],
		'tracking'     => [
			'enabled'         => false,
			'consentRequired' => true,
			'days'            => 30,
		],
	],

	/*
	| Field types offered in the builder and accepted on publish.
	| file_upload is not available in this version.
	*/
	'field_types' => null, // null = all supported types

	/*
	| Site name used in emails ({{site_name}}). Defaults to config('app.name').
	*/
	'site_name' => null,
];
