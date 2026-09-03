import { parseRouteTree } from '@k8ordo/framework-engine';

import { patternsOf, planPaths } from './paths';

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

  it('never renders the catch-all as a page of its own', () => {
    const plan = planPaths(treeOf(['page.tsx', 'not-found.tsx']), []);
    expect(plan.paths).toStrictEqual(['/']);
    expect(plan.unresolved).toStrictEqual([]);
  });
});
