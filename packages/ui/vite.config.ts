import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { vrt } from 'storybook-addon-vrt/vitest-plugin';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  plugins: [react()],
  pack: {
    entry: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.stories.tsx',
      '!src/**/*.test.{ts,tsx}',
    ],
    format: 'esm',
    dts: true,
    outDir: 'dist',
    unbundle: true,
  },
  test: {
    globals: true,
    coverage: {
      all: false,
      provider: 'v8',
    },
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            storybookScript: 'pnpm storybook --ci',
            configDir: fileURLToPath(new URL('./.storybook', import.meta.url)),
          }),
          vrt(),
        ],
        publicDir: fileURLToPath(
          new URL('./.storybook/public', import.meta.url),
        ),
        test: {
          name: { label: 'components', color: 'magenta' },
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            screenshotFailures: false,
            instances: [
              {
                browser: 'chromium',
                context: {
                  reducedMotion: 'reduce',
                },
              },
            ],
          },
        },
      },
      {
        extends: true,
        test: {
          name: { label: 'hooks', color: 'green' },
          include: ['src/hooks/**/*.test.{ts,tsx}'],
          browser: {
            enabled: true,
            instances: [
              {
                browser: 'chromium',
                context: {
                  reducedMotion: 'reduce',
                },
              },
            ],
            provider: playwright(),
            headless: true,
            screenshotFailures: false,
          },
        },
      },
      {
        extends: true,
        test: {
          name: { label: 'helpers', color: 'blue' },
          include: [
            'src/helpers/**/*.test.{ts,tsx}',
            'src/internal/**/*.test.{ts,tsx}',
            'src/components/**/*.test.ts',
            'src/integrations/**/*.test.{ts,tsx}',
          ],
          includeSource: [
            'src/helpers/**/*.{ts,tsx}',
            'src/internal/**/*.{ts,tsx}',
            'src/components/**/*.ts',
          ],
        },
      },
    ],
  },
});
