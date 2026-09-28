import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { chromium, firefox, webkit } from 'playwright';
import type { Browser, Page } from 'playwright';
import { createServer } from 'vite';
import type { ViteDevServer } from 'vite';

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

beforeAll(async () => {
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
