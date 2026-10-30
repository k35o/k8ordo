import { createServer as createHttpServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { chromium, firefox, webkit } from 'playwright';
import type { Browser, Page } from 'playwright';
import { createServer } from 'vite';
import type { ViteDevServer } from 'vite';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

// 戻る操作の主張はトップレベルの文書で確かめる。vitest のブラウザモードは
// テストを iframe の中で動かし、Firefox は iframe の中でだけ、戻る遷移 1 回に
// handler を 2 回走らせたうえ、以後 currentEntry を失って後のテストを
// すべて止める
const root = fileURLToPath(new URL('../fixtures/traversal/', import.meta.url));

// CI はエンジンごとにジョブを分けて並べるので、TEST_BROWSER で 1 つに絞れる
const browserTypes = [chromium, firefox, webkit]
  .filter(
    (type) =>
      process.env.TEST_BROWSER === undefined ||
      process.env.TEST_BROWSER === type.name(),
  )
  .map((type) => ({ name: type.name(), type }));

let server: ViteDevServer;
let origin = '';
// 訪問者がタブで寄る同じサイトの別の origin
let outside: Server;
let outsideOrigin = '';

beforeAll(async () => {
  outside = createHttpServer((_, response) => {
    response.setHeader('content-type', 'text/html');
    response.end('<!doctype html><title>outside</title><h1>outside</h1>');
  });
  await new Promise<void>((resolve) => {
    outside.listen(0, '127.0.0.1', resolve);
  });
  outsideOrigin = `http://127.0.0.1:${String((outside.address() as AddressInfo).port)}`;
  server = await createServer({
    root,
    configFile: false,
    logLevel: 'error',
    // 既定の置き場所はフィクスチャの中にできてしまう
    cacheDir: fileURLToPath(
      new URL('../node_modules/.vite/traversal', import.meta.url),
    ),
    plugins: [react()],
    server: { host: '127.0.0.1', port: 0 },
  });
  await server.listen();
  ({ origin } = new URL(server.resolvedUrls?.local[0] ?? ''));
}, 60_000);

afterAll(async () => {
  await server.close();
  outside.close();
});

const textOf = (page: Page, testId: string): Promise<string | null> =>
  page.getByTestId(testId).textContent();

// update の遷移が終わってから戻る。取りかけの遷移を戻る操作が中断すると、
// 戻る側の主張ではなくなる
const goBack = async (page: Page): Promise<void> => {
  await page.waitForFunction(() => navigation.transition === null);
  await page.evaluate(async () => {
    await navigation.back().finished;
  });
};

describe.each(browserTypes)(
  'going back in a top-level document, in $name',
  ({ type }) => {
    let browser: Browser;

    beforeAll(async () => {
      browser = await type.launch();
    });

    afterAll(async () => {
      await browser.close();
    });

    const open = async (): Promise<Page> => {
      const page = await browser.newPage();
      await page.goto(`${origin}/`);
      await page.getByTestId('page').waitFor();
      return page;
    };

    it('restores the state the entry held', async () => {
      const page = await open();
      await page.getByRole('button', { name: 'push next' }).click();
      await expect.poll(() => textOf(page, 'page')).toBe('2');

      await goBack(page);

      await expect.poll(() => textOf(page, 'page')).toBe('1');
      await page.close();
    }, 30_000);

    // WebKit は読み直した文書からそれより前の entry へ戻るとき、currententrychange
    // を出さない。URL の動きが届くのは popstate だけ
    it('reads the URL of the entry when the visitor goes back to it past another origin', async () => {
      const page = await open();
      await page.getByRole('button', { name: 'push next' }).click();
      await expect.poll(() => textOf(page, 'page')).toBe('2');
      await page.waitForFunction(() => navigation.transition === null);
      await page.goto(`${outsideOrigin}/`);
      await page.goBack();
      await page.getByTestId('page').waitFor();
      expect(await textOf(page, 'page')).toBe('2');

      await page.goBack();

      await expect.poll(() => textOf(page, 'page')).toBe('1');
      await page.close();
    }, 30_000);

    it('restores both faces of the entry', async () => {
      const page = await open();
      await page.getByRole('button', { name: 'tab and expand' }).click();
      await expect.poll(() => textOf(page, 'tab')).toBe('b');
      await expect.poll(() => textOf(page, 'expanded')).toBe('y');

      await goBack(page);

      await expect.poll(() => textOf(page, 'tab')).toBe('a');
      await expect.poll(() => textOf(page, 'expanded')).toBe('');
      await page.close();
    }, 30_000);
  },
);
