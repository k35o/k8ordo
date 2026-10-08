/**
 * A redirect thrown from a Server Action. Branded with a registry symbol
 * rather than a class: the framework bundles this module once into the
 * entry an application imports `redirect()` from and once into the runtime
 * it copies beside it (where the handler catches it), and two copies of a
 * class are two classes. `Symbol.for` is the one identity both share.
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
