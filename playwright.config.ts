import { defineConfig } from '@playwright/test';

// Browser tests against the package served by Orchestra Testbench (see testbench.yaml).
// `npm run e2e` rebuilds the workbench database and assets, then starts the server.
const port = Number(process.env.CHATFLOW_E2E_PORT ?? 8123);

export default defineConfig({
  testDir: 'tests/e2e',
  globalTeardown: './tests/e2e/teardown.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    viewport: { width: 1400, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `vendor/bin/testbench workbench:build && vendor/bin/testbench serve --host=127.0.0.1 --port=${port}`,
    url: `http://127.0.0.1:${port}/vendor/chatflow/runtime/runtime.js`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
