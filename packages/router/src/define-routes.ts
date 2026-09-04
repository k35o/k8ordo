import type { ComponentType } from 'react';

import { isGroupKey, joinPattern, normalizePathname } from './paths';
import type { Join, PathFor } from './paths';

/**
 * Any component, whatever props it declares. The table is written once and
 * rendered by different renderers — a client app renders leaves with no
 * props, the framework hands server components their `params` and layouts
 * their `children` — so the stored type has to admit them all. `never` props
 * is the type-safe spelling of that; each renderer states what it passes.
 */
export type RouteComponent = ComponentType<never>;

/**
 * A leaf renders; a branch wraps its children in an optional layout. Lazy
 * components (`React.lazy`) are objects, not functions, so a branch is
 * recognized by its `children` key rather than by `typeof`.
 */
export type RouteNode =
  | RouteComponent
  | { layout?: RouteComponent; children: RoutesRecord };

export type RoutesRecord = Record<`/${string}`, RouteNode>;

// A branch that landed on the root contributes no prefix of its own, exactly
// as the runtime walk resets it — otherwise every route under a root layout
// would come out as `//products`.
type Below<Prefix extends string, Key extends string> =
  Join<Prefix, Key> extends '/' ? '' : Join<Prefix, Key>;

type PatternsIn<Record_, Prefix extends string> = {
  [K in keyof Record_ & string]: Record_[K] extends { children: infer C }
    ? PatternsIn<C, Below<Prefix, K>>
    : Join<Prefix, K>;
}[keyof Record_ & string];

/** Every full leaf pattern in the table, as written. */
export type PatternOf<R extends RoutesRecord> = PatternsIn<R, ''> & string;

/** Patterns a link can point at — wildcards are matched, never linked. */
export type NavigablePatternOf<R extends RoutesRecord> = Exclude<
  PatternOf<R>,
  `${string}*${string}`
>;

/**
 * The app's pathname space as a type: the union state's `Register` (and any
 * other typed-path consumer) is fed with.
 */
export type RouteOf<D> =
  D extends Routes<infer R> ? PathFor<NavigablePatternOf<R>> : never;

export type Match = {
  /** The full pattern that won, as written in the table. */
  pattern: string;
  params: Readonly<Record<string, string>>;
  /** Layouts outer-first, the leaf last. */
  stack: readonly RouteComponent[];
};

export type Routes<R extends RoutesRecord = RoutesRecord> = {
  kind: 'routes';
  /** The table as passed. */
  record: R;
  /**
   * Matches a pathname in declaration order, first match wins — precedence
   * is what you wrote, not a specificity ranking to second-guess. The one
   * operation that needs the table's value: links and navigation build from
   * the pattern string alone (`href` / `navigateTo`), so only `<Router>`
   * ever holds this object.
   */
  match: (pathname: string) => Match | null;
};

type Entry = {
  pattern: string;
  matcher: URLPattern;
  stack: readonly RouteComponent[];
};

const isBranch = (
  node: RouteNode,
): node is { layout?: RouteComponent; children: RoutesRecord } =>
  typeof node === 'object' && 'children' in node;

const decode = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export function defineRoutes<R extends RoutesRecord>(record: R): Routes<R> {
  const entries: Entry[] = [];
  const seen = new Set<string>();

  const walk = (
    current: RoutesRecord,
    prefix: string,
    stack: readonly RouteComponent[],
  ): void => {
    for (const [key, node] of Object.entries(current)) {
      if (!key.startsWith('/')) {
        throw new TypeError(`route pattern "${key}" must start with "/"`);
      }
      if (key.includes('(') && !isGroupKey(key)) {
        // URLPattern reads `(…)` as a regex group, so a key like
        // `/(admin)/new` would quietly match `/admin/new` and capture a
        // nameless param. The grammar has exactly one meaning for
        // parentheses, and this is not it.
        throw new TypeError(
          `route group "${key}" must be "/(name)" and nothing else — a regular expression is not part of the grammar`,
        );
      }
      if (isGroupKey(key) && !isBranch(node)) {
        // A group contributes no segment, so a leaf under one would silently
        // become a second declaration of the parent's own index.
        throw new TypeError(`route group "${key}" must have children`);
      }
      const pattern = joinPattern(prefix, key);
      if (isBranch(node)) {
        walk(
          node.children,
          pattern === '/' ? '' : pattern,
          node.layout === undefined ? stack : [...stack, node.layout],
        );
      } else {
        if (seen.has(pattern)) {
          throw new TypeError(`route pattern "${pattern}" is declared twice`);
        }
        seen.add(pattern);
        entries.push({
          pattern,
          // URLPattern validates the syntax here, so a broken pattern fails
          // at module load, not at first navigation.
          matcher: new URLPattern({ pathname: pattern }),
          stack: [...stack, node],
        });
      }
    }
  };
  walk(record, '', []);

  const match = (pathname: string): Match | null => {
    const normalized = normalizePathname(pathname);
    for (const entry of entries) {
      const result = entry.matcher.exec({ pathname: normalized });
      if (result === null) continue;
      const params: Record<string, string> = {};
      for (const [name, value] of Object.entries(result.pathname.groups)) {
        // Numeric keys are URLPattern's anonymous wildcard captures — the
        // table only names params, so only named ones surface.
        if (!/^\d+$/u.test(name) && value !== undefined) {
          params[name] = decode(value);
        }
      }
      return { pattern: entry.pattern, params, stack: entry.stack };
    }
    return null;
  };

  return { kind: 'routes', record, match };
}
