import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';

const root = path.resolve(import.meta.dirname, '..');
const client = path.join(root, 'dist', 'client');
// vite.base.config.ts が base: '/site/' で書くサイト
const underBase = path.join(root, 'dist', 'base', 'client');

// 描画に失敗するページ・not-found を持つ構成のビルド。止まることを主張する
// ので、先に走らせて stderr を取っておき、本物のビルドで dist を上書きする
let brokenPageStderr = '';
let brokenNotFoundStderr = '';
// 同じく、失敗するページの上に error.tsx も Suspense も無い構成
let noBoundaryStderr = '';
// guard.ts を置いた構成。ファイルには守るリクエストが無い
let guardStderr = '';
// notFound() と言うページのパスを列挙した構成
let notFoundPageStderr = '';
// GET 以外を export する route.ts を置いた構成
let routeStderr = '';

// ひとつ前のデプロイの dist/client。アプリは同じで、クライアントの
// スクリプトだけが違う。タブを開いた後にデプロイがあった、を再現する
let previous = '';

// 止まらなかったビルドは空の stderr を返し、止まることの主張で落ちる
const failingBuild = (config: string): string => {
  try {
    execFileSync('pnpm', ['exec', 'vp', 'build', '--config', config], {
      cwd: root,
      stdio: 'pipe',
    });
  } catch (error) {
    return String((error as { stderr?: Buffer }).stderr ?? '');
  }
  return '';
};

// 主張の対象がビルド成果物そのものなので、テストがビルドを走らせる。
// 出力を読むだけにすると、何も書かなかったビルドと区別がつかない
beforeAll(() => {
  brokenPageStderr = failingBuild('vite.broken.config.ts');
  brokenNotFoundStderr = failingBuild('vite.broken-not-found.config.ts');
  noBoundaryStderr = failingBuild('vite.broken-no-boundary.config.ts');
  guardStderr = failingBuild('vite.broken-guard.config.ts');
  notFoundPageStderr = failingBuild('vite.not-found-page.config.ts');
  routeStderr = failingBuild('vite.broken-route.config.ts');
  // 圧縮しないだけで、スクリプトの中身とハッシュの入った名前が変わる
  execFileSync('pnpm', ['exec', 'vp', 'build', '--minify', 'false'], {
    cwd: root,
    stdio: 'pipe',
  });
  previous = mkdtempSync(path.join(tmpdir(), 'k8ordo-previous-'));
  cpSync(client, previous, { recursive: true });
  execFileSync('pnpm', ['exec', 'vp', 'build'], { cwd: root, stdio: 'pipe' });
  // 既定のビルドが空にするのは dist/client などの各出力先だけなので、
  // dist/base/ は残る
  execFileSync(
    'pnpm',
    ['exec', 'vp', 'build', '--config', 'vite.base.config.ts'],
    { cwd: root, stdio: 'pipe' },
  );
}, 480_000);

afterAll(() => {
  rmSync(previous, { recursive: true, force: true });
});

const read = (...parts: string[]): string =>
  readFileSync(path.join(client, ...parts), 'utf8');

const readUnderBase = (...parts: string[]): string =>
  readFileSync(path.join(underBase, ...parts), 'utf8');

describe('the static build', () => {
  it('writes a page as HTML the server rendered', () => {
    const html = read('index.html');
    expect(html).toContain('rendered on the server');
    expect(html).toContain('home');
  });

  it("leaves a browser-only component's fallback in the HTML without stopping", () => {
    // `use(browser())` はビルドの失敗ではない: fallback が書かれ、本体は
    // ブラウザが hydrate 後に描く
    const html = read('index.html');
    expect(html).toContain('time zone: not yet');
    expect(html).not.toContain('time zone: Asia');
  });

  it('writes the same page as a payload beside it', () => {
    expect(read('index.rsc')).toContain('rendered on the server');
  });

  it('writes a page per supplied pathname, with its data', () => {
    expect(read('products', '1', 'index.html')).toContain('first product');
    expect(read('products', '2', 'index.html')).toContain('second product');
    expect(read('products', '1', 'index.rsc')).toContain('first product');
    // [id] のスキーマが通した値で、page は number を受け取る
    expect(read('products', '1', 'index.html')).toContain('number:1');
  });

  it('gives a route group its layout without a URL segment', () => {
    const html = read('guide', 'index.html');
    expect(html).toContain('docs-shell');
    expect(html).toContain('guide');
  });

  it('writes not-found.tsx as the file a host serves for an unknown URL', () => {
    expect(read('404.html')).toContain('not found');
  });

  it('stops, naming the page, when a page throws while rendering', () => {
    // error.tsx はブラウザでの失敗のためのもので、ビルド時の失敗は失敗のまま
    expect(brokenPageStderr).toContain('static build could not render /');
    expect(brokenPageStderr).toContain('broken on purpose');
  });

  it('stops, naming 404.html, when not-found.tsx throws while rendering', () => {
    expect(brokenNotFoundStderr).toContain(
      'static build could not render 404.html',
    );
    expect(brokenNotFoundStderr).toContain('not-found broken on purpose');
  });

  it('stops, naming the page, when a page throws with no boundary above it', () => {
    // 境界が無いと HTML の描画そのものが reject する。それでも境界があるときと
    // 同じく、ページ名を挙げて止まる
    expect(noBoundaryStderr).toContain('static build could not render /');
    expect(noBoundaryStderr).toContain('broken with no boundary above it');
  });

  it('stops, naming the page, when a client component throws in the HTML render with no boundary above it', () => {
    expect(noBoundaryStderr).toMatch(
      /static build could not render .*\/client\b/u,
    );
    // React 自身もこのエラーをログに出すので、ページの URL と並んだ行で
    // ハンドラが答えたメッセージだと確かめる
    expect(noBoundaryStderr).toMatch(
      /\/client — client component broken with no boundary above it/u,
    );
  });

  it('stops, naming 404.html, when not-found.tsx throws with no boundary above it', () => {
    expect(noBoundaryStderr).toMatch(
      /static build could not render .*404\.html/u,
    );
    expect(noBoundaryStderr).toContain(
      'not-found broken with no boundary above it',
    );
  });

  it('refuses guard.ts, naming every one and the mode that runs them', () => {
    expect(guardStderr).toContain(
      'static build cannot run guard.ts — a file has no request to guard, and these are guards:\n  src/routes-broken-guard/admin/guard.ts\n  src/routes-broken-guard/guard.ts\nthis application wants @k8ordo/server',
    );
  });

  it('stops, naming the pathname, when a page it was supplied for said notFound()', () => {
    expect(notFoundPageStderr).toContain(
      'the "paths" option supplied pathnames whose page called notFound(): /products/3',
    );
  });

  it('writes a route.ts as the file its GET answered, with the site as its origin', () => {
    const xml = read('feed.xml');
    expect(xml).toContain('<title>first product</title>');
    expect(xml).toContain('<link>https://example.test/products/1</link>');
    // ページではないので、ペイロードも index.html も無い
    expect(existsSync(path.join(client, 'feed.xml', 'index.rsc'))).toBe(false);
  });

  it('refuses a route.ts that answers a method a file cannot, naming it and the method', () => {
    expect(routeStderr).toContain(
      'static build writes a route.ts as the file its GET answers, and a file cannot answer another method — these export one:\n  src/routes-broken-route/api/route.ts (POST)',
    );
  });

  it('writes a redirect.ts as a page that sends the visitor on', () => {
    const html = read('old', 'index.html');
    expect(html).toContain('http-equiv="refresh"');
    expect(html).toContain('url=/products');
    expect(existsSync(path.join(client, 'old', 'index.rsc'))).toBe(false);
  });

  it('writes a sitemap of the pages it rendered, when told the origin', () => {
    const xml = read('sitemap.xml');
    expect(xml).toContain('<loc>https://example.test/</loc>');
    expect(xml).toContain('<loc>https://example.test/products/2</loc>');
    // リダイレクトと not-found と route.ts はページではない
    expect(xml).not.toContain('/old');
    expect(xml).not.toContain('feed.xml');
    expect(xml).not.toContain('404');
  });

  it('ships the client entry, so the page hydrates', () => {
    expect(read('index.html')).toMatch(/<script[^>]+type="module"/u);
  });
});

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.rsc': 'text/x-component; charset=utf-8',
};

describe('the static build under a base', () => {
  it('writes each page at its pathname in the table, beside its payload', () => {
    expect(existsSync(path.join(underBase, 'index.html'))).toBe(true);
    expect(existsSync(path.join(underBase, 'index.rsc'))).toBe(true);
    expect(existsSync(path.join(underBase, 'products', '1', 'index.rsc'))).toBe(
      true,
    );
  });

  it('links and loads scripts under the base', () => {
    const html = readUnderBase('products', 'index.html');
    expect(html).toContain('href="/site/products/1"');
    expect(html).toMatch(/src="\/site\/assets\/[^"]+\.js"/u);
  });

  it('lists each page in the sitemap at its URL under the base', () => {
    expect(readUnderBase('sitemap.xml')).toContain(
      '<loc>https://example.test/site/products/1</loc>',
    );
  });

  it('sends a redirect.ts on to its target under the base', () => {
    expect(readUnderBase('old', 'index.html')).toContain('url=/site/products');
  });
});

describe('a written page in the browser', () => {
  let server: Server;
  let browser: Browser;
  let origin = '';
  // ホストがいま配っているデプロイと、それを置いている場所（Vite の base）
  let deployed = client;
  let mountedAt = '/';

  beforeAll(async () => {
    // 静的ホストと同じ規則で dist/client を配る: ディレクトリは index.html
    server = createServer((request, response) => {
      const { pathname: requested } = new URL(
        request.url ?? '/',
        'http://localhost',
      );
      if (!requested.startsWith(mountedAt)) {
        response.writeHead(404).end();
        return;
      }
      const pathname = `/${requested.slice(mountedAt.length)}`;
      const file = path.join(
        deployed,
        path.extname(pathname) === ''
          ? path.join(pathname, 'index.html')
          : pathname,
      );
      const relative = path.relative(deployed, file);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        response.writeHead(404).end();
        return;
      }
      readFile(file).then(
        (body) =>
          response
            .writeHead(200, {
              'content-type':
                CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream',
            })
            .end(body),
        () => response.writeHead(404).end(),
      );
    });
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    origin = `http://127.0.0.1:${String((server.address() as AddressInfo).port)}`;
    browser = await chromium.launch();
  }, 60_000);

  afterAll(async () => {
    await browser.close();
    server.close();
  });

  afterEach(() => {
    deployed = client;
    mountedAt = '/';
  });

  // hydrate するまでのリンクは、JS なしのただの文書の読み込みになって
  // 主張をすり抜ける。ブラウザでしか描かれない部分が出たら、JS が握っている
  const openHydrated = async (url: string): Promise<Page> => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.getByText(/time zone: (?!not yet)/u).waitFor();
    // 文書の読み込みが起きれば window ごと入れ替わり、この印は消える
    await page.evaluate(() => {
      Object.assign(window, { stayed: true });
    });
    return page;
  };

  it('moves to the next page in place while the tab runs the deploy the host serves', async () => {
    const page = await openHydrated(origin);

    await page.getByRole('link', { name: 'products', exact: true }).click();

    await page.getByRole('heading', { name: 'products' }).waitFor();
    expect(await page.evaluate(() => 'stayed' in window)).toBe(true);
    await page.close();
  });

  it('loads the next page as a document once a deploy has changed the client since the tab opened', async () => {
    deployed = previous;
    const page = await openHydrated(origin);
    deployed = client;

    await page.getByRole('link', { name: 'products', exact: true }).click();

    await page.getByRole('heading', { name: 'products' }).waitFor();
    expect(new URL(page.url()).pathname).toBe('/products');
    expect(await page.evaluate(() => 'stayed' in window)).toBe(false);
    await page.close();
  });

  it('moves to the next page in place when the site sits under a base', async () => {
    deployed = underBase;
    mountedAt = '/site/';
    const page = await openHydrated(`${origin}/site/`);

    await page.getByRole('link', { name: 'products', exact: true }).click();

    await page.getByRole('heading', { name: 'products' }).waitFor();
    expect(new URL(page.url()).pathname).toBe('/site/products');
    expect(await page.evaluate(() => 'stayed' in window)).toBe(true);
    await page.close();
  });

  it('hydrates in place, leaving no hidden copy of the page and one <title>', async () => {
    // ダークの訪問者: ルートの SchemeProvider の値が hydrate の直後に変わる
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    // 裏のタブで開かれたページとして読む。ブラウザはアニメーションフレームを
    // 回さないので、フレームを待って本文を差し込む HTML なら、それは起きない
    await page.addInitScript(() => {
      window.requestAnimationFrame = () => 0;
    });
    // 商品ページはディスクを読んで待つので、境界がシェルより遅れて完了する
    await page.goto(`${origin}/products/1`);
    await page.getByText('scheme: dark').waitFor();

    expect({
      hiddenSegments: await page.locator('div[hidden][id^="S:"]').count(),
      titles: await page.locator('title').count(),
      headings: await page.getByTestId('title').count(),
    }).toStrictEqual({ hiddenSegments: 0, titles: 1, headings: 1 });
    await context.close();
  });
});
