import { withBase } from './base';
import { buildHref } from './paths';
import type { ParamValue } from './paths';
import type { RegisteredNavigablePattern, RegisteredParams } from './register';

type HrefArgs<Params> = keyof Params extends never
  ? []
  : [params: Readonly<Params & Record<never, never>>];

/**
 * Builds the URL a link points at from a pattern and its params — no route
 * table involved, which is why pages never import one. Params are inferred
 * from the pattern literal itself; `Register` adds the check that the
 * pattern exists in the app's table, and — under the framework — the type a
 * page's schema gave each param, so a link takes what the page received.
 *
 * What comes back is a URL, with Vite's `base` in front (`withBase`), not a
 * pathname in the table's terms — which is why it is typed `string`. The
 * same URL serves a link and a navigation started from code:
 * `navigation.navigate(href('/products/:id', { id }))`.
 */
export const href = <P extends RegisteredNavigablePattern>(
  pattern: P,
  ...params: HrefArgs<RegisteredParams<P>>
): string => withBase(buildHref(pattern, params[0]));

/** What a params source supplies: values with one URL spelling, by name. */
export type BoundParams = Readonly<Record<string, ParamValue>>;

/**
 * The params a bound link still takes: what the source does not supply is
 * required as before, and what it does supply may be given to override it.
 */
type Unbound<Params, Bound> = Omit<Params, keyof Bound> &
  Partial<Pick<Params, Extract<keyof Bound, keyof Params>>>;

type BoundHrefArgs<Params, Bound> =
  Exclude<keyof Params, keyof Bound> extends never
    ? [params?: Readonly<Partial<Params> & Record<never, never>>]
    : [params: Readonly<Unbound<Params, Bound> & Record<never, never>>];

/**
 * `href` with some params supplied by a function instead of by every call —
 * a segment the whole application shares, such as a locale or a tenant. The
 * source is read at each call, so a value that differs per request or per
 * URL is read where it is current. Patterns keep their full spelling
 * (`'/:locale/products'`), so the table's types apply unchanged and a bound
 * param can still be given to point at another value.
 *
 * ```ts
 * export const href = bindParams(() => ({ locale: locales.getLocale() }));
 * href('/:locale/products/:id', { id }); // locale comes from the source
 * href('/:locale', { locale: 'en' }); // or is overridden
 * ```
 */
export const bindParams =
  <const Bound extends BoundParams>(
    source: () => Bound,
  ): (<P extends RegisteredNavigablePattern>(
    pattern: P,
    ...rest: BoundHrefArgs<RegisteredParams<P>, Bound>
  ) => string) =>
  (pattern, ...rest) =>
    withBase(buildHref(pattern, { ...source(), ...rest[0] }));
