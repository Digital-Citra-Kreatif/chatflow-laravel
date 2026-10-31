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

test.describe('on a small phone', () => {
  test.use({ viewport: { width: 360, height: 560 } });
  test('full page: a review summary taller than the screen shows its Submit button', async ({ page }) => {
    const problems = watch(page);
    const form = await publish(page, { completion: { review: 'show' } });
    await page.goto(`/chat/${form.slug}/`);
    await answerAll(page);
    await page.locator('.active input[type=checkbox]').check();
    await page.locator('.active').getByRole('button', { name: 'Continue' }).dispatchEvent('click');
    const submit = page.getByRole('button', { name: 'Submit' });
    await expect(page.locator('.summary')).toBeVisible();
    await expect.poll(async () => {
      const box = await submit.boundingBox();
      return box !== null && box.y >= 0 && box.y + box.height <= 560 + 1;
    }, { timeout: 5000 }).toBe(true);
    expect(problems).toEqual([]);
  });
});

test('full page: no session is started until the visitor types, then exactly one', async ({ page }) => {
  const form = await publish(page);
  const calls: string[] = [];
  page.on('request', (request) => request.url().includes('/api/v1/') && calls.push(`${request.method()} ${new URL(request.url()).pathname.replace(/.*api\/v1\//, '')}`));
  await page.goto(`/chat/${form.slug}/`);
  await expect(page.locator('.active input:not([type=hidden])').first()).toBeFocused();
  await page.waitForTimeout(1500);
  expect(calls.filter((call) => /start-token|sessions/.test(call))).toEqual([]);
  await page.keyboard.type('Ada Lovelace');
  await page.keyboard.press('Enter');
  // The answer typed while the session started is kept and saved.
  await expect(page.locator('.bubble.user').first()).toContainText('Ada Lovelace');
  await expect.poll(() => calls.filter((call) => call.startsWith('PATCH sessions/')).length).toBe(1);
  expect(calls.filter((call) => call.endsWith('/start-token'))).toHaveLength(1);
  expect(calls.filter((call) => call === 'POST sessions')).toHaveLength(1);
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
  // The submit limit's own message, and no retry until the server's wait is over.
  await expect(notice).toContainText('Too many submissions');
  await expect(notice.getByRole('button', { name: /^Try again in \d+ min$/ })).toBeDisabled();
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

test('launcher: no layout shift, and the runtime loads when wanted', async ({ page }) => {
  const problems = watch(page);
  const form = await publish(page);
  const runtime: string[] = [];
  page.on('request', (request) => request.url().includes('/runtime/runtime.js') && runtime.push(request.url()));
  await page.addInitScript(() => {
    (window as unknown as { cls: number }).cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
        if (!entry.hadRecentInput) (window as unknown as { cls: number }).cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  let release: () => void = () => undefined;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/runtime/runtime.js*', async (route) => { await held; await route.continue(); });
  await page.goto(`/workbench/embed/${form.id}?mode=launcher`);
  // Before the runtime: a fixed button, out of the page's flow.
  const placeholder = page.locator('[data-cff-placeholder]');
  await expect(placeholder).toBeVisible();
  expect(await page.locator('cff-chat').evaluate((host) => getComputedStyle(host).position)).toBe('fixed');
  // Nothing asks for it, so it is not downloaded.
  await page.waitForTimeout(1500);
  expect(runtime).toEqual([]);
  // Reaching for the button requests it; it hydrates without moving anything.
  await placeholder.hover();
  release();
  await expect.poll(() => runtime.length, { timeout: 10_000 }).toBe(1);
  await expect(page.locator('.launcher-toggle')).toBeVisible();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => (window as unknown as { cls: number }).cls)).toBe(0);
  expect(problems).toEqual([]);
});

test('launcher: the panel opens at its full size and does not grow as messages arrive', async ({ page }) => {
  const form = await publish(page);
  await page.goto(`/workbench/embed/${form.id}?mode=launcher`);
  await page.locator('[data-cff-placeholder]').click();
  const panel = page.locator('.launcher-panel');
  await expect(panel).toBeVisible();
  const first = (await panel.boundingBox())!;
  // The welcome messages type in one after another.
  await expect(page.locator('.active input:not([type=hidden])').first()).toBeVisible();
  await page.waitForTimeout(500);
  const later = (await panel.boundingBox())!;
  expect(Math.round(later.height)).toBe(Math.round(first.height));
  expect(Math.round(later.y)).toBe(Math.round(first.y));
});

test('launcher: keyboard focus moves from the placeholder to the toggle', async ({ page }) => {
  const form = await publish(page);
  let release: () => void = () => undefined;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/runtime/runtime.js*', async (route) => { await held; await route.continue(); });
  await page.goto(`/workbench/embed/${form.id}?mode=launcher`);
  // Tab through the page to the placeholder; its focus starts the download.
  for (let presses = 0; presses < 40; presses++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(() => document.activeElement?.hasAttribute('data-cff-placeholder'))) break;
  }
  expect(await page.evaluate(() => document.activeElement?.hasAttribute('data-cff-placeholder'))).toBe(true);
  release();
  const toggle = page.locator('.launcher-toggle');
  await expect(toggle).toBeVisible();
  // The toggle has focus (inside the shadow root), shows its focus ring, and Enter opens the chat.
  await expect.poll(() => page.evaluate(() => document.querySelector('cff-chat')?.shadowRoot?.activeElement?.className)).toBe('launcher-toggle');
  expect(await toggle.evaluate((element) => element.matches(':focus-visible') && getComputedStyle(element).outlineStyle !== 'none')).toBe(true);
  await page.keyboard.press('Enter');
  await expect(page.locator('.launcher-panel')).toBeVisible();
});

test('launcher: a click before the runtime loads opens the chat', async ({ page }) => {
  const form = await publish(page);
  // Hold the runtime back until after the click.
  let release: () => void = () => undefined;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/runtime/runtime.js*', async (route) => { await held; await route.continue(); });
  await page.goto(`/workbench/embed/${form.id}?mode=launcher`);
  await page.locator('[data-cff-placeholder]').click();
  release();
  await expect(page.locator('.launcher-panel')).toBeVisible();
  await expect(page.locator('.active input:not([type=hidden])').first()).toBeFocused();
});

test('Meadow header text, answer names and Start over', async ({ page }) => {
  const meadow = { style: 'messaging', theme: 'light', wallpaper: 'doodle', primary: '#008069', headerBackground: '#008069', headerText: '#ffffff', chatBackground: '#efe7de', botBubbleBackground: '#ffffff', textColor: '#111b21', userBubbleBackground: '#d9fdd3', userTextColor: '#111b21' };
  const form = await publish(page, { appearance: meadow });
  await page.goto(`/chat/${form.slug}/`);
  await expect(page.locator('.active input:not([type=hidden])').first()).toBeFocused();
  await page.keyboard.type('Ada Lovelace');
  await page.keyboard.press('Enter');
  // The answer's accessible name starts with what it shows (WCAG 2.5.3).
  const answer = page.getByRole('button', { name: /^Ada Lovelace Edit\s*: Your name$/ });
  await expect(answer).toBeVisible();
  const results = await new AxeBuilder({ page }).withRules(['color-contrast', 'label-content-name-mismatch']).analyze();
  expect(results.violations.flatMap((violation) => violation.nodes.map((node) => `${violation.id}: ${node.target.join(' ')}`))).toEqual([]);

  // Start over asks first; Cancel keeps the answers, confirming clears them.
  await page.locator('header').getByRole('button', { name: 'Start over' }).click();
  const dialog = page.getByRole('alertdialog', { name: 'Start over' });
  await expect(dialog).toContainText('Start from the beginning?');
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(answer).toBeVisible();
  await page.locator('header').getByRole('button', { name: 'Start over' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Start over' }).click();
  await expect(answer).toHaveCount(0);
});

test('launcher bottom offset and the auto theme on a dark device', async ({ page }) => {
  const form = await publish(page, {
    display: { mode: 'launcher', launcher: { bottomOffset: 80 } },
    appearance: { style: 'messaging', theme: 'auto', primary: '#008069', headerBackground: '#008069', headerText: '#ffffff', chatBackground: '#efe7de' },
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(`/workbench/embed/${form.id}?mode=launcher`);
  await page.locator('[data-cff-placeholder]').hover();
  const toggle = page.locator('.launcher-toggle');
  await expect(toggle).toBeVisible({ timeout: 10_000 });
  // Away from the button, which grows a little under the pointer.
  await page.mouse.move(0, 0);
  await page.waitForTimeout(300);
  const box = await toggle.boundingBox();
  // 12px from the bottom on a phone, plus the 80px offset.
  expect(Math.round(844 - (box!.y + box!.height))).toBe(92);
  await toggle.click();
  // "auto" follows the dark device: dark chat surfaces, the palette's accent kept.
  const background = await page.locator('.conversation').evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(background).toBe('rgb(14, 22, 33)');
});
