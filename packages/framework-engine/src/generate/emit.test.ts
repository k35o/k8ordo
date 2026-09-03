import { parseRouteTree } from '../grammar/tree';
import { emitRegisterModule, emitRoutesModule } from './emit';

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
    expect(source).toMatch(/'\/': \{\n\s+layout: layout,/u);
  });

  it('gives a directory with only a page the component itself', () => {
    expect(source).toContain("'/:id': products_id_page,");
  });

  it('gives a directory with children a branch', () => {
    expect(source).toMatch(/'\/products': \{\n\s+children: \{/u);
  });

  it('keeps the group key so the layout applies without a URL segment', () => {
    expect(source).toMatch(/'\/\(docs\)': \{\n\s+layout: docs_layout,/u);
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
    expect(source).toContain("  '/': page,");
    expect(source).toContain("  '/about': about_page,");
    expect(source).not.toContain('layout');
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
  });
});
