import { parseRouteTree, buildTable } from '@k8ordo/framework-engine';
import { defineRoutes } from '@k8ordo/router';
import type { FC } from 'react';

import {
  answeredByRoute,
  catchAllPath,
  catchAllPatterns,
  dirFor,
  patternsNeedingPaths,
  patternsOf,
  planPaths,
  planRefusals,
  shadowedShells,
  shellPathname,
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
      'the "paths" option supplied pathnames that still hold a parameter, and only a page with a fallback.tsx beside it takes one: /ja/blog/:slug ([locale]/blog/[slug]/page.tsx has none)',
    );
  });

  it('says a route.ts holding a parameter cannot have a fallback.tsx', () => {
    const plan = planPaths(treeOf(['page.tsx', 'feed/[id]/route.ts']), [
      '/feed/:id',
    ]);
    expect(planRefusals(plan, [])).toContain(
      'the "paths" option supplied pathnames that still hold a parameter, and only a page with a fallback.tsx beside it takes one: /feed/:id (feed/[id]/route.ts cannot have one)',
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

describe('answeredByRoute', () => {
  const tree = treeOf([
    'page.tsx',
    'feed.xml/route.ts',
    'api/[id]/route.ts',
    'api/special/page.tsx',
    'not-found.tsx',
  ]);

  it('says a route.ts answers the pathnames its pattern takes', () => {
    expect(answeredByRoute(tree, '/feed.xml')).toBe(true);
    expect(answeredByRoute(tree, '/api/7')).toBe(true);
  });

  it('says a page answers what it takes, in the matcher’s order', () => {
    expect(answeredByRoute(tree, '/')).toBe(false);
    expect(answeredByRoute(tree, '/api/special')).toBe(false);
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
      'the "paths" option supplied shell locations whose parameter names are not their pattern\'s: /en/posts/:slug (/:locale/posts/:id)',
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
      'the "paths" option supplied shell locations that leave out a parameter a layout above their fallback.tsx receives: /:locale/posts/:id (:locale, received by [locale]/layout.tsx)',
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
      'static build needs shell locations for /:locale/posts/:id — [locale]/layout.tsx receives :locale, so the "paths" option has to fill it, as in /<locale>/posts/:id',
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
      `the "paths" option supplied pathnames with a segment named !fallback, which the build keeps for shells: ${path}`,
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
      'the shell for /:lang/:id ([lang]/[id]/fallback.tsx) would also answer URLs /docs/:section (docs/[section]/page.tsx) is declared first for — give docs/[section]/page.tsx a fallback.tsx too, or supply shell locations it cannot match',
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
      'the shell for /ja/posts/:id ([locale]/posts/[id]/fallback.tsx) would also answer /ja/posts/new, which [locale]/posts/new/page.tsx is declared first for and the build did not write — list /ja/posts/new in "paths", or supply shell locations it cannot match',
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
