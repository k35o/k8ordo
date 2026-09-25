import { mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { createBuilder } from 'vite';

import { engine } from '../plugin/core';

type Handler = (request: Request) => Promise<Response>;

const root = fileURLToPath(
  new URL('../../fixtures/bare-not-found/', import.meta.url),
);
const out = path.join(root, 'dist');

let runtimeDir = '';
let server: Server;
let browser: Browser;
let origin = '';

// 素の NotFound はビルドされたアプリの中にしか現れないので、テストが
// not-found.tsx を持たないアプリを実際にビルドする。ランタイムは dist では
// なくこのパッケージのソースを指し、直した runtime がそのまま試される
beforeAll(async () => {
  runtimeDir = await mkdtemp(path.join(tmpdir(), 'k8ordo-runtime-'));
  // 再エクスポートするだけの .mjs では、このパッケージの sideEffects: false
  // によって、何も export しない entry.browser が丸ごと落とされる。リンクなら
  // Vite が実体へ解決し、ソースそのものがエントリになる
  await Promise.all(
    ['entry.rsc', 'entry.ssr', 'entry.browser'].map((name) =>
      symlink(
        fileURLToPath(new URL(`./${name}.tsx`, import.meta.url)),
        path.join(runtimeDir, `${name}.mjs`),
      ),
    ),
  );

  const builder = await createBuilder({
    root,
    configFile: false,
    logLevel: 'error',
    plugins: [
      engine({ routesDir: 'routes' }, { via: '@k8ordo/server', runtimeDir }),
    ],
    environments: {
      rsc: { build: { outDir: path.join(out, 'rsc') } },
      ssr: { build: { outDir: path.join(out, 'ssr') } },
      client: { build: { outDir: path.join(out, 'client') } },
    },
  });
  await builder.buildApp();

  const { default: handler } = (await import(
    pathToFileURL(path.join(out, 'rsc', 'index.js')).href
  )) as { default: Handler };

  // ハッシュ付きの資産はファイルから、それ以外はハンドラが答える。
  // @k8ordo/server の serve と同じ分担
  const answer = async (url: URL): Promise<Response> => {
    if (!url.pathname.startsWith('/assets/')) return handler(new Request(url));
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
      outgoing.end(Buffer.from(await response.arrayBuffer()));
    })();
  });
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  origin = `http://127.0.0.1:${String((server.address() as AddressInfo).port)}`;
  browser = await chromium.launch();
}, 120_000);

afterAll(async () => {
  await browser.close();
  server.close();
  await rm(runtimeDir, { recursive: true, force: true });
  await rm(out, { recursive: true, force: true });
});

// hydrate する前のリンクは JS なしの文書の読み込みになり、クライアント遷移の
// 主張をすり抜ける。ブラウザでしか描かれない印が出たら、JS が握っている
const openHydrated = async (url: string): Promise<Page> => {
  const page = await browser.newPage();
  await page.goto(url);
  await page.getByText('hydrated').waitFor();
  return page;
};

const payloadRequests = (page: Page): string[] => {
  const pathnames: string[] = [];
  page.on('request', (request) => {
    const { pathname } = new URL(request.url());
    if (pathname.endsWith('.rsc')) pathnames.push(pathname);
  });
  return pathnames;
};

describe('an application that declares no not-found.tsx', () => {
  it('answers a URL no route matches with the framework’s own page, under a real 404', async () => {
    const page = await browser.newPage();

    const response = await page.goto(`${origin}/nowhere`);

    expect(response?.status()).toBe(404);
    await page.getByRole('heading', { name: '404' }).waitFor();
    // ルートレイアウトの中に描かれる: レイアウトのナビゲーションが残る
    await page.getByRole('link', { name: 'nowhere' }).waitFor();
    expect(await page.title()).toBe('Not found');
    await page.close();
  });

  it('shows that page when a client navigation reaches such a URL', async () => {
    const page = await openHydrated(origin);
    const requested = payloadRequests(page);

    await page.getByRole('link', { name: 'nowhere' }).click();

    await page.getByRole('heading', { name: '404' }).waitFor();
    expect(new URL(page.url()).pathname).toBe('/nowhere');
    // 文書の読み込みで行き着いたのではなく、クライアントがペイロードを取りに行った
    expect(requested).toStrictEqual(['/nowhere/index.rsc']);
    await page.close();
  });

  it('takes the visitor back to the page they left', async () => {
    const page = await openHydrated(origin);
    await page.getByRole('link', { name: 'nowhere' }).click();
    await page.getByRole('heading', { name: '404' }).waitFor();

    await page.goBack();

    await page.getByRole('heading', { name: 'home' }).waitFor();
    expect(new URL(page.url()).pathname).toBe('/');
    await page.close();
  });
});
