import type { Problem, RouteDir } from '../grammar/tree';

/**
 * The generator writes the route table and the type wiring so an application
 * never hand-writes either. What it emits is ordinary source using the
 * router's public API — readable in a diff, and identical to what someone
 * would have written by hand from the same directories.
 *
 * The shape is built once, generically over what a route file resolves to:
 * identifiers when emitting source, components when a test wants to hand the
 * result to the real `defineRoutes`. One structure, so the thing under test
 * is the thing that ships.
 */

export type TableBranch<T> = {
  layout?: T;
  error?: T;
  children: Record<string, TableNode<T>>;
};

export type TableNode<T> = T | TableBranch<T>;

/** A directory with nothing but a page is the component itself. */
const isLeaf = (dir: RouteDir): boolean =>
  dir.page !== null &&
  dir.layout === null &&
  dir.error === null &&
  dir.notFound === null &&
  dir.children.length === 0;

/**
 * What a subtree offers the matcher first: a literal, a parameter, or only a
 * catch-all. A group contributes its children's URLs rather than one of its
 * own, so it ranks as whatever the best of them is — otherwise a `[slug]`
 * tucked inside a group would still be tried before a literal sibling.
 */
const rank = (dir: RouteDir): number => {
  if (dir.kind === 'param') return 1;
  if (dir.kind !== 'group') return 0;
  const children = dir.children.map(rank);
  if (dir.page !== null) children.push(0);
  if (dir.notFound !== null) children.push(2);
  return Math.min(...children, 2);
};

/**
 * Literal segments before parameters, and otherwise the order the directories
 * came in. The table matches in declaration order, and the directories arrive
 * sorted by name — under which `[slug]` precedes `about`, because `[` sorts
 * before letters. Left alone, the most ordinary layout there is would make
 * `/about` unreachable behind `/:slug`.
 *
 * A directory tree has no order of its own to honour, so the framework has to
 * choose one; this is the only choice that makes every declared route
 * reachable. Where it still cannot — a group holding both kinds — the
 * unreachable route is reported rather than shipped.
 */
const order = (children: readonly RouteDir[]): readonly RouteDir[] =>
  children.toSorted((a, b) => rank(a) - rank(b));

export const buildTable = <T>(
  tree: RouteDir,
  resolve: (file: string) => T,
): Record<string, TableNode<T>> => {
  const entries = (dir: RouteDir): Record<string, TableNode<T>> => {
    const record: Record<string, TableNode<T>> = {};
    if (dir.page !== null) record['/'] = resolve(dir.page);
    for (const child of order(dir.children)) record[child.key] = node(child);
    // Last, because the table matches in declaration order: every route the
    // app actually declared out-ranks the catch-all.
    if (dir.notFound !== null) record['/*'] = resolve(dir.notFound);
    return record;
  };

  const node = (dir: RouteDir): TableNode<T> => {
    if (isLeaf(dir)) return resolve(dir.page as string);
    const branch: TableBranch<T> = { children: entries(dir) };
    if (dir.layout !== null) branch.layout = resolve(dir.layout);
    if (dir.error !== null) branch.error = resolve(dir.error);
    return branch;
  };

  // The root's own layout (or error boundary) has to wrap everything, which
  // is what a branch under the transparent '/' key does.
  return tree.layout === null && tree.error === null
    ? entries(tree)
    : { '/': node(tree) };
};

export type DeclaredPattern = {
  readonly pattern: string;
  readonly file: string;
  readonly kind: 'page' | 'redirect' | 'notFound';
};

/**
 * Every pattern the directories declare, in the order the matcher will try
 * them — the one walk every consumer of "which URLs does this site have"
 * shares, so the build, the shadow check and the prerenderer never disagree
 * about the order.
 */
export const declaredPatterns = (
  dir: RouteDir,
  prefix = '',
): DeclaredPattern[] => {
  const here = dir.kind === 'root' ? '' : prefix;
  const own = here === '' ? '/' : here;
  const found: DeclaredPattern[] = [];
  if (dir.page !== null)
    found.push({ pattern: own, file: dir.page, kind: 'page' });
  if (dir.redirect !== null && dir.page === null) {
    found.push({ pattern: own, file: dir.redirect, kind: 'redirect' });
  }
  for (const child of order(dir.children)) {
    found.push(
      ...declaredPatterns(
        child,
        child.kind === 'group' ? here : `${here}${child.key}`,
      ),
    );
  }
  if (dir.notFound !== null) {
    found.push({ pattern: `${here}/*`, file: dir.notFound, kind: 'notFound' });
  }
  return found;
};

const declared = declaredPatterns;

/** Every `redirect.ts`, with the pattern its directory puts it under. */
export const declaredRedirects = (dir: RouteDir): DeclaredPattern[] =>
  declaredPatterns(dir).filter((each) => each.kind === 'redirect');

/**
 * Routes that exist and can never render, because something declared earlier
 * answers their URL. Ordering fixes the common shape — a literal beside a
 * parameter — but a group holds URLs of both kinds under one key, and a table
 * cannot interleave across it. Where the order cannot be made right, saying so
 * is the only honest option left: the alternative is a page that is simply
 * never served, with nothing to see in the directory tree.
 */
export const unreachableRoutes = (tree: RouteDir): Problem[] => {
  const all = declared(tree);
  const problems: Problem[] = [];
  for (const [index, route] of all.entries()) {
    if (route.pattern.includes(':') || route.pattern.includes('*')) continue;
    const shadow = all.slice(0, index).find(
      (earlier) =>
        earlier.pattern !== route.pattern &&
        new URLPattern({ pathname: earlier.pattern }).test({
          pathname: route.pattern,
        }),
    );
    if (shadow === undefined) continue;
    problems.push({
      path: route.file,
      message: `"${route.pattern}" can never match — "${shadow.pattern}" (${shadow.file}) is declared first and answers it`,
    });
  }
  return problems;
};

export type EmitOptions = {
  /** Import specifier prefix for the route files, e.g. `./routes`. */
  readonly importPrefix: string;
  /** The mode package the application installed, named in the banner. */
  readonly via?: string;
  /** Route files (relative to the routes root) that export a `paramsSchema`. */
  readonly withParams?: ReadonlySet<string>;
};

const DEFAULT_VIA = '@k8ordo/static';
const ROUTE_REQUEST_FROM = '@k8ordo/server/runtime';

const banner = (via: string | undefined): string =>
  `// Generated by ${via ?? DEFAULT_VIA} from routes/. Do not edit.`;

const sanitize = (path: string): string => {
  const base = path
    .replace(/\.[jt]sx?$/u, '')
    .replaceAll(/[^A-Za-z0-9]+/gu, '_')
    .replaceAll(/^_+|_+$/gu, '');
  return base === '' ? 'route' : base;
};

const createNamer = (): {
  names: Map<string, string>;
  take: (f: string) => string;
} => {
  const names = new Map<string, string>();
  const used = new Set<string>();
  return {
    names,
    take: (file) => {
      const existing = names.get(file);
      if (existing !== undefined) return existing;
      const base = sanitize(file);
      let name = base;
      for (let n = 2; used.has(name); n += 1) name = `${base}_${n}`;
      used.add(name);
      names.set(file, name);
      return name;
    },
  };
};

const pad = (depth: number): string => '  '.repeat(depth);

const isBranch = (node: TableNode<string>): node is TableBranch<string> =>
  typeof node !== 'string';

const renderNode = (
  node: TableNode<string>,
  depth: number,
  asserted: ReadonlyMap<string, string>,
): string => {
  if (!isBranch(node)) return believed(node, asserted);
  const lines = ['{'];
  if (node.layout !== undefined) {
    lines.push(`${pad(depth + 1)}layout: ${believed(node.layout, asserted)},`);
  }
  if (node.error !== undefined) {
    lines.push(`${pad(depth + 1)}error: ${believed(node.error, asserted)},`);
  }
  lines.push(`${pad(depth + 1)}children: {`);
  for (const [key, child] of Object.entries(node.children)) {
    lines.push(
      `${pad(depth + 2)}'${key}': ${renderNode(child, depth + 2, asserted)},`,
    );
  }
  lines.push(`${pad(depth + 1)}},`, `${pad(depth)}}`);
  return lines.join('\n');
};

const believed = (
  name: string,
  asserted: ReadonlyMap<string, string>,
): string => {
  const type = asserted.get(name);
  return type === undefined ? name : `${name} satisfies ${type}`;
};

type Belief = {
  /** The pattern the directories put the file under. */
  readonly pattern: string;
  readonly kind: 'page' | 'layout' | 'notFound' | 'error';
  /** Schema-declaring files along the stack, outer-first, the file's own last. */
  readonly schemas: readonly string[];
};

/**
 * What each route file is promised, by the pattern the directories put it
 * under: a page's own pattern, and for a layout the prefix every route below
 * it shares. Keyed by file, so the emitter can state the belief where the
 * component is used and let the compiler check the props the file declared —
 * the alternative is asking every route file to restate a pattern its own
 * directory already states.
 *
 * A page's belief also carries the `paramsSchema` exports that run before it
 * renders: every layout's above it that declared one, then its own. A
 * not-found's carries none — a catch-all answers what nothing else did, and
 * its params are never validated.
 */
const beliefs = (
  tree: RouteDir,
  withParams: ReadonlySet<string>,
): Map<string, Belief> => {
  const found = new Map<string, Belief>();
  const walk = (
    dir: RouteDir,
    prefix: string,
    inherited: readonly string[],
  ): void => {
    const here = dir.kind === 'root' ? '' : prefix;
    const own = here === '' ? '/' : here;
    const layoutSchemas =
      dir.layout !== null && withParams.has(dir.layout)
        ? [...inherited, dir.layout]
        : inherited;
    if (dir.layout !== null) {
      found.set(dir.layout, {
        pattern: own,
        kind: 'layout',
        schemas: layoutSchemas,
      });
    }
    if (dir.page !== null) {
      found.set(dir.page, {
        pattern: own,
        kind: 'page',
        schemas: withParams.has(dir.page)
          ? [...layoutSchemas, dir.page]
          : layoutSchemas,
      });
    }
    if (dir.notFound !== null) {
      found.set(dir.notFound, {
        pattern: `${here}/*`,
        kind: 'notFound',
        schemas: [],
      });
    }
    if (dir.error !== null) {
      found.set(dir.error, { pattern: own, kind: 'error', schemas: [] });
    }
    for (const child of dir.children) {
      walk(
        child,
        child.kind === 'group' ? here : `${here}${child.key}`,
        layoutSchemas,
      );
    }
  };
  walk(tree, '', []);
  return found;
};

const schemaName = (componentName: string): string => `${componentName}_params`;

export const emitRoutesModule = (
  tree: RouteDir,
  options: EmitOptions,
): string => {
  const namer = createNamer();
  const table = buildTable(tree, namer.take);
  const withParams = options.withParams ?? new Set<string>();

  const byFile = beliefs(tree, withParams);
  const asserted = new Map<string, string>();
  // Per page pattern, the schema identifiers along its stack — what the
  // handler runs before the page renders, and what its params are typed by.
  const stacks = new Map<string, readonly string[]>();
  for (const [file, name] of namer.names) {
    const belief = byFile.get(file);
    if (belief === undefined) continue;
    const schemas = belief.schemas.map((f) => schemaName(namer.take(f)));
    if (belief.kind === 'layout') {
      asserted.set(name, `Layout<'${belief.pattern}'>`);
    } else if (belief.kind === 'error') {
      asserted.set(name, 'ErrorComponent');
    } else if (belief.kind === 'notFound' || schemas.length === 0) {
      asserted.set(name, `Page<'${belief.pattern}'>`);
    } else {
      asserted.set(
        name,
        `Page<'${belief.pattern}', (typeof paramSchemas)['${belief.pattern}']>`,
      );
      stacks.set(belief.pattern, schemas);
    }
  }
  const body = Object.entries(table).map(
    ([key, node]) => `${pad(1)}'${key}': ${renderNode(node, 1, asserted)},`,
  );
  const importLines = [...namer.names].map(([file, name]) => {
    const specifier = `'${options.importPrefix}/${file.replace(/\.[jt]sx?$/u, '')}'`;
    return withParams.has(file)
      ? `import ${name}, { paramsSchema as ${schemaName(name)} } from ${specifier};`
      : `import ${name} from ${specifier};`;
  });
  const hasLayout = [...asserted.values()].some((type) =>
    type.startsWith('Layout<'),
  );
  const hasError = [...asserted.values()].includes('ErrorComponent');
  const hasSchemas = withParams.size > 0;
  // Under a running server a page also receives the request; a build into
  // files has no request to hand over, so the field is absent — a page that
  // reads it fails to type-check under @k8ordo/static rather than at run time.
  const withRequest = (options.via ?? DEFAULT_VIA) === '@k8ordo/server';
  const requestLine = withRequest ? ['  request: RouteRequest;'] : [];
  const redirects = declaredRedirects(tree).map((redirect) => ({
    pattern: redirect.pattern,
    name: namer.take(redirect.file),
  }));
  const redirectImports = redirects.map(
    ({ name }) =>
      `import ${name} from '${options.importPrefix}/${namerFile(namer, name).replace(/\.[jt]sx?$/u, '')}';`,
  );
  // Each schema is checked against the pattern its file sits under, loosely:
  // on a pattern with params it must name at least one of them; a key the
  // pattern lacks is not refused.
  const schemaChecks = [...namer.names]
    .filter(([file]) => withParams.has(file))
    .map(([file, name]) => {
      const belief = byFile.get(file) as Belief;
      return `${pad(1)}${schemaName(name)} satisfies ParamsSchemaFor<'${belief.pattern}'>,`;
    });
  const schemaMap = [...stacks].map(
    ([pattern, schemas]) => `${pad(1)}'${pattern}': [${schemas.join(', ')}],`,
  );
  const typeImports = [
    ...(hasError ? ['ErrorComponent'] : []),
    ...(hasLayout ? ['ParamsOf'] : []),
    ...(hasSchemas ? ['ParamsSchemaFor'] : []),
    'ParsedParams',
  ];

  return [
    banner(options.via),
    '',
    `import { defineRoutes } from '@k8ordo/router';`,
    `import type { ${typeImports.join(', ')} } from '@k8ordo/router';`,
    `import type { ComponentType${hasLayout ? ', ReactNode' : ''} } from 'react';`,
    '',
    ...importLines,
    ...redirectImports,
    '',
    ...(withRequest
      ? [
          '// What a page may read of the request, under a running server only.',
          `import type { RouteRequest } from '${ROUTE_REQUEST_FROM}';`,
          '',
        ]
      : []),
    "// What the renderer passes. `satisfies` below is where a route file's",
    '// own props are checked against the pattern its directory puts it under,',
    '// and where its params take the types the `paramsSchema` exports along',
    '// its stack produce.',
    'type Page<',
    '  P extends string,',
    '  S extends readonly unknown[] = [],',
    '> = ComponentType<{',
    '  params: ParsedParams<P, S>;',
    '  pathname: string;',
    ...requestLine,
    '}>;',
    ...(hasLayout
      ? [
          'type Layout<P extends string> = ComponentType<{',
          '  params: ParamsOf<P>;',
          '  pathname: string;',
          ...requestLine,
          '  children: ReactNode;',
          '}>;',
        ]
      : []),
    ...(redirects.length > 0
      ? [
          '',
          '// What a redirect.ts default-exports: where to, as a pattern the matched',
          '// params fill in, and whether the move is permanent.',
          'type Redirect = string | { readonly to: string; readonly permanent?: boolean };',
        ]
      : []),
    '',
    ...(hasSchemas
      ? [
          '// The `paramsSchema` exports the route files declared, each checked against',
          '// the pattern its file sits under.',
          'const schemas = [',
          ...schemaChecks,
          '] as const;',
          'void schemas;',
          '',
        ]
      : []),
    '// Per page pattern, the schemas that run before it renders — every',
    '// layout above it that declared one, then its own. The handler reads',
    '// this; a schema that refuses makes the pattern not answer the pathname.',
    'export const paramSchemas = {',
    ...schemaMap,
    '} as const;',
    '',
    '// Per pattern, where a redirect.ts sends the visitor. Consulted before the',
    '// table: a directory that redirects has no page to render.',
    'export const redirects = {',
    ...redirects.map(
      ({ pattern, name }) =>
        `${pad(1)}'${pattern}': ${name} satisfies Redirect,`,
    ),
    '} as const;',
    '',
    'export const routes = defineRoutes({',
    ...body,
    '});',
    '',
  ].join('\n');
};

const namerFile = (
  namer: { names: Map<string, string> },
  name: string,
): string => {
  for (const [file, taken] of namer.names) if (taken === name) return file;
  throw new Error(`no file was named ${name}`);
};

export type RegisterOptions = {
  /** Import specifier of the generated routes module, e.g. `./routes.gen`. */
  readonly routesModule: string;
  /** Present only when the application depends on `@k8ordo/state`. */
  readonly stateModule?: string | null;
  /** The mode package the application installed, named in the banner. */
  readonly via?: string;
};

/**
 * Both packages read the app's route table through declaration merging, so
 * the app gets typed paths everywhere without writing the ceremony itself.
 */
export const emitRegisterModule = (options: RegisterOptions): string => {
  const wantsState =
    options.stateModule !== null && options.stateModule !== undefined;
  // Under a running server a route file also receives the request, and
  // `PageProps` / `LayoutProps` from the router learn it from here — so a
  // page that reads it compiles under @k8ordo/server and not under a build
  // into files.
  const via = options.via ?? DEFAULT_VIA;
  const withRequest = via === '@k8ordo/server';
  const lines = [
    banner(options.via),
    '',
    `import type { ParsedParamsMap } from '@k8ordo/router';`,
    ...(withRequest
      ? [`import type { RouteRequest } from '${ROUTE_REQUEST_FROM}';`]
      : []),
    `import type { paramSchemas, routes } from '${options.routesModule}';`,
    '',
    `declare module '@k8ordo/router' {`,
    '  interface Register {',
    '    routes: typeof routes;',
    '    // A link takes a param as the page receives it — typed by its schema.',
    '    params: ParsedParamsMap<typeof paramSchemas>;',
    ...(withRequest
      ? [
          '    // A route file receives the request: this is a running server.',
          '    request: RouteRequest;',
        ]
      : []),
    '  }',
    '}',
  ];
  if (wantsState) {
    lines.push(
      '',
      `declare module '${options.stateModule}' {`,
      '  interface Register {',
      '    routes: typeof routes;',
      '  }',
      '}',
    );
  }
  lines.push('');
  return lines.join('\n');
};
