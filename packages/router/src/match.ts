'use client';

import { usePathname } from './location';
import { normalizePathname } from './paths';
import type { ParamsOf } from './paths';
import type { RegisteredNavigablePattern, RegisteredPattern } from './register';

/**
 * A pattern from the table, or a table pattern followed by `/*` to mean
 * "everything below it" — the shape a navigation asks about when it wants
 * to know which section of the site is showing. The pattern's own page is
 * not below it: `/x/*` matches `/x/y` and not `/x`.
 */
export type MatchablePattern =
  | RegisteredPattern
  | `${RegisteredNavigablePattern}/*`;

const decode = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export type MatchOptions = {
  /**
   * For a `/*` pattern: count the pattern's own page as well, so `/x/*`
   * answers `/x` too — what a section link asks when it wants to be marked
   * on the index as much as below it. Off by default, where `/x/*` is
   * strictly below.
   */
  readonly inclusive?: boolean;
};

/**
 * Whether a pathname is the one a pattern names, and with which params. Pure
 * and table-free — the pattern is checked against `Register`, the pathname
 * is whatever the caller holds — which is why it works where no table is
 * mounted, under the framework included.
 */
export const matchPath = <P extends MatchablePattern>(
  pattern: P,
  pathname: string,
  options?: MatchOptions,
): ParamsOf<P> | null => {
  if (options?.inclusive === true && pattern.endsWith('/*')) {
    // The index has the same params as the section, minus the wildcard's
    // anonymous capture — which is dropped below anyway.
    const own = pattern.slice(0, -'/*'.length);
    const index = matchPath(
      (own === '' ? '/' : own) as MatchablePattern,
      pathname,
    );
    if (index !== null) return index as ParamsOf<P>;
  }
  const result = new URLPattern({ pathname: pattern }).exec({
    pathname: normalizePathname(pathname),
  });
  if (result === null) return null;
  const params: Record<string, string> = {};
  for (const [name, value] of Object.entries(result.pathname.groups)) {
    // Numeric keys are URLPattern's anonymous wildcard captures — the
    // table only names params, so only named ones surface.
    if (!/^\d+$/u.test(name) && value !== undefined) {
      params[name] = decode(value);
    }
  }
  return params as ParamsOf<P>;
};

/**
 * `matchPath` against where the browser is. It re-renders when the pathname
 * changes and never on the search, like `usePathname` it is built on — so a
 * sidebar can ask "is a page under `/docs/*` showing" without a table in the
 * browser, which is the question `useRoute` cannot answer under the framework.
 */
export function useMatch<P extends MatchablePattern>(
  pattern: P,
  options?: MatchOptions,
): ParamsOf<P> | null {
  return matchPath(pattern, usePathname(), options);
}
