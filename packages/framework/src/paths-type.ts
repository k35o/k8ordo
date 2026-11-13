import type { ParamsOf } from '@k8ordo/router';

/** The parameter a pattern ends in: `id` of `/:locale/posts/:id`. */
type LastParam<Pattern extends string> =
  Pattern extends `${string}/:${infer Rest}`
    ? Rest extends `${string}/:${string}`
      ? LastParam<`/${Rest}`>
      : Rest
    : never;

/**
 * What a `paths.ts` exports by default, under `mode: 'static'`: the values
 * its directory's parameter takes, given the params of the directories above
 * it — one call per combination of theirs. `Pattern` is the directory's own,
 * ending in that parameter. A value is the segment as a visitor reads it
 * (`café`, not `caf%C3%A9`); the build escapes it for the URL.
 *
 * ```ts
 * // src/routes/[locale]/posts/[id]/paths.ts
 * const paths: Paths<'/:locale/posts/:id'> = async ({ locale }) =>
 *   (await postsIn(locale)).map((post) => String(post.id));
 * export default paths;
 * ```
 */
export type Paths<Pattern extends string> = (
  params: Omit<ParamsOf<Pattern>, LastParam<Pattern>>,
) => readonly string[] | Promise<readonly string[]>;
