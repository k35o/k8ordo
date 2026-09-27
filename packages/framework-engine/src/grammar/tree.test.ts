import { parseRouteTree, slotOf } from './tree';
import type { RouteDir } from './tree';

const childOf = (dir: RouteDir, name: string): RouteDir => {
  const found = dir.children.find((child) => child.name === name);
  if (found === undefined) throw new Error(`no child "${name}"`);
  return found;
};

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
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatchObject({ path: 'products/helper.ts' });
    expect(problems[0]?.message).toMatch(/_-prefixed directory/u);
  });

  it('ignores anything under a _-prefixed directory', () => {
    const { problems, tree } = parseRouteTree([
      'page.tsx',
      '_parts/filters.tsx',
      'products/page.tsx',
      'products/_parts/table.tsx',
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
  ])('reads %s as the %s slot', (file, slot) => {
    expect(slotOf(file)).toBe(slot);
  });

  it.each(['_parts/guard.ts', 'admin/_lib/page.tsx', '.cache/guard.ts'])(
    'reads nothing from %s, which is private',
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
