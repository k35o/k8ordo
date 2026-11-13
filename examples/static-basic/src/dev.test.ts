import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { chromium, firefox, webkit } from 'playwright';
import type { Browser } from 'playwright';
import { createLogger, createServer } from 'vite';
import type { ViteDevServer } from 'vite';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vite-plus/test';

const root = path.resolve(import.meta.dirname, '..');

// CI はエンジンごとにジョブを分けて並べるので、TEST_BROWSER で 1 つに絞れる
const browserTypes = [chromium, firefox, webkit]
  .filter(
    (type) =>
      process.env.TEST_BROWSER === undefined ||
      process.env.TEST_BROWSER === type.name(),
  )
  .map((type) => ({ name: type.name(), type }));

// 本物の dev サーバがログに出したエラー。編集の途中で出るものは応答には
// 現れず、ここにしか残らない
const logged: string[] = [];
const logger = createLogger('error');
logger.error = (message) => {
  logged.push(message);
};

// dev サーバを立てる前から routes/ にあり、テストの中で消すルート。作るのも
// テストの中にすると、作ったことによる入れ替えがまだ終わらないうちに消して、
// その入れ替えが消えたファイルを読みに行く（監視の遅れの分だけ起きうる）
const removable = path.join(root, 'src/routes/removed-in-dev');

let server: ViteDevServer;

beforeAll(async () => {
  await mkdir(removable, { recursive: true });
  await writeFile(
    path.join(removable, 'page.tsx'),
    'export default function Removed() {\n  return <h1>removed</h1>;\n}\n',
  );
  server = await createServer({
    root,
    logLevel: 'error',
    customLogger: logger,
    server: { port: 0 },
  });
  await server.listen();
}, 180_000);

// 聞いている本物の dev サーバの URL（末尾の / 付き）
const origin = (): string => {
  const [url] = server.resolvedUrls?.local ?? [];
  if (url === undefined) throw new Error('the dev server is not listening');
  return url;
};

// 書き換えたソースは、テストが落ちても元に戻す
const editing = async (
  file: string,
  edit: (source: string) => string,
  body: () => Promise<void>,
): Promise<void> => {
  const source = await readFile(file, 'utf8');
  await writeFile(file, edit(source));
  try {
    await body();
  } finally {
    await writeFile(file, source);
  }
};

afterAll(async () => {
  await rm(removable, { recursive: true, force: true });
  await server.close();
});

describe('vite dev under a route taken away', () => {
  const statusOf = async (pathname: string): Promise<number> =>
    (await fetch(new URL(pathname, origin()))).status;

  it('stops answering the route, with nothing failing to reload', async () => {
    // 表を読み込ませておく。読み込まれていない表は読み直しもされない
    expect(await statusOf('/removed-in-dev')).toBe(200);
    // 監視が知らないファイルは、消えたことも伝わらない
    await vi.waitFor(() => {
      expect(server.watcher.getWatched()[removable]).toStrictEqual([
        'page.tsx',
      ]);
    });
    logged.length = 0;

    await rm(removable, { recursive: true });

    await vi.waitFor(
      async () => {
        expect(await statusOf('/removed-in-dev')).toBe(404);
      },
      { timeout: 10_000 },
    );
    expect(logged).toStrictEqual([]);
  }, 30_000);
});

describe('vite dev under a value paths does not list', () => {
  const answerOf = async (
    pathname: string,
  ): Promise<{ status: number; body: string }> => {
    const response = await fetch(new URL(pathname, origin()));
    return { status: response.status, body: await response.text() };
  };

  it('answers it with the shell, as a host would, its body left to the browser', async () => {
    const { status, body } = await answerOf('/en/posts/3');

    expect(status).toBe(200);
    expect(body).toContain('loading the post…');
    expect(body).not.toContain('third post');
  });

  it('sends the headers framework() declared, as the deployed site would', async () => {
    const response = await fetch(new URL('/en/posts/3', origin()));

    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
  });

  it('answers its payload with the shell’s', async () => {
    const { status, body } = await answerOf('/en/posts/3/index.rsc');

    expect(status).toBe(200);
    expect(body).toContain('loading the post');
  });

  it('renders a value paths lists with its page', async () => {
    const { status, body } = await answerOf('/en/posts/1');

    expect(status).toBe(200);
    expect(body).toContain('<h1 data-testid="title">first post</h1>');
  });
});

describe.each(browserTypes)('vite dev in $name', ({ type }) => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await type.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('shows a value paths does not list, read from the URL in the browser', async () => {
    const page = await browser.newPage();

    await page.goto(new URL('/en/posts/3', origin()).href);

    await page
      .getByRole('heading', { name: 'third post' })
      .waitFor({ timeout: 15_000 });
    expect({
      pathname: new URL(page.url()).pathname,
      loading: await page.getByTestId('shell').count(),
    }).toStrictEqual({ pathname: '/en/posts/3', loading: 0 });
    await page.close();
  }, 30_000);
});

describe.each(browserTypes)('vite dev under an edit in $name', ({ type }) => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await type.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('puts an edited Server Component on screen in place, keeping client state', async () => {
    const page = await browser.newPage();
    await page.goto(origin());
    const counter = page.getByTestId('counter');
    // hydration 前のクリックは何も変えない。数が動いたら JS が握っている
    await vi.waitFor(
      async () => {
        await counter.click();
        expect(await counter.textContent()).not.toBe('count 0');
      },
      { timeout: 10_000 },
    );
    const count = await counter.textContent();
    // 文書の読み込みが起きれば window ごと入れ替わり、この印は消える
    await page.evaluate(() => {
      Object.assign(window, { stayed: true });
    });

    await editing(
      path.join(root, 'src/routes/page.tsx'),
      (source) =>
        source.replace(
          'rendered on the server',
          'rendered on the server, edited',
        ),
      async () => {
        await page
          .getByText('rendered on the server, edited')
          .waitFor({ timeout: 10_000 });
      },
    );

    expect(await counter.textContent()).toBe(count);
    expect(await page.evaluate(() => 'stayed' in window)).toBe(true);
    await page.close();
  }, 30_000);
});
