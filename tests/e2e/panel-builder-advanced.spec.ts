import { expect, test } from '@playwright/test';
import { login, watch } from './helpers';

// The builder's other tabs in the Sunrice panel: logic, design with the live preview,
// settings, emails (with a preview), sharing and the preview tab.
test.describe.configure({ mode: 'serial' });

test('panel builder: logic, design, settings, emails, share, preview', async ({ page }) => {
  const problems = watch(page);
  await login(page, '/admin/chatflow/forms');
  const form = await (await page.request.get('/workbench/forms/contact-request')).json();
  await page.goto(`/admin/chatflow/forms/${form.id}`);
  const saved = page.getByRole('status').filter({ hasText: /^Saved/ });

  // A rule on "Reason for contact": Partnership skips to the message.
  await page.getByRole('button', { name: /^\d+ Reason for contact/ }).click();
  await page.getByRole('tab', { name: 'Rules' }).click();
  await page.getByRole('button', { name: 'Add rule' }).click();
  await page.getByRole('combobox', { name: 'Question' }).click();
  await page.getByRole('option', { name: 'Reason for contact' }).click();
  await page.getByRole('combobox', { name: 'Value' }).click();
  await page.getByRole('option', { name: 'Partnership' }).click();
  await page.getByRole('combobox', { name: 'Target' }).click();
  await page.getByRole('option', { name: 'Contact permission' }).click();
  await page.getByRole('tab', { name: 'Logic' }).click();
  await expect(page.getByText('if Reason for contact is Partnership: Go to Contact permission')).toBeVisible();

  // Design: the live preview shows the chat, and a colour change is kept.
  await page.getByRole('tab', { name: 'Design' }).click();
  await expect(page.getByTestId('chat-preview').locator('.bubble.bot').first()).toBeVisible({ timeout: 15_000 });
  await page.getByRole('textbox', { name: 'Accent (buttons, links)', exact: true }).fill('#0f766e');

  // Settings: override the site's IP default for this form.
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await page.getByRole('combobox', { name: 'IP addresses' }).click();
  await page.getByRole('option', { name: 'Do not store' }).click();

  // Emails: an admin notification, previewed.
  await page.getByRole('tab', { name: 'Emails' }).click();
  await page.getByRole('button', { name: 'Add admin email' }).click();
  await page.getByRole('textbox', { name: 'To', exact: true }).fill('owner@example.com');
  await expect(saved).toBeVisible({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Preview' }).first().click();
  await expect(page.getByRole('dialog').getByText('New submission')).toBeVisible();
  // The email is shown in a sandboxed frame: read its document rather than querying inside it.
  await expect(page.getByRole('dialog').locator('iframe')).toHaveAttribute('srcdoc', /Your name/);
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).last().click();

  // Everything saved survives a reload.
  await expect(saved).toBeVisible({ timeout: 15_000 });
  await page.reload();
  const draft = await (await page.request.get(`/admin/chatflow/api/admin/forms/${form.id}`)).json();
  expect(draft.settings.appearance.primary).toBe('#0f766e');
  expect(draft.settings.privacy.ipMode).toBe('none');
  expect(draft.settings.notifications.admin[0].to).toEqual(['owner@example.com']);
  expect(draft.schema.steps.find((step: { key: string }) => step.key === 'topic').logic).toHaveLength(1);

  // Share: the live link and the embed code; Preview: the chat.
  await page.getByRole('tab', { name: 'Share' }).click();
  await expect(page.getByRole('textbox', { name: 'Form link' })).toHaveValue(/\/chat\/contact-request(-\d+)?\/$/);
  await expect(page.getByRole('textbox', { name: 'Embed code' })).toHaveValue(`<x-chatflow::form :id="${form.id}" mode="inline" />`);
  await expect(page.getByRole('img', { name: 'QR code for the form link' })).toBeVisible();
  await page.getByRole('tab', { name: 'Preview' }).click();
  await expect(page.getByTestId('chat-preview').locator('.bubble.bot').first()).toBeVisible({ timeout: 15_000 });

  expect(problems).toEqual([]);
});
