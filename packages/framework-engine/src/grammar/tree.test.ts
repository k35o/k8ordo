import { fallbackShapes, parseRouteTree, slotOf } from './tree';
import type { RouteDir } from './tree';

const childOf = (dir: RouteDir, name: string): RouteDir => {
  const found = dir.children.find((child) => child.name === name);
  if (found === undefined) throw new Error(`no child "${name}"`);
  return found;
};

const stray = (basename: string): string =>
  `routes/ holds only page.tsx, layout.tsx, not-found.tsx, error.tsx, redirect.ts, guard.ts, route.ts, loading.tsx, fallback.tsx — move "${basename}" out of routes/`;

describe('the directory tree becomes the pathname space', () => {
  const { tree, problems } = parseRouteTree([
    'layout.tsx',
    'page.tsx',
    'not-found.tsx',
    'products/page.tsx',
    'products/[id]/page.tsx',
    '(docs)/layout.tsx',
    '(docs)/guide/page.tsx',
  ]);

  it('accepts the whole convention without complaint', () => {
    expect(problems).toStrictEqual([]);
  });

  it('fills the root slots from the convention filenames', () => {
    expect(tree.kind).toBe('root');
    expect(tree.page).toBe('page.tsx');
    expect(tree.layout).toBe('layout.tsx');
    expect(tree.notFound).toBe('not-found.tsx');
  });

  it('turns [id] into a param key and (docs) into a group key', () => {
    const products = childOf(tree, 'products');
    expect(childOf(products, '[id]')).toMatchObject({
      kind: 'param',
      key: '/:id',
    });
    expect(childOf(tree, '(docs)')).toMatchObject({
      kind: 'group',
      key: '/(docs)',
    });
  });

  it('keeps a literal directory as its own segment', () => {
    expect(childOf(tree, 'products')).toMatchObject({
      kind: 'literal',
      key: '/products',
      page: 'products/page.tsx',
    });
  });
});

describe('what routes/ refuses to hold', () => {
  it('rejects a file that is not part of the convention', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      'products/page.tsx',
      'products/helper.ts',
    ]);
    expect(problems).toStrictEqual([
      { path: 'products/helper.ts', message: stray('helper.ts') },
    ]);
  });

  it('rejects a file under a _-prefixed directory too', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      'products/page.tsx',
      'products/_parts/table.tsx',
    ]);
    expect(problems).toStrictEqual([
      { path: 'products/_parts/table.tsx', message: stray('table.tsx') },
      {
        path: 'products/_parts',
        message:
          'declares no route — every directory needs a page.tsx (or a redirect.ts or route.ts) somewhere below it',
      },
    ]);
  });

  it('reads a _-prefixed directory as an ordinary URL segment', () => {
    const { problems, tree } = parseRouteTree(['page.tsx', '_drafts/page.tsx']);
    expect(problems).toStrictEqual([]);
    expect(childOf(tree, '_drafts')).toMatchObject({
      kind: 'literal',
      key: '/_drafts',
      page: '_drafts/page.tsx',
    });
  });

  it('ignores dotfiles, which the system or an editor leaves behind', () => {
    const { problems, tree } = parseRouteTree([
      '.DS_Store',
      'page.tsx',
      'products/.page.tsx.swp',
      'products/page.tsx',
      '.cache/page.tsx',
    ]);
    expect(problems).toStrictEqual([]);
    expect(tree.children.map((child) => child.name)).toStrictEqual([
      'products',
    ]);
  });

  it('names a malformed param directory', () => {
    const { problems } = parseRouteTree(['[123]/page.tsx']);
    expect(problems[0]?.message).toMatch(/valid param directory/u);
  });

  it('rejects a segment that cannot appear in a URL', () => {
    const { problems } = parseRouteTree(['pro ducts/page.tsx']);
    expect(problems[0]?.message).toMatch(/cannot be a URL segment/u);
  });

  it('rejects the same param name twice in one path', () => {
    const { problems } = parseRouteTree(['[id]/things/[id]/page.tsx']);
    expect(problems).toHaveLength(1);
    expect(problems[0]?.message).toMatch(/already taken by an ancestor/u);
  });

  it('rejects a layout with no page below it', () => {
    const { problems } = parseRouteTree(['page.tsx', 'orphan/layout.tsx']);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatchObject({ path: 'orphan' });
    expect(problems[0]?.message).toMatch(/can never render/u);
  });

  it('catches two groups fighting over the same URL', () => {
    const { problems } = parseRouteTree(['(a)/page.tsx', '(b)/page.tsx']);
    expect(problems).toHaveLength(1);
    expect(problems[0]?.message).toMatch(
      /already declared by \(a\)\/page\.tsx/u,
    );
  });

  it('reports every problem at once, not just the first', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      'stray.ts',
      '[1bad]/page.tsx',
    ]);
    expect(problems.length).toBeGreaterThan(1);
  });
});

describe('error.tsx and redirect.ts', () => {
  it('fills the error and redirect slots from the convention filenames', () => {
    const { tree, problems } = parseRouteTree([
      'page.tsx',
      'error.tsx',
      'old/redirect.ts',
    ]);
    expect(problems).toStrictEqual([]);
    expect(tree.error).toBe('error.tsx');
    expect(childOf(tree, 'old').redirect).toBe('old/redirect.ts');
  });

  it('lets a directory declare a route with a redirect alone', () => {
    const { problems } = parseRouteTree(['page.tsx', 'old/redirect.ts']);
    expect(problems).toStrictEqual([]);
  });

  it('refuses a directory that both renders and redirects', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      'old/page.tsx',
      'old/redirect.ts',
    ]);
    expect(problems).toStrictEqual([
      {
        path: 'old/redirect.ts',
        message: '"old" cannot both render page.tsx and redirect — keep one',
      },
    ]);
  });

  it('counts a redirect as a declared URL, so a second one at the same URL is refused', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      '(a)/old/redirect.ts',
      '(b)/old/page.tsx',
    ]);
    expect(problems).toHaveLength(1);
    expect(problems[0]?.message).toContain('"/old" is already declared');
  });
});

describe('guard.ts', () => {
  it('fills the guard slot of the directory it sits in', () => {
    const { tree, problems } = parseRouteTree([
      'page.tsx',
      'guard.ts',
      'admin/guard.ts',
      'admin/page.tsx',
    ]);
    expect(problems).toStrictEqual([]);
    expect(tree.guard).toBe('guard.ts');
    expect(childOf(tree, 'admin').guard).toBe('admin/guard.ts');
  });

  it('declares no route of its own, so a directory holding only one is refused', () => {
    const { problems } = parseRouteTree(['page.tsx', 'admin/guard.ts']);
    expect(problems).toStrictEqual([
      {
        path: 'admin',
        message:
          'declares no route — every directory needs a page.tsx (or a redirect.ts or route.ts) somewhere below it',
      },
    ]);
  });
});

describe('slotOf', () => {
  it.each([
    ['guard.ts', 'guard'],
    ['admin/guard.ts', 'guard'],
    ['(auth)/[id]/page.tsx', 'page'],
    ['old/redirect.ts', 'redirect'],
    ['_parts/guard.ts', 'guard'],
    ['[locale]/posts/[id]/fallback.tsx', 'fallback'],
  ])('reads %s as the %s slot', (file, slot) => {
    expect(slotOf(file)).toBe(slot);
  });

  it.each(['.cache/guard.ts', 'admin/.drafts/page.tsx'])(
    'reads nothing from %s, which is hidden',
    (file) => {
      expect(slotOf(file)).toBeNull();
    },
  );

  it('reads nothing from a name outside the convention', () => {
    expect(slotOf('products/helper.ts')).toBeNull();
  });
});

describe('route.ts', () => {
  it('fills the route slot, and declares the URL of its directory', () => {
    const { tree, problems } = parseRouteTree([
      'page.tsx',
      'feed.xml/route.ts',
    ]);
    expect(problems).toStrictEqual([]);
    expect(childOf(tree, 'feed.xml').route).toBe('feed.xml/route.ts');
  });

  it('refuses a directory that both renders and answers from route.ts', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      'api/page.tsx',
      'api/route.ts',
    ]);
    expect(problems).toStrictEqual([
      {
        path: 'api/route.ts',
        message:
          '"api" cannot both render page.tsx and answer from route.ts — keep one',
      },
    ]);
  });

  it('refuses a directory that both redirects and answers from route.ts', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      'old/redirect.ts',
      'old/route.ts',
    ]);
    expect(problems).toStrictEqual([
      {
        path: 'old/route.ts',
        message:
          '"old" cannot both redirect and answer from route.ts — keep one',
      },
    ]);
  });

  it('counts as a declared URL, so a page at the same URL through a group is refused', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      '(a)/feed/route.ts',
      '(b)/feed/page.tsx',
    ]);
    expect(problems).toHaveLength(1);
    expect(problems[0]?.message).toContain('"/feed" is already declared');
  });
});

describe('loading.tsx', () => {
  it('fills the loading slot of the directory it sits in', () => {
    const { tree, problems } = parseRouteTree([
      'page.tsx',
      'products/loading.tsx',
      'products/page.tsx',
    ]);
    expect(problems).toStrictEqual([]);
    expect(childOf(tree, 'products').loading).toBe('products/loading.tsx');
  });

  it('declares no route of its own', () => {
    const { problems } = parseRouteTree(['page.tsx', 'empty/loading.tsx']);
    expect(problems.map((problem) => problem.path)).toStrictEqual(['empty']);
  });
});

describe('fallback.tsx', () => {
  it('fills the fallback slot of the directory it sits in, and declares no URL of its own', () => {
    const { tree, problems } = parseRouteTree([
      'page.tsx',
      'posts/[id]/page.tsx',
      'posts/[id]/fallback.tsx',
    ]);
    expect(problems).toStrictEqual([]);
    expect(childOf(childOf(tree, 'posts'), '[id]').fallback).toBe(
      'posts/[id]/fallback.tsx',
    );
  });

  it('reports a lone fallback.tsx only as a directory that declares no route', () => {
    const { problems } = parseRouteTree(['page.tsx', 'x/fallback.tsx']);
    expect(problems).toStrictEqual([
      {
        path: 'x',
        message:
          'declares no route — every directory needs a page.tsx (or a redirect.ts or route.ts) somewhere below it',
      },
    ]);
  });

  it('refuses one with no page.tsx beside it, a route.ts not counting', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      'feed/[id]/route.ts',
      'feed/[id]/fallback.tsx',
    ]);
    expect(problems).toStrictEqual([
      {
        path: 'feed/[id]/fallback.tsx',
        message:
          'fallback.tsx stands in for the page.tsx beside it, and "feed/[id]" has none',
      },
    ]);
  });

  it('refuses one beside a layout.tsx, before anything else about it', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      'posts/[id]/layout.tsx',
      'posts/[id]/page.tsx',
      'posts/[id]/fallback.tsx',
    ]);
    expect(problems).toStrictEqual([
      {
        path: 'posts/[id]/fallback.tsx',
        message:
          'fallback.tsx cannot sit beside layout.tsx — that layout receives every parameter of "posts/[id]", so no shell could leave one to the browser; move the layout one directory up, or into page.tsx and fallback.tsx',
      },
    ]);
  });

  it('refuses one whose pattern has no parameter', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      'about/page.tsx',
      'about/fallback.tsx',
    ]);
    expect(problems).toStrictEqual([
      {
        path: 'about/fallback.tsx',
        message:
          'fallback.tsx stands in for values the build did not write, and "/about" has no parameter; remove it',
      },
    ]);
  });

  it('refuses one whose every parameter reaches a layout above it', () => {
    const { problems } = parseRouteTree([
      'page.tsx',
      '[locale]/about/layout.tsx',
      '[locale]/about/(x)/page.tsx',
      '[locale]/about/(x)/fallback.tsx',
    ]);
    expect(problems).toStrictEqual([
      {
        path: '[locale]/about/(x)/fallback.tsx',
        message:
          'fallback.tsx has nothing to leave to the browser — [locale]/about/layout.tsx receives every parameter of "/:locale/about"; remove fallback.tsx and list the values in paths',
      },
    ]);
  });

  it.each([['error.tsx'], ['loading.tsx']])('accepts one beside %s', (file) => {
    const { problems } = parseRouteTree([
      'page.tsx',
      `posts/[id]/${file}`,
      'posts/[id]/page.tsx',
      'posts/[id]/fallback.tsx',
    ]);
    expect(problems).toStrictEqual([]);
  });
});

describe('fallbackShapes', () => {
  it('leaves every parameter open under a layout that sits in a group', () => {
    const { tree } = parseRouteTree([
      '(blog)/layout.tsx',
      '(blog)/[section]/posts/[id]/page.tsx',
      '(blog)/[section]/posts/[id]/fallback.tsx',
    ]);
    expect(fallbackShapes(tree)).toStrictEqual([
      {
        pattern: '/:section/posts/:id',
        file: '(blog)/[section]/posts/[id]/fallback.tsx',
        page: '(blog)/[section]/posts/[id]/page.tsx',
        params: ['section', 'id'],
        open: ['section', 'id'],
        layout: '(blog)/layout.tsx',
      },
    ]);
  });

  it('closes the parameters the deepest layout above it receives', () => {
    const { tree } = parseRouteTree([
      'layout.tsx',
      '[section]/layout.tsx',
      '[section]/posts/[id]/page.tsx',
      '[section]/posts/[id]/fallback.tsx',
    ]);
    expect(fallbackShapes(tree)).toStrictEqual([
      {
        pattern: '/:section/posts/:id',
        file: '[section]/posts/[id]/fallback.tsx',
        page: '[section]/posts/[id]/page.tsx',
        params: ['section', 'id'],
        open: ['id'],
        layout: '[section]/layout.tsx',
      },
    ]);
  });

  it('leaves out a fallback.tsx the grammar refuses', () => {
    const { tree } = parseRouteTree([
      'page.tsx',
      'about/page.tsx',
      'about/fallback.tsx',
    ]);
    expect(fallbackShapes(tree)).toStrictEqual([]);
  });
});
