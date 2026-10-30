import { readFileSync } from 'node:fs';
import { expect, test, type APIRequestContext } from '@playwright/test';
import { login, watch } from './helpers';

// The submissions inbox in the Sunrice panel: filters, the detail page, notes,
// status, bulk actions and CSV export.
test.describe.configure({ mode: 'serial' });

const API = '/chatflow/api/v1/';

/** Answers a published contact form through the public visitor API. */
async function answer(request: APIRequestContext, form: { id: number; version: number }, name: string, topic: string) {
  const token = await (await request.post(`${API}forms/${form.id}/start-token`, { data: { version: form.version } })).json();
  const session = await (await request.post(`${API}sessions`, {
    data: { formId: form.id, version: form.version, meta: {}, prefill: {} },
    headers: { 'X-CFF-Start-Token': token.startToken, 'Idempotency-Key': crypto.randomUUID() },
  })).json();
  const submitted = await request.post(`${API}sessions/${session.sessionId}/submit`, {
    data: {
      version: session.version, revision: session.revision,
      answers: { name, email: `${name.split(' ')[0].toLowerCase()}@example.com`, topic, message: `Hello from ${name}.`, consent: true },
    },
    headers: { 'X-CFF-Request-Token': session.requestToken, 'Idempotency-Key': crypto.randomUUID() },
  });
  expect(submitted.ok(), await submitted.text()).toBeTruthy();
}

test('panel inbox: filter, read, annotate, export, trash', async ({ page, request }) => {
  const problems = watch(page);
  await login(page, '/admin/chatflow/forms');
  const form = await (await page.request.get('/workbench/forms/contact-request')).json();
  await answer(request, form, 'Rosalind Franklin', 'Partnership');
  await answer(request, form, 'Katherine Johnson', 'Sales inquiry');

  // Narrow the inbox to this form and a search.
  await page.goto(`/admin/chatflow/submissions?formId=${form.id}`);
  const rows = page.getByRole('row').filter({ hasText: 'Response #' });
  await expect(rows).toHaveCount(2);
  await expect(page.getByRole('columnheader', { name: 'Your name' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search answers' }).fill('Rosalind');
  await expect(rows).toHaveCount(1);
  await expect(page).toHaveURL(/search=Rosalind/);

  // The detail page: answers, a note, read and star, a status change.
  await rows.first().getByRole('link', { name: /Response #\d+/ }).click();
  await expect(page.getByText('Hello from Rosalind Franklin.')).toBeVisible();
  await page.getByRole('textbox', { name: 'Add a private note' }).fill('Call back on Monday.');
  await page.getByRole('button', { name: 'Add note' }).click();
  await expect(page.getByText('Note added.')).toBeVisible();
  await expect(page.getByText('Call back on Monday.')).toBeVisible();
  await page.getByRole('button', { name: 'Mark read' }).click();
  await expect(page.getByRole('button', { name: 'Mark unread' })).toBeVisible();
  await page.getByRole('button', { name: 'Star', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Starred' })).toBeVisible();
  await page.getByRole('tab', { name: 'Conversation' }).click();
  await expect(page.getByText('What should we call you?')).toBeVisible();

  // Back keeps the inbox's filters.
  await page.locator('a[aria-label="Submissions"]').click();
  await expect(page).toHaveURL(/search=Rosalind/);
  await expect(rows).toHaveCount(1);

  // Export this form's submissions as CSV.
  await page.getByRole('textbox', { name: 'Search answers' }).fill('');
  await expect(rows).toHaveCount(2);
  await page.getByRole('button', { name: 'Export CSV' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Create export' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download CSV' }).click();
  const csv = readFileSync(await (await download).path(), 'utf8');
  expect(csv).toContain('"Rosalind Franklin"');
  expect(csv).toContain('"Katherine Johnson"');
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).first().click();

  // Bulk: trash both, then delete them permanently from the trash.
  await page.getByRole('checkbox', { name: 'Select all rows' }).click();
  await page.getByRole('button', { name: 'Move to trash' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Move to trash' }).click();
  await expect(rows).toHaveCount(0);
  await page.getByRole('tab', { name: 'Trash' }).click();
  await expect(rows).toHaveCount(2);
  await page.getByRole('checkbox', { name: 'Select all rows' }).click();
  await page.getByRole('button', { name: 'Delete permanently' }).click();
  await page.getByRole('textbox', { name: 'Type DELETE to confirm' }).fill('DELETE');
  await page.getByRole('dialog').getByRole('button', { name: 'Delete permanently' }).click();
  await expect(rows).toHaveCount(0);

  expect(problems).toEqual([]);
});
