import { parseRouteTree, buildTable } from '@k8ordo/framework-engine';
import { defineRoutes } from '@k8ordo/router';
import type { FC } from 'react';

import {
  catchAllPath,
  catchAllPatterns,
  dirFor,
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

  it('refuses a supplied path that still holds a parameter', () => {
    // パラメータが 2 つある表を 1 つだけ展開すると、こういう値が残る
    const plan = planPaths(
      treeOf(['page.tsx', '[locale]/blog/[slug]/page.tsx']),
      ['/ja/blog/:slug'],
    );
    expect(plan.unusable).toStrictEqual(['/ja/blog/:slug']);
    expect(plan.unresolved).toStrictEqual(['/:locale/blog/:slug']);
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
    expect(catchAllPatterns(tree)).toStrictEqual(['/*', '/docs/*']);
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
