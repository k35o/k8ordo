import { buildHref } from './paths';
import type { ParamsOf, PathFor } from './paths';
import type { RegisteredNavigablePattern } from './register';

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

/**
 * Builds a concrete path from a pattern and its params — no route table
 * involved, which is why pages never import one. Params are inferred from
 * the pattern literal itself; `Register` adds the check that the pattern
 * exists in the app's table. The path shape survives in the return type for
 * typed-path consumers (`@k8ordo/state`'s `Register` among them).
 */
export const href = <P extends RegisteredNavigablePattern>(
  pattern: P,
  ...params: HrefArgs<ParamsOf<P>>
): PathFor<P> => buildHref(pattern, params[0]) as PathFor<P>;

/**
 * Typed imperative navigation: `href` composed with
 * `navigation.navigate()`, returning the platform's own
 * `{ committed, finished }`. Changing pages goes through here; changing
 * state goes through `@k8ordo/state`'s `update()`.
 */
export const navigateTo = <P extends RegisteredNavigablePattern>(
  pattern: P,
  ...rest: NavigateToArgs<ParamsOf<P>>
): ReturnType<Navigation['navigate']> => {
  // params と options はどちらも素のオブジェクトなので、実行時の区別は
  // 「パターンが params を要求するか」で行う(型と同じ判定基準)
  const wantsParams = pattern.includes(':');
  const args: readonly unknown[] = rest;
  const params = wantsParams
    ? (args[0] as Readonly<Record<string, string>> | undefined)
    : undefined;
  const options = (wantsParams ? args[1] : args[0]) as
    | NavigateToOptions
    | undefined;
  return navigation.navigate(buildHref(pattern, params), {
    history: options?.history ?? 'push',
  });
};
