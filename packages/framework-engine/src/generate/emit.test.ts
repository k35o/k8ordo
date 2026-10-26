import { describe, expect, it } from 'vite-plus/test';

import { parseRouteTree } from '../grammar/tree';
import {
  emitRegisterModule,
  emitRoutesModule,
  unreachableRoutes,
} from './emit';

const emit = (files: readonly string[]): string => {
  const { tree, problems } = parseRouteTree(files);
  expect(problems).toStrictEqual([]);
  return emitRoutesModule(tree, { importPrefix: './routes' });
};

describe('the emitted table', () => {
  const source = emit([
    'layout.tsx',
    'page.tsx',
    'not-found.tsx',
    'products/page.tsx',
    'products/[id]/page.tsx',
    '(docs)/layout.tsx',
    '(docs)/guide/page.tsx',
  ]);

  it('imports the layouts with the table, extensionless', () => {
    expect(source).toContain("import layout from './routes/layout';");
    expect(source).toContain(
      "import docs_layout from './routes/(docs)/layout';",
    );
  });

  it('reads each page when a request reaches it, extensionless', () => {
    expect(source).toContain("const page = () => import('./routes/page');");
    expect(source).toContain(
      "const products_id_page = () => import('./routes/products/[id]/page');",
    );
  });

  it('reads the router through the framework, never naming the router', () => {
    expect(source).toContain(
      "import { defineRoutes } from '@k8ordo/framework/generated';",
    );
    expect(source).not.toContain('@k8ordo/router');
  });

  it('wraps everything in the root layout through the transparent key', () => {
    expect(source).toContain('export const routes = defineRoutes({');
    expect(source).toMatch(
      /'\/': \{\n\s+layout: layout satisfies Layout<'\/'>,/u,
    );
  });

  it('gives a directory with only a page that page, as lazy() over what reads it', () => {
    expect(source).toContain(
      "'/:id': lazy(products_id_page) satisfies Page<'/products/:id'>,",
    );
    expect(source).toContain("import { lazy } from 'react';");
  });

  it('gives a directory with children a branch', () => {
    expect(source).toMatch(/'\/products': \{\n\s+children: \{/u);
  });

  it('keeps the group key so the layout applies without a URL segment', () => {
    expect(source).toMatch(
      /'\/\(docs\)': \{\n\s+layout: docs_layout satisfies Layout<'\/'>,/u,
    );
  });

  it('places not-found last, where declaration order makes it the fallback', () => {
    const entries = [...source.matchAll(/^\s+'(\/[^']*)':/gmu)].map(
      (match) => match[1],
    );
    expect(entries.at(-1)).toBe('/*');
  });
});

describe('naming', () => {
  it('keeps colliding paths apart', () => {
    const source = emit(['(a)/x/page.tsx', 'a/x/page.tsx']);
    expect(source).toContain(
      "const a_x_page = () => import('./routes/(a)/x/page');",
    );
    expect(source).toContain(
      "const a_x_page_2 = () => import('./routes/a/x/page');",
    );
  });

  it('emits a flat record when the root has no layout', () => {
    const source = emit(['page.tsx', 'about/page.tsx']);
    expect(source).toContain("  '/': lazy(page) satisfies Page<'/'>,");
    expect(source).toContain(
      "  '/about': lazy(about_page) satisfies Page<'/about'>,",
    );
    expect(source).not.toContain('layout:');
    // Layout の別名は使うときだけ出す(未使用のローカル型になるため)
    expect(source).not.toContain('type Layout<');
  });
});

describe('what a route file is promised', () => {
  it('states each page against its own pattern', () => {
    const source = emit([
      'page.tsx',
      'products/page.tsx',
      'products/[id]/page.tsx',
      'not-found.tsx',
    ]);
    expect(source).toContain("lazy(page) satisfies Page<'/'>");
    expect(source).toContain("lazy(products_page) satisfies Page<'/products'>");
    expect(source).toContain(
      "lazy(products_id_page) satisfies Page<'/products/:id'>",
    );
    expect(source).toContain("lazy(not_found) satisfies Page<'/*'>");
  });

  it('states a layout against the prefix every route below it shares', () => {
    const source = emit([
      'layout.tsx',
      'page.tsx',
      '[locale]/layout.tsx',
      '[locale]/page.tsx',
    ]);
    expect(source).toContain("layout satisfies Layout<'/'>");
    expect(source).toContain("locale_layout satisfies Layout<'/:locale'>");
  });

  it('gives a group layout the prefix the group does not add', () => {
    const source = emit([
      'page.tsx',
      '(docs)/layout.tsx',
      '(docs)/guide/page.tsx',
    ]);
    expect(source).toContain("docs_layout satisfies Layout<'/'>");
    expect(source).toContain("lazy(docs_guide_page) satisfies Page<'/guide'>");
  });
});

describe('the emitted register', () => {
  it('wires the table into the router through the framework, never naming the router', () => {
    const source = emitRegisterModule({ routesModule: './routes.gen' });
    expect(source).toContain("declare module '@k8ordo/framework/generated' {");
    expect(source).toContain('routes: typeof routes;');
    expect(source).not.toContain('@k8ordo/router');
  });

  it('wires the same table into state only when the app depends on it', () => {
    const withState = emitRegisterModule({
      routesModule: './routes.gen',
      stateModule: '@k8ordo/state',
    });
    expect(withState).toContain("declare module '@k8ordo/state' {");
    expect(withState.match(/routes: typeof routes;/gu)).toHaveLength(2);

    const without = emitRegisterModule({ routesModule: './routes.gen' });
    expect(without).not.toContain('@k8ordo/state');
  });

  it('loads state itself, so the augmentation holds before any file imports it', () => {
    const source = emitRegisterModule({
      routesModule: './routes.gen',
      stateModule: '@k8ordo/state',
    });
    expect(source).toContain("import type {} from '@k8ordo/state';");
  });

  it('hands route files the request under a running server only', () => {
    const server = emitRegisterModule({
      routesModule: './routes.gen',
      mode: 'server',
    });
    expect(server).toContain(
      "import type { RouteRequest } from '@k8ordo/framework/server';",
    );
    expect(server).toContain('request: RouteRequest;');

    const files = emitRegisterModule({
      routesModule: './routes.gen',
      mode: 'static',
    });
    expect(files).not.toContain('request');
  });

  it('holds every message to the locale set the application declares', () => {
    const source = emitRegisterModule({
      routesModule: './routes.gen',
      localesModule: '../src/i18n',
    });
    expect(source.split('\n')[0]).toBe(
      '// Generated by @k8ordo/framework from routes/ and src/i18n.ts. Do not edit.',
    );
    expect(source).toContain("import type { LocaleOf } from '@k8ordo/i18n';");
    expect(source).toContain("import type { locales } from '../src/i18n';");
    expect(source).toContain(
      [
        "declare module '@k8ordo/i18n' {",
        '  interface Register {',
        '    locale: LocaleOf<typeof locales>;',
        '  }',
        '}',
      ].join('\n'),
    );
  });

  it('says nothing to @k8ordo/i18n without a locale set', () => {
    const source = emitRegisterModule({ routesModule: './routes.gen' });
    expect(source).not.toContain('i18n');
    expect(source).not.toContain('locales');
  });

  it('types links by the params schemas the route files declared', () => {
    const source = emitRegisterModule({ routesModule: './routes.gen' });
    expect(source).toContain('params: ParsedParamsMap<ParamSchemas>;');
    expect(source).toContain(
      "import type { ParamSchemas, routes, SearchReads } from './routes.gen';",
    );
  });
});

describe('params schemas', () => {
  const files = [
    'layout.tsx',
    'page.tsx',
    'not-found.tsx',
    '[locale]/layout.tsx',
    '[locale]/page.tsx',
    '[locale]/not-found.tsx',
    '[locale]/products/[id]/page.tsx',
    '[locale]/about/page.tsx',
  ];
  const withParams = new Set([
    '[locale]/layout.tsx',
    '[locale]/products/[id]/page.tsx',
  ]);
  const source = emitRoutesModule(parseRouteTree(files).tree, {
    importPrefix: './routes',
    withParams,
  });

  const map = (name: string): string => {
    const start = source.indexOf(`export const ${name} = {`);
    return source.slice(start, source.indexOf('} as const;', start));
  };

  it('is emitted from a table the grammar accepted', () => {
    expect(parseRouteTree(files).problems).toStrictEqual([]);
  });

  it('imports a layout’s schema beside the layout, and reads a page’s off the page', () => {
    expect(source).toContain(
      "import locale_layout, { paramsSchema as locale_layout_params } from './routes/[locale]/layout';",
    );
    expect(source).toContain(
      "const locale_products_id_page = () => import('./routes/[locale]/products/[id]/page');",
    );
    expect(source).not.toContain('locale_products_id_page_params');
  });

  it('checks each schema against the pattern its file sits under', () => {
    expect(source).toContain(
      "Checked<typeof locale_layout_params, ParamsSchemaFor<'/:locale'>>,",
    );
    expect(source).toContain(
      "Checked<Loaded<typeof locale_products_id_page>['paramsSchema'], ParamsSchemaFor<'/:locale/products/:id'>>,",
    );
  });

  it('lists, per page, the schemas along its stack — layouts first, then its own off the page', () => {
    expect(source).toContain(
      "'/:locale/products/:id': (page: Loaded<typeof locale_products_id_page>) => [locale_layout_params, page.paramsSchema] as const,",
    );
    // 自分はスキーマを持たないが、上のレイアウトのものは受ける
    expect(source).toContain(
      "'/:locale': () => [locale_layout_params] as const,",
    );
    expect(source).toContain(
      "'/:locale/about': () => [locale_layout_params] as const,",
    );
    // ルートのページは何の下にもない
    expect(map('paramSchemas')).not.toContain("'/':");
  });

  it('types a page by the schemas that run before it, and leaves the rest alone', () => {
    expect(source).toContain(
      "lazy(locale_products_id_page) satisfies Page<'/:locale/products/:id', ParamSchemas['/:locale/products/:id']>",
    );
    expect(source).toContain("lazy(page) satisfies Page<'/'>");
    // catch-all の params はスキーマが拒んでも答えるので、型も文字列のまま
    expect(source).toContain("lazy(not_found) satisfies Page<'/*'>");
    expect(source).toContain(
      "lazy(locale_not_found) satisfies Page<'/:locale/*'>",
    );
    // レイアウトは文字列のまま受ける
    expect(source).toContain("locale_layout satisfies Layout<'/:locale'>");
  });

  it('lists, per catch-all, the schemas of the layouts above its not-found — apart from the pages, which they type', () => {
    // ルートの not-found の上にはスキーマが無いので、載るのは 1 つだけ
    expect(map('catchAllSchemas')).toBe(
      "export const catchAllSchemas = {\n  '/:locale/*': [locale_layout_params],\n",
    );
    expect(map('paramSchemas')).not.toContain('/*');
  });

  it('emits empty maps, and no schema import, when nothing declares one', () => {
    const { tree } = parseRouteTree(['page.tsx', 'not-found.tsx']);
    const plain = emitRoutesModule(tree, { importPrefix: './routes' });
    expect(plain).toContain('export const paramSchemas = {\n} as const;');
    expect(plain).toContain('export const catchAllSchemas = {\n} as const;');
    expect(plain).not.toContain('ParamsSchemaFor');
  });
});

// ディレクトリは名前順で届く。その順序でしか出ない重なりを見たいので、
// ここでも同じに並べる。
const treeOf = (files: readonly string[]) => {
  const { tree, problems } = parseRouteTree(files.toSorted());
  expect(problems).toStrictEqual([]);
  return tree;
};

describe('unreachableRoutes', () => {
  it('says nothing when every route can be reached', () => {
    expect(
      unreachableRoutes(
        treeOf(['page.tsx', 'about/page.tsx', '[slug]/page.tsx']),
      ),
    ).toStrictEqual([]);
  });

  it('names the route a group makes unreachable, and what took it', () => {
    // グループは両方の種類の URL を 1 つのキーの下に持つので、順序では
    // 直せない。ページが黙って出荷されないより、落ちる方がよい。
    const problems = unreachableRoutes(
      treeOf([
        'page.tsx',
        'about/page.tsx',
        '(shop)/layout.tsx',
        '(shop)/sale/page.tsx',
        '(shop)/[id]/page.tsx',
      ]),
    );
    expect(problems).toStrictEqual([
      {
        path: 'about/page.tsx',
        message:
          '"/about" can never match — "/:id" ((shop)/[id]/page.tsx) is declared first and answers it',
      },
    ]);
  });

  it('says nothing of a literal page beside a [slug]/redirect.ts', () => {
    expect(
      unreachableRoutes(
        treeOf(['page.tsx', 'about/page.tsx', '[slug]/redirect.ts']),
      ),
    ).toStrictEqual([]);
  });

  it('names a redirect that a group puts before a page it shadows', () => {
    const problems = unreachableRoutes(
      treeOf([
        'page.tsx',
        'about/page.tsx',
        '(legacy)/sale/page.tsx',
        '(legacy)/[slug]/redirect.ts',
      ]),
    );
    expect(problems).toStrictEqual([
      {
        path: 'about/page.tsx',
        message:
          '"/about" can never match — "/:slug" ((legacy)/[slug]/redirect.ts) is declared first and answers it',
      },
    ]);
  });

  it('names a route the catch-all above it swallows', () => {
    const problems = unreachableRoutes(
      treeOf([
        'page.tsx',
        'about/page.tsx',
        '(shell)/layout.tsx',
        '(shell)/docs/page.tsx',
        '(shell)/not-found.tsx',
      ]),
    );
    expect(problems.map((problem) => problem.path)).toStrictEqual([
      'about/page.tsx',
    ]);
  });
});

describe('error.tsx in the emitted table', () => {
  const source = emit([
    'layout.tsx',
    'page.tsx',
    'error.tsx',
    'shop/error.tsx',
    'shop/page.tsx',
  ]);

  it('puts the error component on the branch beside the layout', () => {
    expect(source).toMatch(
      /'\/': \{\n\s+layout: layout satisfies Layout<'\/'>,\n\s+error: error satisfies ErrorComponent,/u,
    );
  });

  it('makes a directory with a page and an error a branch of its own', () => {
    expect(source).toMatch(
      /'\/shop': \{\n\s+error: shop_error satisfies ErrorComponent,\n\s+children: \{\n\s+'\/': lazy\(shop_page\) satisfies Page<'\/shop'>,/u,
    );
  });

  it('imports the router type it checks the component against', () => {
    expect(source).toContain('ErrorComponent');
    expect(source).toMatch(/import type \{ ErrorComponent, /u);
  });
});

describe('redirect.ts in the emitted table', () => {
  const source = emit([
    'page.tsx',
    'old/redirect.ts',
    '[locale]/legacy/redirect.ts',
    '[locale]/page.tsx',
  ]);

  it('lists each redirect under its pattern', () => {
    expect(source).toContain(
      "import old_redirect from './routes/old/redirect';",
    );
    expect(source).toContain("'/old': old_redirect satisfies Redirect,");
    expect(source).toContain(
      "'/:locale/legacy': locale_legacy_redirect satisfies Redirect,",
    );
  });

  it('holds its place in the table with a component that renders nothing', () => {
    // 描くものではないので、表に置くのは宣言した順番の中での位置だけ
    expect(source).toContain('const answered = (): null => null;');
    expect(source).toContain("'/old': answered,");
    expect(source).not.toMatch(/old_redirect satisfies Page/u);
  });

  it('emits an empty map when nothing redirects', () => {
    expect(emit(['page.tsx'])).toContain(
      'export const redirects = {\n} as const;',
    );
  });
});

describe('the request a page receives', () => {
  it('is part of the props under a running server', () => {
    const { tree } = parseRouteTree(['layout.tsx', 'page.tsx']);
    const source = emitRoutesModule(tree, {
      importPrefix: './routes',
      mode: 'server',
    });
    expect(source).toContain(
      "import type { RouteRequest } from '@k8ordo/framework/server';",
    );
    expect(source).toMatch(/type Page<[\s\S]*?request: RouteRequest;/u);
    expect(source).toMatch(/type Layout<[\s\S]*?request: RouteRequest;/u);
  });

  it('is absent under a build into files, where there is none', () => {
    const { tree } = parseRouteTree(['page.tsx']);
    const source = emitRoutesModule(tree, {
      importPrefix: './routes',
      mode: 'static',
    });
    expect(source).not.toContain('RouteRequest');
  });
});

const guardMap = (text: string): string => {
  const start = text.indexOf('export const guards = {');
  return text.slice(start, text.indexOf('} as const;', start));
};

describe('guard.ts in the emitted table', () => {
  const source = emit([
    'layout.tsx',
    'page.tsx',
    'guard.ts',
    'not-found.tsx',
    'old/redirect.ts',
    'admin/guard.ts',
    'admin/page.tsx',
    'admin/[id]/page.tsx',
    'admin/not-found.tsx',
  ]);

  it('checks each guard against the pattern its directory puts it under', () => {
    expect(source).toContain("import admin_guard from './routes/admin/guard';");
    expect(source).toContain("guard satisfies Guard<'/'>,");
    expect(source).toContain("admin_guard satisfies Guard<'/admin'>,");
  });

  it('lists, per pattern, the guards that run before it answers — outer first', () => {
    const map = guardMap(source);
    expect(map).toContain("'/': [guard],");
    expect(map).toContain("'/admin': [guard, admin_guard],");
    expect(map).toContain("'/admin/:id': [guard, admin_guard],");
    expect(map).toContain("'/admin/*': [guard, admin_guard],");
    expect(map).toContain("'/*': [guard],");
  });

  it('leaves a redirect out, since it answers before any guard runs', () => {
    expect(guardMap(source)).not.toContain('/old');
  });

  it('keeps guards out of the route table, where nothing renders them', () => {
    const table = source.slice(source.indexOf('export const routes'));
    expect(table).not.toContain('guard');
  });

  it('gives /* the root guards even where no not-found.tsx declares it', () => {
    const map = guardMap(emit(['page.tsx', 'guard.ts']));
    expect(map).toContain("'/*': [guard],");
  });

  it('emits an empty map, and no Guard type, when nothing guards', () => {
    const plain = emit(['page.tsx']);
    expect(plain).toContain('export const guards = {\n} as const;');
    expect(plain).not.toContain('type Guard<');
  });
});

describe('route.ts in the emitted table', () => {
  const source = emitRoutesModule(
    parseRouteTree([
      'layout.tsx',
      'page.tsx',
      'feed.xml/route.ts',
      'api/[id]/route.ts',
      'api/[id]/special/page.tsx',
    ]).tree,
    {
      importPrefix: './routes',
      withParams: new Set(['api/[id]/route.ts']),
    },
  );

  it('reads a route.ts whole when a request reaches it, since it answers by its exports', () => {
    expect(source).toContain(
      "const feed_xml_route = () => import('./routes/feed.xml/route');",
    );
  });

  it('holds its place in the table with a component that renders nothing', () => {
    expect(source).toContain('const answered = (): null => null;');
    expect(source).toContain("'/feed.xml': answered,");
    // 子を持つディレクトリでは分岐の '/' に座る
    expect(source).toMatch(/'\/:id': \{\n\s+children: \{\n\s+'\/': answered,/u);
  });

  it('lists each module under its pattern', () => {
    const start = source.indexOf('export const routeModules = {');
    expect(source.slice(start, source.indexOf('} as const;', start))).toBe(
      "export const routeModules = {\n  '/feed.xml': feed_xml_route,\n  '/api/:id': api_id_route,\n",
    );
  });

  it('checks each module against its pattern, typed by the schemas along it', () => {
    expect(source).toContain(
      "Checked<Loaded<typeof feed_xml_route>, RouteModule<'/feed.xml'>>,",
    );
    expect(source).toContain(
      "Checked<Loaded<typeof api_id_route>, RouteModule<'/api/:id', ParamSchemas['/api/:id']>>,",
    );
    expect(source).toContain(
      "'/api/:id': (route: Loaded<typeof api_id_route>) => [route.paramsSchema] as const,",
    );
  });

  it('emits an empty map, and no route types, when nothing answers from a route.ts', () => {
    const plain = emit(['page.tsx']);
    expect(plain).toContain('export const routeModules = {\n} as const;');
    expect(plain).not.toContain('RouteModule');
    expect(plain).not.toContain('answered');
  });
});

describe('loading.tsx in the emitted table', () => {
  it('puts the loading component on the branch, checked as a component', () => {
    const source = emit([
      'layout.tsx',
      'page.tsx',
      'products/loading.tsx',
      'products/page.tsx',
    ]);
    expect(source).toMatch(
      /'\/products': \{\n\s+loading: products_loading satisfies ComponentType,\n\s+children: \{\n\s+'\/': lazy\(products_page\) satisfies Page<'\/products'>,/u,
    );
  });

  it('makes the root a branch of its own, so its loading wraps everything', () => {
    const source = emit(['loading.tsx', 'page.tsx']);
    expect(source).toMatch(
      /'\/': \{\n\s+loading: loading satisfies ComponentType,/u,
    );
  });
});

describe('a page that exports search', () => {
  const source = emitRoutesModule(
    parseRouteTree(['page.tsx', 'products/page.tsx', 'products/[id]/page.tsx'])
      .tree,
    {
      importPrefix: './routes',
      withParams: new Set(['products/[id]/page.tsx']),
      withSearch: new Set(['products/page.tsx', 'products/[id]/page.tsx']),
    },
  );

  it('lists, per page, what reads its search, made from the page through @k8ordo/state', () => {
    expect(source).toContain("import { urlReader } from '@k8ordo/state';");
    const start = source.indexOf('export const searchReaders = {');
    expect(source.slice(start, source.indexOf('} as const;', start))).toBe(
      "export const searchReaders = {\n  '/products': (page: Loaded<typeof products_page>) => urlReader(page.search),\n  '/products/:id': (page: Loaded<typeof products_id_page>) => urlReader(page.search),\n",
    );
  });

  it('types the page by what it reads', () => {
    expect(source).toContain(
      "lazy(products_page) satisfies Page<'/products', [], { search: SearchReads['/products'] }>",
    );
    expect(source).toContain(
      "lazy(products_id_page) satisfies Page<'/products/:id', ParamSchemas['/products/:id'], { search: SearchReads['/products/:id'] }>",
    );
  });

  it('leaves every other page, and the state import, alone', () => {
    const plain = emit(['page.tsx']);
    expect(plain).toContain("lazy(page) satisfies Page<'/'>");
    expect(plain).toContain('export const searchReaders = {\n} as const;');
    expect(plain).not.toContain("from '@k8ordo/state'");
  });
});

const tableOf = (source: string): string =>
  source.slice(source.indexOf('export const routes'));

describe('fallback.tsx in the emitted table', () => {
  const files = [
    'layout.tsx',
    'page.tsx',
    '[locale]/layout.tsx',
    '[locale]/posts/[id]/page.tsx',
    '[locale]/posts/[id]/fallback.tsx',
  ];
  const withParams = new Set(['layout.tsx', '[locale]/layout.tsx']);
  const emitIn = (mode: 'static' | 'server'): string =>
    emitRoutesModule(parseRouteTree(files).tree, {
      importPrefix: './routes',
      mode,
      withParams,
    });

  it('is emitted from a table the grammar accepted', () => {
    expect(parseRouteTree(files).problems).toStrictEqual([]);
  });

  it('lists, under a build into files, the shell per pattern with its open params and the layouts’ schemas', () => {
    const source = emitIn('static');
    expect(source).toContain(
      "const locale_posts_id_fallback = () => import('./routes/[locale]/posts/[id]/fallback');",
    );
    expect(source).toContain(
      [
        'export const fallbacks = {',
        "  '/:locale/posts/:id': {",
        '    load: locale_posts_id_fallback,',
        "    open: ['id'],",
        '    schemas: [layout_params, locale_layout_params],',
        '  },',
        '} as const;',
      ].join('\n'),
    );
    expect(source).toContain(
      "Checked<Loaded<typeof locale_posts_id_fallback>['default'], ComponentType>,",
    );
  });

  it('lists no shell and imports no fallback.tsx under a running server', () => {
    const source = emitIn('server');
    expect(source).toContain('export const fallbacks = {} as const;');
    expect(source).not.toContain('fallback.tsx');
    expect(source).not.toContain('/fallback');
  });

  it('leaves the route table as it is without the fallback.tsx', () => {
    const without = emitRoutesModule(
      parseRouteTree(files.filter((file) => !file.endsWith('fallback.tsx')))
        .tree,
      { importPrefix: './routes', mode: 'static', withParams },
    );
    expect(tableOf(emitIn('static'))).toBe(tableOf(without));
  });
});

describe('what the table reads only when a request reaches it', () => {
  const source = emitRoutesModule(
    parseRouteTree([
      'layout.tsx',
      'error.tsx',
      'guard.ts',
      'page.tsx',
      'not-found.tsx',
      'products/loading.tsx',
      'products/page.tsx',
      'feed.xml/route.ts',
      'old/redirect.ts',
      'posts/[id]/page.tsx',
      'posts/[id]/fallback.tsx',
    ]).tree,
    { importPrefix: './routes', mode: 'static' },
  );
  const filesOf = (pattern: RegExp): string[] =>
    [...source.matchAll(pattern)].map(([, file]) => file ?? '').toSorted();

  it('imports the frame of every page, and what answers before anything renders, with the table', () => {
    expect(filesOf(/^import \w+ from '\.\/routes\/(.+)';$/gmu)).toStrictEqual([
      'error',
      'guard',
      'layout',
      'old/redirect',
      'products/loading',
    ]);
  });

  it('reads a page, a not-found, a route.ts and a fallback.tsx only when a request reaches it', () => {
    expect(
      filesOf(/^const \w+ = \(\) => import\('\.\/routes\/(.+)'\);$/gmu),
    ).toStrictEqual([
      'feed.xml/route',
      'not-found',
      'page',
      'posts/[id]/fallback',
      'posts/[id]/page',
      'products/page',
    ]);
  });

  it('lists, per pattern, what reads the page or the not-found that answers it', () => {
    const start = source.indexOf('export const pageModules = {');
    expect(source.slice(start, source.indexOf('} as const;', start))).toBe(
      "export const pageModules = {\n  '/': page,\n  '/products': products_page,\n  '/posts/:id': posts_id_page,\n  '/*': not_found,\n",
    );
  });
});
