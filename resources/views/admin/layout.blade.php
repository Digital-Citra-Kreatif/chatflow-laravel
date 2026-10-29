<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="csrf-token" content="{{ csrf_token() }}">
<meta name="robots" content="noindex, nofollow">
<title>{{ $title }} · {{ config('app.name', 'Laravel') }}</title>
@foreach ($styles as $style)
<link rel="stylesheet" href="{{ $style }}">
@endforeach
<style>
.cff-topbar{display:flex;align-items:center;gap:24px;padding:0 20px;min-height:48px;background:#1d2327;color:#f0f0f1;flex-wrap:wrap}
.cff-topbar__brand{font-weight:600;font-size:15px;color:#fff;text-decoration:none}
.cff-topbar nav{display:flex;gap:4px;flex-wrap:wrap}
.cff-topbar nav a{color:#c3c4c7;text-decoration:none;padding:14px 10px;display:inline-flex;align-items:center;gap:6px}
.cff-topbar nav a:hover,.cff-topbar nav a:focus{color:#72aee6}
.cff-topbar nav a[aria-current="page"]{color:#fff;box-shadow:inset 0 -3px 0 #72aee6}
.cff-topbar .awaiting-mod{display:inline-block;min-width:18px;padding:0 5px;border-radius:9px;background:#d63638;color:#fff;font-size:11px;line-height:18px;text-align:center}
.cff-admin-content{padding:0 20px 40px}
</style>
</head>
<body class="chatflow-admin chatflow-admin--{{ $screen }}">
<header class="cff-topbar">
	<a class="cff-topbar__brand" href="{{ route('chatflow.admin.index') }}">{{ config('app.name', 'Laravel') }} · {{ __('ChatFlow') }}</a>
	<nav aria-label="{{ __('ChatFlow') }}">
		@foreach ($nav as $item)
			<a href="{{ $item['url'] }}" @if ($item['current']) aria-current="page" @endif>{{ $item['label'] }}@if (! empty($item['badge']))<span class="awaiting-mod"><span class="pending-count">{{ number_format($item['badge']) }}</span></span>@endif</a>
		@endforeach
	</nav>
</header>
<main class="cff-admin-content">
@yield('content')
</main>
<script>{!! $config !!}</script>
<script src="{{ $script }}"></script>
<script>{!! $mount !!}</script>
</body>
</html>
