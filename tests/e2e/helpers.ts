import type { Page } from '@playwright/test';

/** Collects uncaught page errors, console errors and 4xx/5xx responses; tests expect it empty. */
export function watch(page: Page): string[] {
  const problems: string[] = [];
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    // Playwright's trace recorder injects a script into every frame; sandboxed frames (the
    // email preview, deliberately without scripts) block it and the browser says so.
    if (message.text().startsWith("Blocked script execution in 'about:srcdoc'")) return;
    if (message.type() === 'error') problems.push(`console: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) problems.push(`${response.status()} ${response.request().method()} ${response.url()}`);
  });
  return problems;
}

/** Signs in as the workbench's super admin, then opens `to`. */
export async function login(page: Page, to: string) {
  await page.goto(`/workbench/login?to=${encodeURIComponent(to)}`);
}
