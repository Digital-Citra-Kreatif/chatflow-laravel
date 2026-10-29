# ChatFlow for Laravel — port plan

A standalone Laravel package (`littleboy130491/chatflow-laravel`, namespace
`ChatFlow\Laravel`) forked from the ChatFlow Forms WordPress plugin. It is a
fork: no code is shared with the plugin at runtime.

Target: Laravel 13, PHP 8.3+. Works in any Laravel app.

## Principles

1. **The visitor chat runtime is reused unchanged.** The server must answer its
   HTTP contract exactly: same paths (relative to a configurable base,
   default `/chatflow/api/v1/`), JSON shapes, status codes, error envelope
   `{code, message, data: {status, …}}`, token formats and idempotency rules.
2. **The admin React apps are reused from source**, rebuilt with Vite with
   React and the `@wordpress/*` npm packages bundled (not WordPress globals).
   Only small, listed edits are made to the TypeScript.
3. **Pure PHP is copied**, not rewritten: logic engine, field types, schema
   validation, token signing, templates. Namespaces become `ChatFlow\Laravel\…`
   with the same sub-namespaces (`Logic`, `Fields`, `Security`, `Forms`,
   `Templates`, …).
4. **WordPress glue is rewritten with Laravel equivalents**: migrations and the
   query builder, controllers, gates, queued jobs, Mailables, Blade, the
   scheduler, `config()` instead of options.
5. **Database-agnostic where reasonable** (MySQL/MariaDB, PostgreSQL, SQLite
   for tests): no `INET6_*`, `GET_LOCK` or `LAST_INSERT_ID` tricks; use
   `upsert`, `lockForUpdate` and transactions.

## Host app integration

- `composer require littleboy130491/chatflow-laravel`, `php artisan
  chatflow:install` (publishes config, assets, runs migrations).
- `config/chatflow.php`: route prefixes, middleware, table prefix, mail
  defaults, spam/privacy defaults, full-page base path.
- Authorization: gate abilities `chatflow.manage-forms`,
  `chatflow.view-submissions`, `chatflow.edit-submissions`,
  `chatflow.delete-submissions`, `chatflow.export-submissions`. All default to a
  single `viewChatFlow` gate that the host app defines (local environment is
  allowed by default, like Horizon/Telescope).
- Embedding: `<x-chatflow::form :id="5" mode="inline" />`, `@chatflow(5)`, and
  the full-page route `/{fullpageBase}/{slug}`.

## Version 1 scope

**In:**
- Form builder: create, autosave with revisions/conflicts, edit lock, publish
  (immutable versions), templates, JSON import/export, duplicate, trash,
  restore, delete permanently, preview, share.
- Visitor runtime: start token, sessions, resume, autosave (PATCH), restart,
  submit, endings/redirects, view counting, honeypot + time trap + rate limits,
  idempotency, A/B variants (pure logic), metadata (privacy-aware).
- Submissions inbox: list with filters, detail, read/star/status, notes,
  trash/delete, bulk actions, CSV export (synchronous, private download).
- Email: admin notifications and autoresponders, queued, with retries;
  notification preview and test send.
- Abandoned-session sweep and pruning (scheduled commands).

**Out (later):** file uploads, magic links, analytics dashboards and event
storage, AI assist, MCP server, captcha/Akismet, connectors and webhooks,
purge tools, XLSX export, media library images (bot avatar, option images),
page targeting for launchers, global settings UI (config file instead),
translations other than English.

## Layout

```
config/chatflow.php
database/migrations/
resources/schema/            form + settings JSON Schemas (copied)
resources/js/                admin + runtime TypeScript (copied, edited)
resources/views/             admin shell, forms list, full page, embed, emails
dist/                        built JS/CSS (committed; published to public/vendor/chatflow)
routes/                      api.php (public visitor API), admin.php, web.php
src/
  ChatFlowServiceProvider.php
  Logic/ Fields/ Security/ Templates/          copied pure code
  Forms/        Form, SchemaValidator (copied), FormRepository, PublicProjection, EditLock
  Submissions/  SessionService, Repository, Idempotency, Ending, Submission
  Spam/         Protection, RateLimiter
  Tracking/     Metadata, IpResolver
  Notifications/ Planner, Renderer, Mailer, DeliveryJob
  Http/         Controllers (Public, Admin), middleware, ApiError
  Console/      install, abandon sweep, prune
tests/          PHPUnit + Orchestra Testbench (SQLite)
```

## Work order

1. Skeleton: composer.json, provider, config, migrations, error envelope, routes.
2. In parallel: (a) copy pure PHP core + its tests; (b) frontend build and the
   TypeScript edits; (c) public visitor API; (d) admin API, Blade pages, email.
3. Integrate in a demo Laravel app; run the plugin's browser scenarios against
   it (visitor flow, builder create/publish, inbox).
