import { parseRouteTree, buildTable } from '@k8ordo/framework-engine';
import { defineRoutes } from '@k8ordo/router';
import type { FC } from 'react';
import { describe, expect, it } from 'vite-plus/test';

import {
  answersOf,
  catchAllPath,
  catchAllPatterns,
  dirFor,
  patternsNeedingPaths,
  patternsOf,
  planPaths,
  planRefusals,
  shadowedShells,
  shellPathname,
  suppliedFrom,
} from './paths';

const treeOf = (files: readonly string[]) => {
  const { tree, problems } = parseRouteTree(files);
  expect(problems).toStrictEqual([]);
  return tree;
};

describe('patternsOf', () => {
  it('walks groups without giving them a segment', () => {
    expect(
      patternsOf(
        treeOf(['page.tsx', '(docs)/guide/page.tsx', 'products/[id]/page.tsx']),
      ),
    ).toStrictEqual(['/', '/guide', '/products/:id']);
  });
});

describe('planPaths', () => {
  it('takes every parameterless route without being told', () => {
    const plan = planPaths(treeOf(['page.tsx', 'about/page.tsx']), []);
    expect(plan.paths).toStrictEqual(['/', '/about']);
    expect(plan.unresolved).toStrictEqual([]);
  });

  it('refuses to build when a param route has no supplied path', () => {
    const plan = planPaths(treeOf(['page.tsx', 'products/[id]/page.tsx']), []);
    expect(plan.unresolved).toStrictEqual(['/products/:id']);
  });

  it('accepts the supplied paths that cover a pattern', () => {
    const plan = planPaths(treeOf(['page.tsx', 'products/[id]/page.tsx']), [
      '/products/1',
      '/products/2',
      '/elsewhere',
    ]);
    expect(plan.paths).toStrictEqual(['/', '/products/1', '/products/2']);
    expect(plan.unresolved).toStrictEqual([]);
  });

  it('refuses a supplied path no route wants', () => {
    // 打ち間違いは「そのページが無いサイト」になって出荷される
    const plan = planPaths(treeOf(['page.tsx', 'products/[id]/page.tsx']), [
      '/products/1',
      '/produtcs/2',
    ]);
    expect(plan.unusable).toStrictEqual(['/produtcs/2']);
  });

  it('takes a path the table already has as redundant, not wrong', () => {
    const plan = planPaths(treeOf(['page.tsx', 'about/page.tsx']), ['/about']);
    expect(plan.unusable).toStrictEqual([]);
    expect(plan.paths).toStrictEqual(['/', '/about']);
  });

  it('reads a trailing slash as the same pathname the router does', () => {
    const plan = planPaths(treeOf(['page.tsx', 'products/[id]/page.tsx']), [
      '/products/1/',
    ]);
    expect(plan.unusable).toStrictEqual([]);
    expect(plan.unresolved).toStrictEqual([]);
    expect(plan.paths).toStrictEqual(['/', '/products/1']);
  });

  it('refuses a supplied path that still holds a parameter, naming the page that has no fallback.tsx', () => {
    // パラメータが 2 つある表を 1 つだけ展開すると、こういう値が残る
    const plan = planPaths(
      treeOf(['page.tsx', '[locale]/blog/[slug]/page.tsx']),
      ['/ja/blog/:slug'],
    );
    expect(plan.held).toStrictEqual([
      { location: '/ja/blog/:slug', file: '[locale]/blog/[slug]/page.tsx' },
    ]);
    expect(plan.unusable).toStrictEqual([]);
    expect(plan.unresolved).toStrictEqual(['/:locale/blog/:slug']);
    expect(planRefusals(plan, [])).toContain(
      'these pathnames still hold a parameter, and only a page with a fallback.tsx beside it takes one: /ja/blog/:slug ([locale]/blog/[slug]/page.tsx has none)',
    );
  });

  it('says a route.ts holding a parameter cannot have a fallback.tsx', () => {
    const plan = planPaths(treeOf(['page.tsx', 'feed/[id]/route.ts']), [
      '/feed/:id',
    ]);
    expect(planRefusals(plan, [])).toContain(
      'these pathnames still hold a parameter, and only a page with a fallback.tsx beside it takes one: /feed/:id (feed/[id]/route.ts cannot have one)',
    );
  });

  it('never renders the catch-all as a page of its own', () => {
    const plan = planPaths(treeOf(['page.tsx', 'not-found.tsx']), []);
    expect(plan.paths).toStrictEqual(['/']);
    expect(plan.unresolved).toStrictEqual([]);
  });
});

describe('patternsNeedingPaths', () => {
  it('names the parameterised patterns, catch-all aside', () => {
    const tree = treeOf([
      'page.tsx',
      'not-found.tsx',
      'products/page.tsx',
      'products/[id]/page.tsx',
      '[locale]/page.tsx',
    ]);
    expect(patternsNeedingPaths(tree)).toStrictEqual([
      '/products/:id',
      '/:locale',
    ]);
  });
});

describe('catchAllPatterns', () => {
  it('names every not-found, so the build can refuse to choose between them', () => {
    const tree = treeOf(['page.tsx', 'not-found.tsx', 'docs/not-found.tsx']);
    // マッチャーが試す順: 枝の catch-all が先、根の catch-all が最後
    expect(catchAllPatterns(tree)).toStrictEqual(['/docs/*', '/*']);
  });
});

describe('catchAllPath', () => {
  it('is nothing when the table declares no catch-all', () => {
    expect(catchAllPath(treeOf(['page.tsx']))).toBeNull();
  });

  it('reaches a catch-all under a named directory', () => {
    // 番兵だけの深いパスでは `/docs/*` に届かない。前置きの literal は残す。
    const tree = treeOf([
      'page.tsx',
      'docs/page.tsx',
      'docs/not-found.tsx',
      'products/[id]/page.tsx',
    ]);
    const path = catchAllPath(tree);
    expect(path).not.toBeNull();
    const routes = defineRoutes(buildTable(tree, blank));
    expect(routes.match(path as string)?.pattern).toBe('/docs/*');
  });

  it('reaches the only catch-all wherever it sits', () => {
    // ロケール区間の下にしか not-found を置かない構成でも、その 1 枚が 404.html。
    const tree = treeOf([
      'page.tsx',
      '[locale]/page.tsx',
      '[locale]/not-found.tsx',
    ]);
    const path = catchAllPath(tree);
    expect(path).not.toBeNull();
    const routes = defineRoutes(buildTable(tree, blank));
    expect(routes.match(path as string)?.pattern).toBe('/:locale/*');
  });

  it('reaches the catch-all even past parameters at every depth', () => {
    // 実際の表に通して、本当に catch-all しか答えられないことを確かめる
    const files = [
      'page.tsx',
      'not-found.tsx',
      '[a]/page.tsx',
      '[a]/[b]/page.tsx',
      'products/[id]/page.tsx',
    ];
    const tree = treeOf(files);
    const path = catchAllPath(tree);
    expect(path).not.toBeNull();

    const routes = defineRoutes(buildTable(tree, blank));
    expect(routes.match(path as string)?.pattern).toBe('/*');
  });
});

const blank = (): FC => () => null;

describe('dirFor', () => {
  it('writes the file under the name the URL stands for', () => {
    // href() は escape 済みの文字列を返す。そのまま掘ると、どのホストも
    // 一致させられない名前のディレクトリができる
    expect(dirFor('/products/caf%C3%A9')).toBe('/products/café');
    expect(dirFor('/products/1')).toBe('/products/1');
  });

  it('refuses a pathname that would leave the output directory', () => {
    expect(() => dirFor('/products/%2e%2e/%2e%2e/etc')).toThrow(/leaves/u);
  });

  it('refuses a malformed escape instead of writing it verbatim', () => {
    expect(() => dirFor('/products/%zz')).toThrow(/malformed escape/u);
  });
});

describe('answersOf', () => {
  const tree = treeOf([
    'page.tsx',
    'feed.xml/route.ts',
    'api/[id]/route.ts',
    'api/special/page.tsx',
    'not-found.tsx',
  ]);

  it('answers each pathname with the first pattern that takes it, in the matcher’s order', () => {
    const answers = answersOf(tree, [
      '/',
      '/feed.xml',
      '/api/7',
      '/api/special',
    ]);

    expect(
      [...answers].map(([pathname, { kind, pattern }]) => [
        pathname,
        kind,
        pattern,
      ]),
    ).toStrictEqual([
      ['/', 'page', '/'],
      ['/feed.xml', 'route', '/feed.xml'],
      ['/api/7', 'route', '/api/:id'],
      ['/api/special', 'page', '/api/special'],
    ]);
  });

  it('never answers a pathname with the catch-all', () => {
    expect(answersOf(tree, ['/missing/deep']).size).toBe(0);
  });
});

describe('planPaths for a page with a fallback.tsx', () => {
  const posts = [
    'layout.tsx',
    'page.tsx',
    'posts/[id]/page.tsx',
    'posts/[id]/fallback.tsx',
  ];
  const localized = [
    'layout.tsx',
    'page.tsx',
    '[locale]/layout.tsx',
    '[locale]/posts/[id]/page.tsx',
    '[locale]/posts/[id]/fallback.tsx',
  ];

  it('stands the bare shell at the pattern when nothing is supplied', () => {
    const plan = planPaths(treeOf(posts), []);
    expect(plan.unresolved).toStrictEqual([]);
    expect(plan.paths).toStrictEqual(['/']);
    expect(plan.shells).toStrictEqual([
      {
        pattern: '/posts/:id',
        location: '/posts/:id',
        pathname: '/posts/!fallback',
      },
    ]);
  });

  it('builds the values supplied beside the bare shell', () => {
    const plan = planPaths(treeOf(posts), ['/posts/1', '/posts/2']);
    expect(plan.paths).toStrictEqual(['/', '/posts/1', '/posts/2']);
    expect(plan.shells.map((shell) => shell.location)).toStrictEqual([
      '/posts/:id',
    ]);
  });

  it('stands the shells at the supplied locations instead of the bare pattern', () => {
    const plan = planPaths(treeOf(localized), [
      '/en/posts/:id',
      '/ja/posts/:id',
      '/en/posts/1',
    ]);
    expect(plan.paths).toStrictEqual(['/', '/en/posts/1']);
    expect(plan.shells).toStrictEqual([
      {
        pattern: '/:locale/posts/:id',
        location: '/en/posts/:id',
        pathname: '/en/posts/!fallback',
      },
      {
        pattern: '/:locale/posts/:id',
        location: '/ja/posts/:id',
        pathname: '/ja/posts/!fallback',
      },
    ]);
  });

  it('gives a location to the first pattern in table order it fits', () => {
    const plan = planPaths(
      treeOf([
        'page.tsx',
        '[locale]/posts/[id]/page.tsx',
        '[locale]/posts/[id]/fallback.tsx',
        '[section]/[slug]/[id]/page.tsx',
        '[section]/[slug]/[id]/fallback.tsx',
      ]),
      ['/en/posts/:id', '/en/news/:id'],
    );
    expect(
      plan.shells.map(({ pattern, location }) => [pattern, location]),
    ).toStrictEqual([
      ['/:locale/posts/:id', '/en/posts/:id'],
      ['/:section/:slug/:id', '/en/news/:id'],
    ]);
  });

  it('refuses a location whose parameter names are not its pattern’s', () => {
    const plan = planPaths(treeOf(localized), ['/en/posts/:slug']);
    expect(plan.misnamed).toStrictEqual([
      { location: '/en/posts/:slug', pattern: '/:locale/posts/:id' },
    ]);
    expect(planRefusals(plan, [])).toContain(
      "these shell locations name parameters that are not their pattern's: /en/posts/:slug (/:locale/posts/:id)",
    );
  });

  it('refuses a supplied location that leaves open a parameter a layout above receives', () => {
    const plan = planPaths(treeOf(localized), ['/:locale/posts/:id']);
    expect(plan.closed).toStrictEqual([
      {
        location: '/:locale/posts/:id',
        params: ['locale'],
        layout: '[locale]/layout.tsx',
        supplied: true,
      },
    ]);
    expect(planRefusals(plan, [])).toContain(
      'these shells leave out a parameter a layout above their fallback.tsx receives, so its directory needs a paths.ts: /:locale/posts/:id (:locale, received by [locale]/layout.tsx)',
    );
  });

  it('refuses the bare shell when a layout above receives one of its parameters', () => {
    const plan = planPaths(treeOf(localized), ['/en/posts/1']);
    expect(plan.shells).toStrictEqual([]);
    expect(plan.closed).toStrictEqual([
      {
        location: '/:locale/posts/:id',
        params: ['locale'],
        layout: '[locale]/layout.tsx',
        supplied: false,
      },
    ]);
    expect(planRefusals(plan, [])).toContain(
      "static build needs the values of :locale for the shell of /:locale/posts/:id — [locale]/layout.tsx receives it, so that parameter's directory needs a paths.ts, which puts the shell at /<locale>/posts/:id",
    );
  });

  it.each([
    ['a value', '/posts/!fallback'],
    ['a shell location', '/!fallback/posts/:id'],
    ['an escaped spelling', '/posts/%21fallback'],
  ])('refuses %s with a segment the build keeps for shells', (_, path) => {
    const plan = planPaths(treeOf(posts), [path]);
    expect(plan.reserved).toStrictEqual([path]);
    expect(planRefusals(plan, [])).toContain(
      `a paths.ts returned !fallback, which the build keeps for shells: ${path}`,
    );
  });

  it('writes a shell once however often its location is supplied, a trailing slash included', () => {
    const plan = planPaths(treeOf(localized), [
      '/en/posts/:id',
      '/en/posts/:id/',
    ]);
    expect(plan.shells.map((shell) => shell.pathname)).toStrictEqual([
      '/en/posts/!fallback',
    ]);
  });
});

describe('shellPathname', () => {
  it('puts the reserved segment in place of each parameter left open', () => {
    expect(shellPathname('/ja/posts/:id')).toBe('/ja/posts/!fallback');
    expect(shellPathname('/posts/:year/:slug')).toBe(
      '/posts/!fallback/!fallback',
    );
  });
});

describe('shadowedShells', () => {
  it('names a pattern declared first whose parameter the shell would answer at the same position', () => {
    const tree = treeOf([
      'page.tsx',
      'docs/[section]/page.tsx',
      '[lang]/[id]/page.tsx',
      '[lang]/[id]/fallback.tsx',
    ]);
    const plan = planPaths(tree, ['/docs/intro']);
    const shadowed = shadowedShells(tree, plan.shells, new Set(plan.paths));
    expect(shadowed).toStrictEqual([
      {
        location: '/:lang/:id',
        fallback: '[lang]/[id]/fallback.tsx',
        pattern: '/docs/:section',
        file: 'docs/[section]/page.tsx',
        url: null,
      },
    ]);
    expect(planRefusals(plan, shadowed)).toContain(
      'the shell for /:lang/:id ([lang]/[id]/fallback.tsx) would also answer URLs /docs/:section (docs/[section]/page.tsx) is declared first for — give docs/[section]/page.tsx a fallback.tsx too, or put the shell where it cannot match, with a paths.ts above it',
    );
  });

  const besideNew = [
    'page.tsx',
    '[locale]/posts/new/page.tsx',
    '[locale]/posts/[id]/page.tsx',
    '[locale]/posts/[id]/fallback.tsx',
  ];

  it('names the one URL a pattern declared first meets the shell at, when the build did not write it', () => {
    const tree = treeOf(besideNew);
    const plan = planPaths(tree, ['/ja/posts/:id', '/en/posts/new']);
    const shadowed = shadowedShells(tree, plan.shells, new Set(plan.paths));
    expect(shadowed).toStrictEqual([
      {
        location: '/ja/posts/:id',
        fallback: '[locale]/posts/[id]/fallback.tsx',
        pattern: '/:locale/posts/new',
        file: '[locale]/posts/new/page.tsx',
        url: '/ja/posts/new',
      },
    ]);
    expect(planRefusals(plan, shadowed)).toContain(
      "the shell for /ja/posts/:id ([locale]/posts/[id]/fallback.tsx) would also answer /ja/posts/new, which [locale]/posts/new/page.tsx is declared first for and the build did not write — return its value from that parameter's paths.ts, or put the shell where it cannot match, with a paths.ts above it",
    );
  });

  it('says nothing of a URL the build wrote, which its file answers', () => {
    const tree = treeOf([
      'page.tsx',
      '[locale]/posts/first/redirect.ts',
      '[locale]/posts/[id]/page.tsx',
      '[locale]/posts/[id]/fallback.tsx',
    ]);
    const plan = planPaths(tree, [
      '/ja/posts/:id',
      '/ja/posts/first',
      '/ja/posts/1',
    ]);
    expect(
      shadowedShells(tree, plan.shells, new Set(plan.paths)),
    ).toStrictEqual([]);
  });

  it('says nothing of a pattern declared first that has a fallback.tsx of its own', () => {
    const tree = treeOf([
      'page.tsx',
      'docs/[section]/page.tsx',
      'docs/[section]/fallback.tsx',
      '[lang]/[id]/page.tsx',
      '[lang]/[id]/fallback.tsx',
    ]);
    const plan = planPaths(tree, []);
    expect(
      shadowedShells(tree, plan.shells, new Set(plan.paths)),
    ).toStrictEqual([]);
  });
});

describe('suppliedFrom', () => {
  const asked: Array<[string, Record<string, string>]> = [];
  const answering =
    (values: Record<string, (params: Record<string, string>) => unknown>) =>
    (file: string, params: Readonly<Record<string, string>>): unknown => {
      asked.push([file, { ...params }]);
      return values[file]?.(params);
    };

  it('writes every page, route.ts and redirect.ts below a parameter for each of its values', async () => {
    const tree = treeOf([
      'page.tsx',
      'blog/[slug]/page.tsx',
      'blog/[slug]/paths.ts',
      'blog/[slug]/og.png/route.ts',
      'blog/[slug]/old/redirect.ts',
    ]);

    const { locations, problems } = await suppliedFrom(
      tree,
      answering({ 'blog/[slug]/paths.ts': () => ['a', 'b'] }),
    );

    expect(problems).toStrictEqual([]);
    expect(planPaths(tree, locations).paths).toStrictEqual([
      '/',
      '/blog/a',
      '/blog/b',
      '/blog/a/og.png',
      '/blog/b/og.png',
      '/blog/a/old',
      '/blog/b/old',
    ]);
  });

  it('asks a paths.ts once per value of the parameters above it, handing them over', async () => {
    asked.length = 0;
    const tree = treeOf([
      'page.tsx',
      '[locale]/paths.ts',
      '[locale]/posts/[id]/page.tsx',
      '[locale]/posts/[id]/paths.ts',
    ]);

    const { locations } = await suppliedFrom(
      tree,
      answering({
        '[locale]/paths.ts': () => ['ja', 'en'],
        '[locale]/posts/[id]/paths.ts': ({ locale = '' }) =>
          ({ ja: ['1', '2'], en: ['1'] })[locale],
      }),
    );

    expect(asked).toStrictEqual([
      ['[locale]/paths.ts', {}],
      ['[locale]/posts/[id]/paths.ts', { locale: 'ja' }],
      ['[locale]/posts/[id]/paths.ts', { locale: 'en' }],
    ]);
    expect(locations).toStrictEqual([
      '/ja/posts/1',
      '/ja/posts/2',
      '/en/posts/1',
    ]);
  });

  it('puts a shell at each value above a fallback.tsx, where no paths.ts gives its own parameter values', async () => {
    const tree = treeOf([
      'page.tsx',
      '[locale]/layout.tsx',
      '[locale]/paths.ts',
      '[locale]/posts/[id]/page.tsx',
      '[locale]/posts/[id]/fallback.tsx',
    ]);

    const { locations } = await suppliedFrom(
      tree,
      answering({ '[locale]/paths.ts': () => ['ja', 'en'] }),
    );

    expect(planPaths(tree, locations).shells).toStrictEqual([
      {
        pattern: '/:locale/posts/:id',
        location: '/ja/posts/:id',
        pathname: '/ja/posts/!fallback',
      },
      {
        pattern: '/:locale/posts/:id',
        location: '/en/posts/:id',
        pathname: '/en/posts/!fallback',
      },
    ]);
  });

  it('writes the values a directory lists and keeps its fallback.tsx’s shell for the rest', async () => {
    const tree = treeOf([
      'page.tsx',
      'posts/[id]/page.tsx',
      'posts/[id]/fallback.tsx',
      'posts/[id]/paths.ts',
    ]);

    const plan = planPaths(
      tree,
      (
        await suppliedFrom(
          tree,
          answering({ 'posts/[id]/paths.ts': () => ['1'] }),
        )
      ).locations,
    );

    expect(plan.paths).toStrictEqual(['/', '/posts/1']);
    expect(plan.shells.map((shell) => shell.location)).toStrictEqual([
      '/posts/:id',
    ]);
  });

  it('leaves a parameter with neither a paths.ts nor a fallback.tsx for the build to refuse', async () => {
    const tree = treeOf(['page.tsx', 'tags/[tag]/page.tsx']);

    const plan = planPaths(
      tree,
      (await suppliedFrom(tree, answering({}))).locations,
    );

    expect(planRefusals(plan, [])).toStrictEqual([
      "static build needs the values of /tags/:tag — a paths.ts in each parameter's directory returns them, and a fallback.tsx beside a page answers the ones the build does not write",
    ]);
  });

  it('escapes a value for the URL, the characters a pathname is read by included', async () => {
    const tree = treeOf([
      'page.tsx',
      'tags/[tag]/page.tsx',
      'tags/[tag]/paths.ts',
    ]);

    const { locations } = await suppliedFrom(
      tree,
      answering({ 'tags/[tag]/paths.ts': () => ['café', 'a b', 'a*b', ':id'] }),
    );

    expect(locations).toStrictEqual([
      '/tags/caf%C3%A9',
      '/tags/a%20b',
      '/tags/a%2Ab',
      '/tags/%3Aid',
    ]);
  });

  it('says so when a paths.ts returns anything but non-empty strings', async () => {
    const tree = treeOf([
      'page.tsx',
      'tags/[tag]/page.tsx',
      'tags/[tag]/paths.ts',
    ]);

    const { problems } = await suppliedFrom(
      tree,
      answering({ 'tags/[tag]/paths.ts': () => [1, ''] }),
    );

    expect(problems).toStrictEqual([
      'tags/[tag]/paths.ts has to return an array of non-empty strings, the values of :tag',
    ]);
  });

  it('says so when a paths.ts sits below a parameter nothing gives values to', async () => {
    const tree = treeOf([
      'page.tsx',
      '[locale]/posts/[id]/page.tsx',
      '[locale]/posts/[id]/paths.ts',
    ]);

    const { problems } = await suppliedFrom(
      tree,
      answering({ '[locale]/posts/[id]/paths.ts': () => ['1'] }),
    );

    expect(problems).toStrictEqual([
      "[locale]/posts/[id]/paths.ts is asked for its values once per value of the parameters above it, and /:locale/posts still holds one — give that parameter's directory a paths.ts too",
    ]);
  });
});
