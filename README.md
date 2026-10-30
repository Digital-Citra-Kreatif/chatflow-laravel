# ChatFlow for Laravel

Conversational, chat-style forms for Laravel: a visual form builder, a visitor
chat runtime, a submissions inbox with CSV export, and email notifications.
A Laravel port of the ChatFlow Forms WordPress plugin.

Requirements: PHP 8.3+, Laravel 13. MySQL/MariaDB, PostgreSQL and SQLite all work.

## Installation

```bash
composer require littleboy130491/chatflow-laravel
php artisan chatflow:install
```

`chatflow:install` publishes `config/chatflow.php` and the built assets
(`public/vendor/chatflow`), runs the migrations (it asks first; pass `--force`
or `--no-interaction` to skip the question), and prints the next steps.

After upgrading the package, refresh the assets:

```bash
php artisan vendor:publish --tag=chatflow-assets --force
```

The admin lives at `/chatflow/admin` (configurable).

## Configuration

`config/chatflow.php`:

| Key | Default | Purpose |
| --- | --- | --- |
| `table_prefix` | `cff_` | Prefix for every ChatFlow table. |
| `api.prefix` / `api.middleware` | `chatflow/api/v1` / `[]` | Public visitor API (stateless, no CSRF). |
| `admin.prefix` / `admin.middleware` | `chatflow/admin` / `['web', 'auth']` | Admin screens and the admin JSON API (`{prefix}/api/admin/…`). |
| `fullpage_base` | `chat` | Full-page forms at `/{fullpage_base}/{slug}`; `null` disables the route. |
| `fullpage_layout` | `null` | Blade layout for full-page forms. |
| `secret` | `APP_KEY` | Key for visitor tokens (`CHATFLOW_SECRET`). |
| `queue.connection` / `queue.name` | default | Queue for email deliveries (`CHATFLOW_QUEUE_CONNECTION`, `CHATFLOW_QUEUE`). |
| `defaults` | see file | Site-wide theme, privacy, retention, spam, proxy and email branding defaults (`fromName`, `fromEmail`, `replyTo`, `logoUrl`, `brandColor`, `footerText`). |
| `field_types` | all | Restrict the field types offered by the builder. |
| `site_name` | `app.name` | Used as `{{site_name}}` in emails. |

Global settings are configured here; there is no settings screen.

## Authorization

Admin access uses gates. Define `viewChatFlow` (like Horizon/Telescope, only the
`local` environment is allowed when it is not defined):

```php
// app/Providers/AppServiceProvider.php
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::define('viewChatFlow', fn ($user) => $user->is_admin);
}
```

Each screen and API endpoint checks a finer ability, which defaults to `viewChatFlow`.
Define any of them to split permissions:

| Ability | Grants |
| --- | --- |
| `chatflow.manage-forms` | Forms list, builder, templates, publishing, notification preview/test |
| `chatflow.view-submissions` | Submissions inbox, detail, delivery activity |
| `chatflow.edit-submissions` | Read/star/status/notes, bulk changes, resend/retry emails |
| `chatflow.delete-submissions` | Trash and permanent deletion |
| `chatflow.export-submissions` | CSV export and download (own exports only) |

The admin needs a logged-in session user (`admin.middleware` defaults to `web`
and `auth`). The JSON API also requires the CSRF token header on writes and
answers failures as JSON (`401` when signed out, `403` when not allowed).

## Embedding forms

Publish a form in the builder, then embed it:

```blade
<x-chatflow::form :id="5" />
<x-chatflow::form :id="5" mode="launcher" position="left" />
<x-chatflow::form :id="5" mode="inline" height="640" theme="dark" />

@chatflow(5)
@chatflow(5, ['mode' => 'popup'])
```

```php
echo chatflow(5, ['mode' => 'inline']);
```

Modes: `inline`, `fullpage`, `launcher`, `popup`. Options you leave out use the
form's display settings. Each published form also has a full-page URL:
`https://your-app.test/chat/{slug}`. The forms list shows a ready-made embed code
for every form.

## Queue and scheduler

Email notifications are queued jobs (`ChatFlow\Laravel\Notifications\DeliverNotification`).
Run a worker:

```bash
php artisan queue:work
```

Schedule the maintenance commands (e.g. in `routes/console.php`):

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('chatflow:sweep')->hourly()->withoutOverlapping();
Schedule::command('chatflow:retry-deliveries')->everyFiveMinutes();
```

- `chatflow:sweep` marks idle sessions abandoned (firing `chatflow.submission_abandoned`),
  deletes submissions past their retention period, and prunes expired rate-limit,
  idempotency, session and export rows. Retention is off by default; enable it
  site-wide with `defaults.retention` (`enabled`, `days`, `partialDays`) or per form
  under Form settings → Privacy and retention.
- `chatflow:retry-deliveries` re-queues deliveries whose retry is due and releases
  deliveries interrupted by a crashed worker.

Each delivery is attempted up to three times (retries after 60 seconds, then
5 minutes). Its history is shown in the submission's activity panel, where it can
be retried or resent.

## Email notifications

Forms can send admin notifications and autoresponders. Subjects and bodies support
merge tags: `{{field_key}}`, `{{form_title}}`, `{{submission_id}}`, `{{site_name}}`,
`{{date}}`, `{{all_answers}}`, `{{meta_table}}`, `{{admin_link}}` (admin emails only)
and `[cff_button url="https://…"]Label[/cff_button]`. Bodies are limited to a
small HTML allowlist. Override the email views by publishing them:

```bash
php artisan vendor:publish --tag=chatflow-views
```

(`resources/views/vendor/chatflow/emails/{layout,admin,autoresponder}.blade.php`).

## Events and filters

Lifecycle actions are Laravel events with positional payloads:

| Event | Payload |
| --- | --- |
| `chatflow.session_started` | `array $session` (sessionId, formId, version, startedAt) |
| `chatflow.submission_partial_saved` | `Submission $submission, Form $form` |
| `chatflow.submission_completed` | `Submission $submission, Form $form` |
| `chatflow.submission_completed_async` | `Submission $submission, Form $form` (from the queue, after the visitor's request) |
| `chatflow.submission_abandoned` | `Submission $submission, Form $form` |
| `chatflow.submission_deleted` | `Submission $submission, Form $form` |
| `chatflow.form_published` | `Form $form` |

```php
Event::listen('chatflow.submission_completed', function ($submission, $form) {
    // …
});
```

Filters change values; register them with `ChatFlow\Laravel\ChatFlow::filter()`:

```php
use ChatFlow\Laravel\ChatFlow;

ChatFlow::filter('email_args', function (array $args, $submission, $form) {
    $args['headers'][] = 'X-Priority: 1';
    return $args;
});
```

| Filter | Value |
| --- | --- |
| `email_args` / `autoresponder_args` | `['to', 'subject', 'message', 'headers', 'attachments']` before sending |
| `submission_payload` | Payload used by notifications |
| `submission_meta` | Stored submission metadata |
| `validate_answer` | Per-answer validation result |
| `redirect_url` | Ending redirect URL |
| `public_schema` | Form definition sent to visitors |
| `field_types` | Available field types |

## Not in this version

File uploads, magic links, analytics dashboards and event storage, AI assist,
the MCP server, captcha/Akismet, connectors and webhooks, purge tools, XLSX export,
media library images (bot avatar, option images, email attachments), page targeting
for launchers, a global settings screen (use the config file), and translations
other than English.

## Testing

```bash
composer test          # PHP: PHPUnit with Orchestra Testbench (SQLite)
npm test               # TypeScript: Vitest
npm run e2e            # Browser: Playwright
```

`npm run e2e` serves the package in a throwaway Laravel app (Testbench workbench,
see `testbench.yaml`) on port 8123 (`CHATFLOW_E2E_PORT` changes it). It walks one
form through the builder, the visitor chat, the inbox and CSV export, and an
admin email. It needs a Chromium for Playwright (`npx playwright install chromium`).

## License

GPL-3.0-or-later.
