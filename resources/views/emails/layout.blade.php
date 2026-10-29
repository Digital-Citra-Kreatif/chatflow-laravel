{{-- Email layout. $content is sanitised by the renderer; $color and $logo are validated. --}}
<!doctype html><html><head><meta charset="utf-8"><title>{{ $title }}</title></head>
<body style="margin:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#262626"><table role="presentation" style="width:100%;border-collapse:collapse"><tr><td style="padding:24px"><table role="presentation" style="max-width:640px;width:100%;margin:auto;background:#fff;border-top:4px solid {{ $color }}"><tr><td style="padding:28px">
@if ($logo !== '')
<p><img src="{{ $logo }}" alt="{{ $siteName }}" style="max-width:180px;height:auto"></p>
@endif
{!! $content !!}
<hr><p style="font-size:12px;color:#737373">{{ $footer }}</p>
</td></tr></table></td></tr></table></body></html>
