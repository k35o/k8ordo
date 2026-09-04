/**
 * The `routes/` grammar: a directory tree is the application's pathname
 * space, and nothing else is allowed to live there. Parsing is a pure
 * function over a list of paths so the filesystem stays at the edge — the
 * rules are what get tested, not the disk.
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
} as const;

type Slot = (typeof CONVENTION)[keyof typeof CONVENTION];

const PARAM = /^\[([A-Za-z_][A-Za-z0-9_]*)\]$/u;
const GROUP = /^\(([A-Za-z0-9_-]+)\)$/u;
const LITERAL = /^[A-Za-z0-9._~-]+$/u;

/** Private to the route it sits under, and invisible to the grammar. */
const isPrivate = (segment: string): boolean =>
  segment.startsWith('_') || segment.startsWith('.');

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
    if (basename === undefined || isPrivate(basename)) continue;
    if (segments.some((segment) => isPrivate(segment))) continue;
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
        message: `routes/ holds only page.tsx, layout.tsx and not-found.tsx — move "${basename}" under a _-prefixed directory`,
      });
      continue;
    }
    slots[slot] = file;
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
    children,
  };
};

const declaresRoute = (dir: RouteDir): boolean =>
  dir.page !== null ||
  dir.notFound !== null ||
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
  if (dir.notFound !== null) visit(`${here}/*`, dir.notFound);
  for (const child of dir.children) {
    const next = child.kind === 'group' ? here : `${here}${child.key}`;
    eachPattern(child, next, visit);
  }
};

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
            ? 'declares no route — every directory needs a page.tsx somewhere below it'
            : 'has a layout but no page.tsx below it, so it can never render',
      });
      return;
    }
    for (const child of dir.children) walk(child, params);
  };
  walk(root, []);

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
