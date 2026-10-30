import { describe, expect, it } from 'vitest';
import { answerColumnKeys, inboxQueryString, isFiltered, parseInboxQuery } from '@/lib/inbox';

describe('inbox query', () => {
  it('defaults to completed submissions, first page', () => {
    expect(parseInboxQuery('')).toEqual({ filters: { status: 'completed' }, page: 1, perPage: 20 });
    expect(inboxQueryString(parseInboxQuery(''))).toBe('');
  });

  it('round-trips every filter', () => {
    const search = 'status=partial&formId=3&from=2026-01-01&to=2026-02-01&search=ada&isRead=0&isStarred=1&fieldKey=email&operator=contains&value=%40example&page=2&perPage=50';
    const query = parseInboxQuery(search);
    expect(query.filters).toEqual({
      status: 'partial', formId: 3, from: '2026-01-01', to: '2026-02-01', search: 'ada', isRead: false, isStarred: true,
      fieldKey: 'email', operator: 'contains', value: '@example',
    });
    expect(parseInboxQuery(inboxQueryString(query))).toEqual(query);
  });

  it('drops invalid values', () => {
    const query = parseInboxQuery('status=nope&formId=-1&from=yesterday&isRead=maybe&fieldKey=email&operator=eq&page=0&perPage=7');
    expect(query).toEqual({ filters: { status: 'completed' }, page: 1, perPage: 20 });
  });

  it('needs a form for an answer filter, and no value for is_empty', () => {
    expect(parseInboxQuery('fieldKey=email&operator=eq&value=x').filters.fieldKey).toBeUndefined();
    expect(parseInboxQuery('formId=1&fieldKey=email&operator=is_empty&value=x').filters).toEqual({ status: 'completed', formId: 1, fieldKey: 'email', operator: 'is_empty' });
  });

  it('always sends status and paging to the API', () => {
    expect(inboxQueryString(parseInboxQuery(''), true)).toBe('status=completed&page=1&perPage=20');
  });

  it('knows when the list is filtered', () => {
    expect(isFiltered({ status: 'spam' })).toBe(false);
    expect(isFiltered({ status: 'spam', search: 'x' })).toBe(true);
  });

  it('picks answer columns', () => {
    expect(answerColumnKeys({ name: 'Name', email: 'Email', topic: 'Topic', message: 'Message' }, [])).toEqual(['name', 'email', 'topic']);
    expect(answerColumnKeys(undefined, [{ answers: { a: 1, b: 2 } }, { answers: { b: 3 } }])).toEqual(['b', 'a']);
  });
});
