import { normalizePathname } from '@k8ordo/router';

import { currentPhase } from './request-scope';

/** What `redirect()` throws, for whatever answers the request to catch. */
export class Redirect extends Error {
  constructor(readonly to: string) {
    super(`redirect to ${to}`);
    this.name = 'Redirect';
  }
}

/**
 * Ends what answers the request — a `guard.ts`, a `route.ts` or a Server
 * Action — by sending the visitor to `to`, a URL: `href()`'s, with Vite's
 * `base` in it. Thrown, so the lines after it never run, and the cookies
 * and headers written before it go out with the redirect. A guard, a
 * route.ts and a form posted without JavaScript are answered with a `303`
 * to `to`; an action the client runtime posted, with a payload that tells
 * the browser to navigate there. A page is a render, not an answer, so
 * calling it while one renders throws by name.
 */
export const redirect = (to: string): never => {
  if (currentPhase() === 'render') {
    throw new Error(
      `redirect() ends what answers the request, and a page is a render — redirect from a guard.ts, a route.ts or a Server Action, or answer the URL with a redirect.ts (it was asked for ${to})`,
    );
  }
  throw new Redirect(to);
};

/** A redirect's answer: `to` in `location`, under `status`. */
export const redirectResponse = (to: string, status: number): Response =>
  new Response(null, { status, headers: { location: to } });

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
 * send to `/:locale/new`, and `/old/:path+` to `/new/:path+`, every segment
 * the rest param took moved as one; `null` for a pattern no redirect declares. Which
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
      {
        matcher: new URLPattern({ pathname: pattern }),
        rest: new Set(
          pattern
            .split('/')
            .filter(
              (segment) => segment.startsWith(':') && segment.endsWith('+'),
            )
            .map((segment) => segment.slice(1, -1)),
        ),
        target,
      },
    ]),
  );
  return (pattern, pathname) => {
    const declaredHere = matchers.get(pattern);
    if (declaredHere === undefined) return null;
    const { rest } = declaredHere;
    const result = declaredHere.matcher.exec({
      pathname: normalizePathname(pathname),
    });
    if (result === null) return null;
    const segments: Record<string, string> = {};
    for (const [name, value] of Object.entries(result.pathname.groups)) {
      if (/^\d+$/u.test(name) || value === undefined) continue;
      // A rest param goes by the spelling the pattern gives it (`path+`), so a
      // target moves it with `:path+` and nowhere a single segment is meant.
      segments[rest.has(name) ? `${name}+` : name] = value;
    }
    return resolveTarget(declaredHere.target, segments);
  };
};
