import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  pack: {
    entry: ['src/index.ts', 'src/runtime.ts', 'src/vercel.ts'],
    format: 'esm',
    dts: true,
    outDir: 'dist',
    // The engine is a private workspace package: it is bundled into this
    // file rather than published, and its runtime entries — the three
    // environments Vite is pointed at — are copied beside it.
    deps: { alwaysBundle: ['@k8ordo/framework-engine'] },
    copy: [{ from: '../framework-engine/dist/runtime', to: 'dist' }],
  },
  test: {
    globals: true,
    fsModuleCache: true,
    coverage: { all: false, provider: 'v8' },
    include: ['src/**/*.test.ts'],
  },
});
