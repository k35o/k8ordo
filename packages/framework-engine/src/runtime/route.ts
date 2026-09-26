import { inPhase } from './request-scope';

/** The request methods a `route.ts` answers by exporting a function named so. */
export const ROUTE_METHODS = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
] as const;

export type RouteMethod = (typeof ROUTE_METHODS)[number];

type RouteContext = {
  readonly request: Request;
  readonly params: Readonly<Record<string, unknown>>;
};

/** A `route.ts` as the handler sees it: whatever it exports. */
export type AnyRouteModule = Readonly<Record<string, unknown>>;

type RouteHandler = (context: RouteContext) => unknown;

const handlerOf = (
  module: AnyRouteModule,
  method: string,
): RouteHandler | undefined => {
  const handler = module[method];
  return typeof handler === 'function' ? (handler as RouteHandler) : undefined;
};

/**
 * The methods a module answers, as `Allow` names them: its exports, and
 * `HEAD` wherever it answers `GET` — a `HEAD` is a `GET` without the body.
 */
export const methodsOf = (module: AnyRouteModule): RouteMethod[] =>
  ROUTE_METHODS.filter(
    (method) =>
      handlerOf(module, method) !== undefined ||
      (method === 'HEAD' && handlerOf(module, 'GET') !== undefined),
  );

export type RouteAnswer = {
  readonly handler: RouteHandler;
  /** A `HEAD` answered by the `GET`: its body is left off. */
  readonly headOnly: boolean;
};

/**
 * What answers a request's method in a `route.ts`: the export named after
 * it, and a `HEAD` with no export of its own is its `GET`, with the body
 * left off. `null` for a method it does not export — a `405`.
 */
export const routeAnswerFor = (
  module: AnyRouteModule,
  method: string,
): RouteAnswer | null => {
  const own = handlerOf(module, method);
  if (own !== undefined) return { handler: own, headOnly: false };
  const get = method === 'HEAD' ? handlerOf(module, 'GET') : undefined;
  return get === undefined ? null : { handler: get, headOnly: true };
};

/** The `405` a method a `route.ts` does not export gets. */
export const methodNotAllowed = (module: AnyRouteModule): Response =>
  new Response('method not allowed', {
    status: 405,
    headers: { allow: methodsOf(module).join(', ') },
  });

/**
 * Runs what answers, in the phase that may write the response: a route
 * answers the request as much as a guard does.
 */
export const runRoute = async (
  { handler, headOnly }: RouteAnswer,
  context: RouteContext,
): Promise<Response> => {
  const response = await inPhase('route', () => handler(context));
  if (!(response instanceof Response)) {
    throw new TypeError(
      `a route.ts ${context.request.method} answers with a Response, and this one returned something else`,
    );
  }
  if (!headOnly) return response;
  // GET の答えから本文だけを外す。ヘッダーは GET と同じものを返すのが HEAD
  return new Response(null, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};
