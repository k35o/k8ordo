import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * What is running for the request: a `guard.ts`, or the render. Only what
 * answers the request may add to the response; a page is a render, and a
 * render that wrote the response would be a second handler.
 */
export type Phase = 'guard' | 'render';

/** What the final response carries beyond what answered it. */
type Outgoing = {
  readonly headers: Headers;
};

type Scope = {
  readonly request: Request;
  readonly phase: Phase;
  readonly outgoing: Outgoing;
};

/**
 * The mode package bundles this module twice — into the runtime the handler
 * is built from, and into the entry an application imports the response API
 * from — and both copies have to find the one request in progress. So the
 * storage lives on `globalThis` under a registry symbol, as `@k8ordo/i18n`'s
 * locale storage does, rather than in either copy.
 */
const KEY = Symbol.for('k8ordo.request');

type Global = { [KEY]?: AsyncLocalStorage<Scope> };

const storage = (): AsyncLocalStorage<Scope> => {
  const global = globalThis as Global;
  global[KEY] ??= new AsyncLocalStorage<Scope>();
  return global[KEY];
};

/** Runs `fn` as the handling of `request`, starting in the render. */
export const withRequest = <T>(request: Request, fn: () => T): T =>
  storage().run(
    { request, phase: 'render', outgoing: { headers: new Headers() } },
    fn,
  );

/** Runs `fn` as `phase` of the request in progress. */
export const inPhase = <T>(phase: Phase, fn: () => T): T => {
  const current = storage().getStore();
  if (current === undefined) return fn();
  return storage().run({ ...current, phase }, fn);
};

/**
 * `response`, carrying what the request in progress added to the final
 * response. Built anew rather than changed in place: `Response.redirect()`
 * and a fetched response hand out headers that cannot be written.
 */
export const answer = (response: Response): Response => {
  const outgoing = storage().getStore()?.outgoing;
  if (outgoing === undefined || [...outgoing.headers].length === 0) {
    return response;
  }
  const headers = new Headers(response.headers);
  for (const [name, value] of outgoing.headers) {
    // 同名を何度も持てるのは Set-Cookie だけで、反復も 1 つずつ渡してくる。
    // ほかは反復の時点で 1 つに畳まれているので、上書きでよい
    if (name === 'set-cookie') headers.append(name, value);
    else headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

/**
 * Where the response API is allowed: the request in progress, while
 * something that answers it runs.
 */
const answering = (caller: string): Scope => {
  const scope = storage().getStore();
  if (scope === undefined) {
    throw new Error(
      `${caller} needs a request — call it from a guard.ts, while the request is being answered`,
    );
  }
  if (scope.phase === 'render') {
    throw new Error(
      `${caller} writes the response, and a page is a render — call it from a guard.ts; a page reads the request from its props`,
    );
  }
  return scope;
};

/**
 * The headers the final response will carry, whatever answers the request.
 * Set from a `guard.ts` that lets the request through — a
 * `Content-Security-Policy`, say — or from one that ends it: they are added
 * to its `Response` too. A header the answer already carries is replaced.
 */
export const responseHeaders = (): Headers =>
  answering('responseHeaders()').outgoing.headers;
