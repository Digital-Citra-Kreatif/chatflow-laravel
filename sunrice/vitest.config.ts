import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

// Unit tests run outside the panel: the SDK's modules are stubbed in tests/setup.ts.
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: path('./src/') },
      { find: /^@chatflow\//, replacement: path('../resources/js/') },
      { find: /^@imajiner\/admin-sdk$/, replacement: path('./sdk/index.ts') },
      { find: /^@wordpress\/i18n$/, replacement: path('./src/lib/i18n.ts') },
    ],
  },
  test: { environment: 'jsdom', include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'] },
});
