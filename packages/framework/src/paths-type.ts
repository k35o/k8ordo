import type { ParamsOf, Register, RegisteredParams } from '@k8ordo/router';

/** The parameter a pattern ends in: `id` of `/:locale/posts/:id`. */
type LastParam<Pattern extends string> =
  Pattern extends `${string}/:${infer Rest}`
    ? Rest extends `${string}/:${string}`
      ? LastParam<`/${Rest}`>
      : Rest
    : never;

type Values<Pattern extends string> = ReadonlyArray<
  RegisteredParams<Pattern>[LastParam<Pattern> &
    keyof RegisteredParams<Pattern>]
>;

type RegisteredAbove = Register extends { pathsParams: infer M } ? M : object;

type Above<Pattern extends string> = Omit<
  Pattern extends keyof RegisteredAbove
    ? RegisteredAbove[Pattern]
    : ParamsOf<Pattern>,
  LastParam<Pattern>
>;

/**
 * What a `paths.ts` exports by default, under `mode: 'static'`: the values
 * its directory's parameter takes, given the params of the directories above
 * it — one call per combination of theirs. `Pattern` is the directory's own,
 * ending in that parameter. The values are typed as a link takes them: what
 * the page's `paramsSchema` produces (a number for a numeric id), or any
 * value with one spelling where no schema says. The params above arrive as
 * the layouts above the directory read them: spelled as the build writes
 * them, then run through the `paramsSchema` exports of the layouts in the
 * directories above, outer first, and typed as exactly what those produce —
 * the string for a parameter none of them reads. When two `paths.ts` share a
 * pattern under different layouts, the type is what both of them receive: a
 * `year` one reads as a number and the other leaves alone is
 * `number | string`. The page beside the file
 * and a layout in its own directory take no part, since they may read the
 * value the file is asked for. A `[year]` a layout above reads as a number
 * arrives as one, whatever the `paths.ts` above returned, and values one of
 * those schemas refuses are never handed over: the build names them instead.
 * The build spells each value as `href` does (`café`, not `caf%C3%A9`, is
 * the value).
 *
 * ```ts
 * // src/routes/[locale]/posts/[id]/paths.ts
 * const paths: Paths<'/:locale/posts/:id'> = async ({ locale }) =>
 *   (await postsIn(locale)).map((post) => post.id);
 * export default paths;
 * ```
 */
export type Paths<Pattern extends string> = (
  params: Above<Pattern>,
) => Values<Pattern> | Promise<Values<Pattern>>;
