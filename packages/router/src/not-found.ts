/**
 * Branded with a registry symbol rather than recognised by class: the page
 * that throws it and the framework that catches it may hold two copies of
 * this package — a mode package bundles what it runs — and two copies of a
 * class are two classes. `Symbol.for` is the one identity both share.
 */
const BRAND = Symbol.for('k8ordo.not-found');

class NotFound extends Error {
  readonly [BRAND] = true;

  constructor() {
    super('not found');
    this.name = 'NotFound';
  }
}

/**
 * Says, from a page, that its pathname is not a page after all — the
 * product the id names does not exist. Thrown, so the lines after it never
 * run. Under `@k8ordo/static` and `@k8ordo/server` the nearest
 * `not-found.tsx` answers instead, under a 404.
 */
// A declaration rather than an arrow: a call narrows what follows it
// (`if (!product) notFound();`) only when the callee's type is explicit.
export function notFound(): never {
  throw new NotFound();
}

/** Whether a thrown value is what `notFound()` throws. */
export const isNotFound = (value: unknown): boolean =>
  typeof value === 'object' &&
  value !== null &&
  (value as { [BRAND]?: unknown })[BRAND] === true;
