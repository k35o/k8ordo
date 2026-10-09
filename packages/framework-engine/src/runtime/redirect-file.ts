import { normalizePathname } from '@k8ordo/router';

// redirect() と同じモジュールに置かない。redirect() はアプリが
// @k8ordo/framework/server から import する入口に束ねられ、外部パッケージの
// import はそこに副作用の import として残るので、router を持ち込んでしまう

/** What a `redirect.ts` route file default-exports. */
export type RedirectTarget =
  | string
  | { readonly to: string; readonly permanent?: boolean };

type ResolvedRedirect = { readonly to: string; readonly permanent: boolean };

const resolveTarget = (
  target: RedirectTarget,
  segments: Readonly<Record<string, string>>,
): ResolvedRedirect => {
  const { to, permanent } =
    typeof target === 'string' ? { to: target, permanent: false } : target;
  const resolved = to
    .split('/')
    .map((segment) => {
      if (!segment.startsWith(':')) return segment;
      const value = segments[segment.slice(1)];
      if (value === undefined) {
        throw new TypeError(
          `redirect target "${to}" needs a value for "${segment}"`,
        );
      }
      // `href` encodes, because it is handed values. This is handed a
      // segment the URL already spelled — escapes, and escapes that do not
      // decode, included — and moves it as it is.
      return value;
    })
    .join('/');
  return { to: resolved, permanent: permanent ?? false };
};

/**
 * Where a `redirect.ts` sends a pathname the table matched to its pattern,
 * with the matched params filled into the target, so `/:locale/legacy` can
 * send to `/:locale/new`; `null` for a pattern no redirect declares. Which
 * pattern answers is the table's to say — the redirect holds its place there
 * — so this only reads the params again: the router hands them decoded, and a
 * target moves a segment as the URL spelled it. The pathname is normalized as
 * the table normalizes it, so `/old/` is `/old` here too.
 */
export const resolveRedirects = (
  declared: Readonly<Record<string, RedirectTarget>>,
): ((pattern: string, pathname: string) => ResolvedRedirect | null) => {
  const matchers = new Map(
    Object.entries(declared).map(([pattern, target]) => [
      pattern,
      { matcher: new URLPattern({ pathname: pattern }), target },
    ]),
  );
  return (pattern, pathname) => {
    const declaredHere = matchers.get(pattern);
    if (declaredHere === undefined) return null;
    const result = declaredHere.matcher.exec({
      pathname: normalizePathname(pathname),
    });
    if (result === null) return null;
    const segments: Record<string, string> = {};
    for (const [name, value] of Object.entries(result.pathname.groups)) {
      if (!/^\d+$/u.test(name) && value !== undefined) segments[name] = value;
    }
    return resolveTarget(declaredHere.target, segments);
  };
};
