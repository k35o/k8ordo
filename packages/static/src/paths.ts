import type { RouteDir } from '@k8ordo/framework-engine';

/**
 * Every pattern the table declares, walked the way the router walks it.
 * Groups contribute no segment, which is exactly why they cannot separate
 * two pages that would otherwise share a URL.
 */
export const patternsOf = (dir: RouteDir, prefix = ''): string[] => {
  const here = dir.kind === 'root' ? '' : prefix;
  const found: string[] = [];
  if (dir.page !== null) found.push(here === '' ? '/' : here);
  if (dir.notFound !== null) found.push(`${here}/*`);
  for (const child of dir.children) {
    found.push(
      ...patternsOf(
        child,
        child.kind === 'group' ? here : `${here}${child.key}`,
      ),
    );
  }
  return found;
};

export const isConcrete = (pattern: string): boolean =>
  !pattern.includes(':') && !pattern.includes('*');

const SENTINEL = '__k8ordo-not-found__';

/**
 * Every catch-all the table declares. A static host answers every URL it does
 * not have from **one** file, so a table with a nested `not-found.tsx` cannot
 * be represented: whichever one the build picked, the other would never be
 * served. The build says so rather than choosing.
 */
export const catchAllPatterns = (dir: RouteDir): string[] =>
  patternsOf(dir).filter((pattern) => pattern.endsWith('/*'));

/**
 * A pathname the table can only answer with its catch-all, so the build can
 * render `not-found.tsx` without waiting for a visitor to find it.
 *
 * One segment deeper than the longest concrete pattern, spelled with a
 * segment no literal uses: a pattern of a different length cannot match, and
 * parameters consume exactly one segment each, so nothing but a wildcard is
 * left. Which wildcard is not in question — the build refuses a table with
 * more than one. Returns null when there is no catch-all at all.
 */
export const catchAllPath = (dir: RouteDir): string | null => {
  if (catchAllPatterns(dir).length === 0) return null;
  const depth = Math.max(
    1,
    ...patternsOf(dir)
      .filter((pattern) => !pattern.endsWith('/*'))
      .map((pattern) => pattern.split('/').filter(Boolean).length),
  );
  return `/${Array.from({ length: depth + 1 }, () => SENTINEL).join('/')}`;
};

/**
 * The patterns the build cannot answer on its own. A catch-all is excluded:
 * it is rendered as the not-found file, never as a page of its own.
 */
export const patternsNeedingPaths = (dir: RouteDir): string[] =>
  patternsOf(dir).filter(
    (pattern) => !isConcrete(pattern) && !pattern.endsWith('/*'),
  );

export type PathPlan = {
  /** Concrete pathnames to render, in table order. */
  readonly paths: readonly string[];
  /** Patterns that need values nobody supplied. */
  readonly unresolved: readonly string[];
  /** Supplied pathnames no pattern wanted, and any that are not pathnames. */
  readonly unusable: readonly string[];
};

/**
 * Static rendering cannot invent parameter values, and quietly shipping a
 * site missing half its pages is worse than refusing to build one. Every
 * parameterised pattern must be covered by a supplied path.
 *
 * The other direction counts too: a supplied path nothing matched is a typo
 * that would cost exactly the page it was meant to add, and a supplied value
 * that still contains a parameter (`/ja/blog/:slug` — what expanding only one
 * of two parameters leaves behind) would be written to disk as a directory
 * literally named `:slug`. URLPattern accepts both, so this has to say no.
 */
export const planPaths = (
  tree: RouteDir,
  supplied: readonly string[],
): PathPlan => {
  const patterns = patternsOf(tree);
  const paths = patterns.filter((pattern) => isConcrete(pattern));
  const unresolved: string[] = [];
  const unusable = supplied.filter((path) => !isConcrete(path));
  const usable = supplied.filter((path) => isConcrete(path));
  const used = new Set<string>();

  for (const pattern of patterns) {
    if (isConcrete(pattern) || pattern.endsWith('/*')) continue;
    const matcher = new URLPattern({ pathname: pattern });
    const covered = usable.filter((path) => matcher.test({ pathname: path }));
    if (covered.length === 0) {
      unresolved.push(pattern);
      continue;
    }
    paths.push(...covered);
    for (const path of covered) used.add(path);
  }
  unusable.push(...usable.filter((path) => !used.has(path)));

  return { paths: [...new Set(paths)], unresolved, unusable };
};
