/**
 * A redirect thrown from a Server Action. Branded with a registry symbol
 * rather than a class: the mode package bundles this module once into its
 * plugin entry (where `redirect()` is exported from) and once into the
 * runtime it copies beside it (where the handler catches it), and two copies
 * of a class are two classes. `Symbol.for` is the one identity both share.
 */
const BRAND = Symbol.for('k8ordo.redirect');

/**
 * An `Error` for the linter's and the stack's sake, recognised by the brand
 * and never by `instanceof`.
 */
export class Redirect extends Error {
  readonly [BRAND] = true;

  constructor(readonly to: string) {
    super(`redirect to ${to}`);
    this.name = 'Redirect';
  }
}

/**
 * Ends a Server Action by sending the visitor somewhere else. Thrown, so an
 * action reads the way it did before the redirect was added — the lines
 * after it never run. A form posted without JavaScript is answered with a
 * `303` to `to`; one posted by the client runtime is answered with a
 * payload that tells the browser to navigate there.
 */
export const redirect = (to: string): never => {
  throw new Redirect(to);
};

export const isRedirect = (value: unknown): value is Redirect =>
  typeof value === 'object' &&
  value !== null &&
  (value as { [BRAND]?: unknown })[BRAND] === true;

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
 * The redirects `routes/` declared, matched in declaration order: where a
 * pathname is sent, with the matched params filled into the target, so
 * `/:locale/legacy` can send to `/:locale/new`.
 */
export const matchRedirects = (
  declared: Readonly<Record<string, RedirectTarget>>,
): ((pathname: string) => ResolvedRedirect | null) => {
  const matchers = Object.entries(declared).map(([pattern, target]) => ({
    matcher: new URLPattern({ pathname: pattern }),
    target,
  }));
  return (pathname) => {
    for (const { matcher, target } of matchers) {
      const result = matcher.exec({ pathname });
      if (result === null) continue;
      const segments: Record<string, string> = {};
      for (const [name, value] of Object.entries(result.pathname.groups)) {
        if (!/^\d+$/u.test(name) && value !== undefined) segments[name] = value;
      }
      return resolveTarget(target, segments);
    }
    return null;
  };
};
