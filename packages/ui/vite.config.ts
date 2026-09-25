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
    // インソーステスト（`if (import.meta.vitest)`）を dist から落とす。バンドラは
    // define なしに `import.meta.vitest` を畳めないため、テスト本体が利用者の
    // バンドルに残ってしまう。
    define: { 'import.meta.vitest': 'undefined' },
  },
  test: {
    globals: true,
    fsModuleCache: true,
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
            provider: playwright({
              contextOptions: { reducedMotion: 'reduce' },
            }),
            headless: true,
            screenshotFailures: false,
            // @storybook/addon-vitest はストーリーごとに page.viewport() で
            // 1200x900 を敷いていた。その実装は `@vitest/browser/context` を
            // 動的 import して失敗を握り潰す形をしており、vitest 5 では
            // この import が reject する ("vitest/browser can be imported only
            // inside the Browser mode") ため、viewport 指定が黙って no-op に
            // なる (addon の peer も vitest ^3 || ^4 のまま)。放っておくと全
            // ストーリーが vitest 既定の 414x896、つまりモバイル幅で描かれる
            // ので、addon が敷いていたのと同じ寸法をこちらで明示する。
            // addon が vitest 5 に対応したら消してよい。
            viewport: { width: 1200, height: 900 },
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: { label: 'hooks', color: 'green' },
          include: [
            'src/hooks/**/*.test.{ts,tsx}',
            // ブラウザで動く内部 hook のテスト（src/internal の .tsx テストのみ）
            'src/internal/**/*.test.tsx',
          ],
          browser: {
            enabled: true,
            instances: [{ browser: 'chromium' }],
            provider: playwright({
              contextOptions: { reducedMotion: 'reduce' },
            }),
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
            'src/internal/**/*.test.ts',
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
