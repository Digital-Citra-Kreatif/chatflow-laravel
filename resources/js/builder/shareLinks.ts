import type { AdminConfig, FormDTO } from './api';

/** The Blade embed code for a form, with its display mode. */
export function shortcode(form: FormDTO): string {
  const display = form.settings.display ?? {};
  const mode = display.mode ?? 'inline';
  const position =
    (mode === 'launcher' || mode === 'popup') && display.launcher?.position === 'left' ? ' position="left"' : '';
  return `<x-chatflow::form :id="${form.id}" mode="${mode}"${position} />`;
}
/** A saved draft is not a public form. Never manufacture a URL without a published slug. */
export function publicFormUrl(form: FormDTO, config: AdminConfig): string | null {
  if (!form.id || form.version < 1 || !form.slug) return null;
  return `${(config.siteUrl ?? location.origin).replace(/\/+$/, '')}/${(config.fullpageBase ?? 'chat').replace(/^\/+|\/+$/g, '')}/${encodeURIComponent(form.slug)}/`;
}
