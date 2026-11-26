import { lazy } from 'react';
import type { FC } from 'react';
import { describe, expect, expectTypeOf, it } from 'vite-plus/test';

import { defineRoutes } from './define-routes';
import type { NavigablePath, PatternOf } from './define-routes';
import { href } from './links';
import type { ParamsOf, PathFor, PathMatching } from './paths';

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
    expect(routes.match('/ja/products/a%2Fb')?.params.id).toBe('a/b');
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

  it('types what it builds as a URL, not as a path in the table', () => {
    // base を前に付けた URL なので、表のパスの形で型を付けると、base を
    // 自分で足す state の href などへそのまま渡せてしまい、base が二重になる
    expectTypeOf(
      href('/:locale/products/:id', { locale: 'ja', id: '1' }),
    ).toEqualTypeOf<string>();

    expect(rejectedByTypes).toBeInstanceOf(Function);
  });
});

describe('NavigablePath', () => {
  it('takes a path a navigable pattern matches, segment by segment', () => {
    expectTypeOf<NavigablePath<typeof routes, '/'>>().toEqualTypeOf<'/'>();
    expectTypeOf<NavigablePath<typeof routes, '/ja'>>().toEqualTypeOf<'/ja'>();
    expectTypeOf<
      NavigablePath<typeof routes, '/ja/products/42'>
    >().toEqualTypeOf<'/ja/products/42'>();
  });

  it('takes a param built into a template literal as one segment', () => {
    expectTypeOf<
      NavigablePath<typeof routes, `/${string}/products`>
    >().toEqualTypeOf<`/${string}/products`>();
  });

  it('refuses a path no pattern matches, though a param stands first', () => {
    // 和集合だった頃は '/:locale' が `/${string}` になり、これを通していた
    expectTypeOf<NavigablePath<typeof routes, '/ja/nowhere'>>().toBeNever();
    expectTypeOf<
      NavigablePath<typeof routes, '/ja/products/42/reviews'>
    >().toBeNever();
  });

  it('refuses a path only the wildcard matches — matched, never linked', () => {
    expectTypeOf<
      NavigablePath<typeof routes, '/ja/no/such/page'>
    >().toBeNever();
  });

  it('refuses a trailing slash — a link is spelled the one way the table matches', () => {
    // 実行時の match は末尾スラッシュを同じ pathname として受けるが、
    // リンクとして組み立てるパスは正規形（末尾スラッシュなし）に揃えさせる
    expectTypeOf<NavigablePath<typeof routes, '/ja/products/'>>().toBeNever();
  });

  it('refuses an empty segment where a param stands', () => {
    expectTypeOf<NavigablePath<typeof routes, '//products'>>().toBeNever();
  });

  it('refuses a path that is not spelled from the root', () => {
    expectTypeOf<NavigablePath<typeof routes, 'ja/products'>>().toBeNever();
    expectTypeOf<NavigablePath<typeof routes, string>>().toBeNever();
  });

  it('keeps only the members of a union that match', () => {
    expectTypeOf<
      NavigablePath<typeof routes, '/ja' | '/ja/nowhere'>
    >().toEqualTypeOf<'/ja'>();
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

  it.each([
    ['/:id?', ':id?'],
    ['/files/:path*', ':path*'],
    ['/foo-:bar', 'foo-:bar'],
    ['/files/*.pdf', '*.pdf'],
    ['/a{b}?', 'a{b}?'],
    ['/a+b', 'a+b'],
    ['/a\\b', 'a\\b'],
    ['/:', ':'],
    ['/:a-b', ':a-b'],
  ])(
    'rejects %s, a segment outside the grammar, naming the pattern and the segment',
    (pattern, segment) => {
      expect(() => defineRoutes({ [pattern]: Home })).toThrow(
        new TypeError(
          `route pattern "${pattern}" has the segment "${segment}", which is not part of the grammar — a segment is a literal holding none of : * ? + { } ( ) \\, a ":name", or — last — a ":name+" or a "*"`,
        ),
      );
    },
  );

  it('rejects an empty segment', () => {
    expect(() => defineRoutes({ '/a//b': Home })).toThrow(
      /route pattern "\/a\/\/b" has an empty segment/u,
    );
    expect(() => defineRoutes({ '/a/': Home })).toThrow(
      /route pattern "\/a\/" has an empty segment/u,
    );
  });

  it('rejects a rest param anywhere but at the end of the full pattern', () => {
    expect(() => defineRoutes({ '/files/:path+/edit': Home })).toThrow(
      new TypeError(
        'route pattern "/files/:path+/edit" puts ":path+" before the end — a rest param must be the last segment',
      ),
    );
  });

  it('rejects a rest param that ends a branch key with children after it', () => {
    expect(() =>
      defineRoutes({ '/files/:path+': { children: { '/edit': Home } } }),
    ).toThrow(/"\/files\/:path\+\/edit" puts ":path\+" before the end/u);
  });

  it('rejects a wildcard anywhere but at the end of the full pattern', () => {
    expect(() => defineRoutes({ '/*/edit': Home })).toThrow(
      new TypeError(
        'route pattern "/*/edit" puts "*" before the end — a wildcard must be the last segment',
      ),
    );
    expect(() =>
      defineRoutes({ '/docs/*': { children: { '/edit': Home } } }),
    ).toThrow(/"\/docs\/\*\/edit" puts "\*" before the end/u);
  });

  it('takes a rest param or a wildcard that a branch puts last', () => {
    const table = defineRoutes({
      '/files/:path+': { layout: Home, children: { '/': First } },
      '/docs': { children: { '/(guide)': { children: { '/*': Second } } } },
    });
    expect(table.match('/files/a/b')?.params).toStrictEqual({
      path: ['a', 'b'],
    });
    expect(table.match('/docs/any/thing')?.stack).toStrictEqual([Second]);
  });

  it('takes a param named as a JavaScript identifier, as URLPattern reads it', () => {
    const table = defineRoutes({ '/:$id/:_part/:café': Home });
    expect(table.match('/1/2/3')?.params).toStrictEqual({
      $id: '1',
      _part: '2',
      café: '3',
    });
  });

  it('rejects parentheses that are not exactly a group', () => {
    // URLPattern はこれを正規表現グループとして受け取り、/admin/new に
    // 一致してしまう。グループの意味は 1 つだけ
    expect(() => defineRoutes({ '/(admin)/new': Home })).toThrow(
      /route group/u,
    );
    expect(() =>
      defineRoutes({ '/x': { children: { '/(a)b': Home } } }),
    ).toThrow(/route group/u);
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

describe('matchAll', () => {
  it('lists every pattern that fits, in declaration order', () => {
    expect(
      [...routes.matchAll('/ja/products/42')].map((found) => found.pattern),
    ).toStrictEqual(['/:locale/products/:id', '/:locale/*']);
  });

  it('hands each fit its own params, decoded', () => {
    expect(
      [...routes.matchAll('/ja/products/caf%C3%A9')].map(
        (found) => found.params,
      ),
    ).toStrictEqual([{ locale: 'ja', id: 'café' }, { locale: 'ja' }]);
  });

  it('lists nothing when no pattern fits', () => {
    const lone = defineRoutes({ '/about': Home });
    expect([...lone.matchAll('/elsewhere')]).toStrictEqual([]);
  });
});

describe('href with schema-typed params', () => {
  it('spells a number or a boolean the one way a schema reads back', () => {
    expect(href('/:locale/products/:id', { locale: 'ja', id: 42 })).toBe(
      '/ja/products/42',
    );
    expect(href('/:locale/products/:id', { locale: 'ja', id: true })).toBe(
      '/ja/products/true',
    );
  });

  it('refuses a value that has no URL spelling', () => {
    expect(() =>
      href('/:locale/products/:id', { locale: 'ja', id: { a: 1 } as never }),
    ).toThrow(/no URL spelling/u);
  });
});

describe('a rest param', () => {
  const Files: FC = () => null;
  const FileIndex: FC = () => null;
  const Readme: FC = () => null;
  const One: FC = () => null;
  const files = defineRoutes({
    '/files': FileIndex,
    '/files/readme': Readme,
    '/files/:path+': Files,
    '/:locale/docs/:id': One,
    '/:locale/docs/:path+': Files,
    '/*': NotFound,
  });

  it('takes every remaining segment, as an array', () => {
    expect(files.match('/files/a/b/c')).toStrictEqual({
      pattern: '/files/:path+',
      params: { path: ['a', 'b', 'c'] },
      stack: [Files],
    });
  });

  it('hands a single segment over as an array of one', () => {
    expect(files.match('/files/a')?.params).toStrictEqual({ path: ['a'] });
  });

  it('does not take zero segments', () => {
    expect(files.match('/files')?.pattern).toBe('/files');
    expect(files.match('/files/')?.pattern).toBe('/files');
    expect(defineRoutes({ '/files/:path+': Files }).match('/files')).toBeNull();
  });

  it('does not take an empty segment', () => {
    expect(files.match('/files/a//b')?.pattern).toBe('/*');
  });

  it('decodes each segment on its own, so an escaped slash stays inside one', () => {
    expect(files.match('/files/a%2Fb/caf%C3%A9')?.params).toStrictEqual({
      path: ['a/b', 'café'],
    });
  });

  it('keeps the spelling of a segment that does not decode', () => {
    expect(files.match('/files/%E0%A4%A/b')?.params).toStrictEqual({
      path: ['%E0%A4%A', 'b'],
    });
  });

  it('comes after what is declared before it, and before what is declared after', () => {
    expect(files.match('/files/readme')?.pattern).toBe('/files/readme');
    expect(
      [...files.matchAll('/ja/docs/intro')].map((found) => found.pattern),
    ).toStrictEqual(['/:locale/docs/:id', '/:locale/docs/:path+', '/*']);
  });

  it('sits beside the params before it', () => {
    expect(files.match('/ja/docs/guide/intro')?.params).toStrictEqual({
      locale: 'ja',
      path: ['guide', 'intro'],
    });
  });

  it('types its param as the segments it took', () => {
    expectTypeOf<ParamsOf<'/files/:path+'>['path']>().toEqualTypeOf<
      readonly string[]
    >();
    type Docs = ParamsOf<'/:locale/docs/:path+'>;
    expectTypeOf<Docs['locale']>().toEqualTypeOf<string>();
    expectTypeOf<Docs['path']>().toEqualTypeOf<readonly string[]>();
    expectTypeOf<keyof Docs>().toEqualTypeOf<'locale' | 'path'>();
  });

  it('types its paths as everything below the prefix', () => {
    expectTypeOf<
      PathFor<'/files/:path+'>
    >().toEqualTypeOf<`/files/${string}`>();
  });

  it('takes a path of one segment or more, and none of zero', () => {
    type Fits<Path extends string> = PathMatching<Path, '/files/:path+'>;
    expectTypeOf<Fits<'/files/a'>>().toEqualTypeOf<'/files/a'>();
    expectTypeOf<Fits<'/files/a/b/c'>>().toEqualTypeOf<'/files/a/b/c'>();
    expectTypeOf<
      Fits<`/files/${string}`>
    >().toEqualTypeOf<`/files/${string}`>();
    expectTypeOf<Fits<'/files'>>().toBeNever();
    expectTypeOf<Fits<'/files/'>>().toBeNever();
    expectTypeOf<Fits<'/files/a//b'>>().toBeNever();
    expectTypeOf<Fits<'/files/a/'>>().toBeNever();
    expectTypeOf<Fits<'/other/a'>>().toBeNever();
  });

  it('is a path a link can point at', () => {
    expectTypeOf<
      NavigablePath<typeof files, '/files/a/b'>
    >().toEqualTypeOf<'/files/a/b'>();
    expectTypeOf<
      NavigablePath<typeof files, '/ja/docs/guide/intro'>
    >().toEqualTypeOf<'/ja/docs/guide/intro'>();
  });
});

describe('href with a rest param', () => {
  it('escapes each segment and joins them with slashes', () => {
    expect(href('/files/:path+', { path: ['a', 'b'] })).toBe('/files/a/b');
    expect(href('/files/:path+', { path: ['a/b', 'café', 'x y'] })).toBe(
      '/files/a%2Fb/caf%C3%A9/x%20y',
    );
  });

  it('spells a number the one way a schema reads back', () => {
    expect(href('/files/:path+', { path: [2026, 'report'] })).toBe(
      '/files/2026/report',
    );
  });

  it('builds a path the pattern gives back as the same segments', () => {
    const files = defineRoutes({ '/files/:path+': Home });
    const path = ['a/b', 'c d'];
    expect(files.match(href('/files/:path+', { path }))?.params).toStrictEqual({
      path,
    });
  });

  it('refuses an empty array — the pattern takes one segment or more', () => {
    expect(() => href('/files/:path+', { path: [] })).toThrow(
      '"/files/:path+" needs at least one segment for ":path+"',
    );
  });

  it('refuses an empty segment', () => {
    expect(() => href('/files/:path+', { path: ['a', ''] })).toThrow(
      '"/files/:path+" got an empty segment for ":path+"',
    );
  });

  it('refuses a value that is not an array, and a segment with no URL spelling', () => {
    expect(() => href('/files/:path+', { path: 'a/b' as never })).toThrow(
      '"/files/:path+" takes an array of segments for ":path+"',
    );
    expect(() => href('/files/:path+', { path: [{ a: 1 }] as never })).toThrow(
      '"/files/:path+" got a segment for ":path+" that has no URL spelling',
    );
  });

  it('refuses a missing value', () => {
    // @ts-expect-error ":path+" is missing
    expect(() => href('/files/:path+')).toThrow(
      '"/files/:path+" needs a value for ":path+"',
    );
  });

  it('takes an array and nothing else, in the type', () => {
    const rejected = (): void => {
      // @ts-expect-error a rest param is an array of segments
      href('/files/:path+', { path: 'a' });
      // @ts-expect-error a single param is not an array
      href('/products/:id', { id: ['a'] });
    };
    expect(rejected).toBeTypeOf('function');
  });
});
