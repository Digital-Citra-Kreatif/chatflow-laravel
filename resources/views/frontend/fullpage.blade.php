<!doctype html>
<html lang="{{ str_replace( '_', '-', app()->getLocale() ) }}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
@if ( $noindex )
<meta name="robots" content="noindex">
@endif
<title>{{ $form->title() }}</title>
</head>
<body class="cff-fullpage">
<main aria-label="{{ $form->title() }}">{!! $html !!}</main>
</body>
</html>
