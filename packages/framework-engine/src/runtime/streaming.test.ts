import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream as NodeReadableStream } from 'node:stream/web';

import { chromium, firefox, webkit } from 'playwright';
import type { Browser, Page } from 'playwright';

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

let built: BuiltFixture | undefined;
let server: Server;
let browser: Browser;
let origin = '';

const handler = (pathname: string): Promise<Response> => {
  if (built === undefined) throw new Error('the fixture was not built');
  return built.handler(new Request(`${origin}${pathname}`));
};

// ページがデータを待ってから答え、その中身が後から流れてくるのは、
// 組み上がったアプリを流したままのサーバーでしか起きない
beforeAll(async () => {
  const { out } = (built = await buildFixture('streaming'));

  // ハッシュ付きの資産はファイルから、それ以外はハンドラが答える。
  // @k8ordo/framework/serve と同じく、答えは流れてきたとおりに送り、
  // 訪問者が去れば読むのをやめる
  const answer = async (url: URL): Promise<Response> => {
    if (!url.pathname.startsWith('/assets/'))
      return handler(url.pathname + url.search);
    try {
      const body = await readFile(path.join(out, 'client', url.pathname));
      return new Response(body, {
        headers: { 'content-type': 'text/javascript' },
      });
    } catch {
      return new Response(null, { status: 404 });
    }
  };
  server = createServer((incoming, outgoing) => {
    void (async () => {
      const response = await answer(new URL(incoming.url ?? '/', origin));
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body === null) {
        outgoing.end();
        return;
      }
      await pipeline(
        Readable.fromWeb(response.body as unknown as NodeReadableStream),
        outgoing,
      ).catch(() => undefined);
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

afterEach(() => {
  vi.restoreAllMocks();
});

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe('the build', () => {
  it('warns about nothing for a Server Component that imports a Server Action', () => {
    expect(built?.warnings).toStrictEqual([]);
  });
});

describe('a reader that leaves mid-stream', () => {
  // 遅れて届く部分がまだ描かれているうちに、最初のチャンクだけ読んで去る
  it.each([
    ['a document', '/waits'],
    ['a payload', '/waits/index.rsc'],
  ])('is not reported as a failed render, for %s', async (_, pathname) => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await handler(pathname);
    const reader = (response.body as ReadableStream<Uint8Array>).getReader();
    await reader.read();

    await reader.cancel(new Error('Premature close'));
    // 描きかけだった部分（800ms 待つ）が片付くまで待つ
    await wait(1200);

    expect(errors).not.toHaveBeenCalled();
  });

  it('leaves a render that failed reported', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    await (await handler('/broken')).text();

    expect(errors).toHaveBeenCalledWith(
      'k8ordo: rendering %s failed',
      '/broken',
      expect.objectContaining({ message: 'the database is down' }),
    );
  });
});

// hydrate する前のリンクは JS なしの文書の読み込みになり、クライアント遷移の
// 主張をすり抜ける。ブラウザでしか描かれない印が出たら、JS が握っている
const openHydrated = async (pathname: string): Promise<Page> => {
  const page = await browser.newPage();
  await page.goto(`${origin}${pathname}`);
  await page.getByText('hydrated').waitFor();
  // 文書が読み直されると、この印は消える
  await page.evaluate(() => {
    Object.assign(window, { stayed: true });
  });
  return page;
};

// 読み直された文書と、コンソールのエラーを集める。404 の文書の読み込みが
// ブラウザ自身に書かせる「Failed to load resource」は数えない
const watch = (
  page: Page,
): { documents: string[]; errors: string[]; cancelled: string[] } => {
  const seen = {
    documents: [] as string[],
    errors: [] as string[],
    cancelled: [] as string[],
  };
  page.on('request', (request) => {
    if (request.resourceType() === 'document') {
      seen.documents.push(new URL(request.url()).pathname);
    }
  });
  page.on('requestfailed', (request) => {
    const url = new URL(request.url());
    seen.cancelled.push(url.pathname + url.search);
  });
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      !message.text().startsWith('Failed to load resource')
    ) {
      seen.errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    seen.errors.push(error.message);
  });
  return seen;
};

const stayed = (page: Page): Promise<boolean> =>
  page.evaluate(() => 'stayed' in window);

// 遅いページのペイロードは、ページの木の外側が先に届き、木が当てられたあとも
// ページの本体を待って流れ続ける。start がそれを頼んでから、その途中まで待つ。
// クリックはリンクに乗った時点で先読みを始めるので、待ち受けは先に置く
const startLoading = async (
  page: Page,
  payload: string,
  start: () => Promise<void>,
): Promise<void> => {
  const arrived = page.waitForResponse(
    (response) => new URL(response.url()).pathname === payload,
  );
  await start();
  await arrived;
  await wait(400);
};

describe.each(browserTypes)(
  'a page that awaits its data with no loading.tsx, in $name',
  ({ type }) => {
    beforeAll(async () => {
      browser = await type.launch();
    });

    afterAll(async () => {
      await browser.close();
    });

    it('is left in place, not reloaded, when a click overtakes the navigation into it', async () => {
      const page = await openHydrated('/');
      const seen = watch(page);

      await startLoading(page, '/slow/index.rsc', () =>
        page.getByRole('link', { name: 'slow' }).click(),
      );
      await page.getByRole('link', { name: 'waits' }).click();

      await page.getByRole('heading', { name: 'waits' }).waitFor();
      expect(new URL(page.url()).pathname).toBe('/waits');
      expect(await stayed(page)).toBe(true);
      expect(seen.documents).toStrictEqual([]);
      expect(seen.errors).toStrictEqual([]);
      // 追い越された読み込みは、次のページが画面に出たら取り消される
      await vi.waitFor(() => {
        expect(seen.cancelled).toContain('/slow/index.rsc');
      });
      await page.close();
    }, 30_000);

    it('is left in place when the visitor goes back while it loads', async () => {
      const page = await openHydrated('/');
      const seen = watch(page);

      await startLoading(page, '/slow/index.rsc', () =>
        page.getByRole('link', { name: 'slow' }).click(),
      );
      await page.evaluate(() => {
        void navigation.back().finished?.catch(() => undefined);
      });

      await page.getByRole('heading', { name: 'home' }).waitFor();
      expect(new URL(page.url()).pathname).toBe('/');
      expect(await stayed(page)).toBe(true);
      expect(seen.documents).toStrictEqual([]);
      expect(seen.errors).toStrictEqual([]);
      await page.close();
    }, 30_000);

    it('is loaded again, in place, when the search moves on while it loads', async () => {
      const page = await openHydrated('/search?q=quick');
      const seen = watch(page);

      await startLoading(page, '/search/index.rsc', () =>
        page.evaluate(() => {
          void navigation
            .navigate('/search?q=slow')
            .finished?.catch(() => undefined);
        }),
      );
      await page.evaluate(() => {
        void navigation.navigate('/search?q=b').finished;
      });

      await page.getByRole('heading', { name: 'results for b' }).waitFor();
      expect(await stayed(page)).toBe(true);
      expect(seen.documents).toStrictEqual([]);
      expect(seen.errors).toStrictEqual([]);
      await page.close();
    }, 30_000);

    it('hands a navigation to a page that says notFound() late to a document load, reporting no error', async () => {
      const page = await openHydrated('/');
      const seen = watch(page);

      await page.getByRole('link', { name: 'gone' }).click();

      await page.getByRole('heading', { name: '404' }).waitFor();
      expect(seen.documents).toStrictEqual(['/gone']);
      expect(seen.errors).toStrictEqual([]);
      await page.close();
    }, 30_000);
  },
);

describe.each(browserTypes)(
  'a page that awaits its data under a loading.tsx, in $name',
  ({ type }) => {
    beforeAll(async () => {
      browser = await type.launch();
    });

    afterAll(async () => {
      await browser.close();
    });

    it('is in the document for a visitor without JavaScript, not its loading.tsx', async () => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();

      await page.goto(`${origin}/waits`, { waitUntil: 'load' });

      await page.getByRole('heading', { name: 'waits' }).waitFor();
      expect(await page.getByText('row 599').isVisible()).toBe(true);
      expect(await page.getByText('loading waits…').count()).toBe(0);
      await context.close();
    }, 30_000);
  },
);
