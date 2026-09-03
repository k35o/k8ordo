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
      ...patternsOf(child, child.kind === 'group' ? here : `${here}${child.key}`),
    );
  }
  return found;
};

export const isConcrete = (pattern: string): boolean =>
  !pattern.includes(':') && !pattern.includes('*');

export type PathPlan = {
  /** Concrete pathnames to render, in table order. */
  readonly paths: readonly string[];
  /** Patterns that need values nobody supplied. */
  readonly unresolved: readonly string[];
};

/**
 * Static rendering cannot invent parameter values, and quietly shipping a
 * site missing half its pages is worse than refusing to build one. Every
 * parameterised pattern must be covered by a supplied path.
 */
export const planPaths = (
  tree: RouteDir,
  supplied: readonly string[],
): PathPlan => {
  const patterns = patternsOf(tree);
  const paths = patterns.filter((pattern) => isConcrete(pattern));
  const unresolved: string[] = [];

  for (const pattern of patterns) {
    if (isConcrete(pattern) || pattern.endsWith('/*')) continue;
    const matcher = new URLPattern({ pathname: pattern });
    const covered = supplied.filter((path) =>
      matcher.test({ pathname: path }),
    );
    if (covered.length === 0) {
      unresolved.push(pattern);
      continue;
    }
    paths.push(...covered);
  }

  return { paths: [...new Set(paths)], unresolved };
};
