import { fallbackShapes, slotOf } from '../grammar/tree';
import type { Problem, RouteDir, Slot } from '../grammar/tree';
import { FRAMEWORK } from '../host';
import type { Mode } from '../host';
import { ROUTE_METHODS } from '../runtime/route';

/**
 * The generator writes the route table and the type wiring so an application
 * never hand-writes either. What it emits is ordinary source using the
 * router's public API, read through the framework's `./generated` entry —
 * readable in a diff, and identical to what someone would have written by
 * hand from the same directories.
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
 * What holds a directory's own place in the table. A redirect.ts renders
 * nothing and is not what a guard or a schema answers for, but it matches in
 * declaration order with the pages, literals before params, as they do.
 */
const placeOf = (dir: RouteDir): string | null => ownFile(dir) ?? dir.redirect;

/**
 * A directory with nothing but a page (or a route.ts, or a redirect.ts) is
 * that, itself — except a group: it adds no segment, so the router refuses it
 * as a leaf (it would redeclare its parent's index) and takes it only as a
 * branch.
 */
const isLeaf = (dir: RouteDir): boolean =>
  dir.kind !== 'group' &&
  placeOf(dir) !== null &&
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
    const own = placeOf(dir);
    if (own !== null) record['/'] = resolve(own);
    for (const child of order(dir.children)) record[child.key] = node(child);
    // Last, because the table matches in declaration order: every route the
    // app actually declared out-ranks the catch-all.
    if (dir.notFound !== null) record['/*'] = resolve(dir.notFound);
    return record;
  };

  const node = (dir: RouteDir): TableNode<T> => {
    if (isLeaf(dir)) return resolve(placeOf(dir) as string);
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
  /** Whether a page receives the request: only a running server has one. */
  readonly mode?: Mode;
  /** Route files (relative to the routes root) that export a `paramsSchema`. */
  readonly withParams?: ReadonlySet<string>;
  /** Pages (relative to the routes root) that export a `search` url schema. */
  readonly withSearch?: ReadonlySet<string>;
};

/** What holds a route.ts's or a redirect.ts's place in the table. */
const ANSWERED = 'answered';
/**
 * What the generated files import from the router, through the framework:
 * the application installs the router, but only ever names the framework.
 */
const GENERATED_FROM = `${FRAMEWORK}/generated`;
const ROUTE_REQUEST_FROM = `${FRAMEWORK}/server`;

const I18N = '@k8ordo/i18n';

/** Where an application declares its locale set, from its root. */
export const LOCALES_MODULE = 'src/i18n.ts';

const bannerFrom = (...sources: readonly string[]): string =>
  `// Generated by ${FRAMEWORK} from ${sources.join(' and ')}. Do not edit.`;

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
  readonly kind:
    | 'page'
    | 'route'
    | 'layout'
    | 'notFound'
    | 'error'
    | 'loading'
    | 'fallback';
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
 * else did, so its params stay strings. A fallback's carries the layouts'
 * above it too: a shell runs them over the params it fills, and its page's
 * own never, since a shell has no value.
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
    if (dir.fallback !== null) {
      found.set(dir.fallback, {
        pattern: own,
        kind: 'fallback',
        schemas: layoutSchemas,
      });
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

type Guards = {
  /** Per pattern, the `guard.ts` files that run before it answers, outer first. */
  readonly stacks: ReadonlyMap<string, readonly string[]>;
  /** Per `guard.ts`, the pattern its directory puts it under. */
  readonly own: ReadonlyMap<string, string>;
};

/**
 * The guards along each pattern's directories. A redirect is left out: it
 * answers before any guard runs, since the URL it answers has no page to
 * guard (the pages below its directory are guarded as usual). `/*` always
 * carries the root's — a URL nothing answers is
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

/**
 * The slots a request reaches one file at a time: the page or the not-found
 * that answers it, a route.ts, a page's shell. The table reads each of them
 * when a request reaches it — imported with the table, it would be in the
 * handler's own chunk, and what it renders in the browser and the CSS it
 * imports would be in what every page loads. A layout, an error and a
 * loading are the frame of every page below them, and a guard and a redirect
 * answer before anything renders, so those are imported with the table.
 */
const LATE: ReadonlySet<Slot> = new Set([
  'page',
  'notFound',
  'route',
  'fallback',
]);

const isLate = (file: string): boolean => {
  const slot = slotOf(file);
  return slot !== null && LATE.has(slot);
};

export const emitRoutesModule = (
  tree: RouteDir,
  options: EmitOptions,
): string => {
  const namer = createNamer();
  // A page or a not-found stands in the table as `lazy()` over what reads it:
  // the table is checked against its props as it would be against the
  // component, and the handler renders the component it read in its place.
  const valueOf = (file: string): string =>
    isLate(file) ? `lazy(${namer.take(file)})` : namer.take(file);
  // A route.ts or a redirect.ts is not a component: its place in the table
  // is held by one that renders nothing, and the module itself goes to
  // `routeModules` or `redirects`.
  const table = buildTable(tree, (file) =>
    slotOf(file) === 'route' || slotOf(file) === 'redirect'
      ? ANSWERED
      : valueOf(file),
  );
  const routeFiles = declaredRouteFiles(tree).map((route) => ({
    pattern: route.pattern,
    name: namer.take(route.file),
  }));
  const redirects = declaredRedirects(tree).map((redirect) => ({
    pattern: redirect.pattern,
    name: namer.take(redirect.file),
  }));
  // A shell exists only in a build into files; a running server renders
  // every value with its page, so nothing of a fallback.tsx is compiled in.
  const shells = options.mode === 'static' ? fallbackShapes(tree) : [];
  for (const shape of shells) namer.take(shape.file);
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
  const withParams = options.withParams ?? new Set<string>();
  const withSearch = options.withSearch ?? new Set<string>();

  const byFile = beliefs(tree, withParams);
  const asserted = new Map<string, string>();
  // Per page pattern (and route.ts), what the handler runs before it
  // answers: the schemas of the layouts above it that declared one, then its
  // own — an export of the file the walk reached, which is why each is a
  // function of that file's module.
  const stacks = new Map<string, string>();
  // Per catch-all pattern, the layouts' above its not-found. Kept apart from
  // `stacks`: the router types a page's params, and links to it, by those.
  const catchAllStacks = new Map<string, readonly string[]>();
  // Per page pattern that exports `search`, what reads it, made from the
  // page's module.
  const searchReaders = new Map<string, string>();
  for (const [file, name] of namer.names) {
    const belief = byFile.get(file);
    if (belief === undefined) continue;
    const value = valueOf(file);
    const layouts = belief.schemas
      .filter((schema) => schema !== file)
      .map((schema) => schemaName(namer.take(schema)));
    if (belief.kind === 'layout') {
      asserted.set(value, `Layout<'${belief.pattern}'>`);
    } else if (belief.kind === 'error') {
      asserted.set(value, 'ErrorComponent');
    } else if (belief.kind === 'loading') {
      asserted.set(value, 'ComponentType');
    } else if (belief.kind === 'notFound') {
      asserted.set(value, `Page<'${belief.pattern}'>`);
      if (layouts.length > 0) catchAllStacks.set(belief.pattern, layouts);
    } else if (belief.kind === 'page' || belief.kind === 'route') {
      const { pattern } = belief;
      if (withParams.has(file)) {
        const module = belief.kind === 'page' ? 'page' : 'route';
        stacks.set(
          pattern,
          `(${module}: Loaded<typeof ${name}>) => [${[...layouts, `${module}.paramsSchema`].join(', ')}] as const`,
        );
      } else if (layouts.length > 0) {
        stacks.set(pattern, `() => [${layouts.join(', ')}] as const`);
      }
      if (belief.kind === 'route') continue;
      if (withSearch.has(file)) {
        searchReaders.set(
          pattern,
          `(page: Loaded<typeof ${name}>) => urlReader(page.search)`,
        );
      }
      const typedBy = stacks.has(pattern) ? `ParamSchemas['${pattern}']` : '[]';
      asserted.set(
        value,
        withSearch.has(file)
          ? `Page<'${pattern}', ${typedBy}, { search: SearchReads['${pattern}'] }>`
          : stacks.has(pattern)
            ? `Page<'${pattern}', ${typedBy}>`
            : `Page<'${pattern}'>`,
      );
    }
  }
  const body = Object.entries(table).map(
    ([key, node]) => `${pad(1)}'${key}': ${renderNode(node, 1, asserted)},`,
  );
  const hasLayout = [...asserted.values()].some((type) =>
    type.startsWith('Layout<'),
  );
  const hasLazy = [...namer.names.keys()].some(
    (file) => slotOf(file) === 'page' || slotOf(file) === 'notFound',
  );
  // Each schema is checked against the pattern its file sits under, loosely:
  // on a pattern with params it must name at least one of them; a key the
  // pattern lacks is not refused.
  const schemaChecks = [...namer.names]
    .filter(([file]) => withParams.has(file))
    .map(([file, name]) => {
      const belief = byFile.get(file) as Belief;
      const schema = isLate(file)
        ? `Loaded<typeof ${name}>['paramsSchema']`
        : `typeof ${schemaName(name)}`;
      return `${pad(1)}Checked<${schema}, ParamsSchemaFor<'${belief.pattern}'>>,`;
    });
  const routeChecks = routeFiles.map(({ pattern, name }) =>
    stacks.has(pattern)
      ? `${pad(1)}Checked<Loaded<typeof ${name}>, RouteModule<'${pattern}', ParamSchemas['${pattern}']>>,`
      : `${pad(1)}Checked<Loaded<typeof ${name}>, RouteModule<'${pattern}'>>,`,
  );
  // A fallback.tsx renders with no props at all: it stands in for every
  // value, so it is handed none.
  const fallbackChecks = shells.map(
    ({ file }) =>
      `${pad(1)}Checked<Loaded<typeof ${namer.take(file)}>['default'], ComponentType>,`,
  );
  const hasChecks =
    schemaChecks.length + routeChecks.length + fallbackChecks.length > 0;
  const readsLate =
    routeFiles.length > 0 ||
    shells.length > 0 ||
    searchReaders.size > 0 ||
    [...namer.names.keys()].some(
      (file) => withParams.has(file) && isLate(file),
    );
  const hasRoutes = routeFiles.length > 0;
  const hasError = [...asserted.values()].includes('ErrorComponent');
  // Under a running server a page also receives the request; a build into
  // files has no request to hand over, so the field is absent — a page that
  // reads it fails to type-check under mode: 'static' rather than at run time.
  const withRequest = options.mode === 'server';
  const requestLine = withRequest ? ['  request: RouteRequest;'] : [];
  const specifier = (file: string): string =>
    `'${options.importPrefix}/${file.replace(/\.[jt]sx?$/u, '')}'`;
  const importLines = [...namer.names]
    .filter(([file]) => !isLate(file))
    .map(([file, name]) =>
      withParams.has(file)
        ? `import ${name}, { paramsSchema as ${schemaName(name)} } from ${specifier(file)};`
        : `import ${name} from ${specifier(file)};`,
    );
  const loaderLines = [...namer.names]
    .filter(([file]) => isLate(file))
    .map(([file, name]) => `const ${name} = () => import(${specifier(file)});`);
  const toMap = (map: ReadonlyMap<string, readonly string[]>): string[] =>
    [...map].map(
      ([pattern, schemas]) => `${pad(1)}'${pattern}': [${schemas.join(', ')}],`,
    );
  const toFunctions = (map: ReadonlyMap<string, string>): string[] =>
    [...map].map(([pattern, made]) => `${pad(1)}'${pattern}': ${made},`);
  const typeImports = [
    ...(hasError ? ['ErrorComponent'] : []),
    ...(hasLayout || hasGuards ? ['ParamsOf'] : []),
    ...(schemaChecks.length > 0 ? ['ParamsSchemaFor'] : []),
    'ParsedParams',
  ];

  return [
    bannerFrom('routes/'),
    '',
    `import { defineRoutes } from '${GENERATED_FROM}';`,
    ...(searchReaders.size > 0
      ? [`import { urlReader } from '@k8ordo/state';`]
      : []),
    `import type { ${typeImports.join(', ')} } from '${GENERATED_FROM}';`,
    ...(hasLazy ? [`import { lazy } from 'react';`] : []),
    `import type { ComponentType${hasLayout ? ', ReactNode' : ''} } from 'react';`,
    '',
    ...(importLines.length > 0 ? [...importLines, ''] : []),
    ...(withRequest
      ? [
          '// What a page may read of the request, under a running server only.',
          `import type { RouteRequest } from '${ROUTE_REQUEST_FROM}';`,
          '',
        ]
      : []),
    ...(loaderLines.length > 0
      ? [
          '// The files a request reaches one at a time, read when it does: what',
          '// each renders in the browser, and the CSS it imports, goes only to the',
          '// pages that render it.',
          ...loaderLines,
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
    ...(readsLate
      ? [
          '',
          '// A file read when a request reaches it, as the module it is read as.',
          'type Loaded<L extends () => Promise<unknown>> = Awaited<ReturnType<L>>;',
        ]
      : []),
    ...(hasChecks
      ? [
          '',
          '// `satisfies`, for an export the table holds no value of: compiles only',
          '// when T is assignable to U.',
          'type Checked<T extends U, U> = T;',
        ]
      : []),
    '',
    ...(schemaChecks.length > 0
      ? [
          '// The `paramsSchema` exports the route files declared, each checked against',
          '// the pattern its file sits under.',
          'export type SchemaChecks = [',
          ...schemaChecks,
          '];',
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
    '// layout above it that declared one, then its own, read off the file the',
    '// handler read for it. The handler runs them; a schema that refuses makes',
    '// the pattern not answer the pathname.',
    'export const paramSchemas = {',
    ...toFunctions(stacks),
    '} as const;',
    '',
    "// The same stacks, as the router types a page's params and links to it.",
    'export type ParamSchemas = {',
    '  readonly [P in keyof typeof paramSchemas]: (typeof paramSchemas)[P] extends (...args: never) => infer S ? S : never;',
    '};',
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
          'export type RouteChecks = [',
          ...routeChecks,
          '];',
          '',
        ]
      : []),
    ...(hasRoutes || redirects.length > 0
      ? [
          '// A route.ts or a redirect.ts in the table: the handler answers it from',
          '// `routeModules` or `redirects` before anything renders, so its place',
          '// here is only where it matches.',
          `const ${ANSWERED} = (): null => null;`,
          '',
        ]
      : []),
    '// Per page pattern that exports `search`, what reads it out of the URL —',
    "// @k8ordo/state's reading of a url schema, made from the page's module.",
    '// The page receives what it read, and a client navigation that changes',
    '// the search loads it again.',
    'export const searchReaders = {',
    ...toFunctions(searchReaders),
    '} as const;',
    '',
    '// What each of those pages receives as `search`.',
    'export type SearchReads = {',
    '  readonly [P in keyof typeof searchReaders]: (typeof searchReaders)[P] extends (...args: never) => (...args: never) => infer R ? R : never;',
    '};',
    '',
    '// Per pattern, what reads the page or the not-found that answers it. The',
    '// handler renders what it read in the place `lazy()` holds below.',
    'export const pageModules = {',
    ...[...namer.names]
      .filter(
        ([file]) => slotOf(file) === 'page' || slotOf(file) === 'notFound',
      )
      .map(
        ([file, name]) =>
          `${pad(1)}'${(byFile.get(file) as Belief).pattern}': ${name},`,
      ),
    '} as const;',
    '',
    '// Per pattern, what reads the route.ts that answers it, by the methods it',
    '// exports.',
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
    '// Per pattern, where a redirect.ts sends the visitor, once the table',
    '// matched the pattern: a directory that redirects has no page to render.',
    'export const redirects = {',
    ...redirects.map(
      ({ pattern, name }) =>
        `${pad(1)}'${pattern}': ${name} satisfies Redirect,`,
    ),
    '} as const;',
    '',
    ...(options.mode === 'static'
      ? [
          '// Per page pattern with a fallback.tsx: what reads its shell for a value',
          '// the build did not write, the params a shell may leave to the browser, and',
          '// the schemas of the layouts above it, which run over the params it fills.',
          'export const fallbacks = {',
          ...shells.flatMap(({ pattern, file, open }) => [
            `${pad(1)}'${pattern}': {`,
            `${pad(2)}load: ${namer.take(file)},`,
            `${pad(2)}open: [${open.map((param) => `'${param}'`).join(', ')}],`,
            `${pad(2)}schemas: [${(byFile.get(file) as Belief).schemas
              .map((layout) => schemaName(namer.take(layout)))
              .join(', ')}],`,
            `${pad(1)}},`,
          ]),
          '} as const;',
          ...(fallbackChecks.length > 0
            ? [
                '',
                '// The fallback.tsx files, each checked as a component handed nothing.',
                'export type FallbackChecks = [',
                ...fallbackChecks,
                '];',
              ]
            : []),
        ]
      : [
          '// A running server renders every value with its page: no shells.',
          'export const fallbacks = {} as const;',
        ]),
    '',
    'export const routes = defineRoutes({',
    ...body,
    '});',
    '',
  ].join('\n');
};

export type RegisterOptions = {
  /** Import specifier of the generated routes module, e.g. `./routes.gen`. */
  readonly routesModule: string;
  /** Present only when the application depends on `@k8ordo/state`. */
  readonly stateModule?: string | null;
  /**
   * Import specifier of the module exporting the application's locale set
   * (`locales`), e.g. `../src/i18n`. Present only when the application
   * depends on `@k8ordo/i18n` and that module exports it.
   */
  readonly localesModule?: string | null;
  /** Whether a route file receives the request: only a running server has one. */
  readonly mode?: Mode;
};

/**
 * Both packages read the app's route table through declaration merging, so
 * the app gets typed paths everywhere without writing the ceremony itself.
 * The router's `Register` is augmented through the framework's re-export of
 * it, which TypeScript merges into the router's own declaration. The locale
 * set reaches `@k8ordo/i18n`'s `Register` the same way, so every message is
 * held to it.
 */
export const emitRegisterModule = (options: RegisterOptions): string => {
  const wantsState =
    options.stateModule !== null && options.stateModule !== undefined;
  const localesModule = options.localesModule ?? null;
  // Under a running server a route file also receives the request, and
  // `PageProps` / `LayoutProps` from the router learn it from here — so a
  // page that reads it compiles under mode: 'server' and not under a build
  // into files.
  const withRequest = options.mode === 'server';
  const lines = [
    localesModule === null
      ? bannerFrom('routes/')
      : bannerFrom('routes/', LOCALES_MODULE),
    '',
    `import type { ParsedParamsMap } from '${GENERATED_FROM}';`,
    ...(withRequest
      ? [`import type { RouteRequest } from '${ROUTE_REQUEST_FROM}';`]
      : []),
    ...(localesModule === null
      ? []
      : [`import type { LocaleOf } from '${I18N}';`]),
    // An augmentation does not bring its module into the program, and an
    // application may depend on state before any of its files imports it.
    ...(wantsState ? [`import type {} from '${options.stateModule}';`] : []),
    ...(localesModule === null
      ? []
      : [`import type { locales } from '${localesModule}';`]),
    `import type { ParamSchemas, routes, SearchReads } from '${options.routesModule}';`,
    '',
    `declare module '${GENERATED_FROM}' {`,
    '  interface Register {',
    '    routes: typeof routes;',
    '    // A link takes a param as the page receives it — typed by its schema.',
    '    params: ParsedParamsMap<ParamSchemas>;',
    '    // A page that exports `search` receives what it reads.',
    '    search: SearchReads;',
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
  if (localesModule !== null) {
    lines.push(
      '',
      `declare module '${I18N}' {`,
      '  interface Register {',
      '    locale: LocaleOf<typeof locales>;',
      '  }',
      '}',
    );
  }
  lines.push('');
  return lines.join('\n');
};
