import {
  mkdtemp,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { writeStaticVercelOutput, writeVercelOutput } from './vercel-output';

type Entry = {
  readonly default: { readonly fetch: (request: Request) => Promise<Response> };
};

let root: string;
let output: string;

const read = async (file: string): Promise<unknown> =>
  JSON.parse(await readFile(path.join(output, file), 'utf8')) as unknown;

const filesUnder = async (dir: string): Promise<string[]> =>
  (
    await readdir(path.join(output, dir), {
      recursive: true,
      withFileTypes: true,
    })
  )
    .filter((entry) => entry.isFile())
    .map((entry) =>
      path.relative(
        path.join(output, dir),
        path.join(entry.parentPath, entry.name),
      ),
    )
    .toSorted();

// 本物のビルドは要らない: 書き出すのは dist の 3 つのディレクトリの写しと設定だけ
beforeAll(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'k8ordo-vercel-'));
  output = path.join(root, '.vercel', 'output');
  const dist = path.join(root, 'dist');
  await mkdir(path.join(dist, 'client', 'assets'), { recursive: true });
  await mkdir(path.join(dist, 'rsc'), { recursive: true });
  await mkdir(path.join(dist, 'ssr'), { recursive: true });
  await writeFile(
    path.join(dist, 'client', 'assets', 'app-abc123.js'),
    'export {};',
  );
  await writeFile(
    path.join(dist, 'client', 'assets', 'app-abc123.js.br'),
    'br',
  );
  await writeFile(
    path.join(dist, 'client', 'assets', 'app-abc123.js.gz'),
    'gz',
  );
  await writeFile(path.join(dist, 'client', 'archive.tar.gz'), 'a download');
  // ハンドラは隣の ssr を相対パスで読む。組み上がったものと同じ形
  await writeFile(
    path.join(dist, 'rsc', 'index.js'),
    `export default async (request) => {
      const { rendered } = await import('../ssr/index.js');
      return new Response(rendered(new URL(request.url).pathname));
    };`,
  );
  await writeFile(
    path.join(dist, 'ssr', 'index.js'),
    'export const rendered = (pathname) => "<p>" + pathname + "</p>";',
  );
  // vercel pull が書いたもの。出力を書き直しても残す
  await mkdir(output, { recursive: true });
  await writeFile(path.join(root, '.vercel', 'project.json'), '{}');
  await writeFile(path.join(output, 'from-an-earlier-build.txt'), 'stale');

  await writeVercelOutput(
    root,
    {
      client: path.join(dist, 'client'),
      rsc: path.join(dist, 'rsc'),
      ssr: path.join(dist, 'ssr'),
    },
    '/',
  );
});

afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('writeVercelOutput', () => {
  it('sends every request that names no file to the handler, and marks only a hashed file that answered immutable', async () => {
    expect(await read('config.json')).toStrictEqual({
      version: 3,
      routes: [
        { handle: 'filesystem' },
        { src: '^/.*$', dest: '/handler' },
        { handle: 'hit' },
        {
          src: '^\\/assets\\/',
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
          continue: true,
        },
      ],
    });
  });

  it('ships the client build as static files, without the copies compressed for serve', async () => {
    expect(await filesUnder('static')).toStrictEqual([
      'archive.tar.gz',
      path.join('assets', 'app-abc123.js'),
    ]);
  });

  it('declares the handler a streaming Node.js function', async () => {
    expect(await read('functions/handler.func/.vc-config.json')).toStrictEqual({
      runtime: 'nodejs24.x',
      handler: 'index.mjs',
      launcherType: 'Nodejs',
      shouldAddHelpers: false,
      supportsResponseStreaming: true,
    });
  });

  it('hands Vercel the handler as fetch, able to reach the ssr build beside it', async () => {
    const entry = path.join(output, 'functions', 'handler.func', 'index.mjs');
    const { default: fn } = (await import(pathToFileURL(entry).href)) as Entry;
    const response = await fn.fetch(
      new Request('https://example.test/products/1'),
    );
    expect(await response.text()).toBe('<p>/products/1</p>');
  });

  it('starts from an empty output, leaving what vercel pull wrote beside it', async () => {
    expect(await readdir(output)).not.toContain('from-an-earlier-build.txt');
    expect(
      await readFile(path.join(root, '.vercel', 'project.json'), 'utf8'),
    ).toBe('{}');
  });
});

describe('writeVercelOutput under a base', () => {
  let under: string;

  // base を '/site/' にしたビルド。client/ の中身はその下で配られる
  beforeAll(async () => {
    under = await mkdtemp(path.join(tmpdir(), 'k8ordo-vercel-base-'));
    const dist = path.join(under, 'dist');
    await mkdir(path.join(dist, 'client', 'assets'), { recursive: true });
    await mkdir(path.join(dist, 'rsc'), { recursive: true });
    await mkdir(path.join(dist, 'ssr'), { recursive: true });
    await writeFile(
      path.join(dist, 'client', 'assets', 'app-abc123.js'),
      'export {};',
    );
    await writeFile(path.join(dist, 'rsc', 'index.js'), 'export default {};');
    await writeVercelOutput(
      under,
      {
        client: path.join(dist, 'client'),
        rsc: path.join(dist, 'rsc'),
        ssr: path.join(dist, 'ssr'),
      },
      '/site.v2/',
    );
  });

  afterAll(async () => {
    await rm(under, { recursive: true, force: true });
  });

  it('puts the client build at its URL under the base', async () => {
    const files = await readdir(
      path.join(under, '.vercel', 'output', 'static', 'site.v2', 'assets'),
    );
    expect(files).toStrictEqual(['app-abc123.js']);
  });

  it('marks the hashed files under the base immutable, reading the base literally', async () => {
    const config = JSON.parse(
      await readFile(
        path.join(under, '.vercel', 'output', 'config.json'),
        'utf8',
      ),
    ) as { routes: Array<{ src?: string }> };
    expect(config.routes.at(-1)?.src).toBe('^\\/site\\.v2\\/assets\\/');
  });
});

type Route = {
  readonly src?: string;
  readonly dest?: string;
  readonly status?: number;
  readonly handle?: string;
  readonly caseSensitive?: boolean;
};

/** 書き換えの経路のうち、最初に合うものの宛先 */
const destOf = (routes: readonly Route[], pathname: string) =>
  routes
    .slice(
      1,
      routes.findIndex((route) => route.handle === 'hit'),
    )
    .find((route) =>
      new RegExp(route.src ?? '', route.caseSensitive === true ? '' : 'i').test(
        pathname,
      ),
    ) ?? null;

describe('writeStaticVercelOutput', () => {
  let built: string;

  /** static-basic の書き換え: ページでない URL のペイロード、殻の文書、殻のペイロード */
  const REWRITES = [
    { from: '/en/posts/first/index.rsc', to: '/en/posts/!fallback/' },
    { from: '/en/posts/:p1', to: '/en/posts/!fallback/' },
    { from: '/en/posts/:p1/index.rsc', to: '/en/posts/!fallback/index.rsc' },
  ];

  const writeStatic = async (
    base: string,
    notFound: boolean,
  ): Promise<readonly Route[]> => {
    await writeStaticVercelOutput({
      root: built,
      client: path.join(built, 'dist', 'client'),
      base,
      rewrites: REWRITES.map((rule) => ({
        from: `${base.slice(0, -1)}${rule.from}`,
        to: `${base.slice(0, -1)}${rule.to}`,
      })),
      notFound,
    });
    const config = JSON.parse(
      await readFile(
        path.join(built, '.vercel', 'output', 'config.json'),
        'utf8',
      ),
    ) as { version: number; routes: readonly Route[] };
    expect(config.version).toBe(3);
    return config.routes;
  };

  beforeEach(async () => {
    built = await mkdtemp(path.join(tmpdir(), 'k8ordo-vercel-static-'));
    const client = path.join(built, 'dist', 'client');
    await mkdir(path.join(client, 'en', 'posts', '!fallback'), {
      recursive: true,
    });
    await mkdir(path.join(client, 'assets'), { recursive: true });
    await writeFile(path.join(client, 'index.html'), '<p>home</p>');
    await writeFile(
      path.join(client, 'en', 'posts', '!fallback', 'index.html'),
      '<p>shell</p>',
    );
    await writeFile(path.join(client, 'assets', 'app-abc123.js'), 'export {};');
    await writeFile(path.join(client, '404.html'), '<p>not found</p>');
    await writeFile(path.join(client, '_redirects'), '/a /b 200\n');
  });

  afterEach(async () => {
    await rm(built, { recursive: true, force: true });
  });

  it('ships the client build as static files, without the _redirects Vercel never reads, and no function', async () => {
    await writeStatic('/', true);
    const written = path.join(built, '.vercel', 'output');

    expect(
      (
        await readdir(path.join(written, 'static'), {
          recursive: true,
          withFileTypes: true,
        })
      )
        .filter((entry) => entry.isFile())
        .map((entry) =>
          path.relative(
            path.join(written, 'static'),
            path.join(entry.parentPath, entry.name),
          ),
        )
        .toSorted(),
    ).toStrictEqual([
      '404.html',
      path.join('assets', 'app-abc123.js'),
      path.join('en', 'posts', '!fallback', 'index.html'),
      'index.html',
    ]);
    expect(await readdir(written)).not.toContain('functions');
  });

  it('rewrites only once no file answered, in the order _redirects gives', async () => {
    const routes = await writeStatic('/', true);

    expect(routes[0]).toStrictEqual({ handle: 'filesystem' });
    expect(routes.slice(1, 4).map((route) => route.dest)).toStrictEqual([
      '/en/posts/!fallback/index.html',
      '/en/posts/!fallback/index.html',
      '/en/posts/!fallback/index.rsc',
    ]);
    expect(
      routes.slice(1, 4).every((route) => route.caseSensitive === true),
    ).toBe(true);
  });

  it.each([
    ['/en/posts/3', '/en/posts/!fallback/index.html'],
    ['/en/posts/3/', '/en/posts/!fallback/index.html'],
    ['/en/posts/3/index.rsc', '/en/posts/!fallback/index.rsc'],
    ['/en/posts/first/index.rsc', '/en/posts/!fallback/index.html'],
    ['/EN/posts/3', '/404.html'],
    ['/en/posts/3/4', '/404.html'],
    ['/en/posts/3/index.rsc/', '/404.html'],
  ])('answers %s with %s', async (pathname, dest) => {
    const routes = await writeStatic('/', true);

    expect(destOf(routes, pathname)?.dest).toBe(dest);
  });

  it('answers what nothing rewrote with 404.html under 404', async () => {
    const routes = await writeStatic('/', true);

    expect(destOf(routes, '/nope')).toStrictEqual({
      src: '^/.*$',
      dest: '/404.html',
      status: 404,
    });
  });

  it('leaves what nothing rewrote to Vercel without a 404.html', async () => {
    const routes = await writeStatic('/', false);

    expect(destOf(routes, '/nope')).toBeNull();
  });

  it('marks only a hashed file that answered immutable', async () => {
    const routes = await writeStatic('/', true);

    expect(routes.at(-2)).toStrictEqual({ handle: 'hit' });
    expect(routes.at(-1)).toStrictEqual({
      src: '^\\/assets\\/',
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
      continue: true,
    });
  });

  it('puts the client build, the rewrites and 404.html under the base', async () => {
    const routes = await writeStatic('/site/', true);

    expect(
      await readdir(path.join(built, '.vercel', 'output', 'static', 'site')),
    ).toContain('index.html');
    expect(destOf(routes, '/site/en/posts/3')?.dest).toBe(
      '/site/en/posts/!fallback/index.html',
    );
    expect(destOf(routes, '/en/posts/3')?.dest).toBe('/site/404.html');
  });
});
