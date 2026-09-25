import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite-plus';

// CI はエンジンごとにジョブを分けて並べるので、TEST_BROWSER で 1 つに絞れる
const browsers = (['chromium', 'firefox', 'webkit'] as const).filter(
  (browser) =>
    process.env.TEST_BROWSER === undefined ||
    process.env.TEST_BROWSER === browser,
);

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
            instances: browsers.map((browser) => ({
              browser,
              context: { reducedMotion: 'reduce' },
            })),
          },
        },
      },
    ],
  },
});
