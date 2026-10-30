# ChatFlow

ChatFlow adds conversational, chat-style forms to the panel: a builder, a submissions inbox,
CSV export, email notifications and Settings → ChatFlow. It is the `chatflow-laravel`
package's panel plugin (`ChatFlow\Laravel\Sunrice\ChatFlowPlugin`).

## Permissions

| Permission | Allows |
| --- | --- |
| `chatflow.manage-forms` | Forms, the builder, templates, publishing |
| `chatflow.view-submissions` | The inbox, submission details, the dashboard tiles |
| `chatflow.edit-submissions` | Status, read/star, notes, resending emails |
| `chatflow.delete-submissions` | Trashing and deleting submissions |
| `chatflow.export-submissions` | CSV export |
| `chatflow.settings.chatflow` | Settings → ChatFlow |

Inside the panel only these permissions grant access.

## Embedding forms

Each form's **Share** tab gives its link, a QR code and its Blade embed code:

```blade
<x-chatflow::form :id="5" mode="inline" />
```

Modes: `inline`, `fullpage`, `launcher` (a floating button) and `popup`. Full-page forms
live at `/{fullpage_base}/{slug}` (`config/chatflow.php`).

## Site defaults

Settings → ChatFlow holds the defaults forms start from. Empty fields follow
`config/chatflow.php`; saved values override it. In code:
`ChatFlow\Laravel\Support\Settings::get()`.

## Maintenance

Schedule `chatflow:sweep` hourly (abandoned sessions, retention, expired rows and exports)
and `chatflow:retry-deliveries` every five minutes, and run a queue worker for emails.

## AI tools

Read-only: `chatflow_list_forms`, `chatflow_list_submissions`, `chatflow_get_submission`.
They use the token's user's permissions.
