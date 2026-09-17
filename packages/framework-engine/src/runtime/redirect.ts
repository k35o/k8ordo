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

  constructor(
    readonly to: string,
    readonly permanent: boolean,
  ) {
    super(`redirect to ${to}`);
    this.name = 'Redirect';
  }
}

export type RedirectOptions = {
  readonly permanent?: boolean;
};

/**
 * Ends a Server Action by sending the visitor somewhere else. Thrown, so an
 * action reads the way it did before the redirect was added — the lines
 * after it never run. A form posted without JavaScript is answered with a
 * `303` to `to`; one posted by the client runtime is answered with a
 * payload that tells the browser to navigate there.
 */
export const redirect = (to: string, options: RedirectOptions = {}): never => {
  throw new Redirect(to, options.permanent ?? false);
};

export const isRedirect = (value: unknown): value is Redirect =>
  typeof value === 'object' &&
  value !== null &&
  (value as { [BRAND]?: unknown })[BRAND] === true;

/** What a `redirect.ts` route file default-exports. */
export type RedirectTarget =
  | string
  | { readonly to: string; readonly permanent?: boolean };

/**
 * A `redirect.ts` target with the matched params filled in: `/:locale/new`
 * under `{ locale: 'ja' }` is `/ja/new`. The same substitution `href` does,
 * so a target reads like a pattern.
 */
export const resolveTarget = (
  target: RedirectTarget,
  params: Readonly<Record<string, string>>,
): { readonly to: string; readonly permanent: boolean } => {
  const { to, permanent } =
    typeof target === 'string' ? { to: target, permanent: false } : target;
  const resolved = to
    .split('/')
    .map((segment) => {
      if (!segment.startsWith(':')) return segment;
      const value = params[segment.slice(1)];
      if (value === undefined) {
        throw new TypeError(
          `redirect target "${to}" needs a value for "${segment}"`,
        );
      }
      return encodeURIComponent(value);
    })
    .join('/');
  return { to: resolved, permanent: permanent ?? false };
};
