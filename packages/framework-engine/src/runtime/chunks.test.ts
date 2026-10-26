import { readdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';

import { chromium, firefox, webkit } from 'playwright';
import type { Browser, Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

// CI はエンジンごとにジョブを分けて並べるので、TEST_BROWSER で 1 つに絞れる
const browserTypes = [chromium, firefox, webkit]
  .filter(
    (type) =>
      process.env.TEST_BROWSER === undefined ||
      process.env.TEST_BROWSER === type.name(),
  )
  .map((type) => ({ name: type.name(), type }));

/** The fixture's two pages and its not-found. */
const PAGES = ['a', 'b', 'n'] as const;

type PageName = (typeof PAGES)[number];

/**
 * What only one page's own files carry: its server component's CSS Module,
 * its client component's stylesheet, and its client component's text.
 */
const marksOf = (page: PageName): readonly string[] => [
  `mark-${page}-server`,
  `mark-${page}-client`,
  `MARK_${page.toUpperCase()}_CLIENT`,
];

// client コンポーネントの JS が hydrate や遷移より遅れて届く間に、表示が
// 欠けないかを見る。遅らせる長さは、欠けたときに見逃さない程度にとる
const SLOW = 400;

let built: BuiltFixture | undefined;
let server: Server;
let browser: Browser;
let origin = '';
/** Per built asset, by the path the HTML names it with, the pages it is of. */
const pagesOf = new Map<string, readonly PageName[]>();

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// どのページがどのファイルを読むかは、組み上がったアプリにしか現れない
beforeAll(async () => {
  const { handler, out } = (built = await buildFixture('chunks'));
  const assets = path.join(out, 'client', 'assets');
  for (const file of await readdir(assets)) {
    const text = await readFile(path.join(assets, file), 'utf8');
    pagesOf.set(
      `/assets/${file}`,
      PAGES.filter((page) => marksOf(page).some((mark) => text.includes(mark))),
    );
  }

  // ハッシュ付きの資産はファイルから、それ以外はハンドラが答える。
  // ページの client コンポーネントの JS だけを遅らせる
  const answer = async (url: URL): Promise<Response> => {
    if (url.pathname.startsWith('/assets/')) {
      const isScript = url.pathname.endsWith('.js');
      if (isScript && (pagesOf.get(url.pathname) ?? []).length > 0) {
        await wait(SLOW);
      }
      try {
        const body = await readFile(path.join(out, 'client', url.pathname));
        return new Response(body, {
          headers: {
            'content-type': isScript ? 'text/javascript' : 'text/css',
          },
        });
      } catch {
        return new Response(null, { status: 404 });
      }
    }
    // 404.html と同じく、別の pathname で描いた HTML をこの URL で返す
    if (url.pathname === '/elsewhere') {
      return handler(new Request(`${origin}/nowhere`));
    }
    return handler(new Request(url));
  };
  server = createServer((incoming, outgoing) => {
    void (async () => {
      const response = await answer(new URL(incoming.url ?? '/', origin));
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(Buffer.from(await response.arrayBuffer()));
    })();
  });
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  origin = `http://127.0.0.1:${String((server.address() as AddressInfo).port)}`;
}, 120_000);

afterAll(async () => {
  server.close();
  await built?.dispose();
});

/** The pages whose files these assets are, in the fixture's order. */
const pagesIn = (assets: Iterable<string>): PageName[] => {
  const found = new Set(
    [...assets].flatMap((asset) => pagesOf.get(asset) ?? []),
  );
  return PAGES.filter((page) => found.has(page));
};

/** What a page's HTML has the browser load: stylesheets, preloads, scripts. */
const assetsOfHtml = async (pathname: string): Promise<string[]> => {
  if (built === undefined) throw new Error('the fixture was not built');
  const html = await (
    await built.handler(new Request(`https://k8ordo.test${pathname}`))
  ).text();
  return [
    ...html.matchAll(/<(?:link|script)\b[^>]*\b(?:href|src)="([^"]+)"/gu),
  ].map(([, asset]) => asset ?? '');
};

describe('the HTML of each page', () => {
  it.each([
    ['/a', ['a']],
    ['/b', ['b']],
    ['/nowhere', ['n']],
  ])(
    'has %s load its own client components and stylesheets, and no other page’s',
    async (pathname, pages) => {
      expect(pagesIn(await assetsOfHtml(pathname))).toStrictEqual(pages);
    },
  );
});

/** Every asset the page asks for from now on, by its path. */
const requested = (page: Page): Set<string> => {
  const assets = new Set<string>();
  page.on('request', (request) => {
    const { pathname } = new URL(request.url());
    if (pathname.startsWith('/assets/')) assets.add(pathname);
  });
  return assets;
};

type Shown = { readonly body: string; readonly title: string };

/**
 * What the page shows each time the document changes, from before its HTML
 * is parsed, collected in `window.shown`.
 */
const recordShown = (): void => {
  const shown: Shown[] = [];
  Object.assign(window, { shown });
  new MutationObserver(() => {
    shown.push({
      body: (document.body as HTMLElement | null)?.textContent ?? '',
      title: document.title,
    });
  }).observe(document, { subtree: true, childList: true, characterData: true });
};

const shownOn = (page: Page): Promise<Shown[]> =>
  page.evaluate(() => (window as unknown as { shown: Shown[] }).shown);

/** Whether `holds` stayed true from the first time it held to the end. */
const stayed = (
  shown: readonly Shown[],
  holds: (each: Shown) => boolean,
): boolean => {
  const first = shown.findIndex(holds);
  return first !== -1 && shown.slice(first).every(holds);
};

const open = async (pathname: string): Promise<Page> => {
  const page = await browser.newPage();
  await page.addInitScript(recordShown);
  await page.goto(`${origin}${pathname}`);
  await page.getByText('hydrated').waitFor();
  // 文書が読み直されると、この印は消える
  await page.evaluate(() => {
    Object.assign(window, { opened: true });
  });
  return page;
};

const reloaded = async (page: Page): Promise<boolean> =>
  !(await page.evaluate(() => 'opened' in window));

// 遅らせた部品が届き、描き直しが済むまで待つ
const settled = (page: Page): Promise<void> =>
  page.waitForLoadState('networkidle');

describe.each(browserTypes)('pages loading their own, in $name', ({ type }) => {
  beforeAll(async () => {
    browser = await type.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('loads no other page’s client components or stylesheets', async () => {
    const page = await browser.newPage();
    const assets = requested(page);

    await page.goto(`${origin}/a`);
    await page.getByText('hydrated').waitFor();
    await settled(page);

    expect(pagesIn(assets)).toStrictEqual(['a']);
    await page.close();
  }, 30_000);

  it('keeps the body and the title on screen while the page hydrates', async () => {
    const page = await open('/a');
    await settled(page);

    const shown = await shownOn(page);
    expect(stayed(shown, ({ body }) => body.includes('body a'))).toBe(true);
    expect(stayed(shown, ({ title }) => title === 'page a')).toBe(true);
    await page.close();
  }, 30_000);

  it('keeps the body and the title on screen while HTML rendered for another pathname renders afresh', async () => {
    const page = await open('/elsewhere');
    await settled(page);

    const shown = await shownOn(page);
    expect(stayed(shown, ({ body }) => body.includes('body n'))).toBe(true);
    expect(stayed(shown, ({ title }) => title === 'page n')).toBe(true);
    await page.close();
  }, 30_000);

  it('keeps the page on screen until the next one’s client components have loaded, showing no fallback', async () => {
    const page = await open('/a');
    await settled(page);
    const before = (await shownOn(page)).length;

    await page.getByRole('link', { name: 'to b' }).click();
    await page.getByText('MARK_B_CLIENT').waitFor();
    await settled(page);

    const shown = (await shownOn(page)).slice(before);
    expect(shown.every(({ body }) => /body [ab]/u.test(body))).toBe(true);
    expect(shown.some(({ body }) => body.includes('loading b'))).toBe(false);
    expect(await reloaded(page)).toBe(false);
    await page.close();
  }, 30_000);

  it('loads the next page’s client components and stylesheets on a client navigation, and no other page’s', async () => {
    const page = await open('/a');
    await settled(page);
    const assets = requested(page);

    await page.getByRole('link', { name: 'to b' }).click();
    await page.getByText('MARK_B_CLIENT').waitFor();
    await settled(page);

    expect(pagesIn(assets)).toStrictEqual(['b']);
    expect(await reloaded(page)).toBe(false);
    const mark = (selector: string): Promise<string> =>
      page
        .locator(selector)
        .evaluate((element) =>
          getComputedStyle(element).getPropertyValue('--mark').trim(),
        );
    expect(await mark('h1')).toBe('mark-b-server');
    expect(await mark('[data-mark-b]')).toBe('mark-b-client');
    await page.close();
  }, 30_000);

  it('loads the next page’s client components as soon as its link is pointed at', async () => {
    const page = await open('/a');
    await settled(page);
    const loaded = page.waitForEvent(
      'requestfinished',
      (request) => pagesIn([new URL(request.url()).pathname]).join(',') === 'b',
    );

    await page.getByRole('link', { name: 'to b' }).hover();

    await loaded;
    expect(new URL(page.url()).pathname).toBe('/a');
    await page.close();
  }, 30_000);
});
