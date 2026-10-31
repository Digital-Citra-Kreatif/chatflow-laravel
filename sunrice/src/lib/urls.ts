import { adminUrl } from '@imajiner/admin-sdk';

/** Panel addresses of ChatFlow's pages. */
export const urls = {
  forms: (query: Record<string, string | number | undefined> = {}) => withQuery(adminUrl('chatflow/forms'), query),
  createForm: () => adminUrl('chatflow/forms/create'),
  form: (id: number) => adminUrl(`chatflow/forms/${id}`),
  formAction: (id: number, action: 'duplicate' | 'trash' | 'restore') => adminUrl(`chatflow/forms/${id}/${action}`),
  submissions: (query: Record<string, string | number | undefined> = {}) => withQuery(adminUrl('chatflow/submissions'), query),
  submission: (id: number) => adminUrl(`chatflow/submissions/${id}`),
};

export function withQuery(base: string, query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  const search = params.toString();
  return search ? `${base}?${search}` : base;
}
