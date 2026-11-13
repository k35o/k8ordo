import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { ViteDevServer } from 'vite';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { compiledBuild, devServer, failedBuild } from '../fixtures/build';
import type { FailedBuild } from '../fixtures/build';

// 主張の対象はビルドがどこで何を言って止まるかなので、fixture ごとに本物の
// ビルドを走らせる。fixture は root を 1 つずつ持ち、.k8ordo/ も dist/ も
// ほかとぶつからない
describe('a static build that cannot be written', () => {
  const built = new Map<string, FailedBuild>();
  const buildOf = (name: string): FailedBuild => {
    const build = built.get(name);
    if (build === undefined) throw new Error(`fixtures/${name} was not built`);
    return build;
  };
  const said = (name: string): string => buildOf(name).said;

  beforeAll(async () => {
    const builds: ReadonlyArray<
      readonly [string, Parameters<typeof failedBuild>[1]?]
    > = [
      ['page-throws'],
      ['not-found-throws'],
      ['no-boundary'],
      ['guard'],
      ['route-methods'],
      ['search'],
      ['request'],
      ['not-pages'],
      ['paths'],
    ];
    // 同じプロセスで描くので、1 つずつ
    for (const [name, options] of builds) {
      built.set(name, await failedBuild(name, options));
    }
  }, 600_000);

  it('stops, naming the page, when a page throws while rendering', () => {
    // error.tsx はブラウザでの失敗のためのもので、ビルド時の失敗は失敗のまま
    expect(said('page-throws')).toContain('static build could not render /');
    expect(said('page-throws')).toContain('broken on purpose');
  });

  it('stops, naming 404.html, when not-found.tsx throws while rendering', () => {
    expect(said('not-found-throws')).toContain(
      'static build could not render 404.html',
    );
    expect(said('not-found-throws')).toContain('not-found broken on purpose');
  });

  it('stops, naming the page, when a page throws with no boundary above it', () => {
    // 境界が無いと HTML の描画そのものが reject する。それでも境界があるときと
    // 同じく、ページ名を挙げて止まる
    expect(said('no-boundary')).toContain('static build could not render /');
    expect(said('no-boundary')).toContain('broken with no boundary above it');
  });

  it('stops, naming the page, when a client component throws in the HTML render with no boundary above it', () => {
    expect(said('no-boundary')).toMatch(
      /static build could not render .*\/client\b/u,
    );
    // React 自身もこのエラーをログに出すので、ページの URL と並んだ行で
    // ハンドラが答えたメッセージだと確かめる
    expect(said('no-boundary')).toMatch(
      /\/client — client component broken with no boundary above it/u,
    );
  });

  it('stops, naming 404.html, when not-found.tsx throws with no boundary above it', () => {
    expect(said('no-boundary')).toMatch(
      /static build could not render .*404\.html/u,
    );
    expect(said('no-boundary')).toContain(
      'not-found broken with no boundary above it',
    );
  });

  it('refuses guard.ts, naming every one and the mode that runs them', () => {
    expect(said('guard')).toContain(
      "static build cannot run guard.ts — a file has no request to guard, and these are guards:\n  src/routes/admin/guard.ts\n  src/routes/guard.ts\nthis application wants mode: 'server'",
    );
  });

  it('refuses a route.ts that answers a method a file cannot, naming it and the method', () => {
    expect(said('route-methods')).toContain(
      'static build writes a route.ts as the file its GET answers, and a file cannot answer another method — these export one:\n  src/routes/api/route.ts (POST)',
    );
  });

  it('refuses a route.ts that re-exports with export *, whose methods it cannot read', () => {
    expect(said('route-methods')).toContain(
      "static build reads a route.ts's methods and a page's search by name, and export * names none of them — this re-exports another module whole:\n  src/routes/feed/route.ts\n",
    );
  });

  it('refuses a page that reads the search, naming it', () => {
    expect(said('search')).toContain(
      "static build cannot hand a page the search — a file is the same for every search, and these pages export search:\n  src/routes/products/page.tsx\nthis application wants mode: 'server'",
    );
  });

  it('refuses the request API, naming every module that imports it', () => {
    expect(said('request')).toContain(
      "static build cannot answer a request — a file is written once for every visitor, and these import @k8ordo/framework/server:\n  src/home.ts\n  src/routes/page.tsx\n  src/visits.ts\nthis application wants mode: 'server'",
    );
  });

  it('stops, naming the pathname, when a page it was supplied for said notFound()', () => {
    expect(said('not-pages')).toContain(
      'a paths.ts returned values whose page called notFound(): /products/3',
    );
  });

  it('names a pathname a schema refused in the same error as one whose page said notFound()', () => {
    expect(said('not-pages')).toContain(
      'a paths.ts returned values a params schema refused: /products/x\n\na paths.ts returned values whose page called notFound(): /products/3',
    );
  });

  it('writes nothing for a supplied pathname that turned out not to be a page', () => {
    const { client } = buildOf('not-pages');
    expect(
      ['3', 'x'].filter((id) => existsSync(path.join(client, 'products', id))),
    ).toStrictEqual([]);
  });

  it('stops before rendering, naming each pattern whose parameter no paths.ts gives values to, and each shell a layout needs one for', () => {
    expect(said('paths')).toContain(
      "static build needs the values of /products/:id, /:locale/about, /:locale/posts/first — a paths.ts in each parameter's directory returns them, and a fallback.tsx beside a page answers the ones the build does not write",
    );
    expect(said('paths')).toContain(
      'these shells leave out a parameter a layout above their fallback.tsx receives, so its directory needs a paths.ts: /:locale/posts/:id (:locale, received by [locale]/layout.tsx)',
    );
  });
});

// 主張の対象は「dev サーバがそのモジュールをどう扱うか」なので、本物の dev
// サーバを立てる。プラグインの transform を直接呼ぶ形にすると、RSC の変換が
// 先に走るという肝心の並びごと消えてしまい、拒否が死んでいても気づけない
describe('vite dev in static mode', () => {
  const servers = new Map<string, ViteDevServer>();

  beforeAll(async () => {
    for (const name of ['server-only', 'guard', 'route-methods']) {
      servers.set(name, await devServer(name));
    }
  }, 180_000);

  afterAll(async () => {
    await Promise.all([...servers.values()].map((server) => server.close()));
  });

  const transform = (
    name: string,
    environment: 'rsc' | 'client',
    url: string,
  ): Promise<unknown> => {
    const target = servers.get(name)?.environments[environment];
    if (target === undefined) {
      throw new Error(`no ${environment} environment for ${name}`);
    }
    return target.transformRequest(url);
  };

  it('refuses a module that declares a Server Action, naming it', async () => {
    await expect(
      transform('server-only', 'rsc', '/src/action.ts'),
    ).rejects.toThrow(
      /static build cannot ship Server Actions[\s\S]*src\/action\.ts/u,
    );
  });

  it('refuses it in the browser environment too, where a form would import it', async () => {
    await expect(
      transform('server-only', 'client', '/src/action.ts'),
    ).rejects.toThrow(/static build cannot ship Server Actions/u);
  });

  it('refuses a module that imports the request API, naming it', async () => {
    await expect(
      transform('server-only', 'rsc', '/src/request.ts'),
    ).rejects.toThrow(
      /static build cannot answer a request[\s\S]*src\/request\.ts/u,
    );
  });

  it('leaves every other module alone', async () => {
    await expect(
      transform('server-only', 'rsc', '/src/routes/page.tsx'),
    ).resolves.not.toBeNull();
  });

  it('refuses a guard.ts the moment it is compiled, naming it', async () => {
    await expect(
      transform('guard', 'rsc', '/src/routes/admin/guard.ts'),
    ).rejects.toThrow(
      /static build cannot run guard\.ts[\s\S]*src\/routes\/admin\/guard\.ts/u,
    );
  });

  it('refuses a route.ts that answers a method a file cannot, the moment it is compiled', async () => {
    await expect(
      transform('route-methods', 'rsc', '/src/routes/api/route.ts'),
    ).rejects.toThrow(
      /a file cannot answer another method[\s\S]*src\/routes\/api\/route\.ts \(POST\)/u,
    );
  });

  it('refuses a route.ts that re-exports with export *, rather than answering what it brings', async () => {
    await expect(
      transform('route-methods', 'rsc', '/src/routes/feed/route.ts'),
    ).rejects.toThrow(
      /export \* names none of them[\s\S]*src\/routes\/feed\/route\.ts/u,
    );
  });
});

// ソースマップの sources に並ぶモジュール
const modulesIn = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.map'))
    .flatMap(
      (entry) =>
        (
          JSON.parse(
            readFileSync(path.join(entry.parentPath, entry.name), 'utf8'),
          ) as { sources: string[] }
        ).sources,
    );

// React Compiler が変換したモジュールの import する先。テストの下では React の
// 開発版を束ねる
const COMPILER_RUNTIME =
  /\/react-compiler-runtime\.(?:production|development)\.js$/u;

describe('a static build with reactCompiler', () => {
  let out: Awaited<ReturnType<typeof compiledBuild>>;

  beforeAll(async () => {
    out = await compiledBuild('react-compiler');
  }, 120_000);

  it('compiles the client components the browser runs', () => {
    expect(modulesIn(out.client)).toStrictEqual(
      expect.arrayContaining([
        expect.stringMatching(/\/src\/counter\.tsx$/u),
        expect.stringMatching(COMPILER_RUNTIME),
      ]),
    );
  });

  it('renders the client components into HTML as they are written', () => {
    const modules = modulesIn(out.ssr);
    expect(modules).toContainEqual(
      expect.stringMatching(/\/src\/counter\.tsx$/u),
    );
    expect(modules).not.toContainEqual(expect.stringMatching(COMPILER_RUNTIME));
  });

  it('leaves the server components as they are written', () => {
    const modules = modulesIn(out.rsc);
    expect(modules).toContainEqual(
      expect.stringMatching(/\/src\/routes\/page\.tsx$/u),
    );
    expect(modules).not.toContainEqual(expect.stringMatching(COMPILER_RUNTIME));
  });
});
