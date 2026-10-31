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
<main>
<h1 style="position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">{{ $form->title() }}</h1>
{!! $html !!}
</main>
</body>
</html>
