import { AsyncLocalStorage } from 'node:async_hooks';

import { createCookies } from './cookies';
import type { Cookies } from './cookies';
import { parseCookies } from './request';

/**
 * What is running for the request: a `guard.ts`, a Server Action, or the
 * render. Only what answers the request may read and write through the
 * response API; a page is a render, and a render that wrote the response
 * would be a second handler.
 */
export type Phase = 'guard' | 'action' | 'render';

/** What the final response carries beyond what answered it. */
type Outgoing = {
  readonly headers: Headers;
  /** The `Set-Cookie` lines the request's jar has to say. */
  readonly cookies: () => readonly string[];
};

type Scope = {
  readonly request: Request;
  readonly phase: Phase;
  readonly cookies: Cookies;
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
export const withRequest = <T>(request: Request, fn: () => T): T => {
  const jar = createCookies(parseCookies(request.headers.get('cookie')));
  return storage().run(
    {
      request,
      phase: 'render',
      cookies: jar.cookies,
      outgoing: { headers: new Headers(), cookies: jar.lines },
    },
    fn,
  );
};

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
  const cookies = outgoing?.cookies() ?? [];
  if (
    outgoing === undefined ||
    ([...outgoing.headers].length === 0 && cookies.length === 0)
  ) {
    return response;
  }
  const headers = new Headers(response.headers);
  for (const [name, value] of outgoing.headers) {
    // 同名を何度も持てるのは Set-Cookie だけで、反復も 1 つずつ渡してくる。
    // ほかは反復の時点で 1 つに畳まれているので、上書きでよい
    if (name === 'set-cookie') headers.append(name, value);
    else headers.set(name, value);
  }
  for (const line of cookies) headers.append('set-cookie', line);
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
      `${caller} needs a request — call it from a guard.ts or a Server Action, while the request is being answered`,
    );
  }
  if (scope.phase === 'render') {
    throw new Error(
      `${caller} belongs to what answers the request, and a page is a render — call it from a guard.ts or a Server Action; a page reads the request from its props`,
    );
  }
  return scope;
};

/**
 * The headers the final response will carry, whatever answers the request.
 * Set from a `guard.ts` that lets the request through — a
 * `Content-Security-Policy`, say — or from one that ends it, or from a
 * Server Action: they are added to the answer. A header the answer already
 * carries is replaced.
 */
export const responseHeaders = (): Headers =>
  answering('responseHeaders()').outgoing.headers;

/**
 * The request's cookies, to read and to write: what the request carried,
 * with what this answer set or deleted since, and every write said as a
 * `Set-Cookie` on the answer. From a `guard.ts` or a Server Action; a page
 * reads `request.cookies` from its props.
 */
export const cookies = (): Cookies => answering('cookies()').cookies;

/**
 * The headers the request arrived with — for a Server Action, which is
 * handed its arguments rather than the request. Read them; they are the
 * request's own.
 */
export const requestHeaders = (): Headers =>
  answering('requestHeaders()').request.headers;
