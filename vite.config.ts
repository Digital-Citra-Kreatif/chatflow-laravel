import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig(() => {
  const tracking = process.env.CFF_ENTRY === 'tracking';
  return {
  esbuild: { jsx: 'automatic', jsxImportSource: 'preact' },
  build: {
    target: 'es2020', outDir: 'dist/runtime', emptyOutDir: !tracking, sourcemap: false,
    lib: { entry: resolve(tracking ? 'resources/js/tracking/index.ts' : 'resources/js/runtime/index.tsx'), formats: ['es'], fileName: () => tracking ? 'tracking.js' : 'runtime.js' },
    rollupOptions: { output: { inlineDynamicImports: true, assetFileNames: '[name][extname]' } }
  }
  };
});
