import { __, sprintf } from '@wordpress/i18n';
export type { FormSchema, FormSettings, FormDTO, Page, Step, Condition, Ending } from '../shared/contracts';
export type { Rule, Option, Group } from '../shared/schema.generated';
import { allowFieldTypes } from '../shared/logic/fields';
import type { AdminConfig as SharedAdminConfig } from '../shared/contracts';
import type { FormSettings } from '../shared/contracts';
export type Capability =
  | 'manage_forms'
  | 'view_submissions'
  | 'edit_submissions'
  | 'delete_submissions'
  | 'export_submissions'
  | 'purge_submissions'
  | 'manage_settings';
export interface AdminConfig extends SharedAdminConfig {
  /** Content-versioned URL provided by WordPress, for cached preview imports. */
  runtimeUrl?: string;
  defaults?: FormSettings;
  capabilities?: Partial<Record<Capability, boolean>>;
  adminUrl?: string;
  siteUrl?: string;
  /** Site time zone (IANA name or "+HH:MM" offset) used by site-timezone reports. */
  timezone?: string;
  /** The active theme's chatflow/frontend.js / .css, used by the preview. */
  themeFrontend?: { script?: string; style?: string };
  /** The MCP endpoint, where application passwords live, and whether they are available. */
  mcp?: { url: string; profileUrl: string; appPasswords: boolean; user: string };
  fullpageBase?: string;
  tools?: boolean;
  preview?: boolean;
  exportId?: number;
}
export function can(config: AdminConfig, cap: Capability): boolean {
  return config.capabilities?.[cap] === true;
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly data: Record<string, unknown> = {},
  ) {
    super(message);
  }
}
export class AdminApi {
  constructor(
    public readonly config: AdminConfig,
    private readonly transport: typeof fetch = (input, init) => globalThis.fetch(input, init),
  ) {
    // Server-registered extension types (cff_field_types) must not fail client diagnostics.
    allowFieldTypes(config.features?.fieldTypes ?? []);
  }
  /**
   * Build an admin REST URL for both pretty and plain permalinks. With plain
   * permalinks `restUrl` already contains `?rest_route=/cff/v1/`, so appending
   * `?page=1` directly would make the page parameter part of the route.
   */
  urlFor(path: string): string {
    const base = new URL(this.config.restUrl, globalThis.location?.href ?? 'https://localhost/');
    const [route, query = ''] = path.split('?');
    if (base.searchParams.has('rest_route')) {
      const prefix = (base.searchParams.get('rest_route') ?? '').replace(/\/$/, '');
      base.searchParams.set('rest_route', `${prefix}/${route}`);
    } else {
      base.pathname = `${base.pathname.replace(/\/$/, '')}/${route}`;
    }
    for (const [key, value] of new URLSearchParams(query)) base.searchParams.set(key, value);
    return base.href;
  }
  async request<T>(path: string, method = 'GET', body?: unknown, signal?: AbortSignal): Promise<T> {
    if (
      !path.startsWith('admin/') ||
      path.includes('..') ||
      path.includes('://') ||
      /\\|%2e|%2f|%5c/i.test(path.split('?')[0] ?? '')
    )
      throw new Error('Invalid admin API path');
    const response = await this.transport(this.urlFor(path), {
      method,
      credentials: 'same-origin',
      cache: 'no-store',
      redirect: 'error',
      // Laravel: CSRF token instead of the WordPress REST nonce; Accept makes errors come back as JSON.
      headers: { 'X-CSRF-TOKEN': this.config.nonce, 'Content-Type': 'application/json', Accept: 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      ...(signal ? { signal } : {}),
    });
    const json: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const error = json && typeof json === 'object' ? (json as Record<string, unknown>) : {};
      throw new ApiError(
        String(error.code ?? 'cff_http_error'),
        String(error.message ?? __('The request failed. Please try again.', 'chatflow-forms')),
        response.status,
        (error.data ?? {}) as Record<string, unknown>,
      );
    }
    return json as T;
  }
}
/**
 * A message to show for a failed request. Validation failures (an import, a save) carry
 * the exact problems in data.errors: the first is added, with its location in the form.
 */
export function errorMessage(error: unknown): string {
  if (!(error instanceof Error)) return __('An unexpected error occurred.', 'chatflow-forms');
  const issues = error instanceof ApiError && Array.isArray(error.data.errors) ? error.data.errors as { path?: unknown; message?: unknown }[] : [];
  const first = issues.find((issue) => issue && typeof issue.message === 'string');
  if (!first) return error.message;
  const where = typeof first.path === 'string' && first.path ? `${first.path}: ` : '';
  const more = issues.length > 1 ? ` ${sprintf(__('(and %d more)', 'chatflow-forms'), issues.length - 1)}` : '';
  return `${error.message} ${where}${String(first.message)}${more}`;
}
export function queryString(values: Record<string, unknown>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values))
    if (value !== undefined && value !== '' && value !== null) query.set(key, String(value));
  return query.toString();
}
export function safeHttpUrl(value: string): string | null {
  try {
    const url = new URL(value, window.location.href);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

declare global {
  interface Window {
    cffAdmin: AdminConfig;
    cffBlock: AdminConfig;
  }
}
