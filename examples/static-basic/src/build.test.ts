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

// 描画に失敗するページを持つ構成のビルド。止まることを主張するので、
// 先に走らせて stderr を取っておき、本物のビルドで dist を上書きする
let brokenBuildStderr = '';

// ひとつ前のデプロイの dist/client。アプリは同じで、クライアントの
// スクリプトだけが違う。タブを開いた後にデプロイがあった、を再現する
let previous = '';

// 主張の対象がビルド成果物そのものなので、テストがビルドを走らせる。
// 出力を読むだけにすると、何も書かなかったビルドと区別がつかない
beforeAll(() => {
  try {
    execFileSync(
      'pnpm',
      ['exec', 'vp', 'build', '--config', 'vite.broken.config.ts'],
      { cwd: root, stdio: 'pipe' },
    );
  } catch (error) {
    brokenBuildStderr = String((error as { stderr?: Buffer }).stderr ?? '');
  }
  // 圧縮しないだけで、スクリプトの中身とハッシュの入った名前が変わる
  execFileSync('pnpm', ['exec', 'vp', 'build', '--minify', 'false'], {
    cwd: root,
    stdio: 'pipe',
  });
  previous = mkdtempSync(path.join(tmpdir(), 'k8ordo-previous-'));
  cpSync(client, previous, { recursive: true });
  execFileSync('pnpm', ['exec', 'vp', 'build'], { cwd: root, stdio: 'pipe' });
}, 360_000);

afterAll(() => {
  rmSync(previous, { recursive: true, force: true });
});

const read = (...parts: string[]): string =>
  readFileSync(path.join(client, ...parts), 'utf8');

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
    expect(brokenBuildStderr).toContain('static build could not render /');
    expect(brokenBuildStderr).toContain('broken on purpose');
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
    // リダイレクトと not-found はページではない
    expect(xml).not.toContain('/old');
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

describe('a written page in the browser', () => {
  let server: Server;
  let browser: Browser;
  let origin = '';
  // ホストがいま配っているデプロイ
  let deployed = client;

  beforeAll(async () => {
    // 静的ホストと同じ規則で dist/client を配る: ディレクトリは index.html
    server = createServer((request, response) => {
      const { pathname } = new URL(request.url ?? '/', 'http://localhost');
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
