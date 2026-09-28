import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
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
        // Cookie Store API は必ず Secure を付け、Safari は http://localhost でも
        // Secure の Cookie を捨てる。WebKit で cookie の置き場所を確かめるには
        // HTTPS で配るしかない
        plugins: [basicSsl()],
        test: {
          name: { label: 'browser', color: 'green' },
          include: ['src/**/*.browser.test.tsx'],
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
