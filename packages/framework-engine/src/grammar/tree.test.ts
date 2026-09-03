import { parseRouteTree } from './tree';
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
