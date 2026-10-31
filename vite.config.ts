import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig(() => {
  const entry = process.env.CFF_ENTRY ?? 'runtime';
  const tracking = entry !== 'runtime';
  const sources: Record<string, string> = { runtime: 'resources/js/runtime/index.tsx', tracking: 'resources/js/tracking/index.ts', loader: 'resources/js/loader/index.ts' };
  return {
  esbuild: { jsx: 'automatic', jsxImportSource: 'preact' },
  build: {
    // Library builds are not minified by default; visitors download these files.
    target: 'es2020', outDir: 'dist/runtime', emptyOutDir: !tracking, sourcemap: false, minify: true,
    lib: { entry: resolve(sources[entry]!), formats: ['es'], fileName: () => `${entry}.js` },
    rollupOptions: { output: { inlineDynamicImports: true, assetFileNames: '[name][extname]', minify: true } }
  }
  };
});
