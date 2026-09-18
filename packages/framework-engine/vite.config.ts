import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  plugins: [react()],
  pack: {
    entry: [
      'src/**/*.ts',
      'src/**/*.tsx',
      '!src/**/*.test.ts',
      '!src/**/*.browser.test.tsx',
      '!src/**/*.d.ts',
    ],
    format: 'esm',
    dts: true,
    outDir: 'dist',
    unbundle: true,
  },
  test: {
    globals: true,
    fsModuleCache: true,
    coverage: { all: false, provider: 'v8' },
    projects: [
      {
        extends: true,
        test: {
          name: { label: 'unit', color: 'blue' },
          include: ['src/**/*.test.ts'],
        },
      },
      {
        extends: true,
        // テストはこれを vi.mock で差し替えるが、事前バンドルと先読みの変換は
        // 差し替えの前に走り、RSC プラグインしか解決できない仮想モジュールの
        // import で落ちる
        optimizeDeps: { exclude: ['@vitejs/plugin-rsc/browser'] },
        server: { preTransformRequests: false },
        test: {
          name: { label: 'browser', color: 'green' },
          include: ['src/**/*.browser.test.tsx'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            screenshotFailures: false,
            instances: [
              { browser: 'chromium', context: { reducedMotion: 'reduce' } },
            ],
          },
        },
      },
    ],
  },
});
