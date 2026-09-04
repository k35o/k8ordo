import { parseRouteTree, buildTable } from '@k8ordo/framework-engine';
import { defineRoutes } from '@k8ordo/router';
import type { FC } from 'react';

import {
  catchAllPath,
  patternsNeedingPaths,
  patternsOf,
  planPaths,
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

describe('catchAllPath', () => {
  it('is nothing when the table declares no catch-all', () => {
    expect(catchAllPath(treeOf(['page.tsx']))).toBeNull();
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
