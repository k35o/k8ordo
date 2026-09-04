import { defineRoutes } from '@k8ordo/router';
import type { FC } from 'react';

import { parseRouteTree } from '../grammar/tree';
import { buildTable } from './emit';

/**
 * The structure the emitter renders to source, handed instead to the real
 * `defineRoutes`. This proves what text assertions cannot: that the router
 * accepts what the generator builds, and that it matches the way the
 * directories said it would.
 */
const nothing: FC = () => null;
const stubs = new Map<string, FC>();
const stub = (file: string): FC => {
  const existing = stubs.get(file);
  if (existing !== undefined) return existing;
  // 同一性で stack を検証するので、ファイルごとに別のラッパーを作る
  const component: FC = nothing.bind(null);
  stubs.set(file, component);
  return component;
};

const tableFor = (files: readonly string[]) => {
  const { tree, problems } = parseRouteTree(files);
  expect(problems).toStrictEqual([]);
  return defineRoutes(buildTable(tree, stub));
};

describe('the generated table, given to the router', () => {
  const routes = tableFor([
    'layout.tsx',
    'page.tsx',
    'not-found.tsx',
    'products/page.tsx',
    'products/[id]/page.tsx',
    '(docs)/layout.tsx',
    '(docs)/guide/page.tsx',
  ]);

  it('matches the index through the root layout', () => {
    expect(routes.match('/')).toMatchObject({
      pattern: '/',
      stack: [stub('layout.tsx'), stub('page.tsx')],
    });
  });

  it('matches a param directory and names the param', () => {
    expect(routes.match('/products/42')).toMatchObject({
      pattern: '/products/:id',
      params: { id: '42' },
      stack: [stub('layout.tsx'), stub('products/[id]/page.tsx')],
    });
  });

  it('applies a group layout without putting the group in the URL', () => {
    expect(routes.match('/guide')).toMatchObject({
      pattern: '/guide',
      stack: [
        stub('layout.tsx'),
        stub('(docs)/layout.tsx'),
        stub('(docs)/guide/page.tsx'),
      ],
    });
  });

  it('falls back to not-found only when nothing else matched', () => {
    expect(routes.match('/products')?.pattern).toBe('/products');
    expect(routes.match('/nowhere')).toMatchObject({
      pattern: '/*',
      stack: [stub('layout.tsx'), stub('not-found.tsx')],
    });
  });
});

describe('literal siblings of a parameter', () => {
  // ディレクトリはファイル名順で届き、`[` は英小文字より前に来る。素直に
  // 並べると /:slug が /about を隠して、宣言したページに到達できなくなる。
  const routes = tableFor([
    'page.tsx',
    'about/page.tsx',
    '[slug]/page.tsx',
    'blog/[id]/page.tsx',
    'blog/latest/page.tsx',
  ]);

  it('reach their own page, not the parameter', () => {
    expect(routes.match('/about')).toMatchObject({
      pattern: '/about',
      stack: [stub('about/page.tsx')],
    });
    expect(routes.match('/blog/latest')).toMatchObject({
      pattern: '/blog/latest',
      stack: [stub('blog/latest/page.tsx')],
    });
  });

  it('are not shadowed by a parameter hiding inside a group', () => {
    // グループは URL を持たないので、中身がそのまま兄弟と並ぶ。順序は
    // 「そのグループが最初に差し出すもの」で決まる。
    const grouped = tableFor([
      'page.tsx',
      'about/page.tsx',
      '(marketing)/layout.tsx',
      '(marketing)/[slug]/page.tsx',
    ]);
    expect(grouped.match('/about')?.pattern).toBe('/about');
    expect(grouped.match('/anything')?.pattern).toBe('/:slug');
  });

  it('leave the parameter everything else', () => {
    expect(routes.match('/anything')).toMatchObject({
      pattern: '/:slug',
      params: { slug: 'anything' },
    });
    expect(routes.match('/blog/42')).toMatchObject({
      pattern: '/blog/:id',
      params: { id: '42' },
    });
  });
});
