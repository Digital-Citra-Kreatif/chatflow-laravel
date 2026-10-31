import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { sunrice } from './sdk/vite';

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

/**
 * The panel bundle: React, Inertia and the UI components come from the panel
 * (window.Sunrice) through the SDK's plugin; ChatFlow's own pure modules
 * (logic, contracts, the builder's draft model) are shared with the standalone
 * admin through "@chatflow/…". Their WordPress i18n calls use the panel's t().
 */
export default defineConfig({
  plugins: [react(), tailwindcss(), sunrice({ entry: path('./src/main.tsx'), outDir: path('../dist/sunrice') })],
  resolve: {
    alias: [
      { find: /^@\//, replacement: path('./src/') },
      { find: /^@chatflow\//, replacement: path('../resources/js/') },
      // Only the SDK's root module is bundled; "@imajiner/admin-sdk/ui" is the panel's (see the SDK plugin).
      { find: /^@imajiner\/admin-sdk$/, replacement: path('./sdk/index.ts') },
      { find: /^@wordpress\/i18n$/, replacement: path('./src/lib/i18n.ts') },
    ],
  },
});
