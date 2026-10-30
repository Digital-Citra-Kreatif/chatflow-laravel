import { readFileSync, existsSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

// One form's life in order: build and publish it, answer it as a visitor, read the
// answer in the inbox and export it, then add an admin email and check it is sent.
test.describe.configure({ mode: 'serial' });

const mailLog = 'vendor/orchestra/testbench-core/laravel/storage/logs/laravel.log';
let shareUrl = '';
let formId = '';

/** Fails the test on any uncaught page error, console error or 4xx/5xx response. */
function watch(page: Page): string[] {
  const problems: string[] = [];
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) problems.push(`${response.status()} ${response.request().method()} ${response.url()}`);
  });
  return problems;
}

async function login(page: Page, to: string) {
  await page.goto(`/workbench/login?to=${encodeURIComponent(to)}`);
}

async function publish(page: Page) {
  await page.getByRole('button', { name: 'Publish', exact: true }).click();
  await page.getByRole('button', { name: 'Publish new version' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Form published' })).toBeVisible();
}

/** Answers the Contact request template; the runtime focuses each text input itself. */
async function answerContactForm(page: Page, name: string) {
  await page.goto(shareUrl);
  const bot = (text: string) => page.locator('.bubble.bot', { hasText: text });
  const type = async (text: string) => {
    await page.keyboard.type(text);
    await page.keyboard.press('Enter');
  };
  await expect(bot('What should we call you?')).toBeVisible();
  await type(name);
  await expect(bot('Where can we reply to you?')).toBeVisible();
  await type('ada@example.com');
  await page.getByRole('button', { name: 'Customer support' }).click();
  await expect(bot('Tell us a little more.')).toBeVisible();
  await page.keyboard.type('My engine needs debugging.');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(bot('May we use these details to respond to your request?')).toBeVisible();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(bot('Thank you! Your message has been recorded.')).toBeVisible();
}

test('builder: create from a template and publish', async ({ page }) => {
  const problems = watch(page);
  await login(page, '/chatflow/admin?page=cff-builder');
  const card = page.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Contact request', exact: true }) });
  await card.getByRole('button', { name: 'Use template' }).click();
  await expect(page).toHaveURL(/formId=\d+/);
  formId = new URL(page.url()).searchParams.get('formId') ?? '';
  await expect(page.getByText('6 fields')).toBeVisible();

  // Settings this version cannot deliver stay hidden.
  await page.getByRole('button', { name: 'Form settings', exact: true }).click();
  const sections = page.locator('.cff-settings-nav button');
  await expect(sections).toHaveText(['General', 'Notifications', 'Privacy and retention', 'Spam protection', 'Language and wording']);
  await page.getByRole('button', { name: 'Spam protection', exact: true }).click();
  await expect(page.getByLabel('Captcha')).toHaveCount(0);

  await publish(page);
  await page.getByRole('button', { name: 'Publish & share' }).click();
  const link = page.locator('.cff-share a[href*="/chat/"]').first();
  shareUrl = (await link.getAttribute('href')) ?? '';
  expect(shareUrl).toMatch(/\/chat\/contact-request\/?$/);
  await page.getByRole('button', { name: 'Embed', exact: true }).click();
  await expect(page.getByText(`<x-chatflow::form :id="${formId}" mode="inline" />`)).toBeVisible();
  expect(problems).toEqual([]);
});

test('visitor: answer the published form', async ({ page }) => {
  const problems = watch(page);
  await answerContactForm(page, 'Ada Lovelace');
  expect(problems).toEqual([]);
});

test('inbox: read the submission and export it as CSV', async ({ page }) => {
  const problems = watch(page);
  await login(page, '/chatflow/admin?page=cff-submissions');
  const row = page.getByRole('row', { name: /Ada Lovelace/ });
  await expect(row).toContainText('Customer support');
  await row.getByRole('button', { name: /^Response #\d+$/ }).click();
  await expect(page.getByText('My engine needs debugging.')).toBeVisible();
  await page.getByRole('button', { name: 'Back to submissions' }).click();

  await page.getByRole('button', { name: 'Export filtered results' }).click();
  await page.locator('select').filter({ hasText: 'Select a form' }).selectOption({ label: 'Contact request' });
  await page.getByRole('button', { name: 'Create private export' }).click();
  const download = page.waitForEvent('download');
  await page.getByText('Download (authenticated, expiring)').click();
  const csv = readFileSync(await (await download).path(), 'utf8');
  expect(csv).toContain('"Your name"');
  expect(csv).toContain('"Ada Lovelace",ada@example.com,"Customer support","My engine needs debugging."');
  expect(problems).toEqual([]);
});

test('notifications: an admin email is sent for new submissions', async ({ page }) => {
  const problems = watch(page);
  await login(page, `/chatflow/admin?page=cff-builder&formId=${formId}`);
  await page.getByRole('button', { name: 'Form settings', exact: true }).click();
  await page.getByRole('button', { name: 'Notifications', exact: true }).click();
  await page.getByRole('button', { name: 'Add admin email' }).click();
  await page.locator('[data-settings-group=notifications]').getByLabel('Recipients').fill('owner@example.com');
  await expect(page.getByText(/Draft saved \d/)).toBeVisible();
  await expect(page.getByText('Unpublished changes')).toBeVisible();
  await publish(page);

  const before = existsSync(mailLog) ? readFileSync(mailLog, 'utf8').length : 0;
  await answerContactForm(page, 'Grace Hopper');
  await expect.poll(() => (existsSync(mailLog) ? readFileSync(mailLog, 'utf8').slice(before) : '')).toContain('To: owner@example.com');
  const mail = readFileSync(mailLog, 'utf8').slice(before);
  expect(mail).toContain('Subject: New submission');
  expect(mail).toContain('Your name: Grace Hopper');
  expect(problems).toEqual([]);
});
