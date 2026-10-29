import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { chromium, firefox, webkit } from 'playwright';
import type { Browser, Page } from 'playwright';
import { createServer } from 'vite';
import type { ViteDevServer } from 'vite';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

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
      await page
        .getByRole('heading', {
          name: new URL(pathname, origin).pathname.slice(1),
        })
        .waitFor();
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

    // 一覧は絞り込みを useDeferredValue で遅らせて描く。急ぎの描画のあとで
    // 位置を戻すと、まだ前の entry の一覧の高さの上に戻り、絞った描画で
    // スクロールアンカリングがずらす
    const listCount = (page: Page): Promise<string | null> =>
      page.getByTestId('count').textContent();

    /** The count the page shows once the traversal's `finished` settles. */
    const countWhenSettled = (
      page: Page,
      direction: 'back' | 'forward',
    ): Promise<string | null | undefined> =>
      page.evaluate(async (to) => {
        await navigation[to]().finished;
        return document.querySelector('[data-testid="count"]')?.textContent;
      }, direction);

    it('restores the position an entry of the same page was left at, onto what that entry renders, when the visitor goes back to it', async () => {
      const page = await open('/list?q=few');
      await expect.poll(() => listCount(page)).toBe('30');
      await page.evaluate(() => {
        window.scrollTo(0, 1500);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/list');
      await expect.poll(() => listCount(page)).toBe('90');
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });

      expect(await countWhenSettled(page, 'back')).toBe('30');
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);

    it('restores the position an entry of the same page was left at, onto what that entry renders, when the visitor goes forward to it', async () => {
      const page = await open('/list?q=few');
      await expect.poll(() => listCount(page)).toBe('30');
      await navigateTo(page, '/list');
      await expect.poll(() => listCount(page)).toBe('90');
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });
      const left = await scrollY(page);
      await traverse(page, 'back');
      await expect.poll(() => listCount(page)).toBe('30');
      await page.evaluate(() => {
        window.scrollTo(0, 1500);
      });

      expect(await countWhenSettled(page, 'forward')).toBe('90');
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);

    it('settles a push within the same page as soon as it commits, without waiting for what the page renders behind it', async () => {
      const page = await open('/list?q=few');
      await expect.poll(() => listCount(page)).toBe('30');

      const settled = await page.evaluate(async () => {
        await navigation.navigate('/list').finished;
        return document.querySelector('[data-testid="count"]')?.textContent;
      });

      expect(settled).toBe('30');
      await expect.poll(() => listCount(page)).toBe('90');
      await page.close();
    }, 30_000);

    it('restores the position an entry was left at when the visitor goes back to it and the page reads what moved', async () => {
      const page = await open('/host.html?reload&q=few');
      await expect.poll(() => listCount(page)).toBe('30');
      await page.evaluate(() => {
        window.scrollTo(0, 1500);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/host.html?reload');
      await expect.poll(() => listCount(page)).toBe('90');
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });

      expect(await countWhenSettled(page, 'back')).toBe('30');
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);

    // リンクを押すと URL は先に進み、前のページは読み込みが終わるまで残る。
    // そこで読んでいた位置から戻るのは移るのを取り消すことで、押したときの
    // 位置に引き戻さない
    it('keeps the position where the visitor scrolled a page still on screen when they go back while the next one loads', async () => {
      const page = await open('/host.html');
      await expect.poll(() => listCount(page)).toBe('90');
      await page.evaluate(() => {
        window.scrollTo(0, 1500);
        (
          globalThis as unknown as { controls: { hold: boolean } }
        ).controls.hold = true;
        navigation.navigate('/elsewhere').finished?.catch(() => undefined);
      });
      await page.waitForURL(`${origin}/elsewhere`);
      await page.evaluate(() => {
        window.scrollTo(0, 500);
      });
      const kept = await scrollY(page);

      // WebKit は、取りかけの遷移を中断させた戻るの finished まで AbortError で
      // reject する。戻る遷移そのものは確定するので、committed を待つ
      await page.evaluate(async () => {
        const back = navigation.back();
        back.finished?.catch(() => undefined);
        await back.committed;
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          });
        });
      });

      expect(new URL(page.url()).pathname).toBe('/host.html');
      expect(await scrollY(page)).toBe(kept);
      await page.close();
    }, 30_000);
  },
);
