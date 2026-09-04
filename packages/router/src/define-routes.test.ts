import { lazy } from 'react';
import type { FC } from 'react';

import { defineRoutes } from './define-routes';
import type { PatternOf, RouteOf } from './define-routes';
import { href } from './links';

const Home: FC = () => null;
const LocaleLayout: FC = () => null;
const LocaleHome: FC = () => null;
const ProductList: FC = () => null;
const ProductPage: FC = () => null;
const NotFound: FC = () => null;
const First: FC = () => null;
const Second: FC = () => null;
const Marketing: FC = () => null;
const Docs: FC = () => null;

const routes = defineRoutes({
  '/': Home,
  '/:locale': {
    layout: LocaleLayout,
    children: {
      '/': LocaleHome,
      '/products': ProductList,
      '/products/:id': ProductPage,
      '/*': NotFound,
    },
  },
});

describe('match', () => {
  it('resolves the root to its own leaf with an empty stack prefix', () => {
    expect(routes.match('/')).toStrictEqual({
      pattern: '/',
      params: {},
      stack: [Home],
    });
  });

  it('carries the layout chain outer-first and the leaf last', () => {
    expect(routes.match('/ja')).toStrictEqual({
      pattern: '/:locale',
      params: { locale: 'ja' },
      stack: [LocaleLayout, LocaleHome],
    });
  });

  it('composes nested patterns and merges their params', () => {
    expect(routes.match('/ja/products/42')).toStrictEqual({
      pattern: '/:locale/products/:id',
      params: { locale: 'ja', id: '42' },
      stack: [LocaleLayout, ProductPage],
    });
  });

  it('lets the wildcard catch what nothing before it matched', () => {
    const matched = routes.match('/ja/no/such/page');
    expect(matched?.pattern).toBe('/:locale/*');
    expect(matched?.stack).toStrictEqual([LocaleLayout, NotFound]);
    // URLPattern の匿名ワイルドカードは数値キーで捕まるが、表が名前を
    // 付けたものだけを params とする
    expect(matched?.params).toStrictEqual({ locale: 'ja' });
  });

  it('treats a trailing slash as the same pathname', () => {
    expect(routes.match('/ja/products/')?.pattern).toBe('/:locale/products');
    expect(routes.match('/ja/products///')?.pattern).toBe('/:locale/products');
    expect(routes.match('///')?.pattern).toBe('/');
  });

  it('decodes param values from the pathname', () => {
    expect(routes.match('/ja/products/a%2Fb')?.params['id']).toBe('a/b');
  });

  it('honours declaration order, not specificity', () => {
    const paramFirst = defineRoutes({ '/:x': First, '/a': Second });
    expect(paramFirst.match('/a')?.stack).toStrictEqual([First]);

    const staticFirst = defineRoutes({ '/a': Second, '/:x': First });
    expect(staticFirst.match('/a')?.stack).toStrictEqual([Second]);
  });

  it('returns null when nothing in the table matches', () => {
    const only = defineRoutes({ '/only': Home });
    expect(only.match('/elsewhere')).toBeNull();
  });
});

describe('route groups', () => {
  const grouped = defineRoutes({
    '/(marketing)': {
      layout: Marketing,
      children: { '/': Home, '/pricing': ProductList },
    },
    '/(docs)': {
      layout: Docs,
      children: { '/guide': ProductPage },
    },
  });

  it('structures the table without contributing a URL segment', () => {
    expect(grouped.match('/')).toStrictEqual({
      pattern: '/',
      params: {},
      stack: [Marketing, Home],
    });
    expect(grouped.match('/pricing')?.stack).toStrictEqual([
      Marketing,
      ProductList,
    ]);
  });

  it('lets sibling groups own different layouts at the same depth', () => {
    expect(grouped.match('/guide')?.stack).toStrictEqual([Docs, ProductPage]);
  });

  it('applies inside a nested branch too', () => {
    const nested = defineRoutes({
      '/products': {
        children: { '/(admin)': { layout: Docs, children: { '/new': Home } } },
      },
    });
    expect(nested.match('/products/new')?.stack).toStrictEqual([Docs, Home]);
  });

  it('rejects a group with no children — it would redeclare the index', () => {
    expect(() => defineRoutes({ '/(oops)': Home })).toThrow(
      /must have children/u,
    );
  });
});

describe('patterns under a root layout', () => {
  // 生成器が出す形: すべてが透過キー '/' の下のブランチに入る
  const wrapped = defineRoutes({
    '/': {
      layout: LocaleLayout,
      children: {
        '/': Home,
        '/products': { children: { '/': ProductList, '/:id': ProductPage } },
        '/(docs)': { layout: Docs, children: { '/guide': First } },
      },
    },
  });

  it('does not double the leading slash', () => {
    expect(wrapped.match('/products')?.pattern).toBe('/products');
    expect(wrapped.match('/products/7')?.params).toStrictEqual({ id: '7' });
    expect(wrapped.match('/guide')?.stack).toStrictEqual([
      LocaleLayout,
      Docs,
      First,
    ]);
  });

  it('says the same thing in the type', () => {
    expectTypeOf<PatternOf<typeof wrapped.record>>().toEqualTypeOf<
      '/' | '/products' | '/products/:id' | '/guide'
    >();
  });
});

describe('href', () => {
  it('substitutes and URL-encodes param values, importing no table', () => {
    expect(href('/:locale/products/:id', { locale: 'ja', id: 'a/b' })).toBe(
      '/ja/products/a%2Fb',
    );
  });

  it('takes no params argument when the pattern declares none', () => {
    expect(href('/')).toBe('/');
    expect(href('/:locale/products', { locale: 'en' })).toBe('/en/products');
  });

  it('refuses a wildcard — matched, never linked', () => {
    expect(() => href('/:locale/*', { locale: 'ja' })).toThrow(/wildcard/u);
  });

  it('keeps the path shape in the type for typed-path consumers', () => {
    expectTypeOf(
      href('/:locale/products/:id', { locale: 'ja', id: '1' }),
    ).toEqualTypeOf<`/${string}/products/${string}`>();
    expectTypeOf<RouteOf<typeof routes>>().toEqualTypeOf<
      | '/'
      | `/${string}`
      | `/${string}/products`
      | `/${string}/products/${string}`
    >();

    expect(rejectedByTypes).toBeInstanceOf(Function);
  });
});

// 型検査だけが目的で、実行はしない(実行すれば正しく throw する)。
// パターンが表に実在するかの検査は Register 宣言後に効く(このパッケージ
// 内で augment するとコンパイル全体に漏れるため、ここでは検査しない)
const rejectedByTypes = () => {
  // @ts-expect-error ":id" is missing
  href('/:locale/products/:id', { locale: 'ja' });
  // @ts-expect-error a pattern starts with "/"
  href('products');
};

describe('defineRoutes', () => {
  it('rejects a pattern declared twice, wherever the copies nest', () => {
    expect(() =>
      defineRoutes({
        '/x': Home,
        '/': { children: { '/x': NotFound } },
      }),
    ).toThrow(/declared twice/u);
  });

  it('rejects a pattern URLPattern cannot parse, at definition time', () => {
    expect(() => defineRoutes({ '/(': Home })).toThrow(TypeError);
  });

  it('takes a lazy component as a leaf, not as a branch', () => {
    // React.lazy は関数ではなくオブジェクトを返すので、branch の判定を
    // typeof ではなく children の有無で行っている。その保証。
    const Lazy = lazy(() => Promise.resolve({ default: Home }));
    const lazyRoutes = defineRoutes({ '/late': Lazy });
    expect(lazyRoutes.match('/late')).toMatchObject({
      pattern: '/late',
      stack: [Lazy],
    });
  });
});
