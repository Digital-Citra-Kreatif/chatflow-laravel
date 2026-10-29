import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Admin apps: React and the @wordpress/* packages are bundled (no WordPress globals).
// Each entry is a classic IIFE script that merges itself into window.CFFAdmin.
export default defineConfig(() => {
  const entry = process.env.CFF_ENTRY === 'submissions' ? 'submissions' : 'builder';
  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.IS_GUTENBERG_PLUGIN': 'false',
      'process.env.IS_WORDPRESS_CORE': 'false',
      'process.env.SCRIPT_DEBUG': 'false',
    },
    build: {
      target: 'es2020', outDir: 'dist/admin', emptyOutDir: entry === 'builder', sourcemap: false,
      lib: { entry: resolve(`resources/js/admin/${entry}.ts`), formats: ['iife'], name: `CFFAdmin_${entry}`, fileName: () => `${entry}.js`, cssFileName: entry },
      rollupOptions: {
        output: { assetFileNames: '[name][extname]' },
        onwarn(warning, warn) { if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning); },
      },
    },
  };
});
