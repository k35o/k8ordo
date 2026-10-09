import {
  declaredPatterns,
  decodePathname,
  FALLBACK_SEGMENT,
  fallbackShapes,
  NOT_FOUND_SEGMENT,
} from '@k8ordo/framework-engine';
import type {
  DeclaredPattern,
  FallbackShape,
  RouteDir,
} from '@k8ordo/framework-engine';
import { normalizePathname } from '@k8ordo/router';

/**
 * Every pattern the table declares — pages, redirects and catch-alls — in
 * the order the matcher will try them. The engine's one walk, so the build
 * and the prerenderer agree; a redirect is a URL the site has, so it is a
 * file the site writes.
 */
export const patternsOf = (dir: RouteDir): string[] =>
  declaredPatterns(dir).map((each) => each.pattern);

/** A `:name` segment: a parameter a pattern, or a shell location, leaves open. */
const PARAM_SEGMENT = /^:[A-Za-z_]\w*$/u;

const isParamSegment = (segment: string): boolean =>
  PARAM_SEGMENT.test(segment);

/**
 * A pathname with nothing left to fill: no `:name` segment and no `*`. A `:`
 * inside a segment (`/posts/a:b`) is a value like any other.
 */
export const isConcrete = (pattern: string): boolean =>
  !pattern.includes('*') &&
  !pattern.split('/').some((segment) => isParamSegment(segment));

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
 * Built from the catch-all's own prefix — its literal segments kept, its
 * parameters filled with a segment no literal uses — and then taken one
 * segment deeper than the longest concrete pattern. Keeping the literals is
 * what reaches a `not-found.tsx` that sits under a named directory; going
 * deeper is what stops any real page from answering first, since parameters
 * consume exactly one segment each. Returns null when there is no catch-all;
 * which one is never in question, because the build refuses a table with more
 * than one.
 */
export const catchAllPath = (dir: RouteDir): string | null => {
  const [pattern] = catchAllPatterns(dir);
  if (pattern === undefined) return null;
  const prefix = pattern
    .slice(0, -'/*'.length)
    .split('/')
    .filter(Boolean)
    .map((segment) => (segment.startsWith(':') ? NOT_FOUND_SEGMENT : segment));
  const depth = Math.max(
    prefix.length + 1,
    ...patternsOf(dir)
      .filter((each) => !each.endsWith('/*'))
      .map((each) => each.split('/').filter(Boolean).length + 1),
  );
  const filler = Array.from(
    { length: depth - prefix.length },
    () => NOT_FOUND_SEGMENT,
  );
  return `/${[...prefix, ...filler].join('/')}`;
};

/**
 * The patterns the build cannot answer on its own. A catch-all is excluded:
 * it is rendered as the not-found file, never as a page of its own.
 */
export const patternsNeedingPaths = (dir: RouteDir): string[] =>
  patternsOf(dir).filter(
    (pattern) => !isConcrete(pattern) && !pattern.endsWith('/*'),
  );

/**
 * A shell location's pathname: each segment it leaves to the browser replaced
 * by the reserved one. `/ja/posts/:id` → `/ja/posts/!fallback`.
 */
export const shellPathname = (location: string): string =>
  location
    .split('/')
    .map((segment) => (isParamSegment(segment) ? FALLBACK_SEGMENT : segment))
    .join('/');

/** The params a shell location still holds, in order. */
const unknownOf = (location: string): string[] =>
  location
    .split('/')
    .filter((segment) => isParamSegment(segment))
    .map((segment) => segment.slice(1));

export type Shell = {
  /** The pattern whose fallback.tsx renders it. */
  readonly pattern: string;
  /** Where it stands, as supplied or the bare pattern — what a host's rule matches. */
  readonly location: string;
  /** What the handler renders it for, and the directory it is written to. */
  readonly pathname: string;
};

export type ClosedShell = {
  readonly location: string;
  /** Left unknown, though a layout above the fallback.tsx receives them. */
  readonly params: readonly string[];
  readonly layout: string;
  /** Supplied by `paths`, or the bare pattern standing in for none. */
  readonly supplied: boolean;
};

export type PathPlan = {
  /** Concrete pathnames to render, in table order. */
  readonly paths: readonly string[];
  /** The shells to render: table order, and within a pattern supply order. */
  readonly shells: readonly Shell[];
  /** Patterns that need values nobody supplied. */
  readonly unresolved: readonly string[];
  /** Supplied pathnames no pattern wanted, and any that are not pathnames. */
  readonly unusable: readonly string[];
  /** Supplied pathnames holding a parameter, for a pattern with no fallback.tsx. */
  readonly held: ReadonlyArray<{
    readonly location: string;
    readonly file: string;
  }>;
  /** Supplied shell locations whose parameter names are not their pattern's. */
  readonly misnamed: ReadonlyArray<{
    readonly location: string;
    readonly pattern: string;
  }>;
  /** Shell locations leaving open a param a layout above receives. */
  readonly closed: readonly ClosedShell[];
  /** Supplied pathnames with a segment the build keeps for shells. */
  readonly reserved: readonly string[];
};

/**
 * Whether a location is one the pattern answers, segment by segment: a
 * literal needs the same literal; a parameter takes a value, or the same
 * `:name` left open — any `:name`, when names are not compared.
 */
const fits = (pattern: string, location: string, byName = true): boolean => {
  const wanted = pattern.split('/');
  const given = location.split('/');
  if (wanted.length !== given.length) return false;
  return wanted.every((segment, index) => {
    const at = given[index] as string;
    if (!isParamSegment(segment)) return segment === at;
    return !isParamSegment(at) || !byName || at === segment;
  });
};

/**
 * Static rendering cannot invent parameter values, and quietly shipping a
 * site missing half its pages is worse than refusing to build one. Every
 * parameterised pattern must be covered by a supplied path — or, for a page
 * with a fallback.tsx beside it, by its shell, which answers the values the
 * build did not write.
 *
 * The other direction counts too: a supplied path nothing matched is a typo
 * that would cost exactly the page it was meant to add, and a supplied value
 * that still contains a parameter (`/ja/blog/:slug` — what expanding only one
 * of two parameters leaves behind) would be written to disk as a directory
 * literally named `:slug` — unless its page has a fallback.tsx, when it is
 * where that shell stands. URLPattern accepts both, so this has to say no.
 *
 * A location goes to the first pattern in table order it fits, which is the
 * pattern whose URLs a host's rule for it will catch.
 */
export const planPaths = (
  tree: RouteDir,
  supplied: readonly string[],
): PathPlan => {
  const patterns = patternsOf(tree);
  const declared = declaredPatterns(tree).filter(
    (each) => each.kind !== 'notFound',
  );
  const shapes = new Map(
    fallbackShapes(tree).map((shape) => [shape.pattern, shape]),
  );
  const paths = patterns.filter((pattern) => isConcrete(pattern));
  const unresolved: string[] = [];
  const unusable: string[] = [];
  const held: Array<{ location: string; file: string }> = [];
  const misnamed: Array<{ location: string; pattern: string }> = [];
  const closed: ClosedShell[] = [];
  const reserved: string[] = [];
  const located = new Map<string, Shell[]>();
  // 場所を渡されたパターン。閉じた場所だけでも、素の殻の誤りを重ねて言わない
  const offered = new Set<string>();
  // 末尾スラッシュは同じ pathname。ルーターがそう扱う以上、ビルドも揃える。
  const usable: string[] = [];

  for (const raw of supplied) {
    const path = normalizePathname(raw);
    // 殻の置き場の名前。%21fallback も復号すれば同じディレクトリになる
    if (
      path
        .split('/')
        .some((segment) => decodePathname(segment) === FALLBACK_SEGMENT)
    ) {
      reserved.push(path);
      continue;
    }
    if (isConcrete(path)) {
      usable.push(path);
      continue;
    }
    if (path.includes('*')) {
      unusable.push(path);
      continue;
    }
    const first = declared.find((each) => fits(each.pattern, path));
    if (first === undefined) {
      const loosely = declared.find((each) => fits(each.pattern, path, false));
      if (loosely === undefined) unusable.push(path);
      else misnamed.push({ location: path, pattern: loosely.pattern });
      continue;
    }
    const shape = shapes.get(first.pattern);
    if (shape === undefined) {
      held.push({ location: path, file: first.file });
      continue;
    }
    offered.add(first.pattern);
    const outside = unknownOf(path).filter(
      (name) => !shape.open.includes(name),
    );
    if (outside.length > 0) {
      closed.push({
        location: path,
        params: outside,
        layout: shape.layout ?? '',
        supplied: true,
      });
      continue;
    }
    located.set(first.pattern, [
      ...(located.get(first.pattern) ?? []),
      { pattern: first.pattern, location: path, pathname: shellPathname(path) },
    ]);
  }
  // 表がそのまま持っているパスを渡してくるのは冗長なだけで、誤りではない。
  const used = new Set<string>(paths);
  const shells: Shell[] = [];

  for (const pattern of patterns) {
    if (isConcrete(pattern) || pattern.endsWith('/*')) continue;
    const matcher = new URLPattern({ pathname: pattern });
    const covered = usable.filter((path) => matcher.test({ pathname: path }));
    paths.push(...covered);
    for (const path of covered) used.add(path);
    const shape = shapes.get(pattern);
    if (shape === undefined) {
      if (covered.length === 0) unresolved.push(pattern);
      continue;
    }
    const assigned = located.get(pattern) ?? [];
    if (assigned.length > 0) {
      // 渡された場所がサイトの持つ上の値のすべて。素の殻を足すと /fr/posts/1
      // にまで 200 で答えてしまう
      shells.push(...assigned);
      continue;
    }
    if (offered.has(pattern)) continue;
    const left = shape.params.filter((name) => !shape.open.includes(name));
    if (left.length === 0) {
      shells.push({
        pattern,
        location: pattern,
        pathname: shellPathname(pattern),
      });
    } else {
      closed.push({
        location: pattern,
        params: left,
        layout: shape.layout ?? '',
        supplied: false,
      });
    }
  }
  unusable.push(...usable.filter((path) => !used.has(path)));

  return {
    paths: [...new Set(paths)],
    shells: shells.filter(
      (shell, index) =>
        shells.findIndex((each) => each.pathname === shell.pathname) === index,
    ),
    unresolved,
    unusable,
    held,
    misnamed,
    closed,
    reserved,
  };
};

export type ShadowedShell = {
  readonly location: string;
  /** Its fallback.tsx. */
  readonly fallback: string;
  /** The pattern declared first that the shell's rule would also answer for. */
  readonly pattern: string;
  /** The file declaring that pattern. */
  readonly file: string;
  /** The one URL both answer, or null when they share a parameter position (infinitely many). */
  readonly url: string | null;
};

/**
 * Shells whose host rule would answer URLs the table gives a pattern declared
 * before theirs — a page, route.ts or redirect.ts with a parameter and no
 * fallback.tsx of its own. A host matches the shell's location alone, so the
 * table's order does not reach it. Only real conflicts: where both hold a
 * parameter at one position, infinitely many URLs; where the two meet in one
 * URL, only when the build did not write it, since the written file answers.
 */
export const shadowedShells = (
  tree: RouteDir,
  shells: readonly Shell[],
  built: ReadonlySet<string>,
): ShadowedShell[] => {
  const declared = declaredPatterns(tree).filter(
    (each) => each.kind !== 'notFound',
  );
  const shapes = new Map<string, FallbackShape>(
    fallbackShapes(tree).map((shape) => [shape.pattern, shape]),
  );
  const found: ShadowedShell[] = [];
  for (const shell of shells) {
    const shape = shapes.get(shell.pattern);
    if (shape === undefined) continue;
    const before = declared.slice(
      0,
      declared.findIndex((each) => each.pattern === shell.pattern),
    );
    for (const earlier of before) {
      if (shapes.has(earlier.pattern) || isConcrete(earlier.pattern)) continue;
      const url = overlapOf(shell.location, earlier);
      if (url === undefined) continue;
      if (url !== null && built.has(url)) continue;
      found.push({
        location: shell.location,
        fallback: shape.file,
        pattern: earlier.pattern,
        file: earlier.file,
        url,
      });
    }
  }
  return found;
};

/**
 * Where a location and a pattern meet: `undefined` when they never do, `null`
 * when a parameter on both sides at one position makes it infinitely many
 * URLs, and otherwise the one URL, each position fixed by one side.
 */
const overlapOf = (
  location: string,
  earlier: DeclaredPattern,
): string | null | undefined => {
  const mine = location.split('/');
  const theirs = earlier.pattern.split('/');
  if (mine.length !== theirs.length) return undefined;
  const url: string[] = [];
  for (const [index, segment] of mine.entries()) {
    const other = theirs[index] as string;
    const open = isParamSegment(segment);
    const otherOpen = isParamSegment(other);
    if (open && otherOpen) return null;
    if (!open && !otherOpen && segment !== other) return undefined;
    url.push(open ? other : segment);
  }
  return url.join('/');
};

/** How a pathname is named in a message: its file, as a person finds it. */
const isPage = (file: string): boolean =>
  file === 'page.tsx' || file.endsWith('/page.tsx');

const paramList = (params: readonly string[]): string =>
  params.map((name) => `:${name}`).join(', ');

/**
 * What the build refuses in a plan, each kind its own message, so fixing one
 * is not what reveals the next. `vite dev` logs the same words as a warning.
 */
export const planRefusals = (
  plan: PathPlan,
  shadowed: readonly ShadowedShell[],
): string[] => {
  const bare = plan.closed.filter((each) => !each.supplied);
  const suppliedClosed = plan.closed.filter((each) => each.supplied);
  return [
    ...(plan.unresolved.length > 0
      ? [
          `static build needs pathnames for ${plan.unresolved.join(', ')} — supply them with the "paths" option`,
        ]
      : []),
    ...(plan.unusable.length > 0
      ? [
          `the "paths" option supplied pathnames no route wants: ${plan.unusable.join(', ')}`,
        ]
      : []),
    ...(plan.held.length > 0
      ? [
          `the "paths" option supplied pathnames that still hold a parameter, and only a page with a fallback.tsx beside it takes one: ${plan.held
            .map(
              ({ location, file }) =>
                `${location} (${file} ${isPage(file) ? 'has none' : 'cannot have one'})`,
            )
            .join(', ')}`,
        ]
      : []),
    ...(plan.misnamed.length > 0
      ? [
          `the "paths" option supplied shell locations whose parameter names are not their pattern's: ${plan.misnamed
            .map(({ location, pattern }) => `${location} (${pattern})`)
            .join(', ')}`,
        ]
      : []),
    ...(suppliedClosed.length > 0
      ? [
          `the "paths" option supplied shell locations that leave out a parameter a layout above their fallback.tsx receives: ${suppliedClosed
            .map(
              ({ location, params, layout }) =>
                `${location} (${paramList(params)}, received by ${layout})`,
            )
            .join(', ')}`,
        ]
      : []),
    ...(bare.length > 0
      ? [
          bare
            .map(
              ({ location, params, layout }) =>
                `static build needs shell locations for ${location} — ${layout} receives ${paramList(params)}, so the "paths" option has to fill ${params.length === 1 ? 'it' : 'them'}, as in ${location
                  .split('/')
                  .map((segment) =>
                    params.some((name) => segment === `:${name}`)
                      ? `<${segment.slice(1)}>`
                      : segment,
                  )
                  .join('/')}`,
            )
            .join('\n'),
        ]
      : []),
    ...(plan.reserved.length > 0
      ? [
          `the "paths" option supplied pathnames with a segment named ${FALLBACK_SEGMENT}, which the build keeps for shells: ${plan.reserved.join(', ')}`,
        ]
      : []),
    ...(shadowed.length > 0
      ? [
          shadowed
            .map(({ location, fallback, pattern, file, url }) =>
              url === null
                ? `the shell for ${location} (${fallback}) would also answer URLs ${pattern} (${file}) is declared first for — ${isPage(file) ? `give ${file} a fallback.tsx too, or supply` : 'supply'} shell locations it cannot match`
                : `the shell for ${location} (${fallback}) would also answer ${url}, which ${file} is declared first for and the build did not write — list ${url} in "paths", or supply shell locations it cannot match`,
            )
            .join('\n'),
        ]
      : []),
  ];
};

/**
 * The directory a rendered pathname is written to. A supplied path is
 * URL-escaped — `/products/caf%C3%A9` — so writing it verbatim would
 * make a directory literally named with the escapes, which no host would then
 * match. Decoding is also the moment a path that leaves the output directory
 * has to be refused: `..` is a real URL segment and would otherwise be
 * resolved by `path.join`.
 */
export const dirFor = (pathname: string): string => {
  const decoded = decodePathname(pathname);
  if (decoded === null) {
    throw new Error(
      `the "paths" option supplied a pathname with a malformed escape: ${pathname}`,
    );
  }
  if (decoded.split('/').some((segment) => segment === '..')) {
    throw new Error(
      `the "paths" option supplied a pathname that leaves the output: ${pathname}`,
    );
  }
  return decoded;
};

/**
 * Whether a route.ts answers a pathname the build writes, rather than a page:
 * the first declared pattern that matches it says, in the matcher's order.
 * The catch-all never answers a pathname the build was given.
 */
export const answeredByRoute = (dir: RouteDir, pathname: string): boolean => {
  for (const each of declaredPatterns(dir)) {
    if (each.kind === 'notFound') continue;
    if (new URLPattern({ pathname: each.pattern }).test({ pathname })) {
      return each.kind === 'route';
    }
  }
  return false;
};
