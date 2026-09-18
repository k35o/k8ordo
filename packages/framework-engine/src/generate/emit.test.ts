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

  it('imports every route file once, extensionless', () => {
    expect(source).toContain("import layout from './routes/layout';");
    expect(source).toContain("import page from './routes/page';");
    expect(source).toContain(
      "import products_id_page from './routes/products/[id]/page';",
    );
    expect(source).toContain(
      "import docs_layout from './routes/(docs)/layout';",
    );
  });

  it('wraps everything in the root layout through the transparent key', () => {
    expect(source).toContain('export const routes = defineRoutes({');
    expect(source).toMatch(
      /'\/': \{\n\s+layout: layout satisfies Layout<'\/'>,/u,
    );
  });

  it('gives a directory with only a page the component itself', () => {
    expect(source).toContain(
      "'/:id': products_id_page satisfies Page<'/products/:id'>,",
    );
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
    expect(source).toContain("import a_x_page from './routes/(a)/x/page';");
    expect(source).toContain("import a_x_page_2 from './routes/a/x/page';");
  });

  it('emits a flat record when the root has no layout', () => {
    const source = emit(['page.tsx', 'about/page.tsx']);
    expect(source).toContain("  '/': page satisfies Page<'/'>,");
    expect(source).toContain(
      "  '/about': about_page satisfies Page<'/about'>,",
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
    expect(source).toContain("page satisfies Page<'/'>");
    expect(source).toContain("products_page satisfies Page<'/products'>");
    expect(source).toContain(
      "products_id_page satisfies Page<'/products/:id'>",
    );
    expect(source).toContain("not_found satisfies Page<'/*'>");
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
    expect(source).toContain("docs_guide_page satisfies Page<'/guide'>");
  });
});

describe('the emitted register', () => {
  it('wires the table into the router', () => {
    const source = emitRegisterModule({ routesModule: './routes.gen' });
    expect(source).toContain("declare module '@k8ordo/router' {");
    expect(source).toContain('routes: typeof routes;');
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

  it('hands route files the request under a running server only', () => {
    const server = emitRegisterModule({
      routesModule: './routes.gen',
      via: '@k8ordo/server',
    });
    expect(server).toContain(
      "import type { RouteRequest } from '@k8ordo/server/runtime';",
    );
    expect(server).toContain('request: RouteRequest;');

    const files = emitRegisterModule({
      routesModule: './routes.gen',
      via: '@k8ordo/static',
    });
    expect(files).not.toContain('request');
  });

  it('types links by the params schemas the route files declared', () => {
    const source = emitRegisterModule({ routesModule: './routes.gen' });
    expect(source).toContain('params: ParsedParamsMap<typeof paramSchemas>;');
    expect(source).toContain(
      "import type { paramSchemas, routes } from './routes.gen';",
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

  it('is emitted from a table the grammar accepted', () => {
    expect(parseRouteTree(files).problems).toStrictEqual([]);
  });

  it('imports the schema beside the component of a file that declares one', () => {
    expect(source).toContain(
      "import locale_layout, { paramsSchema as locale_layout_params } from './routes/[locale]/layout';",
    );
    expect(source).toContain(
      "import locale_products_id_page, { paramsSchema as locale_products_id_page_params } from './routes/[locale]/products/[id]/page';",
    );
    expect(source).toContain(
      "import locale_page from './routes/[locale]/page';",
    );
  });

  it('checks each schema against the pattern its file sits under', () => {
    expect(source).toContain(
      "locale_layout_params satisfies ParamsSchemaFor<'/:locale'>,",
    );
    expect(source).toContain(
      "locale_products_id_page_params satisfies ParamsSchemaFor<'/:locale/products/:id'>,",
    );
  });

  it('lists, per page, the schemas along its stack — layouts first', () => {
    expect(source).toContain(
      "'/:locale/products/:id': [locale_layout_params, locale_products_id_page_params],",
    );
    // 自分はスキーマを持たないが、上のレイアウトのものは受ける
    expect(source).toContain("'/:locale': [locale_layout_params],");
    expect(source).toContain("'/:locale/about': [locale_layout_params],");
    // ルートのページは何の下にもない
    expect(source).not.toContain("'/': [");
  });

  it('types a page by the schemas that run before it, and leaves the rest alone', () => {
    expect(source).toContain(
      "locale_products_id_page satisfies Page<'/:locale/products/:id', (typeof paramSchemas)['/:locale/products/:id']>",
    );
    expect(source).toContain("page satisfies Page<'/'>");
    // catch-all の params は検査しないので、型も文字列のまま
    expect(source).toContain("not_found satisfies Page<'/*'>");
    // レイアウトは文字列のまま受ける
    expect(source).toContain("locale_layout satisfies Layout<'/:locale'>");
  });

  it('emits an empty map, and no schema import, when nothing declares one', () => {
    const { tree } = parseRouteTree(['page.tsx']);
    const plain = emitRoutesModule(tree, { importPrefix: './routes' });
    expect(plain).toContain('export const paramSchemas = {\n} as const;');
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
      /'\/shop': \{\n\s+error: shop_error satisfies ErrorComponent,\n\s+children: \{\n\s+'\/': shop_page satisfies Page<'\/shop'>,/u,
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

  it('lists each redirect under its pattern, outside the route table', () => {
    expect(source).toContain(
      "import old_redirect from './routes/old/redirect';",
    );
    expect(source).toContain("'/old': old_redirect satisfies Redirect,");
    expect(source).toContain(
      "'/:locale/legacy': locale_legacy_redirect satisfies Redirect,",
    );
    // 表には出ない: リダイレクトは描画するものではない
    expect(source).not.toMatch(/'\/old': old_redirect satisfies Page/u);
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
      via: '@k8ordo/server',
    });
    expect(source).toContain(
      "import type { RouteRequest } from '@k8ordo/server/runtime';",
    );
    expect(source).toMatch(/type Page<[\s\S]*?request: RouteRequest;/u);
    expect(source).toMatch(/type Layout<[\s\S]*?request: RouteRequest;/u);
  });

  it('is absent under a build into files, where there is none', () => {
    const { tree } = parseRouteTree(['page.tsx']);
    const source = emitRoutesModule(tree, {
      importPrefix: './routes',
      via: '@k8ordo/static',
    });
    expect(source).not.toContain('RouteRequest');
  });
});
