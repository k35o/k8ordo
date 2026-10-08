import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { chromium, firefox, webkit } from 'playwright';
import type { Browser, Page } from 'playwright';
import { preview } from 'vite';
import type { PreviewServer } from 'vite';

const root = path.resolve(import.meta.dirname, '..');
const client = path.join(root, 'dist', 'client');
// vite.base.config.ts が base: '/site/' で書くサイト
const underBase = path.join(root, 'dist', 'base', 'client');

// CI はエンジンごとにジョブを分けて並べるので、TEST_BROWSER で 1 つに絞れる
const browserTypes = [chromium, firefox, webkit]
  .filter(
    (type) =>
      process.env.TEST_BROWSER === undefined ||
      process.env.TEST_BROWSER === type.name(),
  )
  .map((type) => ({ name: type.name(), type }));

// 描画に失敗するページ・not-found を持つ構成のビルド。止まることを主張する
// ので、先に走らせて stderr を取っておき、本物のビルドで dist を上書きする
let brokenPageStderr = '';
let brokenNotFoundStderr = '';
// 同じく、失敗するページの上に error.tsx も Suspense も無い構成
let noBoundaryStderr = '';
// guard.ts を置いた構成。ファイルには守るリクエストが無い
let guardStderr = '';
// notFound() と言うページのパスと、スキーマが拒むパスを列挙した構成
let notFoundPageStderr = '';
// その構成のビルドが止まったあと、dist/client に残っていたもの
let leftByNotFoundPage: string[] = [];
// GET 以外を export する route.ts を置いた構成
let routeStderr = '';
// search を読むと宣言したページを置いた構成
let searchStderr = '';
// リクエストの API を import したページを置いた構成
let requestStderr = '';
// 渡されたパターンをそのまま paths に返す構成
let pathsStderr = '';
// 本物のビルドが最後に言ったこと
let builtLog = '';

// ひとつ前のデプロイの dist/client。アプリは同じで、クライアントの
// スクリプトだけが違う。タブを開いた後にデプロイがあった、を再現する
let previous = '';

// vitest は NODE_ENV=test を置き、子プロセスのビルドもそれを継いで React の
// 開発版を積む。主張の対象は配る成果物なので、本番のビルドにする
const BUILD = {
  cwd: root,
  stdio: 'pipe',
  env: { ...process.env, NODE_ENV: 'production' },
} as const;

// 止まらなかったビルドは空の stderr を返し、止まることの主張で落ちる
const failingBuild = (config: string): string => {
  try {
    execFileSync('pnpm', ['exec', 'vp', 'build', '--config', config], BUILD);
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
  leftByNotFoundPage = ['3', 'x'].filter((id) =>
    existsSync(path.join(client, 'products', id)),
  );
  routeStderr = failingBuild('vite.broken-route.config.ts');
  searchStderr = failingBuild('vite.broken-search.config.ts');
  requestStderr = failingBuild('vite.broken-request.config.ts');
  pathsStderr = failingBuild('vite.broken-paths.config.ts');
  // 圧縮しないだけで、スクリプトの中身とハッシュの入った名前が変わる
  execFileSync('pnpm', ['exec', 'vp', 'build', '--minify', 'false'], BUILD);
  previous = mkdtempSync(path.join(tmpdir(), 'k8ordo-previous-'));
  cpSync(client, previous, { recursive: true });
  builtLog = String(execFileSync('pnpm', ['exec', 'vp', 'build'], BUILD));
  // 既定のビルドが空にするのは dist/client などの各出力先だけなので、
  // dist/base/ は残る
  execFileSync(
    'pnpm',
    ['exec', 'vp', 'build', '--config', 'vite.base.config.ts'],
    BUILD,
  );
}, 480_000);

afterAll(() => {
  rmSync(previous, { recursive: true, force: true });
});

// <head> の先頭に置かれた <meta> のポリシー。無ければ空
const policyFirstIn = (html: string): string =>
  (
    /^<!DOCTYPE html><html[^>]*><head><meta http-equiv="Content-Security-Policy" content="([^"]*)">/u.exec(
      html,
    )?.[1] ?? ''
  ).replaceAll('&apos;', "'");

// src を持たないスクリプトの中身
const inlineScriptsIn = (html: string): string[] =>
  [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script[\s/>]/giu)]
    .filter(([, attributes = '']) => !attributes.includes('src='))
    .map(([, , source = '']) => source);

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

  it('writes a page under a loading.tsx whole, without the fallback', () => {
    const html = read('products', 'index.html');
    expect(html).toContain('first product');
    // フォールバックは埋め込んだペイロードには載るが、描かれてはいない
    expect(html).not.toContain('<p data-testid="loading">');
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
      "static build cannot run guard.ts — a file has no request to guard, and these are guards:\n  src/routes-broken-guard/admin/guard.ts\n  src/routes-broken-guard/guard.ts\nthis application wants mode: 'server'",
    );
  });

  it('stops, naming the pathname, when a page it was supplied for said notFound()', () => {
    expect(notFoundPageStderr).toContain(
      'the "paths" option supplied pathnames whose page called notFound(): /products/3',
    );
  });

  it('names a pathname a schema refused in the same error as one whose page said notFound()', () => {
    expect(notFoundPageStderr).toContain(
      'the "paths" option supplied pathnames a params schema refused: /products/x\n\nthe "paths" option supplied pathnames whose page called notFound(): /products/3',
    );
  });

  it('writes nothing for a supplied pathname that turned out not to be a page', () => {
    expect(leftByNotFoundPage).toStrictEqual([]);
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

  it('refuses a route.ts that re-exports with export *, whose methods it cannot read', () => {
    expect(routeStderr).toContain(
      "static build reads a route.ts's methods and a page's search by name, and export * names none of them — this re-exports another module whole:\n  src/routes-broken-route/feed/route.ts\n",
    );
  });

  it('refuses a page that reads the search, naming it', () => {
    expect(searchStderr).toContain(
      "static build cannot hand a page the search — a file is the same for every search, and these pages export search:\n  src/routes-broken-search/products/page.tsx\nthis application wants mode: 'server'",
    );
  });

  it('refuses the request API, naming every module that imports it', () => {
    expect(requestStderr).toContain(
      "static build cannot answer a request — a file is written once for every visitor, and these import @k8ordo/framework/server:\n  src/broken-parts/request/home.ts\n  src/broken-parts/request/visits.ts\n  src/routes-broken-request/page.tsx\nthis application wants mode: 'server'",
    );
  });

  it('lets an `import type` of the request API through, since nothing of it is loaded', () => {
    expect(read('old', 'index.html')).toContain('url=/products');
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
    expect(xml).toContain('<loc>https://example.test/ja/about</loc>');
    expect(xml).toContain('<loc>https://example.test/en/posts/1</loc>');
    // リダイレクトと not-found と route.ts はページではない。殻もビルドが
    // 見なかった値の代わりで、URL ではない
    expect(xml).not.toContain('/old');
    expect(xml).not.toContain('/posts/first');
    expect(xml).not.toContain('feed.xml');
    expect(xml).not.toContain('404');
    expect(xml).not.toContain('fallback');
  });

  it.each([
    ['en', 'loading the post…'],
    ['ja', '記事を読み込んでいます…'],
  ])(
    'writes the shell for /%s/posts/:id in its locale, the body left to the browser',
    (locale, loading) => {
      const html = read(locale, 'posts', '!fallback', 'index.html');
      expect(html).toMatch(new RegExp(`<html[^>]* lang="${locale}"`, 'u'));
      expect(html).toContain(`<p data-testid="shell">${loading}</p>`);
      expect(html).not.toContain('<h1');
      expect(read(locale, 'posts', '!fallback', 'index.rsc')).toContain(
        'not found',
      );
    },
  );

  it('writes the values paths lists with their page, and no other', () => {
    expect(read('en', 'posts', '1', 'index.html')).toContain(
      '<h1 data-testid="title">first post</h1>',
    );
    expect(read('ja', 'posts', '2', 'index.rsc')).toContain('second post');
    expect(existsSync(path.join(client, 'en', 'posts', '3'))).toBe(false);
  });

  it('writes a redirect.ts beside the shell as a page with no payload', () => {
    expect(read('en', 'posts', 'first', 'index.html')).toContain(
      'url=/en/posts/1',
    );
    expect(
      existsSync(path.join(client, 'en', 'posts', 'first', 'index.rsc')),
    ).toBe(false);
  });

  it('writes _redirects: the built URLs a shell rule would catch, then the shells', () => {
    expect(read('_redirects')).toBe(REDIRECTS);
  });

  it('says what it wrote, the shells by location', () => {
    expect(builtLog).toContain(
      'k8ordo: wrote 16 routes, 2 shells (/en/posts/:id, /ja/posts/:id) and 404.html and sitemap.xml and _redirects',
    );
  });

  it('stops before rendering, naming each pathname that still holds a parameter no shell takes', () => {
    expect(pathsStderr).toContain(
      'the "paths" option supplied pathnames that still hold a parameter, and only a page with a fallback.tsx beside it takes one: /products/:id (products/[id]/page.tsx has none), /:locale/about ([locale]/about/page.tsx has none), /:locale/posts/first ([locale]/posts/first/redirect.ts cannot have one)',
    );
    expect(pathsStderr).toContain(
      'the "paths" option supplied shell locations that leave out a parameter a layout above their fallback.tsx receives: /:locale/posts/:id (:locale, received by [locale]/layout.tsx)',
    );
  });

  it.each([
    'index.html',
    'products/1/index.html',
    '404.html',
    'en/posts/!fallback/index.html',
  ])(
    'writes the application’s policy first in the <head> of %s, naming each inline script by hash',
    (file) => {
      const html = read(file);
      const policy = policyFirstIn(html);
      expect(policy).toMatch(
        /^script-src 'self'( 'sha256-[A-Za-z0-9+/]{43}=')+; object-src 'none'; base-uri 'none'$/u,
      );
      const inline = inlineScriptsIn(html);
      // color-scheme と、書き込んだペイロード
      expect(inline.length).toBeGreaterThanOrEqual(2);
      for (const source of inline) {
        expect(policy).toContain(
          `'sha256-${createHash('sha256').update(source).digest('base64')}'`,
        );
      }
    },
  );

  it.each([
    ['en', 'about the shop', 'Open since September 1, 2026.'],
    ['ja', 'このお店について', '2026年9月2日から営業しています。'],
  ])(
    'writes /%s/about in that locale, its dates in the locale’s time zone',
    (locale, title, opened) => {
      const html = read(locale, 'about', 'index.html');
      expect(html).toMatch(new RegExp(`<html[^>]* lang="${locale}"`, 'u'));
      expect(html).toContain(`<h1 data-testid="title">${title}</h1>`);
      expect(html).toContain(opened);
    },
  );

  it('writes the product list whole: a file is the same whatever the search', () => {
    const html = read('products', 'index.html');
    expect(html).toContain('first product');
    expect(html).toContain('second product');
  });

  it('leaves no nonce in what it writes: a file everyone reads cannot keep one', () => {
    for (const file of ['index.html', 'index.rsc', '404.html']) {
      expect(read(file)).not.toContain('nonce');
    }
  });

  it('ships the client entry, so the page hydrates', () => {
    expect(read('index.html')).toMatch(/<script[^>]+type="module"/u);
  });
});

// 書かれるはずの _redirects。ホストの規則の形そのものが主張なので、行ごとに書く
const REDIRECTS = [
  '# @k8ordo/framework: built URLs the rules below would also catch',
  '/en/posts/1 /en/posts/1 200',
  '/en/posts/1/index.rsc /en/posts/1/index.rsc 200',
  '/en/posts/2 /en/posts/2 200',
  '/en/posts/2/index.rsc /en/posts/2/index.rsc 200',
  '/en/posts/first /en/posts/first 200',
  '/en/posts/first/index.rsc /en/posts/!fallback/ 200',
  '/ja/posts/1 /ja/posts/1 200',
  '/ja/posts/1/index.rsc /ja/posts/1/index.rsc 200',
  '/ja/posts/2 /ja/posts/2 200',
  '/ja/posts/2/index.rsc /ja/posts/2/index.rsc 200',
  '/ja/posts/first /ja/posts/first 200',
  '/ja/posts/first/index.rsc /ja/posts/!fallback/ 200',
  "# @k8ordo/framework: values the build did not write, answered by their fallback.tsx's shell",
  '/en/posts/:p1 /en/posts/!fallback/ 200',
  '/ja/posts/:p1 /ja/posts/!fallback/ 200',
  '/en/posts/:p1/index.rsc /en/posts/!fallback/index.rsc 200',
  '/ja/posts/:p1/index.rsc /ja/posts/!fallback/index.rsc 200',
  '',
].join('\n');

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
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

  it('writes every rule of _redirects with the base in front of both sides', () => {
    expect(readUnderBase('_redirects')).toBe(
      REDIRECTS.replaceAll(/^\/|(?<= )\//gmu, '/site/'),
    );
  });
});

// 書かれたファイルごとの中身のハッシュ
const filesIn = (dir: string): Map<string, string> =>
  new Map(
    readdirSync(dir, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const file = path.join(entry.parentPath, entry.name);
        return [
          path.relative(dir, file),
          createHash('sha256').update(readFileSync(file)).digest('hex'),
        ] as const;
      })
      .toSorted(([a], [b]) => a.localeCompare(b)),
  );

// アプリを一時ディレクトリに写す。設定はトップレベルの await を使うので、
// CommonJS のアプリがそうするように .mts で置く
const copyApp = (): string => {
  const app = mkdtempSync(path.join(tmpdir(), 'k8ordo-app-'));
  cpSync(path.join(root, 'vite.config.ts'), path.join(app, 'vite.config.mts'));
  cpSync(path.join(root, 'src'), path.join(app, 'src'), {
    recursive: true,
    filter: (source) => !source.endsWith('.test.ts'),
  });
  symlinkSync(path.join(root, 'node_modules'), path.join(app, 'node_modules'));
  return app;
};

const buildIn = (app: string, ...args: string[]): void => {
  execFileSync(
    path.join(root, 'node_modules', '.bin', 'vp'),
    ['build', ...args],
    { ...BUILD, cwd: app },
  );
};

describe('an application whose package.json does not say type: module', () => {
  let app = '';

  // type の無い package.json を Node は CommonJS と読み、Vite は入口を
  // .mjs で書く。type の有無だけを変えて 2 度組む。dist と比べないのは、
  // クライアント参照の名前が root からのパスで決まり、置き場所が変わるだけで
  // 中身が変わるから
  beforeAll(() => {
    app = copyApp();
    const { type: _type, ...untyped } = JSON.parse(
      readFileSync(path.join(root, 'package.json'), 'utf8'),
    ) as Record<string, unknown>;
    const buildAs = (manifest: Record<string, unknown>): void => {
      writeFileSync(path.join(app, 'package.json'), JSON.stringify(manifest));
      buildIn(app);
    };
    buildAs({ ...untyped, type: 'module' });
    renameSync(path.join(app, 'dist'), path.join(app, 'dist-module'));
    buildAs(untyped);
  }, 120_000);

  afterAll(() => {
    rmSync(app, { recursive: true, force: true });
  });

  it('writes the same files as when it says it', () => {
    expect(filesIn(path.join(app, 'dist', 'client'))).toStrictEqual(
      filesIn(path.join(app, 'dist-module', 'client')),
    );
  });
});

describe('an application whose rsc build is a directory beside its package.json', () => {
  let app = '';
  let manifest = '';
  let stderr = '';

  // rsc と ssr が出会うのはアプリのルートで、そこにある package.json は
  // アプリのもの
  beforeAll(() => {
    app = copyApp();
    manifest = readFileSync(path.join(root, 'package.json'), 'utf8');
    writeFileSync(path.join(app, 'package.json'), manifest);
    writeFileSync(
      path.join(app, 'vite.rsc-beside.config.mts'),
      [
        "import { mergeConfig } from 'vite';",
        '',
        "import config from './vite.config.mts';",
        '',
        'export default mergeConfig(config, {',
        "  environments: { rsc: { build: { outDir: 'build-rsc' } } },",
        '});',
        '',
      ].join('\n'),
    );
    try {
      buildIn(app, '--config', 'vite.rsc-beside.config.mts');
    } catch (error) {
      stderr = String((error as { stderr?: Buffer }).stderr ?? '');
    }
  }, 120_000);

  afterAll(() => {
    rmSync(app, { recursive: true, force: true });
  });

  it('stops, naming where the two builds meet', () => {
    expect(stderr).toContain(
      'the rsc and ssr builds share ., which holds the application',
    );
  });

  it("leaves the application's package.json as it was", () => {
    expect(readFileSync(path.join(app, 'package.json'), 'utf8')).toBe(manifest);
  });
});

// _redirects の 200 の行。フレームワークの読み手は使わず、書かれたファイルを
// ここで独立に読む。食い違えば、ホストが読むのと違うものをビルドが書いている
type Rule = { readonly from: string; readonly to: string };

const rulesIn = (dir: string): Rule[] => {
  const file = path.join(dir, '_redirects');
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))
    .map((line) => line.split(/\s+/u))
    .filter((fields) => fields[2] === '200')
    .map(([from = '', to = '']) => ({ from, to }));
};

// Cloudflare がプレースホルダと読むもの: : と英字
const PLACEHOLDER = /:[A-Za-z]\w*/u;

const segmentsOf = (url: string): string[] =>
  (url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url).split('/');

// Netlify: :name は 1 区切り、末尾の / は見ない
const netlifyMatches = (from: string, pathname: string): boolean => {
  const wanted = segmentsOf(from);
  const given = segmentsOf(pathname);
  return (
    wanted.length === given.length &&
    wanted.every((segment, index) =>
      segment.startsWith(':') ? given[index] !== '' : segment === given[index],
    )
  );
};

// Cloudflare: 前後を固定し、:name は 1 区切り、末尾の / も区別する
const cloudflareMatches = (from: string, pathname: string): boolean =>
  new RegExp(
    `^${from
      .split(/(:[A-Za-z]\w*)/u)
      .map((part, index) => (index % 2 === 0 ? RegExp.escape(part) : '[^/]+'))
      .join('')}$`,
    'u',
  ).test(pathname);

const isFile = (file: string): boolean =>
  existsSync(file) && statSync(file).isFile();

const pathnameOf = (page: Page): string => new URL(page.url()).pathname;

// 文書の読み込みが起きていなければ、ページに付けた印が残っている
const stayed = (page: Page): Promise<boolean> =>
  page.evaluate(() => 'stayed' in window);

describe.each(browserTypes)('a written page in $name', ({ type }) => {
  let server: Server;
  let browser: Browser;
  let origin = '';
  // ホストがいま配っているデプロイと、それを置いている場所（Vite の base）
  let deployed = client;
  let mountedAt = '/';
  // ホストの _redirects の読み方。既定は Netlify、真なら Cloudflare の
  // Workers static assets（html_handling は既定の auto-trailing-slash）
  let cloudflare = false;
  // _redirects からペイロードの規則（index.rsc の行）を除いて読む
  let withoutPayloadRules = false;
  // ホストが受けた要求の pathname
  let requested: string[] = [];

  beforeAll(async () => {
    server = createServer((request, response) => {
      const url = new URL(request.url ?? '/', 'http://localhost');
      requested.push(url.pathname);
      type Answer = {
        readonly status: number;
        readonly file?: string;
        readonly location?: string;
      };
      // base の下の URL が名指すファイル。base の外とディレクトリの外は無い
      const fileFor = (pathname: string): string | null => {
        if (!pathname.startsWith(mountedAt)) return null;
        let decoded: string;
        try {
          decoded = decodeURIComponent(pathname.slice(mountedAt.length));
        } catch {
          return null;
        }
        const file = path.join(deployed, decoded);
        const relative = path.relative(deployed, file);
        return relative.startsWith('..') || path.isAbsolute(relative)
          ? null
          : file;
      };
      const notFound = (): Answer => {
        const page = path.join(deployed, '404.html');
        return isFile(page) ? { status: 404, file: page } : { status: 404 };
      };
      const rules = rulesIn(deployed).filter(
        (rule) => !withoutPayloadRules || !rule.from.endsWith('/index.rsc'),
      );

      // Netlify: ファイル（ディレクトリは index.html）が先、無ければ最初に
      // 合う規則の宛先、それも無ければ 404.html
      const netlify = (): Answer => {
        const served = (pathname: string): string | null => {
          const file = fileFor(pathname);
          if (file === null) return null;
          if (isFile(file)) return file;
          const index = path.join(file, 'index.html');
          return isFile(index) ? index : null;
        };
        const own = served(url.pathname);
        if (own !== null) return { status: 200, file: own };
        const rule = rules.find(({ from }) =>
          netlifyMatches(from, url.pathname),
        );
        const target = rule === undefined ? null : served(rule.to);
        return target === null ? notFound() : { status: 200, file: target };
      };

      // Cloudflare: 規則がファイルより先。静的な規則を pathname そのもので
      // 引き、次に動的な規則を順に。宛先は区切りごとに符号化し直して、綴りが
      // 変われば 307。宛先にもそうでない URL にも auto-trailing-slash が効く
      const cloudflareAnswer = (): Answer => {
        const firstDynamic = rules.findIndex(({ from }) =>
          PLACEHOLDER.test(from),
        );
        const statics =
          firstDynamic === -1 ? rules : rules.slice(0, firstDynamic);
        const dynamics = firstDynamic === -1 ? [] : rules.slice(firstDynamic);
        const rule =
          statics.find(({ from }) => from === url.pathname) ??
          dynamics.find(({ from }) => cloudflareMatches(from, url.pathname));
        const asset = (pathname: string): Answer => {
          const file = fileFor(pathname);
          if (file === null) return notFound();
          if (pathname.endsWith('/')) {
            const index = path.join(file, 'index.html');
            return isFile(index) ? { status: 200, file: index } : notFound();
          }
          if (isFile(file)) return { status: 200, file };
          if (isFile(path.join(file, 'index.html'))) {
            return { status: 307, location: `${pathname}/${url.search}` };
          }
          return notFound();
        };
        if (rule === undefined) return asset(url.pathname);
        const canonical = rule.to
          .split('/')
          .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
          .join('/');
        return canonical === rule.to
          ? asset(rule.to)
          : { status: 307, location: `${canonical}${url.search}` };
      };

      const answer = cloudflare ? cloudflareAnswer() : netlify();
      if (answer.location !== undefined) {
        response.writeHead(answer.status, { location: answer.location }).end();
        return;
      }
      if (answer.file === undefined) {
        response.writeHead(answer.status).end();
        return;
      }
      response
        .writeHead(answer.status, {
          'content-type':
            CONTENT_TYPES[path.extname(answer.file)] ??
            'application/octet-stream',
        })
        .end(readFileSync(answer.file));
    });
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    origin = `http://127.0.0.1:${String((server.address() as AddressInfo).port)}`;
    browser = await type.launch();
  }, 60_000);

  afterAll(async () => {
    await browser.close();
    server.close();
  });

  afterEach(() => {
    deployed = client;
    mountedAt = '/';
    cloudflare = false;
    withoutPayloadRules = false;
    requested = [];
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

  it('runs under the policy its <meta> states: nothing refused, through hydration and a navigation', async () => {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      const refused: string[] = [];
      Object.assign(window, { refused });
      document.addEventListener('securitypolicyviolation', (event) => {
        refused.push(`${event.effectiveDirective} ${event.blockedURI}`);
      });
    });
    await page.goto(origin);
    await page.getByText(/time zone: (?!not yet)/u).waitFor();

    await page.getByRole('link', { name: 'product 1' }).click();
    await page.getByTestId('product-id').getByText('number:1').waitFor();
    // 違反の知らせは後のタスクで届くので、ひと巡り待ってから読む
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 0);
        }),
    );

    expect(
      await page.evaluate(
        () => (window as unknown as { refused: string[] }).refused,
      ),
    ).toStrictEqual([]);
    await page.close();
  });

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

  it('filters the product list by the search once it runs in the browser', async () => {
    const page = await browser.newPage();

    await page.goto(`${origin}/products?q=second`);

    await expect
      .poll(
        () => page.getByTestId('list').getByRole('listitem').allTextContents(),
        {
          timeout: 10_000,
        },
      )
      .toStrictEqual(['second product']);
    expect(await page.getByLabel('filter').inputValue()).toBe('second');
    await page.close();
  });

  it('moves the search in place when the filter form is submitted', async () => {
    const page = await openHydrated(origin);
    await page.getByRole('link', { name: 'products', exact: true }).click();
    await page.getByRole('heading', { name: 'products' }).waitFor();

    await page.getByLabel('filter').fill('first');
    await page.getByRole('button', { name: 'filter' }).click();

    await expect
      .poll(() =>
        page.getByTestId('list').getByRole('listitem').allTextContents(),
      )
      .toStrictEqual(['first product']);
    expect(new URL(page.url()).search).toBe('?q=first');
    expect(await page.evaluate(() => 'stayed' in window)).toBe(true);
    await page.close();
  });

  it('hydrates a page written in ja without a mismatch: the browser reads the locale the URL names', async () => {
    const page = await browser.newPage();
    const thrown: string[] = [];
    const logged: string[] = [];
    page.on('pageerror', (error) => thrown.push(error.message));
    page.on('console', (message) => {
      logged.push(`${message.type()}: ${message.text()}`);
    });

    await page.goto(`${origin}/ja/about`);
    await page.getByText(/time zone: (?!not yet)/u).waitFor();

    // 本文の食い違いなら、本番の React もエラーを出してクライアントで描き直す
    expect({
      select: await page.getByRole('combobox', { name: '言語' }).count(),
      thrown,
      errors: logged.filter((line) => line.startsWith('error:')),
    }).toStrictEqual({ select: 1, thrown: [], errors: [] });
    await page.close();
  });

  it('moves to the same page in another locale in place, <html lang> with it', async () => {
    const page = await openHydrated(`${origin}/en/about`);

    await page.getByLabel('language').selectOption('ja');

    await page.getByRole('heading', { name: 'このお店について' }).waitFor();
    expect({
      pathname: new URL(page.url()).pathname,
      lang: await page.evaluate(() => document.documentElement.lang),
      opened: await page.getByTestId('opened').textContent(),
      stayed: await page.evaluate(() => 'stayed' in window),
    }).toStrictEqual({
      pathname: '/ja/about',
      lang: 'ja',
      opened: '2026年9月2日から営業しています。',
      stayed: true,
    });
    await page.close();
  });

  it('keeps the scheme the toggle stores, and the next load starts from it before any module runs', async () => {
    const page = await openHydrated(origin);
    await page.getByRole('button', { name: 'scheme: light' }).click();
    await page.getByRole('button', { name: 'scheme: dark' }).waitFor();

    // モジュールを止めて読み直す。<html> に dark を付けられるのは、ポリシーが
    // ハッシュで許したインラインスクリプトだけになる
    await page.route('**/*.js', (route) => route.abort());
    await page.reload();

    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      ),
    ).toBe(true);
    await page.close();
  });

  it('hydrates in place, leaving no hidden copy of the page and one <title>', async () => {
    // ダークの訪問者: ColorSchemeProvider の値が hydrate の直後に変わる
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

  // 殻の本文はブラウザでしか描かれない。見出しが出たら JS が握っている
  const openShell = async (url: string, heading: string): Promise<Page> => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.getByRole('heading', { name: heading }).waitFor();
    await page.evaluate(() => {
      Object.assign(window, { stayed: true });
    });
    return page;
  };

  describe('a value the build did not write', () => {
    it('is answered with its shell, whose body the browser reads from the URL, in the locale the build wrote', async () => {
      const page = await browser.newPage();

      const response = await page.goto(`${origin}/ja/posts/3`);
      await page.getByRole('heading', { name: 'third post' }).waitFor();

      expect({
        status: response?.status(),
        pathname: pathnameOf(page),
        lang: await page.evaluate(() => document.documentElement.lang),
        title: await page.title(),
        loading: await page.getByText('記事を読み込んでいます…').count(),
      }).toStrictEqual({
        status: 200,
        pathname: '/ja/posts/3',
        lang: 'ja',
        title: 'third post',
        loading: 0,
      });
      await page.close();
    });

    it('leaves a built value to its own file, rendered on the server', async () => {
      const html = await (await fetch(`${origin}/en/posts/1`)).text();

      expect(html).toContain('<h1 data-testid="title">first post</h1>');
      expect(html).not.toContain('data-testid="shell"');
    });

    it('is reached in place from a built page', async () => {
      const page = await openHydrated(`${origin}/en/posts/1`);

      await page.getByRole('link', { name: 'post 3', exact: true }).click();

      await page.getByRole('heading', { name: 'third post' }).waitFor();
      expect(pathnameOf(page)).toBe('/en/posts/3');
      expect(await stayed(page)).toBe(true);
      await page.close();
    });

    it('that names no post shows the not-found in place, under the 200 the file was served with', async () => {
      const page = await browser.newPage();
      const thrown: string[] = [];
      const logged: string[] = [];
      page.on('pageerror', (error) => thrown.push(error.message));
      page.on('console', (message) => {
        logged.push(`${message.type()}: ${message.text()}`);
      });

      const response = await page.goto(`${origin}/en/posts/999`);
      await page.getByRole('heading', { name: 'not found' }).waitFor();

      expect({
        status: response?.status(),
        pathname: pathnameOf(page),
        thrown,
        errors: logged.filter((line) => line.startsWith('error:')),
      }).toStrictEqual({
        status: 200,
        pathname: '/en/posts/999',
        thrown: [],
        errors: [],
      });
      await page.close();
    });

    it('that names no post shows the not-found in place after a navigation', async () => {
      const page = await openHydrated(`${origin}/en/posts/1`);

      await page.getByRole('link', { name: 'post 999', exact: true }).click();

      await page.getByRole('heading', { name: 'not found' }).waitFor();
      expect(pathnameOf(page)).toBe('/en/posts/999');
      expect(await stayed(page)).toBe(true);
      await page.close();
    });

    it('comes back from the not-found on back, read from the URL again', async () => {
      const page = await openShell(`${origin}/en/posts/3`, 'third post');
      await page.getByRole('link', { name: 'post 999', exact: true }).click();
      await page.getByRole('heading', { name: 'not found' }).waitFor();

      await page.goBack();

      await page.getByRole('heading', { name: 'third post' }).waitFor();
      expect(pathnameOf(page)).toBe('/en/posts/3');
      expect(await stayed(page)).toBe(true);
      await page.close();
    });

    it('never shows a not-found or an error while the visitor leaves it for another page', async () => {
      const page = await openShell(`${origin}/en/posts/3`, 'third post');
      // URL は次のページが届く前に変わる。その間に出た見出しと error.tsx を
      // すべて記録する
      await page.evaluate(() => {
        const seen = { headings: [] as string[], errors: 0 };
        Object.assign(window, { seen });
        new MutationObserver(() => {
          for (const heading of document.querySelectorAll('h1')) {
            seen.headings.push(heading.textContent);
          }
          seen.errors += document.querySelectorAll(
            '[data-testid="route-error"]',
          ).length;
        }).observe(document.documentElement, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      });

      await page.getByRole('link', { name: 'about', exact: true }).click();

      await page.getByRole('heading', { name: 'about the shop' }).waitFor();
      const seen = await page.evaluate(
        () =>
          (
            window as unknown as {
              seen: { headings: string[]; errors: number };
            }
          ).seen,
      );
      expect(seen.headings).not.toContain('not found');
      expect(seen.errors).toBe(0);
      expect(await stayed(page)).toBe(true);
      await page.close();
    });

    it('lets a navigation to a redirect.ts beside the shell follow the redirect', async () => {
      const page = await openHydrated(`${origin}/en/posts/2`);

      await page
        .getByRole('link', { name: 'first post (old address)', exact: true })
        .click();

      await page.getByRole('heading', { name: 'first post' }).waitFor();
      expect(pathnameOf(page)).toBe('/en/posts/1');
      await page.close();
    });

    it.each(['/en/posts/3?from=x', '/en/posts/3/', '/en/posts/%33'])(
      'is answered at %s too',
      async (url) => {
        const page = await browser.newPage();

        await page.goto(`${origin}${url}`);

        await page.getByRole('heading', { name: 'third post' }).waitFor();
        expect(await page.evaluate(() => location.search)).toBe(
          new URL(url, origin).search,
        );
        await page.close();
      },
    );

    it('is still reached from a built page, by a document load, on a host without the payload rules', async () => {
      withoutPayloadRules = true;
      const page = await openHydrated(`${origin}/en/posts/1`);

      await page.getByRole('link', { name: 'post 3', exact: true }).click();

      await page.getByRole('heading', { name: 'third post' }).waitFor();
      expect(pathnameOf(page)).toBe('/en/posts/3');
      expect(await stayed(page)).toBe(false);
      await page.close();
    });

    it('is answered with its shell when the site sits under a base', async () => {
      deployed = underBase;
      mountedAt = '/site/';
      const page = await browser.newPage();

      await page.goto(`${origin}/site/ja/posts/3`);

      await page.getByRole('heading', { name: 'third post' }).waitFor();
      expect(pathnameOf(page)).toBe('/site/ja/posts/3');
      await page.close();
    });
  });

  describe('a value the build did not write, on Cloudflare', () => {
    it('is answered with its shell without a redirect, the URL never naming it', async () => {
      cloudflare = true;
      const page = await browser.newPage();

      const response = await page.goto(`${origin}/en/posts/3`);
      await page.getByRole('heading', { name: 'third post' }).waitFor();

      expect({
        status: response?.status(),
        redirected: response?.request().redirectedFrom(),
        pathname: pathnameOf(page),
      }).toStrictEqual({
        status: 200,
        redirected: null,
        pathname: '/en/posts/3',
      });
      await page.close();
    });

    it('leaves a built page to its own file, which the host serves at its directory', async () => {
      cloudflare = true;

      const first = await fetch(`${origin}/en/posts/1`, { redirect: 'manual' });
      const html = await (await fetch(`${origin}/en/posts/1/`)).text();

      expect(first.status).toBe(307);
      expect(first.headers.get('location')).toBe('/en/posts/1/');
      expect(html).toContain('<h1 data-testid="title">first post</h1>');
    });

    it('moves in place from the shell to a built page, fetching that page’s own payload', async () => {
      cloudflare = true;
      const page = await openShell(`${origin}/en/posts/3`, 'third post');
      const payload = page.waitForResponse((response) =>
        response.url().endsWith('/en/posts/1/index.rsc'),
      );

      await page.getByRole('link', { name: 'post 1', exact: true }).click();

      await page.getByRole('heading', { name: 'first post' }).waitFor();
      const body = await (await payload).text();
      expect(body).toContain('first post');
      expect(body).not.toContain('loading the post');
      expect(await stayed(page)).toBe(true);
      await page.close();
    });

    it('lets a navigation to a redirect.ts beside the shell follow the redirect', async () => {
      cloudflare = true;
      const page = await openHydrated(`${origin}/en/posts/2`);

      await page
        .getByRole('link', { name: 'first post (old address)', exact: true })
        .click();

      await page.getByRole('heading', { name: 'first post' }).waitFor();
      // Cloudflare はディレクトリの URL を末尾の / 付きに寄せる
      expect(pathnameOf(page)).toMatch(/^\/en\/posts\/1\/?$/u);
      expect(requested).toContain('/en/posts/first/index.rsc');
      await page.close();
    });
  });
});

describe('vite preview of the static build', () => {
  let server: PreviewServer;
  let origin = '';

  beforeAll(async () => {
    server = await preview({
      root,
      configFile: path.join(root, 'vite.config.ts'),
      logLevel: 'silent',
      preview: { port: 0 },
    });
    const [url] = server.resolvedUrls?.local ?? [];
    if (url === undefined) throw new Error('vite preview is not listening');
    origin = url.slice(0, -1);
  }, 60_000);

  afterAll(async () => {
    await server.close();
  });

  it('answers a value the build did not write with the shell’s file, its policy <meta> included', async () => {
    const response = await fetch(`${origin}/en/posts/3`);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain('loading the post…');
    expect(policyFirstIn(html)).not.toBe('');
  });

  it('answers its payload with the shell’s payload', async () => {
    const response = await fetch(`${origin}/en/posts/3/index.rsc`);

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('loading the post');
  });

  it('answers a built page with its file, not a render', async () => {
    const response = await fetch(`${origin}/en/posts/1`);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toBe(read('en', 'posts', '1', 'index.html'));
    expect(policyFirstIn(html)).not.toBe('');
  });

  it('answers a URL the build has nothing for with 404.html under 404', async () => {
    const response = await fetch(`${origin}/nope`);

    expect(response.status).toBe(404);
    expect(await response.text()).toBe(read('404.html'));
  });

  it('refuses a method a file cannot answer with 405', async () => {
    const response = await fetch(`${origin}/`, { method: 'POST' });

    expect(response.status).toBe(405);
  });
});
