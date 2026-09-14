import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite-plus';

// フレームワーク (@k8ordo/static / @k8ordo/server) のプラグインは入れない。
// この example は「<Router> を自分でマウントするクライアント描画アプリ」の
// 担保なので、素の Vite + React だけで成り立つことに意味がある。
export default defineConfig({
  plugins: [react()],
  // Navigation API も URLPattern もモックしないので、テストは本物の
  // ブラウザ (Chromium) で走らせる。@k8ordo/router 自身のテストと同じ構成
  test: {
    globals: true,
    fsModuleCache: true,
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
});
