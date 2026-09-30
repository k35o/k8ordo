import { globSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { vrt } from 'storybook-addon-vrt/vitest-plugin';
import { defineConfig } from 'vite-plus';

// CI はエンジンごとにジョブを分けて並べるので、TEST_BROWSER で 1 つに絞れる
const browsers = (['chromium', 'firefox', 'webkit'] as const).filter(
  (browser) =>
    process.env.TEST_BROWSER === undefined ||
    process.env.TEST_BROWSER === browser,
);

// storybookTest の tags はストーリーを選ぶだけで、ファイルは選ばない（test.include
// は plugin が上書きする）。含めるタグで絞ったプロジェクトも全ストーリーの
// ファイルを 1 つずつ iframe に読み込み、0 件で飛ばしていた。WebKit はその
// iframe をページが閉じるまで手放さないので、タグを書いていないファイルは外す。
const filesWithoutTags = (tags: string[]) =>
  globSync('src/**/*.stories.tsx', { cwd: import.meta.dirname }).filter(
    (file) => {
      const source = readFileSync(new URL(file, import.meta.url), 'utf8');
      return tags.every((tag) => !source.includes(`'${tag}'`));
    },
  );

const storiesProject = ({
  label,
  color,
  tags,
  context,
  initialGlobals,
  withVrt = false,
}: {
  label: string;
  color: 'magenta' | 'red' | 'yellow' | 'cyan';
  tags: { include?: string[]; exclude?: string[] };
  context?: { forcedColors?: 'active'; contrast?: 'more' };
  initialGlobals?: Record<string, unknown>;
  withVrt?: boolean;
}) => ({
  extends: true,
  plugins: [
    storybookTest({
      storybookScript: 'pnpm storybook --ci',
      configDir: fileURLToPath(new URL('./.storybook', import.meta.url)),
      tags,
      initialGlobals,
    }),
    ...(withVrt ? [vrt()] : []),
  ],
  publicDir: fileURLToPath(new URL('./.storybook/public', import.meta.url)),
  test: {
    name: { label, color },
    ...(tags.include && { exclude: filesWithoutTags(tags.include) }),
    browser: {
      enabled: true,
      provider: playwright({
        contextOptions: { reducedMotion: 'reduce', ...context },
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
      instances: browsers.map((browser) => ({ browser })),
    },
  },
});

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
    // vitest はブラウザのプロジェクトごとに（コア数 - 1）枚のページを開く。
    // 自分だけが走っている前提の数なので、6 つが同時に走る 4 コアの CI では
    // WebKit のページが 18 枚並び、描画の更新が 1 秒以上止まって waitFor が
    // 切れていた。WebKit だけはプロジェクトごとに 1 枚にする。
    ...(process.env.TEST_BROWSER === 'webkit' && { maxWorkers: 1 }),
    coverage: {
      all: false,
      provider: 'v8',
    },
    projects: [
      storiesProject({
        label: 'components',
        color: 'magenta',
        tags: { exclude: ['forced-colors', 'contrast-more'] },
        withVrt: true,
      }),
      // axe の color-contrast はそのとき描かれている配色しか見ないので、
      // ダークでも全ストーリーを走らせる
      storiesProject({
        label: 'components-dark',
        color: 'red',
        tags: { exclude: ['forced-colors', 'contrast-more'] },
        initialGlobals: { theme: 'dark' },
      }),
      // OS の配色設定はストーリーごとには切り替えられないので、設定ごとに
      // プロジェクトを分け、その設定で確かめるストーリーだけを走らせる
      storiesProject({
        label: 'components-forced-colors',
        color: 'yellow',
        tags: { include: ['forced-colors'] },
        context: { forcedColors: 'active' },
      }),
      storiesProject({
        label: 'components-contrast-more',
        color: 'cyan',
        tags: { include: ['contrast-more'] },
        context: { contrast: 'more' },
      }),
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
            instances: browsers.map((browser) => ({ browser })),
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
          name: { label: 'form', color: 'yellow' },
          include: [
            'src/components/form/**/*.test.tsx',
            'src/components/_internal/**/*.test.tsx',
          ],
          browser: {
            enabled: true,
            instances: browsers.map((browser) => ({ browser })),
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
            'src/i18n/**/*.test.ts',
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
