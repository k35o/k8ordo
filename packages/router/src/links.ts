import { buildHref } from './paths';
import type { ParamValue, PathFor } from './paths';
import type { RegisteredNavigablePattern, RegisteredParams } from './register';

type HrefArgs<Params> = keyof Params extends never
  ? []
  : [params: Readonly<Params & Record<never, never>>];

export type NavigateToOptions = {
  /**
   * `push` by default: going to a page is what the back button undoes —
   * the opposite default from a state refinement.
   */
  history?: 'push' | 'replace';
};

type NavigateToArgs<Params> = keyof Params extends never
  ? [options?: NavigateToOptions]
  : [
      params: Readonly<Params & Record<never, never>>,
      options?: NavigateToOptions,
    ];

const navigate = (
  pattern: string,
  params: Readonly<Record<string, unknown>> | undefined,
  options: NavigateToOptions | undefined,
): ReturnType<Navigation['navigate']> =>
  navigation.navigate(buildHref(pattern, params), {
    history: options?.history ?? 'push',
  });

/**
 * Builds a concrete path from a pattern and its params — no route table
 * involved, which is why pages never import one. Params are inferred from
 * the pattern literal itself; `Register` adds the check that the pattern
 * exists in the app's table, and — under the framework — the type a page's
 * schema gave each param, so a link takes what the page received. The path
 * shape survives in the return type for typed-path consumers
 * (`@k8ordo/state`'s `Register` among them).
 */
export const href = <P extends RegisteredNavigablePattern>(
  pattern: P,
  ...params: HrefArgs<RegisteredParams<P>>
): PathFor<P> => buildHref(pattern, params[0]) as PathFor<P>;

/**
 * Typed imperative navigation: `href` composed with
 * `navigation.navigate()`, returning the platform's own
 * `{ committed, finished }`. Changing pages goes through here; changing
 * state goes through `@k8ordo/state`'s `update()`.
 */
export const navigateTo = <P extends RegisteredNavigablePattern>(
  pattern: P,
  ...rest: NavigateToArgs<RegisteredParams<P>>
): ReturnType<Navigation['navigate']> => {
  // params と options はどちらも素のオブジェクトなので、実行時の区別は
  // 「パターンが params を要求するか」で行う(型と同じ判定基準)
  const wantsParams = pattern.includes(':');
  const args: readonly unknown[] = rest;
  const params = wantsParams
    ? (args[0] as Readonly<Record<string, unknown>> | undefined)
    : undefined;
  const options = (wantsParams ? args[1] : args[0]) as
    | NavigateToOptions
    | undefined;
  return navigate(pattern, params, options);
};

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

type BoundNavigateToArgs<Params, Bound> = keyof Params extends never
  ? [options?: NavigateToOptions]
  : [...BoundHrefArgs<Params, Bound>, options?: NavigateToOptions];

export type BoundLinks<Bound extends BoundParams> = {
  readonly href: <P extends RegisteredNavigablePattern>(
    pattern: P,
    ...rest: BoundHrefArgs<RegisteredParams<P>, Bound>
  ) => PathFor<P>;
  readonly navigateTo: <P extends RegisteredNavigablePattern>(
    pattern: P,
    ...rest: BoundNavigateToArgs<RegisteredParams<P>, Bound>
  ) => ReturnType<Navigation['navigate']>;
};

/**
 * `href` and `navigateTo` with some params supplied by a function instead of
 * by every call — a segment the whole application shares, such as a locale
 * or a tenant. The source is read at each call, so a value that differs per
 * request or per URL is read where it is current. Patterns keep their full
 * spelling (`'/:locale/products'`), so the table's types apply unchanged and
 * a bound param can still be given to point at another value.
 *
 * ```ts
 * const { href, navigateTo } = bindParams(() => ({ locale: locales.getLocale() }));
 * href('/:locale/products/:id', { id }); // locale comes from the source
 * navigateTo('/:locale', { locale: 'en' }, { history: 'replace' }); // or is overridden
 * ```
 */
export const bindParams = <const Bound extends BoundParams>(
  source: () => Bound,
): BoundLinks<Bound> => ({
  href: (pattern, ...rest) =>
    buildHref(pattern, { ...source(), ...rest[0] }) as never,
  navigateTo: (pattern, ...rest) => {
    // The same rule as `navigateTo`: a pattern that names params takes them
    // first, and a pattern that names none takes the options first.
    const wantsParams = pattern.includes(':');
    const args: readonly unknown[] = rest;
    const params = wantsParams
      ? (args[0] as Readonly<Record<string, unknown>> | undefined)
      : undefined;
    const options = (wantsParams ? args[1] : args[0]) as
      | NavigateToOptions
      | undefined;
    return navigate(pattern, { ...source(), ...params }, options);
  },
});
