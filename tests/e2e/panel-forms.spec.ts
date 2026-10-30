import { expect, test } from '@playwright/test';
import { login, watch } from './helpers';

// The forms list in the Sunrice panel: create from a template, search, duplicate,
// trash, restore and delete permanently.
test.describe.configure({ mode: 'serial' });

test('panel forms list: create, find, duplicate, trash, restore, delete', async ({ page }) => {
  const problems = watch(page);
  await login(page, '/admin/chatflow/forms');
  await expect(page.getByRole('heading', { name: 'Forms', exact: true })).toBeVisible();

  // Create from a template: a draft opens in the builder.
  await page.getByRole('link', { name: 'New form' }).click();
  await page.getByRole('button', { name: 'Use template: Lead capture' }).click();
  await expect(page).toHaveURL(/\/admin\/chatflow\/forms\/\d+$/);
  await expect(page.getByRole('heading', { name: 'Lead capture' })).toBeVisible();

  await page.goto('/admin/chatflow/forms');
  await page.getByRole('textbox', { name: 'Search forms' }).fill('lead');
  await expect(page).toHaveURL(/search=lead/);
  const row = () => page.getByRole('row', { name: /Lead capture/ });
  await expect(row()).toHaveCount(1);
  await expect(row()).toContainText('Draft');

  // Duplicate opens the copy; the list then has both.
  await row().getByRole('button', { name: 'Actions for Lead capture' }).click();
  await page.getByRole('menuitem', { name: 'Duplicate' }).click();
  await expect(page.getByText('Form duplicated.')).toBeVisible();
  await page.goto('/admin/chatflow/forms?search=lead');
  await expect(row()).toHaveCount(2);

  // A draft goes to the trash without asking, with an Undo in the toast.
  await row().first().getByRole('button', { name: /^Actions for/ }).click();
  await page.getByRole('menuitem', { name: 'Move to trash' }).click();
  await expect(page.getByText('Moved to the trash.')).toBeVisible();
  await expect(row()).toHaveCount(1);

  await page.getByRole('button', { name: 'Trash', exact: true }).click();
  await expect(page.getByText('Trash', { exact: true }).first()).toBeVisible();
  await row().getByRole('button', { name: 'Restore' }).click();
  await expect(page.getByText('Form restored.')).toBeVisible();

  // Back to the list, trash it again, then delete it permanently from the trash.
  await page.goto('/admin/chatflow/forms?search=lead');
  await row().first().getByRole('button', { name: /^Actions for/ }).click();
  await page.getByRole('menuitem', { name: 'Move to trash' }).click();
  await expect(page.getByText('Moved to the trash.')).toBeVisible();
  await page.goto('/admin/chatflow/forms?status=trash');
  await row().getByRole('button', { name: 'Delete permanently' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete permanently' }).click();
  await expect(page.getByText('Form deleted permanently.')).toBeVisible();
  await expect(page.getByText('The trash is empty.')).toBeVisible();

  expect(problems).toEqual([]);
});
