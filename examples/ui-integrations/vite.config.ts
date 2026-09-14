import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    fsModuleCache: true,
    projects: [
      {
        extends: true,
        test: {
          name: { label: 'spec', color: 'blue' },
          include: ['src/**/*.test.ts'],
        },
      },
      {
        // spec / DSL がパーサを通ることと、それが実際に描画されることは別問題。
        // アダプタが使う React context は本物のツリーの中でしか成立しないので、
        // 描画側は素の Chromium にマウントして確かめる。
        //
        // 注: dev の依存最適化はパッケージ名でコピーを畳むので、peer が
        // 2 コピーに割れていてもここでは再現しない。その規律は
        // `pnpm check:peer-copies` が解決グラフ側で見る。
        extends: true,
        test: {
          name: { label: 'render', color: 'green' },
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
