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
    expect(source).not.toContain('layout');
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

  it('wires typed paths into state only when the app depends on it', () => {
    const withState = emitRegisterModule({
      routesModule: './routes.gen',
      stateModule: '@k8ordo/state',
    });
    expect(withState).toContain('path: RouteOf<typeof routes>;');

    const without = emitRegisterModule({ routesModule: './routes.gen' });
    expect(without).not.toContain('@k8ordo/state');
    // RouteOf は state の augmentation だけが使う。常に import すると
    // state を使わないアプリで未使用のローカルになる
    expect(without).not.toContain('RouteOf');
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
