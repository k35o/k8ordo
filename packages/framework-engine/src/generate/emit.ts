import { slotOf } from '../grammar/tree';
import type { Problem, RouteDir } from '../grammar/tree';
import { ROUTE_METHODS } from '../runtime/route';

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
  loading?: T;
  children: Record<string, TableNode<T>>;
};

export type TableNode<T> = T | TableBranch<T>;

/** What answers a directory's own URL: its page, or its route.ts. */
const ownFile = (dir: RouteDir): string | null => dir.page ?? dir.route;

/**
 * A directory with nothing but a page (or a route.ts) is that, itself —
 * except a group: it adds no segment, so the router refuses it as a leaf (it
 * would redeclare its parent's index) and takes it only as a branch.
 */
const isLeaf = (dir: RouteDir): boolean =>
  dir.kind !== 'group' &&
  ownFile(dir) !== null &&
  dir.layout === null &&
  dir.error === null &&
  dir.loading === null &&
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
    const own = ownFile(dir);
    if (own !== null) record['/'] = resolve(own);
    for (const child of order(dir.children)) record[child.key] = node(child);
    // Last, because the table matches in declaration order: every route the
    // app actually declared out-ranks the catch-all.
    if (dir.notFound !== null) record['/*'] = resolve(dir.notFound);
    return record;
  };

  const node = (dir: RouteDir): TableNode<T> => {
    if (isLeaf(dir)) return resolve(ownFile(dir) as string);
    const branch: TableBranch<T> = { children: entries(dir) };
    if (dir.layout !== null) branch.layout = resolve(dir.layout);
    if (dir.error !== null) branch.error = resolve(dir.error);
    if (dir.loading !== null) branch.loading = resolve(dir.loading);
    return branch;
  };

  // The root's own layout (or error boundary, or loading) has to wrap
  // everything, which is what a branch under the transparent '/' key does.
  return tree.layout === null && tree.error === null && tree.loading === null
    ? entries(tree)
    : { '/': node(tree) };
};

export type DeclaredPattern = {
  readonly pattern: string;
  readonly file: string;
  readonly kind: 'page' | 'route' | 'redirect' | 'notFound';
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
  if (dir.page !== null) {
    found.push({ pattern: own, file: dir.page, kind: 'page' });
  } else if (dir.route !== null) {
    found.push({ pattern: own, file: dir.route, kind: 'route' });
  } else if (dir.redirect !== null) {
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

/** Every `route.ts`, with the pattern its directory puts it under. */
export const declaredRouteFiles = (dir: RouteDir): DeclaredPattern[] =>
  declaredPatterns(dir).filter((each) => each.kind === 'route');

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
  /** Pages (relative to the routes root) that export a `search` url schema. */
  readonly withSearch?: ReadonlySet<string>;
};

const DEFAULT_VIA = '@k8ordo/static';

/** What holds a route.ts's place in the table. */
const ANSWERED = 'answered';
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
  if (node.loading !== undefined) {
    lines.push(
      `${pad(depth + 1)}loading: ${believed(node.loading, asserted)},`,
    );
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
  readonly kind: 'page' | 'route' | 'layout' | 'notFound' | 'error' | 'loading';
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
 * not-found's carries the layouts' above it, which run for what they write to
 * the render's context and never refuse it — a catch-all answers what nothing
 * else did, so its params stay strings.
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
    const answers = ownFile(dir);
    if (answers !== null) {
      found.set(answers, {
        pattern: own,
        kind: dir.page === null ? 'route' : 'page',
        schemas: withParams.has(answers)
          ? [...layoutSchemas, answers]
          : layoutSchemas,
      });
    }
    if (dir.notFound !== null) {
      found.set(dir.notFound, {
        pattern: `${here}/*`,
        kind: 'notFound',
        schemas: layoutSchemas,
      });
    }
    if (dir.error !== null) {
      found.set(dir.error, { pattern: own, kind: 'error', schemas: [] });
    }
    if (dir.loading !== null) {
      found.set(dir.loading, { pattern: own, kind: 'loading', schemas: [] });
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

const searchName = (componentName: string): string => `${componentName}_search`;

type Guards = {
  /** Per pattern, the `guard.ts` files that run before it answers, outer first. */
  readonly stacks: ReadonlyMap<string, readonly string[]>;
  /** Per `guard.ts`, the pattern its directory puts it under. */
  readonly own: ReadonlyMap<string, string>;
};

/**
 * The guards along each pattern's directories. A redirect is left out: it
 * answers before any guard runs, since a directory that redirects has nothing
 * below it to guard. `/*` always carries the root's — a URL nothing answers is
 * still below the root, and the framework's own 404 is answered under them.
 */
const guardsOf = (tree: RouteDir): Guards => {
  const stacks = new Map<string, readonly string[]>();
  const own = new Map<string, string>();
  const walk = (
    dir: RouteDir,
    prefix: string,
    inherited: readonly string[],
  ): void => {
    const here = dir.kind === 'root' ? '' : prefix;
    const pattern = here === '' ? '/' : here;
    const stack = dir.guard === null ? inherited : [...inherited, dir.guard];
    if (dir.guard !== null) own.set(dir.guard, pattern);
    if (stack.length > 0) {
      if (ownFile(dir) !== null) stacks.set(pattern, stack);
      if (dir.notFound !== null) stacks.set(`${here}/*`, stack);
    }
    for (const child of dir.children) {
      walk(child, child.kind === 'group' ? here : `${here}${child.key}`, stack);
    }
  };
  walk(tree, '', []);
  if (tree.guard !== null && !stacks.has('/*')) {
    stacks.set('/*', [tree.guard]);
  }
  return { stacks, own };
};

export const emitRoutesModule = (
  tree: RouteDir,
  options: EmitOptions,
): string => {
  const namer = createNamer();
  // A route.ts is not a component: its place in the table is held by one
  // that renders nothing, and the module itself goes to `routeModules`.
  const table = buildTable(tree, (file) =>
    slotOf(file) === 'route' ? ANSWERED : namer.take(file),
  );
  const routeFiles = declaredRouteFiles(tree).map((route) => ({
    pattern: route.pattern,
    file: route.file,
    name: namer.take(route.file),
  }));
  const withParams = options.withParams ?? new Set<string>();
  const withSearch = options.withSearch ?? new Set<string>();

  const byFile = beliefs(tree, withParams);
  const asserted = new Map<string, string>();
  // Per page pattern, the schema identifiers along its stack — what the
  // handler runs before the page renders, and what its params are typed by.
  const stacks = new Map<string, readonly string[]>();
  // Per catch-all pattern, the layouts' above its not-found. Kept apart from
  // `stacks`: the router types a page's params, and links to it, by those.
  const catchAllStacks = new Map<string, readonly string[]>();
  for (const [file, name] of namer.names) {
    const belief = byFile.get(file);
    if (belief === undefined) continue;
    const schemas = belief.schemas.map((f) => schemaName(namer.take(f)));
    if (belief.kind === 'layout') {
      asserted.set(name, `Layout<'${belief.pattern}'>`);
    } else if (belief.kind === 'error') {
      asserted.set(name, 'ErrorComponent');
    } else if (belief.kind === 'loading') {
      asserted.set(name, 'ComponentType');
    } else if (belief.kind === 'notFound') {
      asserted.set(name, `Page<'${belief.pattern}'>`);
      if (schemas.length > 0) catchAllStacks.set(belief.pattern, schemas);
    } else if (belief.kind === 'route') {
      // Not in the table, so nothing to state there; its schemas still run
      // before it answers, and type its params.
      if (schemas.length > 0) stacks.set(belief.pattern, schemas);
    } else {
      if (schemas.length > 0) stacks.set(belief.pattern, schemas);
      const typedBy =
        schemas.length === 0
          ? '[]'
          : `(typeof paramSchemas)['${belief.pattern}']`;
      asserted.set(
        name,
        withSearch.has(file)
          ? `Page<'${belief.pattern}', ${typedBy}, { search: ReturnType<(typeof searchReaders)['${belief.pattern}']> }>`
          : schemas.length === 0
            ? `Page<'${belief.pattern}'>`
            : `Page<'${belief.pattern}', ${typedBy}>`,
      );
    }
  }
  const body = Object.entries(table).map(
    ([key, node]) => `${pad(1)}'${key}': ${renderNode(node, 1, asserted)},`,
  );
  const guarded = guardsOf(tree);
  const guardStacks = new Map(
    [...guarded.stacks].map(([pattern, files]) => [
      pattern,
      files.map((file) => namer.take(file)),
    ]),
  );
  const guardChecks = [...guarded.own].map(
    ([file, pattern]) =>
      `${pad(1)}${namer.take(file)} satisfies Guard<'${pattern}'>,`,
  );
  const hasGuards = guardChecks.length > 0;
  const hasLayout = [...asserted.values()].some((type) =>
    type.startsWith('Layout<'),
  );
  const importLines = [...namer.names].map(([file, name]) => {
    const specifier = `'${options.importPrefix}/${file.replace(/\.[jt]sx?$/u, '')}'`;
    if (slotOf(file) === 'route')
      return `import * as ${name} from ${specifier};`;
    const named = [
      ...(withParams.has(file) ? [`paramsSchema as ${schemaName(name)}`] : []),
      ...(withSearch.has(file) ? [`search as ${searchName(name)}`] : []),
    ];
    return named.length === 0
      ? `import ${name} from ${specifier};`
      : `import ${name}, { ${named.join(', ')} } from ${specifier};`;
  });
  // Per page pattern, what reads the search a page declared it reads.
  const searchReaders = [...namer.names]
    .filter(([file]) => withSearch.has(file))
    .map(
      ([file, name]) =>
        `${pad(1)}'${(byFile.get(file) as Belief).pattern}': urlReader(${searchName(name)}),`,
    );
  // A route.ts is imported whole, so its schema is read off the module.
  const routeSchemaLines = routeFiles
    .filter(({ file }) => withParams.has(file))
    .map(({ name }) => `const ${schemaName(name)} = ${name}.paramsSchema;`);
  const routeChecks = routeFiles.map(({ pattern, name }) =>
    stacks.has(pattern)
      ? `${pad(1)}${name} satisfies RouteModule<'${pattern}', (typeof paramSchemas)['${pattern}']>,`
      : `${pad(1)}${name} satisfies RouteModule<'${pattern}'>,`,
  );
  const hasRoutes = routeFiles.length > 0;
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
  const toMap = (map: ReadonlyMap<string, readonly string[]>): string[] =>
    [...map].map(
      ([pattern, schemas]) => `${pad(1)}'${pattern}': [${schemas.join(', ')}],`,
    );
  const typeImports = [
    ...(hasError ? ['ErrorComponent'] : []),
    ...(hasLayout || hasGuards ? ['ParamsOf'] : []),
    ...(hasSchemas ? ['ParamsSchemaFor'] : []),
    'ParsedParams',
  ];

  return [
    banner(options.via),
    '',
    `import { defineRoutes } from '@k8ordo/router';`,
    ...(searchReaders.length > 0
      ? [`import { urlReader } from '@k8ordo/state';`]
      : []),
    `import type { ${typeImports.join(', ')} } from '@k8ordo/router';`,
    `import type { ComponentType${hasLayout ? ', ReactNode' : ''} } from 'react';`,
    '',
    ...importLines,
    ...redirectImports,
    '',
    ...(routeSchemaLines.length > 0 ? [...routeSchemaLines, ''] : []),
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
    '  Q = Record<never, never>,',
    '> = ComponentType<',
    '  {',
    '    params: ParsedParams<P, S>;',
    '    pathname: string;',
    ...requestLine.map((line) => `  ${line}`),
    '  } & Q',
    '>;',
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
    ...(hasGuards
      ? [
          '// What a guard.ts default-exports: run before whatever answers below it,',
          '// outer first. A Response ends the request there; nothing lets it through.',
          'type Guard<P extends string> = (context: {',
          '  readonly request: Request;',
          '  readonly params: ParamsOf<P>;',
          '}) => Response | void | Promise<Response | void>;',
          '',
          '// The guard.ts exports, each checked against the pattern its directory',
          '// puts it under.',
          'const guardChecks = [',
          ...guardChecks,
          '] as const;',
          'void guardChecks;',
          '',
        ]
      : []),
    '// Per page pattern, the schemas that run before it renders — every',
    '// layout above it that declared one, then its own. The handler reads',
    '// this; a schema that refuses makes the pattern not answer the pathname.',
    'export const paramSchemas = {',
    ...toMap(stacks),
    '} as const;',
    '',
    '// Per catch-all pattern, the schemas of the layouts above its not-found.',
    '// The handler runs them for what they write to the render (the locale a',
    '// 404 is in); a refusal does not stop a catch-all from answering.',
    'export const catchAllSchemas = {',
    ...toMap(catchAllStacks),
    '} as const;',
    '',
    ...(hasRoutes
      ? [
          '// What a route.ts exports: a function per request method it answers,',
          '// handed the request and the params, answering with a Response.',
          'type RouteHandler<',
          '  P extends string,',
          '  S extends readonly unknown[] = [],',
          '> = (context: {',
          '  readonly request: Request;',
          '  readonly params: ParsedParams<P, S>;',
          '}) => Response | Promise<Response>;',
          'type RouteModule<P extends string, S extends readonly unknown[] = []> = {',
          `  readonly [M in ${ROUTE_METHODS.map((method) => `'${method}'`).join(' | ')}]?: RouteHandler<P, S>;`,
          '};',
          '',
          '// The route.ts modules, each checked against the pattern its directory',
          '// puts it under.',
          'const routeChecks = [',
          ...routeChecks,
          '] as const;',
          'void routeChecks;',
          '',
          '// A route.ts in the table: the handler answers it from `routeModules`',
          '// before anything renders, so its place here is only where it matches.',
          `const ${ANSWERED} = (): null => null;`,
          '',
        ]
      : []),
    '// Per page pattern that exports `search`, what reads it out of the URL —',
    "// @k8ordo/state's reading of a url schema. The page receives what it read,",
    '// and a client navigation that changes the search loads it again.',
    'export const searchReaders = {',
    ...searchReaders,
    '} as const;',
    '',
    '// Per pattern, the route.ts that answers it, by the methods it exports.',
    'export const routeModules = {',
    ...routeFiles.map(({ pattern, name }) => `${pad(1)}'${pattern}': ${name},`),
    '} as const;',
    '',
    '// Per pattern, the guards that run before it answers — outer first. `/*`',
    "// carries the root's, for a URL nothing answers.",
    'export const guards = {',
    ...toMap(guardStacks),
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
    `import type { paramSchemas, routes, searchReaders } from '${options.routesModule}';`,
    '',
    `declare module '@k8ordo/router' {`,
    '  interface Register {',
    '    routes: typeof routes;',
    '    // A link takes a param as the page receives it — typed by its schema.',
    '    params: ParsedParamsMap<typeof paramSchemas>;',
    '    // A page that exports `search` receives what it reads.',
    '    search: {',
    '      readonly [P in keyof typeof searchReaders]: ReturnType<',
    '        (typeof searchReaders)[P]',
    '      >;',
    '    };',
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
