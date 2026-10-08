import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { chromium, firefox, webkit } from 'playwright';
import type { Browser } from 'playwright';
import { createLogger, createServer } from 'vite';
import type { ViteDevServer } from 'vite';

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

// 主張の対象は「dev サーバがそのモジュールをどう扱うか」なので、テストが本物の
// dev サーバを立てる。プラグインの transform を直接呼ぶ形にすると、RSC の変換が
// 先に走るという肝心の並びごと消えてしまい、拒否が死んでいても気づけない
let server: ViteDevServer;
// guard.ts を置いた構成の dev サーバ。本物より先に立てる: どちらも同じ
// .k8ordo/ に表を書くので、後に立てた本物の表が残る
let guarded: ViteDevServer;
// GET 以外を export する route.ts を置いた構成の dev サーバ
let routed: ViteDevServer;

const start = (config: string): Promise<ViteDevServer> =>
  createServer({
    root,
    configFile: path.join(root, config),
    logLevel: 'error',
    customLogger: logger,
    server: { port: 0 },
  });

beforeAll(async () => {
  await mkdir(removable, { recursive: true });
  await writeFile(
    path.join(removable, 'page.tsx'),
    'export default function Removed() {\n  return <h1>removed</h1>;\n}\n',
  );
  guarded = await start('vite.broken-guard.config.ts');
  routed = await start('vite.broken-route.config.ts');
  server = await start('vite.config.ts');
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
  await guarded.close();
  await routed.close();
  await server.close();
});

const transform = (
  environment: 'rsc' | 'client',
  url: string,
  on: ViteDevServer = server,
): Promise<unknown> => {
  const target = on.environments[environment];
  if (target === undefined) {
    throw new Error(`no ${environment} environment`);
  }
  return target.transformRequest(url);
};

describe('vite dev in static mode', () => {
  it('refuses a module that declares a Server Action', async () => {
    await expect(transform('rsc', '/src/refused-action.ts')).rejects.toThrow(
      /static build cannot ship Server Actions/u,
    );
  });

  it('names the file the application would have to change', async () => {
    await expect(transform('rsc', '/src/refused-action.ts')).rejects.toThrow(
      /src\/refused-action\.ts/u,
    );
  });

  it('refuses it in the browser environment too, where a form would import it', async () => {
    await expect(transform('client', '/src/refused-action.ts')).rejects.toThrow(
      /static build cannot ship Server Actions/u,
    );
  });

  it('refuses a module that imports the request API, naming it', async () => {
    await expect(transform('rsc', '/src/refused-request.ts')).rejects.toThrow(
      /static build cannot answer a request[\s\S]*src\/refused-request\.ts/u,
    );
  });

  it('refuses a guard.ts the moment it is compiled, naming it', async () => {
    await expect(
      transform('rsc', '/src/routes-broken-guard/admin/guard.ts', guarded),
    ).rejects.toThrow(
      /static build cannot run guard\.ts[\s\S]*src\/routes-broken-guard\/admin\/guard\.ts/u,
    );
  });

  it('refuses a route.ts that answers a method a file cannot, the moment it is compiled', async () => {
    await expect(
      transform('rsc', '/src/routes-broken-route/api/route.ts', routed),
    ).rejects.toThrow(
      /a file cannot answer another method[\s\S]*src\/routes-broken-route\/api\/route\.ts \(POST\)/u,
    );
  });

  it('refuses a route.ts that re-exports with export *, rather than answering what it brings', async () => {
    await expect(
      transform('rsc', '/src/routes-broken-route/feed/route.ts', routed),
    ).rejects.toThrow(
      /export \* names none of them[\s\S]*src\/routes-broken-route\/feed\/route\.ts/u,
    );
  });

  it('leaves every other module alone', async () => {
    await expect(
      transform('rsc', '/src/routes/page.tsx'),
    ).resolves.not.toBeNull();
    await expect(
      transform('rsc', '/src/routes/_data/catalog.server.ts'),
    ).resolves.not.toBeNull();
  });
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
