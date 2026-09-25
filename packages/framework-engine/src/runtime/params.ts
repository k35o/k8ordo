import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';

/**
 * A route file's `paramsSchema` export, in the one shape every validation library
 * agrees on (Standard Schema). The framework runs it; the router only types
 * what comes out. Only the synchronous half is honoured: a matcher decides
 * which pattern answers a pathname before anything renders, and nothing
 * asynchronous belongs in that decision.
 */
export type ParamsSchema = {
  readonly '~standard': {
    readonly validate: (
      value: unknown,
    ) => StandardResult | Promise<StandardResult>;
  };
};

type StandardResult =
  | { readonly value: unknown; readonly issues?: undefined }
  | { readonly issues: readonly unknown[] };

export type ParsedParams = {
  readonly params: Readonly<Record<string, unknown>>;
  /** Runs `fn` in the async context the schemas left behind. */
  readonly enter: <T>(fn: () => T) => T;
};

/**
 * Runs the schemas along a matched stack — outer layouts first, the page
 * last — over the raw params, each replacing the strings it names with what
 * it produced. `null` means some schema refused, which is the pattern not
 * answering this pathname at all.
 *
 * A schema may write to the async context it runs in — `@k8ordo/i18n`
 * records the locale it accepted there, for the render to read — so the
 * stack runs in a context of its own. A refusal discards what the schemas
 * before it wrote, and an acceptance hands it on only through `enter`,
 * never to the caller: the static build calls the handler for every page
 * from one context.
 */
export const parseParams = (
  schemas: readonly ParamsSchema[],
  raw: Readonly<Record<string, string>>,
): ParsedParams | null =>
  new AsyncResource('k8ordo.params').runInAsyncScope(() => {
    const current: Record<string, unknown> = { ...raw };
    for (const schema of schemas) {
      const result = schema['~standard'].validate(current);
      if (result instanceof Promise) {
        throw new TypeError(
          'a params schema must validate synchronously — which pattern answers a pathname is decided before anything renders',
        );
      }
      if (result.issues !== undefined) return null;
      // A schema names only the params it validates (an object schema strips
      // the rest), so the ones it did not mention keep their strings.
      if (typeof result.value === 'object' && result.value !== null) {
        Object.assign(current, result.value);
      }
    }
    return { params: current, enter: AsyncLocalStorage.snapshot() };
  });

/**
 * The layouts' schemas above a not-found, run over the catch-all's params for
 * what they write — never to refuse it: a catch-all answers what nothing else
 * did, whatever its params hold. When every schema accepts, the not-found
 * renders in the context they left, so a 404 under `/en/…` is in the locale
 * the URL names; when one refuses (`/fr/…`), in none. The params stay the
 * strings the pathname carried either way, which is what a not-found's type
 * says.
 */
export const parseCatchAllParams = (
  schemas: readonly ParamsSchema[],
  raw: Readonly<Record<string, string>>,
): ParsedParams => ({
  params: raw,
  enter: parseParams(schemas, raw)?.enter ?? ((fn) => fn()),
});
