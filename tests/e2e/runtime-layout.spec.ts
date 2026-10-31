import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { login, watch } from './helpers';

// The visitor chat's layout and contrast: what the visitor acts on stays on screen
// (full-page and inline, on a phone), and text on the brand colour stays readable.
test.describe.configure({ mode: 'serial' });
test.use({ viewport: { width: 390, height: 844 } });

async function publish(page: Page, query: Record<string, unknown> = {}) {
  await login(page, '/admin');
  const params = new URLSearchParams(Object.entries(query).map(([key, value]) => [key, JSON.stringify(value)]));
  return (await page.request.get(`/workbench/forms/contact-request?${params}`)).json() as Promise<{ id: number; slug: string }>;
}

/** The active question's input or buttons and its Continue are fully inside the window. */
async function expectActiveInView(page: Page) {
  const active = page.locator('.active').last();
  await expect(active).toBeVisible();
  await expect.poll(async () => {
    const box = await active.boundingBox();
    const height = page.viewportSize()!.height;
    return box !== null && box.y >= 0 && box.y + box.height <= height + 1;
  }, { timeout: 5000 }).toBe(true);
}

/**
 * Answers like a visitor: types into the field the chat focused and presses Enter, and
 * clicks choices without Playwright's automatic scrolling (fill() and click() scroll
 * their target into view first, which would hide the very problem tested here).
 */
async function answerAll(page: Page) {
  const focused = () => expect(page.locator('.active input:not([type=hidden]), .active textarea').first()).toBeFocused();
  const type = async (value: string) => {
    await focused();
    await page.keyboard.type(value);
    await page.keyboard.press('Enter');
  };
  await expectActiveInView(page);
  // An empty answer shows its error next to the input, on screen.
  await focused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.field-error')).toBeAttached();
  await expectActiveInView(page);
  await type('Ada Lovelace');
  await expectActiveInView(page);
  await type('ada@example.com');
  await expectActiveInView(page);
  await page.locator('.active').getByRole('button', { name: 'Partnership' }).dispatchEvent('click');
  await expectActiveInView(page);
  await type('A longer message so the conversation grows past the bottom of a phone screen.');
  await expectActiveInView(page);
}

test.describe('on a shorter phone', () => {
  // The contact form fits a tall phone; this one is short enough for the conversation to outgrow it.
  test.use({ viewport: { width: 390, height: 667 } });
  test('full page: the active step stays in view on a phone', async ({ page }) => {
    const problems = watch(page);
    const form = await publish(page);
    await page.goto(`/chat/${form.slug}/`);
    await answerAll(page);
    expect(problems).toEqual([]);
  });
});

test('inline: the page does not jump on load, then follows the conversation', async ({ page }) => {
  const problems = watch(page);
  const form = await publish(page);
  await page.goto(`/workbench/embed/${form.id}?mode=inline`);
  await expect(page.locator('.bubble.bot').first()).toBeAttached();
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  // The visitor scrolls to the form and starts typing.
  await page.locator('.active input').first().scrollIntoViewIfNeeded();
  await page.locator('.active input').first().focus();
  await answerAll(page);
  expect(problems).toEqual([]);
});

test('a refused submit (429) is shown on screen', async ({ page }) => {
  const form = await publish(page, { spam: { rateLimit: 1, rateWindowSeconds: 600 } });
  for (let round = 0; round < 2; round++) {
    await page.goto(`/chat/${form.slug}/`);
    if (round) await page.getByRole('button', { name: 'Start over' }).first().click().catch(() => undefined);
    await answerAll(page);
    await page.locator('.active input[type=checkbox]').check();
    await page.locator('.active').getByRole('button', { name: 'Continue' }).click();
  }
  const notice = page.locator('.notice.is-error');
  await expect(notice).toBeVisible();
  await expect.poll(async () => {
    const box = await notice.boundingBox();
    return box !== null && box.y >= 0 && box.y + box.height <= 844 + 1;
  }, { timeout: 5000 }).toBe(true);
});

for (const theme of ['light', 'dark'] as const) {
  test(`classic ${theme} with a yellow brand colour passes colour contrast`, async ({ page }) => {
    const form = await publish(page, { appearance: { style: 'classic', theme, primary: '#fde047' } });
    await page.goto(`/chat/${form.slug}/`);
    // The first question's Continue button is on the brand colour; dark mode also has "Start over" in the header.
    await expect(page.locator('.active').getByRole('button', { name: 'Continue' })).toBeVisible();
    const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
    expect(results.violations.flatMap((violation) => violation.nodes.map((node) => node.target.join(' ')))).toEqual([]);
  });
}

test('launcher: errors and the on-screen keyboard keep the active step in view', async ({ page }) => {
  const problems = watch(page);
  const form = await publish(page);
  await page.goto(`/workbench/embed/${form.id}?mode=launcher`);
  await page.getByRole('button', { name: /chat|open/i }).last().click();
  const input = page.locator('.active input:not([type=hidden])').first();
  await expect(input).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.field-error')).toBeAttached();
  await expectActiveInView(page);
  await page.keyboard.type('Ada Lovelace');
  await page.keyboard.press('Enter');
  await expect(input).toBeFocused();
  // A phone keyboard leaves about 508 px of the window visible.
  await page.setViewportSize({ width: 390, height: 508 });
  await expectActiveInView(page);
  expect(problems).toEqual([]);
});
