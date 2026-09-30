import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite-plus';

// CI はエンジンごとにジョブを分けて並べるので、TEST_BROWSER で 1 つに絞れる
const browsers = (['chromium', 'firefox', 'webkit'] as const).filter(
  (browser) =>
    process.env.TEST_BROWSER === undefined ||
    process.env.TEST_BROWSER === browser,
);

// HTTPS にすると Vite は Node の HTTP/2 で配る。Node は、要求の本文を誰も
// 読まないまま応答を書き終えたストリームを RST_STREAM(NO_ERROR) で閉じに
// いき、送信が詰まっているとそれが応答の終端より先に届く。Firefox は途中で
// 切れた転送として扱い、テストファイルの import ごと落とす。本文を読み捨てて
// おけば Node は RST_STREAM を送らない
const drainRequests = (): Plugin => ({
  name: 'drain-requests',
  configureServer(server) {
    server.middlewares.use((request, _response, next) => {
      if (request.method === 'GET') request.resume();
      next();
    });
  },
});

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
        plugins: [basicSsl(), drainRequests()],
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
