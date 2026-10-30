# ChatFlow in the Sunrice admin panel

ChatFlow's admin rebuilt as a [Sunrice](https://github.com/Digital-Citra-Kreatif/sunrice) panel
plugin: the forms list, the builder, the submissions inbox and the site settings as panel
pages in React 19, Inertia and the panel's own shadcn components. The standalone admin
(`/chatflow/admin`) keeps working; an app that uses the panel can turn it off with
`CHATFLOW_ADMIN_ENABLED=false`.

## Using it

Requires `sunrice/admin` (PHP 8.4+, Laravel 13).

```php
// app/Providers/AdminPanelProvider.php
use ChatFlow\Laravel\Sunrice\ChatFlowPlugin;

$panel->plugin(ChatFlowPlugin::make());
```

```bash
php artisan sunrice:assets   # publishes the panel's and ChatFlow's built assets
```

The plugin adds a ChatFlow group to the sidebar (Forms, Submissions) and these permissions,
which keep ChatFlow's ability names, so every check inside ChatFlow is answered by the
panel's roles (super admins have them all):

| Permission | Allows |
| --- | --- |
| `chatflow.manage-forms` | Forms list, builder, templates, publishing |
| `chatflow.view-submissions` | The inbox and submission details |
| `chatflow.edit-submissions` | Status, read/star, notes, resending emails |
| `chatflow.delete-submissions` | Trashing and deleting submissions (privileged) |
| `chatflow.export-submissions` | CSV export (privileged) |

Inside the panel only these permissions grant access: ChatFlow's `viewChatFlow` fallback
(open in the local environment) is not used.

**Settings → ChatFlow** (permission `chatflow.settings.chatflow`) holds the site-wide
defaults forms start from: chat theme, privacy, retention, spam protection and email
sender and look. Every field starts empty and follows `config/chatflow.php` (its placeholder
shows the value); a value saved here overrides the config file, and choosing the empty
option again goes back to it. `ChatFlow\Laravel\Support\Settings::get()` gives the result;
`fromConfig()` the config file alone.

## How it is built (and why)

The goal is low risk and easy maintenance, so nothing that is already tested is rewritten:

- **No second backend.** The pages use ChatFlow's existing admin JSON API
  (`routes/admin-api.php`), mounted under the panel at `/admin/chatflow/api/admin/…`, behind
  the same abilities, CSRF and body-size checks as the standalone admin. Inertia controllers
  (`src/Sunrice/Http/PagesController.php`) only give each page its first data; small list
  actions (duplicate, trash, restore, delete) are Inertia posts that flash the panel's toasts.
- **No second copy of the logic.** Form drafts (autosave, revisions, conflicts, publishing),
  import/export, labels, the logic engine and the schema contracts are the pure TypeScript
  modules in `resources/js/`, imported as `@chatflow/…`. Their `@wordpress/i18n` calls go to
  a shim (`sunrice/src/lib/i18n.ts`) that uses the panel's `t()`.
- **No second UI kit.** Pages use the panel's components through `@imajiner/admin-sdk`, so
  they follow its theme, dark mode and branding. Layout utilities are Tailwind, prefixed
  `cf:` so they never touch the panel's.
- **Separate frontend package.** `sunrice/` has its own `package.json` (React 19), apart
  from the standalone admin's React 18 and WordPress packages, so either can change or be
  removed without the other.

```
src/Sunrice/            ChatFlowPlugin (permissions, navigation, routes, bundle), PagesController
routes/sunrice.php      the panel routes; routes/admin-api.php is shared with the standalone admin
sunrice/                the panel frontend
  sdk/                  @imajiner/admin-sdk, vendored from sunrice v0.3.1 (not on npm)
  src/pages/            one Inertia page per screen, loaded on demand
  src/components/       pieces shared by the pages
  src/lib/              api client, i18n shim, the draft hook, field settings table, helpers
dist/sunrice/           the build (committed, published to public/vendor/chatflow/sunrice)
```

### The SDK

`@imajiner/admin-sdk` isn't published to npm, so `sunrice/sdk/` holds its source from the
`v0.3.1` tag of Digital-Citra-Kreatif/sunrice (commit `5d1ea77`, SDK runtime 3). A bundle
built for another runtime version refuses to load with a clear error, so update the copy
together with the `sunrice/admin` version: copy `packages/admin-sdk/src/*.ts` from the
matching tag.

### The builder

`src/lib/draft.ts` wraps ChatFlow's `DraftController` (the same one the standalone builder
uses) for React: it holds the form's edit lock, autosaves every 3 seconds while there are
changes, and uses the panel's `useUnsavedChanges` for Ctrl/Cmd+S and the leave prompt.
Revision conflicts, a held lock and failed saves show as banners with their way out.

What each field type lets you edit is data, not code: `src/lib/fieldTypes.ts` lists every
setting with its path in the step (`settings.unit`, `validation.minLength`), a label, a
control and the types it applies to, and `SettingField` renders them. To add a setting,
add a line there. Messages, choices, field keys and endings have their own editors.

## Development

```bash
npm --prefix sunrice install
npm run build:sunrice        # type-checks, then builds dist/sunrice
npm --prefix sunrice test    # unit tests
composer test                # PHP, including tests/Sunrice (needs sunrice/admin: PHP 8.4)
npm run e2e                  # browser tests; the workbench serves the panel at /admin
```

## Status

| Phase | Scope | State |
| --- | --- | --- |
| P0 Foundations | plugin, permissions, navigation, API under the panel, bundle pipeline, workbench | done |
| P1 Settings | Settings → ChatFlow: theme, privacy, retention, spam, email defaults | done |
| P2 Forms list | tabs, search, sort, stats, create (blank, template, import), duplicate, export, trash | done |
| P3 Inbox | filters, columns, bulk actions, detail tabs, notes, status, resend, CSV export | done |
| P4 Builder core | flow editor, field inspector, endings, autosave, conflicts, lock, publish | done |
| P5 Builder advanced | logic, variables, design, form settings, notifications, share, preview | to do |
| P6 Extras | dashboard widget, AI tools, docs and guide, full browser parity suite | to do |
