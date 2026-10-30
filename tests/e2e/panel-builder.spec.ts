import { expect, test } from '@playwright/test';
import { login, watch } from './helpers';

// The builder in the Sunrice panel: a blank form gets questions, saves itself,
// publishes, and visitors get the published version.
test.describe.configure({ mode: 'serial' });

test('panel builder: build, autosave, publish', async ({ page, browser }) => {
  const problems = watch(page);
  await login(page, '/admin/chatflow/forms/create');
  await page.getByRole('button', { name: 'Start blank' }).click();
  await expect(page).toHaveURL(/\/admin\/chatflow\/forms\/\d+$/);
  const name = `Panel built form ${Date.now()}`;
  await page.getByRole('textbox', { name: 'Form name' }).fill(name);

  // A short text question with its own message, required.
  await page.getByRole('button', { name: 'Add field' }).click();
  await page.getByRole('menuitem', { name: 'Short text' }).click();
  await page.getByRole('textbox', { name: 'Bot message' }).fill('Which city do you live in?');
  await expect(page.getByRole('button', { name: /^\d+ Which city do you live in\?/ })).toBeVisible();
  await page.getByRole('tab', { name: 'Advanced' }).click();
  await page.getByRole('textbox', { name: 'Field key' }).fill('city');
  await page.getByRole('textbox', { name: 'Field key' }).press('Enter');
  await page.getByRole('tab', { name: 'Content' }).click();

  // A choice question with options added in bulk.
  await page.getByRole('button', { name: 'Add field' }).click();
  await page.getByRole('menuitem', { name: 'Single choice' }).click();
  await page.getByRole('textbox', { name: 'Bot message' }).fill('How did you hear about us?');
  // Edits less than 0.7 s apart are one undo step: let this one settle first.
  await expect(page.getByRole('status').filter({ hasText: /^Saved/ })).toBeVisible({ timeout: 15_000 });
  await page.getByRole('textbox', { name: 'Add several (one per line)' }).fill('Friend\nSearch\nSocial media');
  await page.getByRole('button', { name: 'Add these options' }).click();
  await expect(page.getByRole('textbox', { name: 'Option label' })).toHaveCount(4);

  // Autosave catches up.
  await expect(page.getByRole('status').filter({ hasText: /^Saved/ })).toBeVisible({ timeout: 15_000 });

  // Undo removes the bulk options; redo brings them back.
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('textbox', { name: 'Option label' })).toHaveCount(1);
  await page.getByRole('button', { name: 'Redo' }).click();
  await expect(page.getByRole('textbox', { name: 'Option label' })).toHaveCount(4);

  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Publish', exact: true }).click();
  await expect(page.getByText('Published. Visitors now get this version.')).toBeVisible();
  await expect(page.getByText('Live · v1')).toBeVisible();

  // A visitor sees the new question on the live page.
  const id = page.url().split('/').pop();
  const { slug } = await (await page.request.get(`/admin/chatflow/api/admin/forms/${id}`)).json();
  const visitor = await browser.newPage();
  await visitor.goto(`/chat/${slug}/`);
  await expect(visitor.locator('.bubble.bot', { hasText: 'Which city do you live in?' })).toBeVisible();
  await visitor.close();

  expect(problems).toEqual([]);
});
