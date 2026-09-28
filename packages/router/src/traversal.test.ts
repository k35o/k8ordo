import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { chromium, firefox, webkit } from 'playwright';
import type { Browser, Page } from 'playwright';
import { createServer } from 'vite';
import type { ViteDevServer } from 'vite';

// 戻る・進むの主張はトップレベルの文書で確かめる。vitest のブラウザモードは
// テストを iframe の中で動かし、Firefox と WebKit の Navigation API は
// iframe の中でだけスクロールを正しく戻さない（Firefox は戻さず、WebKit は
// handler の完了を待たずに戻して 0 に潰す）
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

const scrollY = (page: Page): Promise<number> =>
  page.evaluate(() => window.scrollY);

const navigateTo = (page: Page, url: string): Promise<void> =>
  page.evaluate(async (to) => {
    await navigation.navigate(to).finished;
  }, url);

const traverse = (page: Page, direction: 'back' | 'forward'): Promise<void> =>
  page.evaluate(async (to) => {
    await navigation[to]().finished;
  }, direction);

describe.each(browserTypes)(
  'going back and forward in a top-level document, in $name',
  ({ type }) => {
    let browser: Browser;

    beforeAll(async () => {
      browser = await type.launch();
    });

    afterAll(async () => {
      await browser.close();
    });

    const open = async (pathname: string): Promise<Page> => {
      const page = await browser.newPage();
      await page.goto(`${origin}${pathname}`);
      await page.getByRole('heading', { name: pathname.slice(1) }).waitFor();
      return page;
    };

    it('restores the position a page was left at when the visitor goes back to it', async () => {
      const page = await open('/tall');
      await page.evaluate(() => {
        window.scrollTo(0, 3000);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/about');
      await page.getByRole('heading', { name: 'about' }).waitFor();
      expect(await scrollY(page)).toBe(0);

      await traverse(page, 'back');

      await page.getByRole('heading', { name: 'tall' }).waitFor();
      // Firefox はスクロールを finished の 1 フレーム後に戻す
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);

    it('restores the position a page was left at when the visitor goes forward to it', async () => {
      const page = await open('/about');
      await navigateTo(page, '/tall');
      await page.getByRole('heading', { name: 'tall' }).waitFor();
      await page.evaluate(() => {
        window.scrollTo(0, 3000);
      });
      const left = await scrollY(page);
      await traverse(page, 'back');
      await page.getByRole('heading', { name: 'about' }).waitFor();

      await traverse(page, 'forward');

      await page.getByRole('heading', { name: 'tall' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);
  },
);
