import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { messagingDefaults, palettes } from '../../resources/js/builder/themePalettes';
import { login } from './helpers';

// Every theme preset keeps its text readable (axe color-contrast, WCAG AA) wherever the chat
// shows: full page, inline and in the launcher, on a phone and on a desktop. The visitor's
// answers (their bubbles) and the Continue button on the brand colour are on screen when checked.
test.describe.configure({ mode: 'parallel', timeout: 30_000 });

const presets = [
  { id: 'default', appearance: { style: 'messaging', theme: 'light', ...messagingDefaults } },
  ...palettes().map((palette) => ({ id: palette.id, appearance: { style: 'messaging', theme: palette.theme, wallpaper: palette.wallpaper, ...palette.colors } })),
];

async function answerUpToConsent(page: Page) {
  const input = page.locator('.active input:not([type=hidden]), .active textarea').first();
  const answers = page.locator('.bubble.user');
  const type = async (value: string, count: number) => {
    await expect(input).toBeFocused();
    await page.keyboard.type(value);
    await page.keyboard.press('Enter');
    await expect(answers).toHaveCount(count);
  };
  await type('Ada Lovelace', 1);
  await type('ada@example.com', 2);
  await page.locator('.active').getByRole('button', { name: 'Partnership' }).click();
  await expect(answers).toHaveCount(3);
  await type('Hello there.', 4);
  await expect(page.locator('.active').getByRole('button', { name: 'Continue' })).toBeVisible();
}

for (const viewport of [{ name: 'phone', width: 390, height: 844 }, { name: 'desktop', width: 1280, height: 900 }]) {
  for (const mode of ['fullpage', 'inline', 'launcher'] as const) {
    for (const preset of presets) {
      test(`${preset.id}, ${mode}, ${viewport.name}: no colour contrast failures`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await login(page, '/admin');
        const params = new URLSearchParams({ appearance: JSON.stringify(preset.appearance) });
        const form = await (await page.request.get(`/workbench/forms/contact-request?${params}`)).json() as { id: number; slug: string };
        if (mode === 'fullpage') await page.goto(`/chat/${form.slug}/`);
        else {
          await page.goto(`/workbench/embed/${form.id}?mode=${mode}`);
          if (mode === 'launcher') await page.locator('[data-cff-placeholder]').click();
          else { await page.locator('.active input').first().scrollIntoViewIfNeeded(); await page.locator('.active input').first().focus(); }
        }
        await answerUpToConsent(page);
        await page.waitForTimeout(300);
        const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
        expect(results.violations.flatMap((violation) => violation.nodes.map((node) => `${node.target.join(' ')}: ${node.failureSummary}`))).toEqual([]);
      });
    }
  }
}
