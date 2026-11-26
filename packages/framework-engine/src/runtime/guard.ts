import type { Match, ParamsOf } from '@k8ordo/router';

import { endedBy } from './ended';
import type { SaidNotFound } from './ended';
import { inPhase } from './request-scope';

/**
 * What a `guard.ts` receives: the request for the page — a client
 * navigation's payload request too, under the page's URL — and the params of
 * the pattern its directory puts it under, as the pathname carried them — a
 * string each, a rest param its segments — since a guard runs above the page
 * and every layout, where no schema has typed them.
 */
export type GuardContext<P extends string = string> = {
  readonly request: Request;
  readonly params: ParamsOf<P>;
};

/**
 * What a `guard.ts` default-exports. `redirect(url)` ends the request there
 * with a `303`, `notFound()` with the nearest not-found.tsx under 404, and a
 * `Response` returned — a `401`, a `403` — is the answer itself; returning
 * nothing lets it through to what answers below. There is no `next()` to run
 * the page and rewrite its answer: a page streams, and its headers leave
 * before its body is written.
 */
export type Guard<P extends string = string> = (
  context: GuardContext<P>,
  // 何も返さない guard の戻り値は void と推論され、undefined では受けられない
  // oxlint-disable-next-line typescript/no-invalid-void-type
) => Response | void | Promise<Response | void>;

type AnyGuard = (context: {
  readonly request: Request;
  readonly params: Match['params'];
}) => unknown;

/**
 * Runs the guards along a pattern, outer first, one at a time: an outer guard
 * that ends the request leaves the inner ones unrun, which is what lets an
 * inner guard assume what an outer one checked.
 */
export const runGuards = async (
  guards: readonly AnyGuard[],
  context: Parameters<AnyGuard>[0],
): Promise<Response | SaidNotFound | null> => {
  for (const guard of guards) {
    // 外の guard が通してから内の guard を走らせる。並べて走らせると、外が
    // 断ったリクエストでも内の guard の副作用が起きる
    let answer: unknown;
    try {
      answer = await inPhase('guard', () => guard(context));
    } catch (error) {
      return endedBy(error);
    }
    if (answer === undefined) continue;
    if (!(answer instanceof Response)) {
      throw new TypeError(
        'a guard.ts ends the request with redirect() or notFound(), or by returning a Response, and returns nothing to let it through',
      );
    }
    return answer;
  }
  return null;
};
