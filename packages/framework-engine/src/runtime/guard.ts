import type { ParamsOf } from '@k8ordo/router';

import { inPhase } from './request-scope';

/**
 * What a `guard.ts` receives: the request, and the params of the pattern its
 * directory puts it under, as the strings the pathname carried — a guard runs
 * above the page and every layout, where no schema has typed them.
 */
export type GuardContext<P extends string = string> = {
  readonly request: Request;
  readonly params: ParamsOf<P>;
};

/**
 * What a `guard.ts` default-exports. A `Response` ends the request there — a
 * redirect, a `401` — and returning nothing lets it through to what answers
 * below. There is no `next()` to run the page and rewrite its answer: a page
 * streams, and its headers leave before its body is written.
 */
export type Guard<P extends string = string> = (
  context: GuardContext<P>,
  // 何も返さない guard の戻り値は void と推論され、undefined では受けられない
  // oxlint-disable-next-line typescript/no-invalid-void-type
) => Response | void | Promise<Response | void>;

type AnyGuard = (context: {
  readonly request: Request;
  readonly params: Readonly<Record<string, string>>;
}) => unknown;

/**
 * Runs the guards along a pattern, outer first, one at a time: an outer guard
 * that ends the request leaves the inner ones unrun, which is what lets an
 * inner guard assume what an outer one checked.
 */
export const runGuards = async (
  guards: readonly AnyGuard[],
  context: Parameters<AnyGuard>[0],
): Promise<Response | null> => {
  for (const guard of guards) {
    // 外の guard が通してから内の guard を走らせる。並べて走らせると、外が
    // 断ったリクエストでも内の guard の副作用が起きる
    // oxlint-disable-next-line eslint/no-await-in-loop
    const answer = await inPhase('guard', () => guard(context));
    if (answer === undefined) continue;
    if (!(answer instanceof Response)) {
      throw new TypeError(
        'a guard.ts returns a Response to end the request, or nothing to let it through',
      );
    }
    return answer;
  }
  return null;
};
