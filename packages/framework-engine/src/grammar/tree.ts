/**
 * The `routes/` grammar: a directory tree is the application's pathname
 * space, and nothing else is allowed to live there: components, data and
 * helpers belong outside it. Parsing is a pure function over a list of paths
 * so the filesystem stays at the edge — the rules are what get tested, not
 * the disk.
 */

export type Problem = {
  /** The offending file or directory, relative to the routes root. */
  readonly path: string;
  readonly message: string;
};

export type RouteDirKind = 'root' | 'literal' | 'param' | 'group';

export type RouteDir = {
  /** The directory as written: `''` (root), `products`, `[id]`, `(docs)`. */
  readonly name: string;
  readonly kind: RouteDirKind;
  /** The table key this directory contributes: `/`, `/products`, `/:id`. */
  readonly key: string;
  /** Path of this directory relative to the routes root. */
  readonly path: string;
  readonly page: string | null;
  readonly layout: string | null;
  readonly notFound: string | null;
  /** Shown in place of what is below when it throws — inside the layout. */
  readonly error: string | null;
  /** Shown while what is below suspends — inside the error boundary. */
  readonly loading: string | null;
  /** A `redirect.ts`: this directory's URL sends the visitor elsewhere. */
  readonly redirect: string | null;
  /** A `guard.ts`: runs before whatever answers below this directory. */
  readonly guard: string | null;
  /** A `route.ts`: this directory's URL is answered by its method exports. */
  readonly route: string | null;
  /**
   * A `fallback.tsx`: under static mode, the shell its `page.tsx` is answered
   * with for a value the build did not write.
   */
  readonly fallback: string | null;
  readonly children: readonly RouteDir[];
};

export type ParseResult = {
  readonly tree: RouteDir;
  readonly problems: readonly Problem[];
};

const CONVENTION = {
  'page.tsx': 'page',
  'layout.tsx': 'layout',
  'not-found.tsx': 'notFound',
  'error.tsx': 'error',
  'redirect.ts': 'redirect',
  'guard.ts': 'guard',
  'route.ts': 'route',
  'loading.tsx': 'loading',
  'fallback.tsx': 'fallback',
} as const;

export const ROUTE_FILES = Object.keys(CONVENTION).join(', ');

export type Slot = (typeof CONVENTION)[keyof typeof CONVENTION];

const PARAM = /^\[([A-Za-z_][A-Za-z0-9_]*)\]$/u;
const GROUP = /^\(([A-Za-z0-9_-]+)\)$/u;
const LITERAL = /^[A-Za-z0-9._~-]+$/u;

/**
 * A dotfile belongs to the system or an editor (`.DS_Store`, a swap file), not
 * to the application, so a stray one must not break the build.
 */
const isHidden = (segment: string): boolean => segment.startsWith('.');

/**
 * Which slot a file fills, by its path relative to the routes root — `null`
 * for anything the grammar does not read: a hidden file, or a name outside
 * the convention (which the parse reports). One module at a time, for a
 * caller that is handed a module rather than the tree (a dev server's
 * transform).
 */
export const slotOf = (file: string): Slot | null => {
  const segments = file.split('/').filter((segment) => segment !== '');
  if (segments.some((segment) => isHidden(segment))) return null;
  const basename = segments.at(-1);
  if (basename === undefined) return null;
  return (CONVENTION as Record<string, Slot | undefined>)[basename] ?? null;
};

type RawDir = {
  files: Map<string, string>;
  dirs: Map<string, RawDir>;
};

const emptyDir = (): RawDir => ({ files: new Map(), dirs: new Map() });

const build = (files: readonly string[]): RawDir => {
  const root = emptyDir();
  for (const file of files) {
    const segments = file.split('/').filter((segment) => segment !== '');
    const basename = segments.pop();
    if (basename === undefined || isHidden(basename)) continue;
    if (segments.some((segment) => isHidden(segment))) continue;
    let current = root;
    for (const segment of segments) {
      let next = current.dirs.get(segment);
      if (next === undefined) {
        next = emptyDir();
        current.dirs.set(segment, next);
      }
      current = next;
    }
    current.files.set(basename, file);
  }
  return root;
};

const classify = (
  name: string,
  path: string,
  problems: Problem[],
): { kind: RouteDirKind; key: string; param: string | null } => {
  const param = PARAM.exec(name);
  if (param !== null) {
    return {
      kind: 'param',
      key: `/:${param[1] as string}`,
      param: param[1] as string,
    };
  }
  if (GROUP.exec(name) !== null) {
    return { kind: 'group', key: `/${name}`, param: null };
  }
  if (name.startsWith('[') || name.endsWith(']')) {
    problems.push({
      path,
      message: `"${name}" is not a valid param directory — use [name] with a letter or underscore first`,
    });
  } else if (name.startsWith('(') || name.endsWith(')')) {
    problems.push({
      path,
      message: `"${name}" is not a valid route group — use (name)`,
    });
  } else if (!LITERAL.test(name)) {
    problems.push({
      path,
      message: `"${name}" cannot be a URL segment — use letters, digits, . _ ~ or -`,
    });
  }
  return { kind: 'literal', key: `/${name}`, param: null };
};

const convert = (
  raw: RawDir,
  name: string,
  path: string,
  kind: RouteDirKind,
  key: string,
  problems: Problem[],
): RouteDir => {
  const slots: Partial<Record<Slot, string>> = {};
  for (const [basename, file] of raw.files) {
    const slot = (CONVENTION as Record<string, Slot | undefined>)[basename];
    if (slot === undefined) {
      problems.push({
        path: file,
        message: `routes/ holds only ${ROUTE_FILES} — move "${basename}" out of routes/`,
      });
      continue;
    }
    slots[slot] = file;
  }
  const here = path === '' ? '/' : path;
  if (slots.page !== undefined && slots.redirect !== undefined) {
    // 同じ URL が「描画する」と「よそへ送る」の両方を言うことはできない
    problems.push({
      path: slots.redirect,
      message: `"${here}" cannot both render page.tsx and redirect — keep one`,
    });
  }
  // route.ts も同じ URL に答えるので、page.tsx とも redirect.ts とも並べない
  if (slots.route !== undefined && slots.page !== undefined) {
    problems.push({
      path: slots.route,
      message: `"${here}" cannot both render page.tsx and answer from route.ts — keep one`,
    });
  }
  if (slots.route !== undefined && slots.redirect !== undefined) {
    problems.push({
      path: slots.route,
      message: `"${here}" cannot both redirect and answer from route.ts — keep one`,
    });
  }

  const children = [...raw.dirs.entries()].map(([childName, childRaw]) => {
    const childPath = path === '' ? childName : `${path}/${childName}`;
    const classified = classify(childName, childPath, problems);
    return convert(
      childRaw,
      childName,
      childPath,
      classified.kind,
      classified.key,
      problems,
    );
  });

  return {
    name,
    kind,
    key,
    path,
    page: slots.page ?? null,
    layout: slots.layout ?? null,
    notFound: slots.notFound ?? null,
    error: slots.error ?? null,
    loading: slots.loading ?? null,
    redirect: slots.redirect ?? null,
    guard: slots.guard ?? null,
    route: slots.route ?? null,
    fallback: slots.fallback ?? null,
    children,
  };
};

const declaresRoute = (dir: RouteDir): boolean =>
  dir.page !== null ||
  dir.route !== null ||
  dir.notFound !== null ||
  dir.redirect !== null ||
  dir.children.some(declaresRoute);

/**
 * Walks the tree the way the router's own table walk does, so the patterns
 * checked here are the patterns that will exist at runtime.
 */
const eachPattern = (
  dir: RouteDir,
  prefix: string,
  visit: (pattern: string, file: string) => void,
): void => {
  const here = dir.kind === 'root' ? '' : prefix;
  if (dir.page !== null) visit(here === '' ? '/' : here, dir.page);
  // 同じ dir の page・redirect・route の衝突は別に報告するので、ここでは 1 つだけ
  if (dir.route !== null && dir.page === null) {
    visit(here === '' ? '/' : here, dir.route);
  }
  if (dir.redirect !== null && dir.page === null && dir.route === null) {
    visit(here === '' ? '/' : here, dir.redirect);
  }
  if (dir.notFound !== null) visit(`${here}/*`, dir.notFound);
  for (const child of dir.children) {
    const next = child.kind === 'group' ? here : `${here}${child.key}`;
    eachPattern(child, next, visit);
  }
};

export type FallbackShape = {
  /** The pattern its page answers: `/:locale/posts/:id`. */
  readonly pattern: string;
  /** The fallback.tsx, relative to the routes root. */
  readonly file: string;
  /** The page.tsx beside it, relative to the routes root. */
  readonly page: string;
  /** Every param of the pattern, outermost first. */
  readonly params: readonly string[];
  /** The params no layout above it receives: the ones a shell may leave to the browser. */
  readonly open: readonly string[];
  /** The deepest layout.tsx above it (routes-relative), or null. */
  readonly layout: string | null;
};

type FallbackCheck =
  | { readonly shape: FallbackShape; readonly problem?: undefined }
  | { readonly problem: Problem; readonly shape?: undefined };

/** The deepest layout on the way down, and the params known where it sits. */
type Above = { readonly file: string; readonly params: readonly string[] };

const checkFallback = (
  dir: RouteDir,
  file: string,
  pattern: string,
  params: readonly string[],
  above: Above | null,
): FallbackCheck => {
  const here = dir.path === '' ? '/' : dir.path;
  const refuse = (message: string): FallbackCheck => ({
    problem: { path: file, message },
  });
  if (dir.page === null) {
    return refuse(
      `fallback.tsx stands in for the page.tsx beside it, and "${here}" has none`,
    );
  }
  if (dir.layout !== null) {
    return refuse(
      `fallback.tsx cannot sit beside layout.tsx — that layout receives every parameter of "${here}", so no shell could leave one to the browser; move the layout one directory up, or into page.tsx and fallback.tsx`,
    );
  }
  if (params.length === 0) {
    return refuse(
      `fallback.tsx stands in for values the build did not write, and "${pattern}" has no parameter; remove it`,
    );
  }
  const open = params.filter((name) => !(above?.params ?? []).includes(name));
  if (open.length === 0 && above !== null) {
    return refuse(
      `fallback.tsx has nothing to leave to the browser — ${above.file} receives every parameter of "${pattern}"; remove fallback.tsx and list the values in paths`,
    );
  }
  return {
    shape: {
      pattern,
      file,
      page: dir.page,
      params,
      open,
      layout: above?.file ?? null,
    },
  };
};

/**
 * Every `fallback.tsx` the directories hold, as a shape or as the problem
 * that refuses it — one walk, so the grammar, the generated table and the
 * static build never disagree about which params a shell may leave open.
 * A directory that declares no route is skipped with everything below it:
 * that problem is reported on its own.
 */
const checkFallbacks = (tree: RouteDir): FallbackCheck[] => {
  const found: FallbackCheck[] = [];
  const walk = (
    dir: RouteDir,
    prefix: string,
    inherited: readonly string[],
    above: Above | null,
  ): void => {
    if (!declaresRoute(dir)) return;
    const here = dir.kind === 'root' ? '' : prefix;
    const params =
      dir.kind === 'param' ? [...inherited, dir.key.slice(2)] : inherited;
    if (dir.fallback !== null) {
      found.push(
        checkFallback(
          dir,
          dir.fallback,
          here === '' ? '/' : here,
          params,
          above,
        ),
      );
    }
    const below = dir.layout === null ? above : { file: dir.layout, params };
    for (const child of dir.children) {
      walk(
        child,
        child.kind === 'group' ? here : `${here}${child.key}`,
        params,
        below,
      );
    }
  };
  walk(tree, '', [], null);
  return found;
};

/**
 * The page patterns with a `fallback.tsx` beside them that the grammar
 * accepts, with the params a shell may leave to the browser — those no layout
 * above the fallback receives.
 */
export const fallbackShapes = (tree: RouteDir): FallbackShape[] =>
  checkFallbacks(tree).flatMap((each) =>
    each.shape === undefined ? [] : [each.shape],
  );

const validate = (root: RouteDir, problems: Problem[]): void => {
  const walk = (dir: RouteDir, inherited: readonly string[]): void => {
    let params = inherited;
    if (dir.kind === 'param') {
      const name = dir.key.slice(2);
      if (params.includes(name)) {
        problems.push({
          path: dir.path,
          message: `":${name}" is already taken by an ancestor — params must be unique within a path`,
        });
      }
      params = [...params, name];
    }
    if (!declaresRoute(dir)) {
      problems.push({
        path: dir.path === '' ? '.' : dir.path,
        message:
          dir.layout === null
            ? 'declares no route — every directory needs a page.tsx (or a redirect.ts or route.ts) somewhere below it'
            : 'has a layout but no page.tsx below it, so it can never render',
      });
      return;
    }
    for (const child of dir.children) walk(child, params);
  };
  walk(root, []);
  for (const each of checkFallbacks(root)) {
    if (each.problem !== undefined) problems.push(each.problem);
  }

  const owners = new Map<string, string>();
  eachPattern(root, '', (pattern, file) => {
    const first = owners.get(pattern);
    if (first === undefined) {
      owners.set(pattern, file);
      return;
    }
    problems.push({
      path: file,
      message: `"${pattern}" is already declared by ${first} — route groups do not separate URLs`,
    });
  });
};

/**
 * @param files paths relative to the routes root, POSIX separators.
 */
export const parseRouteTree = (files: readonly string[]): ParseResult => {
  const problems: Problem[] = [];
  const tree = convert(build(files), '', '', 'root', '/', problems);
  validate(tree, problems);
  return { tree, problems };
};
