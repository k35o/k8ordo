import { createElement, Suspense } from 'react';
import type { ComponentType, ReactNode } from 'react';

import { RouteErrorBoundary } from './boundary';
import type { ErrorComponent } from './boundary';
import { Outlet } from './outlet';
import {
  isGroupKey,
  joinPattern,
  normalizePathname,
  readParams,
} from './paths';
import type { Join } from './paths';

/**
 * Any component, whatever props it declares. The table is written once and
 * rendered by different renderers — a client app renders leaves with no
 * props, the framework hands server components their `params` and layouts
 * their `children` — so the stored type has to admit them all. `never` props
 * is the type-safe spelling of that; each renderer states what it passes.
 */
export type RouteComponent = ComponentType<never>;

/**
 * A leaf renders; a branch wraps its children in an optional layout, and
 * may name an `error` component to show in place of what is below when it
 * throws — inside the layout, so the frame survives the failure — and a
 * `loading` component to show while what is below suspends. Lazy components
 * (`React.lazy`) are objects, not functions, so a branch is recognized by
 * its `children` key rather than by `typeof`.
 */
export type RouteNode =
  | RouteComponent
  | {
      layout?: RouteComponent;
      error?: ErrorComponent;
      loading?: ComponentType;
      children: RoutesRecord;
    };

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

export type Match = {
  /** The full pattern that won, as written in the table. */
  pattern: string;
  /** A `:param` as its segment, a rest param (`:name+`) as its segments. */
  params: Readonly<Record<string, string | readonly string[]>>;
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
   * the pattern string alone (`href`), so only `<Router>`
   * ever holds this object.
   */
  match: (pathname: string) => Match | null;
  /**
   * Every pattern that fits a pathname, in declaration order, matched as the
   * iteration reaches it. `match` is its first. A caller that can still turn
   * a fit down — a param a schema refuses is a pathname the pattern does not
   * answer — walks on to whatever the table declares next, the catch-all
   * included.
   */
  matchAll: (pathname: string) => IteratorObject<Match, undefined>;
};

type Entry = {
  pattern: string;
  matcher: URLPattern;
  stack: readonly RouteComponent[];
};

type Branch = Exclude<RouteNode, RouteComponent>;

const isBranch = (node: RouteNode): node is Branch =>
  typeof node === 'object' && 'children' in node;

/**
 * A branch's `error` becomes an element of the stack — after the layout, so
 * it wraps what the layout wraps. It takes what any renderer passes and
 * renders what it is given; a renderer that passes nothing (the client
 * router, which nests through `<Outlet />`) is told so by the absence of
 * `children`, and the boundary leaves the hole to the next element.
 */
const boundaryFor = (
  fallback: ErrorComponent,
): ComponentType<{ children?: ReactNode }> => {
  const Boundary = ({ children }: { children?: ReactNode }): ReactNode =>
    createElement(
      RouteErrorBoundary,
      { fallback },
      children === undefined ? createElement(Outlet) : children,
    );
  return Boundary;
};

/**
 * A branch's `loading` becomes an element of the stack too — after the
 * layout and inside the error boundary, so what the boundary catches is what
 * the fallback stood in for. A plain `<Suspense>`: a page change under one
 * already showing keeps the page on screen while the next one loads, as
 * every page change does, and the fallback shows while it first streams in
 * and when a navigation mounts it anew.
 */
const loadingFor = (
  Fallback: ComponentType,
): ComponentType<{ children?: ReactNode }> => {
  const Loading = ({ children }: { children?: ReactNode }): ReactNode =>
    createElement(
      Suspense,
      { fallback: createElement(Fallback) },
      children === undefined ? createElement(Outlet) : children,
    );
  return Loading;
};

const PARAM_NAME = /^[\p{ID_Start}$_][\p{ID_Continue}$\u200C\u200D]*$/u;

const SYNTAX = /[:*?+{}()\\]/u;

const GRAMMAR =
  'a segment is a literal holding none of : * ? + { } ( ) \\, a ":name", or — last — a ":name+" or a "*"';

// キーごとではなく結合した葉のパターンで読む。枝のキーに書いた rest や
// wildcard の後ろには、子のキーが続く
const grammarProblem = (pattern: string): string | null => {
  if (pattern === '/') return null;
  const segments = pattern.slice(1).split('/');
  const last = segments.length - 1;
  for (const [index, segment] of segments.entries()) {
    if (segment === '') {
      return `route pattern "${pattern}" has an empty segment — ${GRAMMAR}`;
    }
    const isParam = segment.startsWith(':');
    const isRest = isParam && segment.endsWith('+');
    const isWildcard = segment === '*';
    const fits = isParam
      ? PARAM_NAME.test(segment.slice(1, isRest ? -1 : undefined))
      : isWildcard || !SYNTAX.test(segment);
    if (!fits) {
      return `route pattern "${pattern}" has the segment "${segment}", which is not part of the grammar — ${GRAMMAR}`;
    }
    if ((isRest || isWildcard) && index !== last) {
      return `route pattern "${pattern}" puts "${segment}" before the end — ${isRest ? 'a rest param' : 'a wildcard'} must be the last segment`;
    }
  }
  return null;
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
        const below = [
          ...stack,
          ...(node.layout === undefined ? [] : [node.layout]),
          ...(node.error === undefined
            ? []
            : [boundaryFor(node.error) as RouteComponent]),
          ...(node.loading === undefined
            ? []
            : [loadingFor(node.loading) as RouteComponent]),
        ];
        walk(node.children, pattern === '/' ? '' : pattern, below);
      } else {
        const problem = grammarProblem(pattern);
        if (problem !== null) throw new TypeError(problem);
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

  function* matchAll(pathname: string): Generator<Match, undefined> {
    const normalized = normalizePathname(pathname);
    for (const entry of entries) {
      const result = entry.matcher.exec({ pathname: normalized });
      if (result === null) continue;
      yield {
        pattern: entry.pattern,
        params: readParams(entry.pattern, result.pathname.groups),
        stack: entry.stack,
      };
    }
    return undefined;
  }

  const match = (pathname: string): Match | null =>
    matchAll(pathname).next().value ?? null;

  return { kind: 'routes', record, match, matchAll };
}
