import { createServer as createHttpServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { chromium, firefox, webkit } from 'playwright';
import type { Browser, Page } from 'playwright';
import { createServer } from 'vite';
import type { ViteDevServer } from 'vite';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vite-plus/test';

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
  outsideOrigin = `http://127.0.0.1:${outsidePort}/`;
  outsideSite = `http://localhost:${outsidePort}/`;
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

describe.each(browserTypes)(
  'going back and forward in a top-level document, in $name',
  ({ type }) => {
    let browser: Browser;
    let page: Page;
    // WebKit は移る回数を制限し、超えると QuotaExceededError を投げる
    const movePause = type.name() === 'webkit' ? 110 : 0;

    beforeAll(async () => {
      browser = await type.launch();
    });

    beforeEach(async () => {
      page = await browser.newPage();
    });

    afterEach(async () => {
      await page.close();
    });

    afterAll(async () => {
      await browser.close();
    });

    const heading = (name: string, timeout?: number): Promise<void> =>
      page.getByRole('heading', { name }).waitFor({ timeout });

    const open = async (pathname: string): Promise<void> => {
      await page.goto(`${origin}${pathname}`);
      await heading(new URL(pathname, origin).pathname.slice(1));
    };

    const cameBackFrom = async (url: string): Promise<void> => {
      await page.goto(url);
      await page.goBack();
    };

    const navigateTo = (url: string): Promise<void> =>
      page.evaluate(async (to) => {
        await navigation.navigate(to).finished;
      }, url);

    /** Goes back or forward, and answers the count the page shows once `finished` settles. */
    const traverse = (
      direction: 'back' | 'forward',
    ): Promise<string | null | undefined> =>
      page.evaluate(async (to) => {
        await navigation[to]().finished;
        return document.querySelector('[data-testid="count"]')?.textContent;
      }, direction);

    // WebKit は、取りかけの遷移を中断させた戻る・進むの finished まで AbortError で
    // reject する。遷移そのものは確定するので、committed を待つ
    const commit = (to: 'back' | 'forward' | `/${string}`): Promise<void> =>
      page.evaluate(async (destination) => {
        const step =
          destination === 'back' || destination === 'forward'
            ? navigation[destination]()
            : navigation.navigate(destination);
        step.finished?.catch(() => undefined);
        await step.committed;
      }, to);

    const hold = (): Promise<void> =>
      page.evaluate(() => {
        controls.hold = true;
      });

    const release = (): Promise<void> =>
      page.evaluate(() => {
        controls.hold = false;
        controls.holdRender = false;
        controls.release();
      });

    const loads = (): Promise<string[]> => page.evaluate(() => controls.loads);

    // 文書の読み直しの要求を、試験が放すまで返さない
    const holdDocument = async (
      pathname: string,
    ): Promise<{ requested: Promise<unknown>; release: () => void }> => {
      const requested = Promise.withResolvers<undefined>();
      const released = Promise.withResolvers<undefined>();
      await page.route(
        (url) => url.pathname === pathname,
        async (route) => {
          requested.resolve(undefined);
          await released.promise;
          await route.continue().catch(() => undefined);
        },
      );
      return {
        // ほかのエンジンは navigate を出し、文書を読み直さずに描く
        requested: Promise.race([
          requested.promise,
          heading(pathname.slice(1)).catch(() => undefined),
        ]),
        release: () => {
          released.resolve(undefined);
        },
      };
    };

    /** Scrolls the page and answers where it landed. */
    const scrollTo = (top: number): Promise<number> =>
      page.evaluate((y) => {
        window.scrollTo(0, y);
        return window.scrollY;
      }, top);

    const scrollY = (): Promise<number> => page.evaluate(() => window.scrollY);

    const listCount = (): Promise<string | null> =>
      page.getByTestId('count').textContent();

    const PAGES = [
      ['', '/tall', 3000, '/about', 0],
      [' from further down a longer page', '/short', 300, '/tall', 3000],
    ] as const;

    it.each(PAGES)(
      'restores the position a page was left at when the visitor goes back to it%s',
      async (_, to, at, from, fromAt) => {
        await open(to);
        const left = await scrollTo(at);
        await navigateTo(from);
        await scrollTo(fromAt);

        await traverse('back');

        await heading(to.slice(1));
        // Firefox はスクロールを finished の 1 フレーム後に戻す
        await expect.poll(scrollY).toBe(left);
      },
      30_000,
    );

    it.each(PAGES)(
      'restores the position a page was left at when the visitor goes forward to it%s',
      async (_, to, at, from, fromAt) => {
        await open(from);
        await navigateTo(to);
        const left = await scrollTo(at);
        await traverse('back');
        await heading(from.slice(1));
        await scrollTo(fromAt);

        await traverse('forward');

        await heading(to.slice(1));
        await expect.poll(scrollY).toBe(left);
      },
      30_000,
    );

    it('restores the position a page was left at when the visitor goes back to it after reloading the next one', async () => {
      await open('/short');
      const left = await scrollTo(300);
      await navigateTo('/tall');
      await scrollTo(3000);
      await page.reload();
      await heading('tall');

      await traverse('back');

      await heading('short');
      await expect.poll(scrollY).toBe(left);
    }, 30_000);

    // 別の origin から戻ると、about の文書は bfcache から戻らなければ読み直される。
    // WebKit はその文書の entries() に tall を並べず、tall への戻るの行き先に
    // key を付けない
    it('restores the position a page was left at when the visitor goes back to it past another origin', async () => {
      await open('/tall');
      const left = await scrollTo(3000);
      await navigateTo('/about');
      await cameBackFrom(outsideOrigin);
      await heading('about');

      await page.goBack();

      await heading('tall');
      await expect.poll(scrollY).toBe(left);
    }, 30_000);

    // WebKit は key の無い戻るのあとも currentEntry を読み直した entry のままにする。
    // 次に移るときに、画面のページの位置をその entry のものとして書かない
    it('restores the position a page was left at when the visitor goes back past another origin and then forward to it', async () => {
      await open('/tall');
      await scrollTo(3000);
      await navigateTo('/short');
      await cameBackFrom(outsideOrigin);
      await heading('short');
      await scrollTo(500);
      await page.goBack();
      await heading('tall');
      await expect.poll(scrollY).toBe(3000);

      await page.goForward();

      await heading('short');
      await expect.poll(scrollY).toBe(500);
    }, 30_000);

    it('restores the position a page was left at when the visitor goes back past another origin, follows a link from there, goes back and then forward to it', async () => {
      await open('/tall');
      await scrollTo(3000);
      await navigateTo('/about');
      await cameBackFrom(outsideOrigin);
      await heading('about');
      await page.goBack();
      await heading('tall');
      await navigateTo('/short');
      await scrollTo(700);
      await page.goBack();
      await heading('tall');
      await expect.poll(scrollY).toBe(3000);

      await page.goForward();

      await heading('short');
      await expect.poll(scrollY).toBe(700);
    }, 30_000);

    // WebKit は key の無い戻るで currententrychange を出さない。URL の動きが届くのは
    // popstate だけ
    it('keeps usePathname on the URL when the visitor goes back past another origin', async () => {
      await open('/tall');
      await navigateTo('/about');
      await cameBackFrom(outsideOrigin);
      await heading('about');
      expect(await page.getByTestId('pathname').textContent()).toBe('/about');

      await page.goBack();

      await heading('tall');
      await expect
        .poll(() => page.getByTestId('pathname').textContent())
        .toBe('/tall');
    }, 30_000);

    it('restores the position an entry of the same page was left at, onto what that entry renders, when the visitor goes back to it past another origin', async () => {
      await open('/list?q=few');
      await expect.poll(listCount).toBe('30');
      await scrollTo(1500);
      await navigateTo('/list');
      await expect.poll(listCount).toBe('90');
      await navigateTo('/about');
      await cameBackFrom(outsideOrigin);
      await heading('about');
      await page.goBack();
      await expect.poll(listCount).toBe('90');
      await scrollTo(6000);

      await page.goBack();

      await expect.poll(listCount).toBe('30');
      await expect.poll(scrollY).toBe(1500);
    }, 30_000);

    it('restores the position and what an entry of the same page renders when the visitor goes back past another origin and then forward to it', async () => {
      await open('/list?q=few');
      await expect.poll(listCount).toBe('30');
      await navigateTo('/list');
      await expect.poll(listCount).toBe('90');
      await cameBackFrom(outsideOrigin);
      await expect.poll(listCount).toBe('90');
      await scrollTo(6000);
      await page.goBack();
      await expect.poll(listCount).toBe('30');

      await page.goForward();

      await expect.poll(listCount).toBe('90');
      await expect.poll(scrollY).toBe(6000);
    }, 30_000);

    // 別の origin から入り直した文書の navigation.entries() には、別の origin より
    // 前の entry が並ばない。そこで移っても、それらを離れた位置は忘れない
    it('restores the position a page was left at when the visitor goes back to it past another origin they came back in from and moved on', async () => {
      await open('/tall');
      const left = await scrollTo(3000);
      await navigateTo('/about');
      await page.goto(outsideOrigin);
      await page.goto(`${origin}/short`);
      await heading('short');
      await navigateTo('/about');
      await traverse('back');
      await page.goBack();
      await heading('outside');
      await page.goBack();
      await heading('about');

      await page.goBack();

      await heading('tall');
      await expect.poll(scrollY).toBe(left);
    }, 30_000);

    // 別のサイトを挟むと、WebKit は読み直した文書からの戻るに navigate を出さず、
    // popstate だけを出して currentEntry を null にする。URL だけが動いて前のページが
    // 画面に残り、その文書では navigation.navigate() が AbortError になる。
    // フィクスチャはクライアントで描くので、読み直した文書の位置は確かめない
    it('shows the page the URL names, and keeps following links, when the visitor goes back past another site', async () => {
      await open('/tall');
      await navigateTo('/about');
      await cameBackFrom(outsideSite);
      await heading('about');

      await page.goBack();

      await page.waitForFunction(() => navigation.currentEntry !== null);
      await heading('tall');
      expect(new URL(page.url()).pathname).toBe('/tall');
      await navigateTo('/short');
      await heading('short');
    }, 30_000);

    it('shows what the URL holds, and keeps following links, when the visitor goes back past another site within a page', async () => {
      await open('/list?q=few');
      await expect.poll(listCount).toBe('30');
      await navigateTo('/list');
      await expect.poll(listCount).toBe('90');
      await cameBackFrom(outsideSite);
      await expect.poll(listCount).toBe('90');

      await page.goBack();

      // 一覧は popstate で先に絞られる。文書の読み直しが終わるのを待つ
      await page.waitForFunction(() => navigation.currentEntry !== null);
      await expect.poll(listCount).toBe('30');
      expect(new URL(page.url()).search).toBe('?q=few');
      await navigateTo('/short');
      await heading('short');
    }, 30_000);

    // 別のサイトから戻って読み直した文書の中で移り、その文書の最初の entry へ戻ると、
    // WebKit は navigate を出さずに popstate だけを出す。currentEntry はその entry へ動く
    it('shows the page the URL names, and keeps following links, when the visitor goes back to the page they came back to from another site', async () => {
      await open('/tall');
      await cameBackFrom(outsideSite);
      await heading('tall');
      await navigateTo('/about');
      await heading('about');

      await page.goBack();

      await heading('tall', 10_000);
      expect(new URL(page.url()).pathname).toBe('/tall');
      await navigateTo('/short');
      await heading('short');
    }, 30_000);

    // 次のページの読み込みの途中に戻っても、WebKit は navigate を出さないので、読み込みは
    // 止まらずに前の URL の下へ着く。currentEntry は読み込み中の entry に残る
    it('shows the page the URL names when the visitor goes back, before the next page has loaded, to the page they came back to from another site', async () => {
      await open('/host.html?q=few');
      await expect.poll(listCount).toBe('30');
      await cameBackFrom(outsideSite);
      await expect.poll(listCount).toBe('30');
      await hold();
      // 移る先の読み込みが終わるか、文書が去ると返る
      const left = page
        .evaluate(async () => {
          await navigation.navigate('/about').finished?.catch(() => undefined);
        })
        .catch(() => undefined);
      await page.waitForURL(`${origin}/about`, { waitUntil: 'commit' });

      await page.evaluate(() => {
        history.back();
      });
      await page.waitForURL(`${origin}/host.html?q=few`, {
        waitUntil: 'commit',
      });
      await release().catch(() => undefined);
      await left;

      await heading('host.html', 10_000);
      expect(await listCount()).toBe('30');
      expect(new URL(page.url()).search).toBe('?q=few');
    }, 30_000);

    it('shows what the URL holds when the visitor goes back within a page that reads it, to the entry they came back to from another site', async () => {
      await open('/host.html?reload&q=few');
      await expect.poll(listCount).toBe('30');
      await cameBackFrom(outsideSite);
      await expect.poll(listCount).toBe('30');
      await navigateTo('/host.html?reload');
      await expect.poll(listCount).toBe('90');

      await page.goBack();

      // 一覧は読み直した文書が描く
      await expect.poll(listCount, { timeout: 10_000 }).toBe('30');
      expect(new URL(page.url()).search).toBe('?reload&q=few');
    }, 30_000);

    // 画面のページが popstate で URL を読み直すなら、文書は読み直さない
    it('keeps the document when the visitor goes back within a page that follows the URL itself, to the entry they came back to from another site', async () => {
      await open('/list?q=few');
      await expect.poll(listCount).toBe('30');
      await cameBackFrom(outsideSite);
      await expect.poll(listCount).toBe('30');
      await navigateTo('/list');
      await expect.poll(listCount).toBe('90');
      // 読み直しを頼むと、その文書に reload の navigate が出る
      await page.evaluate(() => {
        const kinds: NavigationType[] = [];
        Object.assign(globalThis, { kinds });
        navigation.addEventListener('navigate', (event) => {
          kinds.push(event.navigationType);
        });
      });

      await page.goBack();

      await expect.poll(listCount).toBe('30');
      expect(
        await page.evaluate(
          () => (globalThis as unknown as { kinds?: NavigationType[] }).kinds,
        ),
      ).not.toContain('reload');
    }, 30_000);

    // Firefox は iframe の中で、横取りした戻るを 2 回 commit し、popstate も 2 回出す。
    // トップレベルの文書ではどのエンジンも 1 回なので、2 回目を同じタスクで出す
    it('keeps the document when the browser dispatches popstate twice for a traversal it announced', async () => {
      await open('/tall');
      await navigateTo('/about');
      await heading('about');
      await page.evaluate(() => {
        Object.assign(globalThis, { kept: true });
        window.addEventListener(
          'popstate',
          (event) => {
            window.dispatchEvent(
              new PopStateEvent('popstate', { state: event.state }),
            );
          },
          { once: true },
        );
      });

      await traverse('back');

      await heading('tall');
      expect(await page.evaluate(() => 'kept' in globalThis)).toBe(true);
    }, 30_000);

    // 回線が遅いと、別のサイトから戻って読み直す文書がスクリプトを読む前に、もう一度
    // 戻れる。WebKit は popstate を誰も聞いていないうちに currentEntry を null にする
    it('shows the page the URL names, and keeps following links, when the visitor goes back past another site twice before the page has loaded its script', async () => {
      await open('/tall');
      await navigateTo('/about');
      await page.goto(outsideSite);
      const script = Promise.withResolvers<undefined>();
      const entry = (url: URL): boolean => url.pathname === '/main.tsx';
      await page.route(entry, async (route) => {
        await script.promise;
        await route.continue().catch(() => undefined);
      });
      await page.goBack({ waitUntil: 'commit' });
      // Chromium の goBack は履歴をブラウザのプロセスに問い合わせる。commit を待って返った
      // 直後は、ブラウザがまだ文書の付け替えを終えておらず、Not attached to an active page
      // で落ちることがある。ページの中での評価は Chromium が遷移を終えるまで送らずに止めて
      // おくので、それが返ってから戻る
      expect(
        await page.evaluate(() => document.querySelector('h1') === null),
      ).toBe(true);

      await page.goBack({ waitUntil: 'commit' });
      // unroute は最後にする。放してすぐだと、Playwright が要求の横取りを止める途中に
      // スクリプトが出したモジュールの要求が、続けられずに止まったままになり load が来ない
      script.resolve(undefined);

      // Chromium では、読み込みの途中の文書の中で戻ると、読み込みが終わる前に待ち始めた
      // 要素の待ちが、要素が出ても返らない
      await page.waitForLoadState();
      await page.waitForFunction(() => navigation.currentEntry !== null, null, {
        timeout: 10_000,
      });
      await heading('tall');
      expect(new URL(page.url()).pathname).toBe('/tall');
      await navigateTo('/short');
      await heading('short');
      await page.unroute(entry);
    }, 30_000);

    // WebKit では、読み直しの要求が返る前にリンクを押せる。横取りすると読み直しが止まり、
    // currentEntry が null の文書ではその遷移も AbortError になる
    it('follows a link the visitor clicks as soon as they go back past another site', async () => {
      await open('/tall');
      await navigateTo('/about');
      await cameBackFrom(outsideSite);
      await heading('about');
      const reload = await holdDocument('/tall');

      await page.goBack();
      await reload.requested;
      await page.evaluate(() => {
        const link = navigation.navigate('/short');
        link.committed?.catch(() => undefined);
        link.finished?.catch(() => undefined);
      });
      reload.release();

      await heading('short', 10_000);
      expect(new URL(page.url()).pathname).toBe('/short');
    }, 30_000);

    // 読み直しを頼んだあとに進むと、URL は進んだ先へ動く。そこで読み直しを頼み直さないと、
    // 止めていた前の URL の読み直しが着いて、進んだ先が消える
    it('shows the page the visitor goes forward to while the document reloads for going back past another site', async () => {
      await open('/tall');
      await cameBackFrom(outsideSite);
      await heading('tall');
      await navigateTo('/about');
      await navigateTo('/short');
      await heading('short');
      const reload = await holdDocument('/tall');
      await page.evaluate(() => {
        history.go(-2);
      });
      await reload.requested;

      await page.evaluate(() => {
        history.forward();
      });
      await page.waitForURL(`${origin}/about`, { waitUntil: 'commit' });
      reload.release();

      await heading('about', 10_000);
      expect(new URL(page.url()).pathname).toBe('/about');
    }, 30_000);

    // 移っては戻る読み方では、切り捨てられた entry と hash の移動の key が記録に
    // 積もる。tab の履歴に数件しか無くても、まだ戻れる entry を押し出さない
    it('restores the position a page was left at when the visitor goes back to it after leaving more than 100 entries that are gone', async () => {
      await open('/tall');
      const left = await scrollTo(3000);
      await navigateTo('/about');
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
      await heading('about');

      await traverse('back');

      await heading('tall');
      await expect.poll(scrollY).toBe(left);
    }, 60_000);

    // 一覧は絞り込みを useDeferredValue で遅らせて描く。急ぎの描画のあとで
    // 位置を戻すと、まだ前の entry の一覧の高さの上に戻り、絞った描画で
    // スクロールアンカリングがずらす
    const LONGER_ENTRY = ' from further down a longer entry';
    const READS = ' and the page reads what moved';
    it.each([
      ['', '/list?q=few', '/list', 1500, 300],
      [LONGER_ENTRY, '/list?q=few', '/list', 300, 6000],
      [READS, '/host.html?reload&q=few', '/host.html?reload', 1500, 300],
      [
        `${LONGER_ENTRY}${READS}`,
        '/host.html?reload&q=few',
        '/host.html?reload',
        300,
        6000,
      ],
    ])(
      'restores the position an entry of the same page was left at, onto what that entry renders, when the visitor goes back to it%s',
      async (_, few, all, at, otherAt) => {
        await open(few);
        await expect.poll(listCount).toBe('30');
        const left = await scrollTo(at);
        await navigateTo(all);
        await expect.poll(listCount).toBe('90');
        await scrollTo(otherAt);

        expect(await traverse('back')).toBe('30');
        await expect.poll(scrollY).toBe(left);
      },
      30_000,
    );

    it('restores the position an entry of the same page was left at, onto what that entry renders, when the visitor goes forward to it', async () => {
      await open('/list?q=few');
      await expect.poll(listCount).toBe('30');
      await navigateTo('/list');
      await expect.poll(listCount).toBe('90');
      const left = await scrollTo(300);
      await traverse('back');
      await expect.poll(listCount).toBe('30');
      await scrollTo(1500);

      expect(await traverse('forward')).toBe('90');
      await expect.poll(scrollY).toBe(left);
    }, 30_000);

    it('settles a push within the same page as soon as it commits, without waiting for what the page renders behind it', async () => {
      await open('/list?q=few');
      await expect.poll(listCount).toBe('30');

      const settled = await page.evaluate(async () => {
        await navigation.navigate('/list').finished;
        return document.querySelector('[data-testid="count"]')?.textContent;
      });

      expect(settled).toBe('30');
      await expect.poll(listCount).toBe('90');
    }, 30_000);

    // リンクを押すと URL は先に進み、前のページは読み込みが終わるまで残る。
    // そこで読んでいた位置から戻るのは移るのを取り消すことで、押したときの
    // 位置に引き戻さない。search を読むページでも、読み直さない
    it.each(['/host.html', '/host.html?reload'])(
      'loads nothing and keeps the position the visitor scrolled %s to when they go back to it while the next page loads',
      async (pathname) => {
        await open(pathname);
        await expect.poll(listCount).toBe('90');
        await scrollTo(1500);
        await hold();
        await commit('/elsewhere');
        const kept = await scrollTo(500);

        await commit('back');
        await page.evaluate(
          () =>
            new Promise((resolve) => {
              requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
              });
            }),
        );

        expect(page.url()).toBe(`${origin}${pathname}`);
        expect(await scrollY()).toBe(kept);
        expect(await loads()).toStrictEqual(['/elsewhere']);
      },
      30_000,
    );

    // 読み込んだ木は当たっても、描き終えるまで前のページが画面に残る。そこで戻るのは
    // 取り消しではない。当てた木はもう引っ込められない
    it('shows the page the visitor goes back to while the next one has loaded but not rendered yet', async () => {
      await open('/host.html');
      await page.evaluate(() => {
        controls.holdRender = true;
      });
      await commit('/p1');
      expect(await loads()).toStrictEqual(['/p1']);

      await commit('back');
      await release();

      await expect.poll(loads).toStrictEqual(['/p1', '/host.html']);
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(resolve);
            });
          }),
      );
      expect(await page.getByRole('heading').textContent()).toBe('host.html');
      expect(page.url()).toBe(`${origin}/host.html`);
    }, 30_000);

    // Playwright の WebKit は bfcache を使わないので、WebKit が bfcache から戻した
    // 文書に出す traverse を同じ形で流し、ブラウザが戻す位置を続けて置く
    it('leaves the position to the browser when WebKit announces coming back from the back/forward cache as a traversal to the entry on screen', async () => {
      await open('/short');

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
    }, 30_000);

    // 読み込みのあいだに動かせるのは画面に残る前のページで、行き先の座標ではない
    it('restores the position a page was left at when the visitor goes back to it, even if they scroll the page still on screen while it loads', async () => {
      await open('/host.html');
      const left = await scrollTo(1500);
      await navigateTo('/p1');
      await scrollTo(300);
      await hold();
      await commit('back');
      // Firefox が popstate のタスクで前のページを動かし終えてから測る
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 0);
          }),
      );
      const before = await scrollY();
      await page.mouse.move(200, 200);
      await page.mouse.wheel(0, 400);
      // ホイールのスクロールはアニメーションで進み、wheel() は届くのを待たない。
      // 動かし終える前に読み込みを終えると、残りが戻した位置に足される
      await expect.poll(scrollY).toBe(before + 400);

      await release();

      await heading('host.html');
      await expect.poll(scrollY).toBe(left);
    }, 30_000);

    it('starts a page the visitor called off while it loaded at the top when they go forward to it', async () => {
      await open('/host.html');
      await scrollTo(1500);
      await hold();
      await commit('/elsewhere');
      await commit('back');
      await release();

      await traverse('forward');

      await heading('elsewhere');
      await expect.poll(scrollY).toBe(0);
    }, 30_000);

    // 読み込みのあいだ、URL はもう行き先の entry を指し、画面には前のページが
    // 残る。そこで離れるのは画面のページで、位置もそのページのもの
    it('restores the position a page was left at when the visitor goes back past it while it loads, and then forward to it', async () => {
      await open('/host.html');
      await navigateTo('/p1');
      const left = await scrollTo(1000);
      await navigateTo('/p2');
      await scrollTo(300);
      await hold();
      await commit('back');
      await commit('back');
      await release();
      await heading('host.html');

      await traverse('forward');

      await heading('p1');
      await expect.poll(scrollY).toBe(left);
    }, 30_000);

    it('restores the position a page was left at when the visitor follows a link while going back to another, and then comes back', async () => {
      await open('/host.html');
      const left = await scrollTo(1500);
      await navigateTo('/p1');
      await scrollTo(700);
      await hold();
      await commit('back');
      await commit('/p3');
      await release();
      await heading('p3');

      await traverse('back');

      await heading('host.html');
      await expect.poll(scrollY).toBe(left);
    }, 30_000);
  },
);
