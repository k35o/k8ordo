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
// 訪問者がタブで寄る外のページ。127.0.0.1 の別のポートは同じサイトの別の origin、
// localhost は別のサイト。WebKit は戻るの来かたがこの 2 つで違う
let outside: Server;
let outsideOrigin = '';
let outsideSite = '';

beforeAll(async () => {
  outside = createHttpServer((_, response) => {
    response.setHeader('content-type', 'text/html');
    response.end('<!doctype html><title>outside</title><h1>outside</h1>');
  });
  await new Promise<void>((resolve) => {
    outside.listen(0, resolve);
  });
  const outsidePort = String((outside.address() as AddressInfo).port);
  outsideOrigin = `http://127.0.0.1:${outsidePort}`;
  outsideSite = `http://localhost:${outsidePort}`;
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

const scrollY = (page: Page): Promise<number> =>
  page.evaluate(() => window.scrollY);

const navigateTo = (page: Page, url: string): Promise<void> =>
  page.evaluate(async (to) => {
    await navigation.navigate(to).finished;
  }, url);

/** What `fixtures/traversal/host.tsx` puts on `globalThis` to hold its loads. */
type Controls = { hold: boolean; release: () => void };

const traverse = (page: Page, direction: 'back' | 'forward'): Promise<void> =>
  page.evaluate(async (to) => {
    await navigation[to]().finished;
  }, direction);

describe.each(browserTypes)(
  'going back and forward in a top-level document, in $name',
  ({ type }) => {
    let browser: Browser;
    // WebKit は移る回数を制限し、超えると QuotaExceededError を投げる
    const movePause = type.name() === 'webkit' ? 110 : 0;

    beforeAll(async () => {
      browser = await type.launch();
    });

    afterAll(async () => {
      await browser.close();
    });

    const listCount = (page: Page): Promise<string | null> =>
      page.getByTestId('count').textContent();

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

    // short は描く commit の中で layout を強制する。Chromium は、traverse の
    // URL を確定させてから位置が変わるたびに、それを行き先の entry の保存した
    // 位置に書き込む。前のページの位置が short で下げられる量を超えていると、
    // layout が位置を short の下端に切り詰め、その値が書き込まれる
    it('restores the position a page was left at when the visitor goes back to it from further down a longer page', async () => {
      const page = await open('/short');
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/tall');
      await page.evaluate(() => {
        window.scrollTo(0, 3000);
      });

      await traverse(page, 'back');

      await page.getByRole('heading', { name: 'short' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);

    // 読み直しても、それより前に作った entry へは同じ文書のまま戻る
    it('restores the position a page was left at when the visitor goes back to it after reloading the next one', async () => {
      const page = await open('/short');
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/tall');
      await page.evaluate(() => {
        window.scrollTo(0, 3000);
      });
      await page.reload();
      await page.getByRole('heading', { name: 'tall' }).waitFor();

      await traverse(page, 'back');

      await page.getByRole('heading', { name: 'short' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);

    // 別の origin から戻ると、about の文書は bfcache から戻らなければ読み直される。
    // WebKit はその文書の entries() に tall を並べず、tall への戻るの行き先に
    // key を付けない
    it('restores the position a page was left at when the visitor goes back to it past another origin', async () => {
      const page = await open('/tall');
      await page.evaluate(() => {
        window.scrollTo(0, 3000);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/about');
      await page.goto(`${outsideOrigin}/`);
      await page.goBack();
      await page.getByRole('heading', { name: 'about' }).waitFor();

      await page.goBack();

      await page.getByRole('heading', { name: 'tall' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);

    // WebKit は key の無い戻るのあとも currentEntry を読み直した entry のままにする。
    // 次に移るときに、画面のページの位置をその entry のものとして書かない
    it('restores the position a page was left at when the visitor goes back past another origin and then forward to it', async () => {
      const page = await open('/tall');
      await page.evaluate(() => {
        window.scrollTo(0, 3000);
      });
      await navigateTo(page, '/short');
      await page.goto(`${outsideOrigin}/`);
      await page.goBack();
      await page.getByRole('heading', { name: 'short' }).waitFor();
      await page.evaluate(() => {
        window.scrollTo(0, 500);
      });
      await page.goBack();
      await page.getByRole('heading', { name: 'tall' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(3000);

      await page.goForward();

      await page.getByRole('heading', { name: 'short' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(500);
      await page.close();
    }, 30_000);

    it('restores the position a page was left at when the visitor goes back past another origin, follows a link from there, goes back and then forward to it', async () => {
      const page = await open('/tall');
      await page.evaluate(() => {
        window.scrollTo(0, 3000);
      });
      await navigateTo(page, '/about');
      await page.goto(`${outsideOrigin}/`);
      await page.goBack();
      await page.getByRole('heading', { name: 'about' }).waitFor();
      await page.goBack();
      await page.getByRole('heading', { name: 'tall' }).waitFor();
      await navigateTo(page, '/short');
      await page.evaluate(() => {
        window.scrollTo(0, 700);
      });
      await page.goBack();
      await page.getByRole('heading', { name: 'tall' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(3000);

      await page.goForward();

      await page.getByRole('heading', { name: 'short' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(700);
      await page.close();
    }, 30_000);

    // 別の origin から入り直した文書の navigation.entries() には、別の origin より
    // 前の entry が並ばない。そこで移っても、それらを離れた位置は忘れない
    it('restores the position a page was left at when the visitor goes back to it past another origin they came back in from and moved on', async () => {
      const page = await open('/tall');
      await page.evaluate(() => {
        window.scrollTo(0, 3000);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/about');
      await page.goto(`${outsideOrigin}/`);
      await page.goto(`${origin}/short`);
      await page.getByRole('heading', { name: 'short' }).waitFor();
      await navigateTo(page, '/about');
      await traverse(page, 'back');
      await page.goBack();
      await page.getByRole('heading', { name: 'outside' }).waitFor();
      await page.goBack();
      await page.getByRole('heading', { name: 'about' }).waitFor();

      await page.goBack();

      await page.getByRole('heading', { name: 'tall' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);

    // 別のサイトを挟むと、WebKit は読み直した文書からの戻るに navigate を出さず、
    // popstate だけを出して currentEntry を null にする。URL だけが動いて前のページが
    // 画面に残り、その文書では navigation.navigate() が AbortError になる。
    // フィクスチャはクライアントで描くので、読み直した文書の位置は確かめない
    it('shows the page the URL names, and keeps following links, when the visitor goes back past another site', async () => {
      const page = await open('/tall');
      await navigateTo(page, '/about');
      await page.goto(`${outsideSite}/`);
      await page.goBack();
      await page.getByRole('heading', { name: 'about' }).waitFor();

      await page.goBack();

      await page.getByRole('heading', { name: 'tall' }).waitFor();
      expect(new URL(page.url()).pathname).toBe('/tall');
      await navigateTo(page, '/short');
      await page.getByRole('heading', { name: 'short' }).waitFor();
      await page.close();
    }, 30_000);

    it('shows what the URL holds, and keeps following links, when the visitor goes back past another site within a page', async () => {
      const page = await open('/list?q=few');
      await expect.poll(() => listCount(page)).toBe('30');
      await navigateTo(page, '/list');
      await expect.poll(() => listCount(page)).toBe('90');
      await page.goto(`${outsideSite}/`);
      await page.goBack();
      await expect.poll(() => listCount(page)).toBe('90');

      await page.goBack();

      await expect.poll(() => listCount(page)).toBe('30');
      expect(new URL(page.url()).search).toBe('?q=few');
      await navigateTo(page, '/short');
      await page.getByRole('heading', { name: 'short' }).waitFor();
      await page.close();
    }, 30_000);

    // 移っては戻る読み方では、切り捨てられた entry と hash の移動の key が記録に
    // 積もる。tab の履歴に数件しか無くても、まだ戻れる entry を押し出さない
    it('restores the position a page was left at when the visitor goes back to it after leaving more than 100 entries that are gone', async () => {
      const page = await open('/tall');
      await page.evaluate(() => {
        window.scrollTo(0, 3000);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/about');
      await page.evaluate(async (ms) => {
        const move = async (go: () => NavigationResult): Promise<void> => {
          await go().finished;
          await new Promise((resolve) => {
            setTimeout(resolve, ms);
          });
        };
        for (let i = 0; i < 51; i += 1) {
          await move(() => navigation.navigate('/short'));
          await move(() => navigation.navigate('#again'));
          await move(() => navigation.back());
          await move(() => navigation.back());
        }
      }, movePause);
      await page.getByRole('heading', { name: 'about' }).waitFor();

      await traverse(page, 'back');

      await page.getByRole('heading', { name: 'tall' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 60_000);

    it('restores the position a page was left at when the visitor goes forward to it from further down a longer page', async () => {
      const page = await open('/tall');
      await navigateTo(page, '/short');
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });
      const left = await scrollY(page);
      await traverse(page, 'back');
      await page.getByRole('heading', { name: 'tall' }).waitFor();
      await page.evaluate(() => {
        window.scrollTo(0, 3000);
      });

      await traverse(page, 'forward');

      await page.getByRole('heading', { name: 'short' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);

    // 一覧は絞り込みを useDeferredValue で遅らせて描く。急ぎの描画のあとで
    // 位置を戻すと、まだ前の entry の一覧の高さの上に戻り、絞った描画で
    // スクロールアンカリングがずらす
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

    it('restores the position an entry of the same page was left at when the visitor goes back to it from further down a longer entry', async () => {
      const page = await open('/list?q=few');
      await expect.poll(() => listCount(page)).toBe('30');
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/list');
      await expect.poll(() => listCount(page)).toBe('90');
      await page.evaluate(() => {
        window.scrollTo(0, 6000);
      });

      expect(await countWhenSettled(page, 'back')).toBe('30');
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

    it('restores the position an entry was left at when the visitor goes back to it from further down a longer entry and the page reads what moved', async () => {
      const page = await open('/host.html?reload&q=few');
      await expect.poll(() => listCount(page)).toBe('30');
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/host.html?reload');
      await expect.poll(() => listCount(page)).toBe('90');
      await page.evaluate(() => {
        window.scrollTo(0, 6000);
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

    // WebKit は bfcache から戻した文書に、位置を戻す前の traverse を出す。行き先は
    // 今の entry で、画面のページは動いていない。Playwright の WebKit は bfcache を
    // 使わないので、そのイベントを同じ形で流し、ブラウザが戻す位置を続けて置く
    it('leaves the position to the browser when WebKit announces coming back from the back/forward cache as a traversal to the entry on screen', async () => {
      const page = await open('/short');

      const settled = await page.evaluate(async () => {
        navigation.dispatchEvent(
          Object.assign(new Event('navigate'), {
            canIntercept: true,
            hashChange: false,
            downloadRequest: null,
            formData: null,
            navigationType: 'traverse',
            destination: {
              key: navigation.currentEntry?.key,
              url: location.href,
            },
            signal: new AbortController().signal,
            intercept: () => undefined,
          }),
        );
        window.scrollTo(0, 500);
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });
        return window.scrollY;
      });

      expect(settled).toBe(500);
      await page.close();
    }, 30_000);

    // 読み込みのあいだに動かせるのは画面に残る前のページで、行き先の座標ではない
    it('restores the position a page was left at when the visitor goes back to it, even if they scroll the page still on screen while it loads', async () => {
      const page = await open('/host.html');
      await page.evaluate(() => {
        window.scrollTo(0, 1500);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/p1');
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });
      await page.evaluate(async () => {
        (globalThis as unknown as { controls: Controls }).controls.hold = true;
        const back = navigation.back();
        back.finished?.catch(() => undefined);
        await back.committed;
        // Firefox は popstate を出したタスクの中で、画面に残る前のページを
        // 行き先の保存した位置へ動かす。動かし終えてから測る
        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
      });
      const before = await scrollY(page);
      await page.mouse.move(200, 200);
      await page.mouse.wheel(0, 400);
      // ホイールのスクロールはアニメーションで進み、wheel() は届くのを待たない。
      // 動かし終える前に読み込みを終えると、残りが戻した位置に足される
      await expect.poll(() => scrollY(page)).toBe(before + 400);

      await page.evaluate(() => {
        const { controls } = globalThis as unknown as { controls: Controls };
        controls.hold = false;
        controls.release();
      });

      await page.getByRole('heading', { name: 'host.html' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);

    it('starts a page the visitor called off while it loaded at the top when they go forward to it', async () => {
      const page = await open('/host.html');
      await page.evaluate(() => {
        window.scrollTo(0, 1500);
        (globalThis as unknown as { controls: Controls }).controls.hold = true;
        navigation.navigate('/elsewhere').finished?.catch(() => undefined);
      });
      await page.waitForURL(`${origin}/elsewhere`);
      await page.evaluate(async () => {
        const back = navigation.back();
        back.finished?.catch(() => undefined);
        await back.committed;
        const { controls } = globalThis as unknown as { controls: Controls };
        controls.hold = false;
        controls.release();
      });

      await traverse(page, 'forward');

      await page.getByRole('heading', { name: 'elsewhere' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(0);
      await page.close();
    }, 30_000);

    // 読み込みのあいだ、URL はもう行き先の entry を指し、画面には前のページが
    // 残る。そこで離れるのは画面のページで、位置もそのページのもの
    it('restores the position a page was left at when the visitor goes back past it while it loads, and then forward to it', async () => {
      const page = await open('/host.html');
      await navigateTo(page, '/p1');
      await page.evaluate(() => {
        window.scrollTo(0, 1000);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/p2');
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });
      await page.evaluate(async () => {
        const { controls } = globalThis as unknown as { controls: Controls };
        controls.hold = true;
        const first = navigation.back();
        first.finished?.catch(() => undefined);
        await first.committed;
        // WebKit は、取りかけの遷移を中断させた戻るの finished まで reject する
        const second = navigation.back();
        second.finished?.catch(() => undefined);
        await second.committed;
        controls.hold = false;
        controls.release();
      });
      await page.getByRole('heading', { name: 'host.html' }).waitFor();

      await traverse(page, 'forward');

      await page.getByRole('heading', { name: 'p1' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);

    it('restores the position a page was left at when the visitor follows a link while going back to another, and then comes back', async () => {
      const page = await open('/host.html');
      await page.evaluate(() => {
        window.scrollTo(0, 1500);
      });
      const left = await scrollY(page);
      await navigateTo(page, '/p1');
      await page.evaluate(() => {
        window.scrollTo(0, 700);
      });
      await page.evaluate(async () => {
        const { controls } = globalThis as unknown as { controls: Controls };
        controls.hold = true;
        const back = navigation.back();
        back.finished?.catch(() => undefined);
        await back.committed;
        const link = navigation.navigate('/p3');
        link.finished?.catch(() => undefined);
        await link.committed;
        controls.hold = false;
        controls.release();
      });
      await page.getByRole('heading', { name: 'p3' }).waitFor();

      await traverse(page, 'back');

      await page.getByRole('heading', { name: 'host.html' }).waitFor();
      await expect.poll(() => scrollY(page)).toBe(left);
      await page.close();
    }, 30_000);
  },
);
