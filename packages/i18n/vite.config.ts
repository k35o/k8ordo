import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  pack: {
    entry: [
      'src/**/*.ts',
      'src/**/*.tsx',
      '!src/**/*.test.ts',
      '!src/**/*.browser.test.ts',
    ],
    format: 'esm',
    dts: true,
    outDir: 'dist',
    unbundle: true,
  },
  test: {
    globals: true,
    coverage: { all: false, provider: 'v8' },
    projects: [
      {
        extends: true,
        test: {
          name: { label: 'unit', color: 'blue' },
          include: ['src/**/*.test.ts'],
          exclude: ['src/**/*.browser.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: { label: 'browser', color: 'green' },
          include: ['src/**/*.browser.test.ts'],
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
