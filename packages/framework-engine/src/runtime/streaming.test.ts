import type { Browser, Page } from 'playwright';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vite-plus/test';

import { browserTypes, buildFixture, serveBuilt } from '../../fixtures/build';
import type { BuiltFixture, ServedBuild } from '../../fixtures/build';

let built: BuiltFixture | undefined;
let served: ServedBuild | undefined;
let browser: Browser;
let origin = '';

const handler = (pathname: string): Promise<Response> => {
  if (built === undefined) throw new Error('the fixture was not built');
  return built.handler(new Request(`${origin}${pathname}`));
};

// ページがデータを待ってから答え、その中身が後から流れてくるのは、
// 組み上がったアプリを流したままのサーバーでしか起きない
beforeAll(async () => {
  built = await buildFixture('streaming');
  served = await serveBuilt(built);
  ({ origin } = served);
}, 120_000);

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  served?.close();
  await built?.dispose();
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

/**
 * What a document has sent once `text` arrives, and for how long it goes on
 * streaming after that.
 */
const sentUntil = async (
  pathname: string,
  text: string,
): Promise<{ readonly sent: string; readonly streamedOn: number }> => {
  const response = await handler(pathname);
  const reader = (response.body as ReadableStream<Uint8Array>).getReader();
  const decoder = new TextDecoder();
  let sent = '';
  let done = false;
  while (!done && !sent.includes(text)) {
    const read = await reader.read();
    sent += decoder.decode(read.value, { stream: true });
    ({ done } = read);
  }
  const at = performance.now();
  while (!done) ({ done } = await reader.read());
  return { sent, streamedOn: performance.now() - at };
};

describe('the shell of a document', () => {
  // ページが待つ部分は 1 秒かかる。殻がそれを待てば、殻のあとにはほとんど
  // 流れない
  it.each([
    [
      'a client component renders the <Suspense> above it',
      '/client-boundary',
      'waiting in a client boundary',
      'arrived in a client boundary',
    ],
    [
      'it is under an error.tsx and no loading.tsx',
      '/caught',
      '<nav>',
      'arrived under an error.tsx',
    ],
    [
      'it is only passed in a prop that is never rendered',
      '/held',
      'holding',
      'arrived in a prop',
    ],
  ])(
    'is sent before what the page waits for, when %s',
    async (_, pathname, shown, late) => {
      const { sent, streamedOn } = await sentUntil(pathname, shown);

      expect(sent).toContain(shown);
      expect(sent).not.toContain(late);
      expect(streamedOn).toBeGreaterThan(500);
    },
  );
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

// 遅いページのペイロードは、ページの木の外側が先に届き、ページの本体を待って
// 流れ続ける。start がそれを頼んでから、その途中まで待つ。クリックはリンクに
// 乗った時点で先読みを始めるので、待ち受けは先に置く
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
      // 追い越された読み込みは取り消される。本体は Suspense の外なので、
      // 木は本体が届くまで当てられず、遷移が追い越された時点で取り消される
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

// アクションの答えはページを描き直したもので、tally の本体は 1000ms 待つ。
// 答えが届き終えるのを待ち、当てられたなら画面に出るまで待つ
const answersOf = (page: Page): Array<Promise<unknown>> => {
  const answers: Array<Promise<unknown>> = [];
  page.on('response', (response) => {
    if (response.request().method() === 'POST') {
      answers.push(response.finished());
    }
  });
  return answers;
};

const allApplied = async (
  answers: Array<Promise<unknown>>,
  count: number,
): Promise<void> => {
  await vi.waitFor(() => {
    expect(answers).toHaveLength(count);
  });
  await Promise.all(answers);
  await wait(500);
};

describe.each(browserTypes)(
  'a Server Action’s answer on a page that awaits its data with no loading.tsx, in $name',
  ({ type }) => {
    beforeAll(async () => {
      browser = await type.launch();
    });

    afterAll(async () => {
      await browser.close();
    });

    it('is not applied over the page a navigation went on to while it loaded', async () => {
      const page = await openHydrated('/tally');
      const seen = watch(page);
      const answers = answersOf(page);

      await page.getByRole('button', { name: 'bump' }).click();
      await page.getByRole('link', { name: 'home' }).click();
      await page.getByRole('heading', { name: 'home' }).waitFor();
      await allApplied(answers, 1);

      expect(await page.getByRole('heading').textContent()).toBe('home');
      expect(await page.title()).toBe('home');
      expect(new URL(page.url()).pathname).toBe('/');
      expect(await stayed(page)).toBe(true);
      expect(seen.documents).toStrictEqual([]);
      expect(seen.errors).toStrictEqual([]);
      await page.close();
    }, 30_000);

    it('leaves the answer to the last of two actions called in a row on screen', async () => {
      const page = await openHydrated('/tally');
      const seen = watch(page);
      const answers = answersOf(page);
      const before = Number(
        (await page.getByRole('heading').textContent())?.replace('tally ', ''),
      );

      const bump = page.getByRole('button', { name: 'bump' });
      await bump.click();
      await bump.click();
      await allApplied(answers, 2);

      const after = `tally ${String(before + 2)}`;
      expect(await page.getByRole('heading').textContent()).toBe(after);
      expect(await page.title()).toBe(after);
      expect(seen.documents).toStrictEqual([]);
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

    // 画面に出ている loading.tsx の下へ移ると、本体を待つ間も木は当てられ、
    // 前のページが残る。その間に追い越されても、当てた木の読み込みは本体の
    // 中で中断されず、次の木が画面に出てから取り消される
    it('keeps its request once its tree is applied, and is left in place when a click overtakes the navigation into it', async () => {
      const page = await openHydrated('/shelf');
      const seen = watch(page);

      await startLoading(page, '/shelf/tardy/index.rsc', () =>
        page.getByRole('link', { name: 'tardy' }).click(),
      );
      await page.getByRole('link', { name: 'home' }).click();

      await page.getByRole('heading', { name: 'home' }).waitFor();
      expect(new URL(page.url()).pathname).toBe('/');
      expect(await stayed(page)).toBe(true);
      expect(seen.documents).toStrictEqual([]);
      expect(seen.errors).toStrictEqual([]);
      await vi.waitFor(() => {
        expect(seen.cancelled).toContain('/shelf/tardy/index.rsc');
      });
      await page.close();
    }, 30_000);

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
