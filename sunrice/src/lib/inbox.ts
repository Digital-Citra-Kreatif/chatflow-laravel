import type { Filters, Status } from '@chatflow/submissions/model';

export type { Filters, Status };

/** Inbox state kept in the address (?status=partial&formId=3&page=2…), so links, reloads and Back work. */
export interface InboxQuery {
  filters: Filters;
  page: number;
  perPage: number;
}

export const PER_PAGE_OPTIONS = [20, 50, 100] as const;
const STATUSES: Status[] = ['completed', 'partial', 'abandoned', 'spam', 'trash'];
const OPERATORS = ['eq', 'neq', 'contains', 'gt', 'gte', 'lt', 'lte', 'is_empty', 'is_not_empty'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Reads the inbox state from a query string; anything invalid is dropped. */
export function parseInboxQuery(search: string): InboxQuery {
  const params = new URLSearchParams(search);
  const filters: Filters = {};
  const status = params.get('status');
  filters.status = STATUSES.includes(status as Status) ? (status as Status) : 'completed';
  const formId = Number(params.get('formId'));
  if (Number.isSafeInteger(formId) && formId > 0) filters.formId = formId;
  for (const key of ['from', 'to'] as const) {
    const value = params.get(key);
    if (value && DATE.test(value)) filters[key] = value;
  }
  const text = params.get('search');
  if (text) filters.search = text.slice(0, 255);
  for (const key of ['isRead', 'isStarred'] as const) {
    const value = params.get(key);
    if (value === '1' || value === '0') filters[key] = value === '1';
  }
  const fieldKey = params.get('fieldKey');
  const operator = params.get('operator');
  if (filters.formId && fieldKey && /^[a-z][a-z0-9_]{0,63}$/.test(fieldKey) && operator && OPERATORS.includes(operator)) {
    filters.fieldKey = fieldKey;
    filters.operator = operator;
    const value = params.get('value');
    if (value !== null && !operator.startsWith('is_')) filters.value = value.slice(0, 255);
  }
  const page = Number(params.get('page'));
  const perPage = Number(params.get('perPage'));
  return {
    filters,
    page: Number.isSafeInteger(page) && page > 1 ? page : 1,
    perPage: (PER_PAGE_OPTIONS as readonly number[]).includes(perPage) ? perPage : PER_PAGE_OPTIONS[0],
  };
}

/** The query string for an inbox state: defaults are left out, booleans are 1/0. */
export function inboxQueryString(query: InboxQuery, forApi = false): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query.filters)) {
    if (value === undefined || value === '') continue;
    if (!forApi && key === 'status' && value === 'completed') continue;
    params.set(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
  }
  if (forApi || query.page > 1) params.set('page', String(query.page));
  if (forApi || query.perPage !== PER_PAGE_OPTIONS[0]) params.set('perPage', String(query.perPage));
  return params.toString();
}

/** Whether anything narrows the list beyond its status tab. */
export function isFiltered(filters: Filters): boolean {
  return Object.entries(filters).some(([key, value]) => key !== 'status' && value !== undefined && value !== '');
}

/** Up to three answer columns: the form's first fields when one form is shown, else the most common keys on the page. */
export function answerColumnKeys(labels: Record<string, string> | undefined, rows: { answers: Record<string, unknown> }[]): string[] {
  if (labels) return Object.keys(labels).slice(0, 3);
  const counts = new Map<string, number>();
  for (const row of rows) for (const key of Object.keys(row.answers)) counts.set(key, (counts.get(key) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([key]) => key);
}
