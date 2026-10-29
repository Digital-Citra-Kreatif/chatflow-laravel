@extends('chatflow::admin.layout')

@section('content')
<div class="wrap" id="cff-forms-list">
	<h1 class="wp-heading-inline">{{ __('ChatFlow Forms') }}</h1>
	<a class="page-title-action" href="{{ route('chatflow.admin.index', ['page' => 'cff-builder']) }}">{{ __('Create form') }}</a>
	<hr class="wp-header-end">
	<p>{{ __('Conversational forms that feel like a chat. Draft here, publish when you are ready to share.') }}</p>
	@if ($notice)
		<div class="notice notice-{{ $notice[0] }}"><p>{{ $notice[1] }}</p></div>
	@endif
	<div data-cff-status role="status" aria-live="polite"></div>
	<form method="get" action="{{ route('chatflow.admin.index') }}">
		<input type="hidden" name="page" value="cff-forms">
		@if ($list['status'] !== '')
			<input type="hidden" name="status" value="{{ $list['status'] }}">
		@endif
		<ul class="subsubsub">
			@foreach ($list['views'] as $view)
				<li><a href="{{ $view['url'] }}" @if ($view['current']) class="current" aria-current="page" @endif>{{ $view['label'] }}</a>@if (! $loop->last) |@endif</li>
			@endforeach
		</ul>
		<p class="search-box">
			<label class="screen-reader-text" for="cff-forms-search-input">{{ __('Search forms') }}</label>
			<input type="search" id="cff-forms-search-input" name="s" value="{{ $list['search'] }}">
			<input type="submit" class="button" value="{{ __('Search forms') }}">
		</p>
	</form>
	<div class="tablenav top">
		<div class="tablenav-pages">
			<span class="displaying-num">{{ trans_choice(':count item|:count items', $list['total'], ['count' => $list['total']]) }}</span>
			@if ($list['pages'] > 1)
				@if ($list['prevUrl'])<a class="button" href="{{ $list['prevUrl'] }}" aria-label="{{ __('Previous page') }}">‹</a>@endif
				<span>{{ __(':page of :pages', ['page' => $list['page'], 'pages' => $list['pages']]) }}</span>
				@if ($list['nextUrl'])<a class="button" href="{{ $list['nextUrl'] }}" aria-label="{{ __('Next page') }}">›</a>@endif
			@endif
		</div>
	</div>
	<table class="wp-list-table widefat fixed striped table-view-list">
		<thead>
			<tr>
				<th scope="col" class="manage-column column-name column-primary"><a href="{{ $list['sortUrl'] }}">{{ __('Name') }}@if ($list['sorted']) <span aria-hidden="true">{{ $list['sorted'] === 'asc' ? '▲' : '▼' }}</span>@endif</a></th>
				<th scope="col" class="manage-column column-status">{{ __('Status') }}</th>
				<th scope="col" class="manage-column column-completed">{{ __('Submissions') }}</th>
				<th scope="col" class="manage-column column-completionRate">{{ __('Completion rate') }}</th>
				<th scope="col" class="manage-column column-lastSubmissionAt">{{ __('Last submission') }}</th>
				<th scope="col" class="manage-column column-shortcode">{{ __('Embed code') }}</th>
			</tr>
		</thead>
		<tbody>
			@forelse ($list['items'] as $item)
				<tr>
					<td class="name column-name column-primary">
						@if ($item['status'] === 'trash')
							<strong>{{ $item['name'] }}</strong>
							<div class="row-actions">
								<span class="untrash"><form method="post" action="{{ route('chatflow.admin.forms.restore', ['id' => $item['id']]) }}" style="display:inline">@csrf<button type="submit" class="button-link">{{ __('Restore') }}</button></form> | </span>
								<span class="delete"><form method="post" action="{{ route('chatflow.admin.forms.destroy', ['id' => $item['id']]) }}" style="display:inline" onsubmit="return window.confirm(this.dataset.cffConfirm)" data-cff-confirm="{{ __('Delete this form permanently? This cannot be undone. Forms that still have submissions cannot be deleted.') }}">@csrf<button type="submit" class="button-link submitdelete">{{ __('Delete permanently') }}</button></form></span>
							</div>
						@else
							<strong><a href="{{ $item['editUrl'] }}">{{ $item['name'] }}</a></strong>
							<div class="row-actions">
								<span class="edit"><a href="{{ $item['editUrl'] }}">{{ __('Edit') }}</a> | </span>
								<span class="duplicate"><button type="button" class="button-link" data-cff-action="duplicate" data-form-id="{{ $item['id'] }}">{{ __('Duplicate') }}</button> | </span>
								<span class="preview"><a href="{{ $item['previewUrl'] }}">{{ __('Preview') }}</a> | </span>
								<span class="export"><button type="button" class="button-link" data-cff-action="export" data-form-id="{{ $item['id'] }}">{{ __('Export JSON') }}</button> | </span>
								<span class="trash"><button type="button" class="button-link submitdelete" data-cff-action="trash" data-form-id="{{ $item['id'] }}">{{ __('Trash') }}</button></span>
							</div>
						@endif
					</td>
					<td class="status column-status">
						<span class="cff-status-pill {{ $item['status'] === 'publish' ? 'is-live' : ($item['status'] === 'trash' ? 'is-trash' : 'is-draft') }}">{{ ['publish' => __('Live'), 'trash' => __('Trash')][$item['status']] ?? __('Draft') }}</span>
					</td>
					<td class="completed column-completed">{{ $item['completed'] }}</td>
					<td class="completionRate column-completionRate">{{ $item['completionRate'] }}%</td>
					<td class="lastSubmissionAt column-lastSubmissionAt">
						@if (is_string($item['lastSubmissionAt']) && $item['lastSubmissionAt'] !== '')
							{{ \Illuminate\Support\Carbon::parse($item['lastSubmissionAt'], 'UTC')->setTimezone(config('app.timezone', 'UTC'))->format('M j, Y H:i') }}
						@else
							—
						@endif
					</td>
					<td class="shortcode column-shortcode">
						@isset ($item['shortcode'])
							<code>{{ $item['shortcode'] }}</code>
							<button type="button" class="button-link" data-cff-action="copy" data-form-id="{{ $item['id'] }}" data-cff-shortcode="{{ $item['shortcode'] }}">{{ __('Copy') }}</button>
						@else
							—
						@endisset
					</td>
				</tr>
			@empty
				<tr class="no-items"><td class="colspanchange" colspan="6">{{ $list['trashView'] ? __('No forms in the trash.') : __('No forms found.') }}</td></tr>
			@endforelse
		</tbody>
	</table>
</div>
@endsection
