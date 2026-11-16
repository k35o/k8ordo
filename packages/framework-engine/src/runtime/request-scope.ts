import { AsyncLocalStorage } from 'node:async_hooks';

import { createCookies } from './cookies';
import type { Cookies } from './cookies';
import { parseCookies } from './request';

/**
 * What is running for the request: a `guard.ts`, a `route.ts`, a Server
 * Action, or the render. Only what answers the request may read and write
 * through the response API; a page is a render, and a render that wrote the
 * response would be a second handler.
 */
export type Phase = 'guard' | 'route' | 'action' | 'render';

/** What the final response carries beyond what answered it. */
type Outgoing = {
  readonly headers: Headers;
  /** The `Set-Cookie` lines the request's jar has to say. */
  readonly cookies: () => readonly string[];
};

/**
 * What whoever calls the handler hands it beside the request: the host's own
 * `waitUntil`, where it has one. A Worker's `ctx` fits as it is, and so does
 * `{ waitUntil }` around a function a host exports.
 */
export type HandlerContext = {
  /** Keeps the host running until `promise` settles. */
  readonly waitUntil?: (promise: Promise<unknown>) => void;
};

type Scope = {
  readonly request: Request;
  readonly host: HandlerContext;
  readonly phase: Phase;
  readonly cookies: Cookies;
  readonly outgoing: Outgoing;
  /** What this answer's inline scripts are signed with. */
  readonly nonce: string;
  /** Whether the answer is written to a file, the same for every visitor. */
  readonly file?: boolean;
};

const storage = new AsyncLocalStorage<Scope>();

// CSP は nonce に 128 ビット以上の乱数を求める
const freshNonce = (): string =>
  btoa(String.fromCodePoint(...crypto.getRandomValues(new Uint8Array(16))));

/**
 * Runs `fn` as the handling of `request`, starting in the render, with what
 * the handler's caller handed it as `host`.
 */
export const withRequest = <T>(
  request: Request,
  fn: () => T,
  host: HandlerContext = {},
): T => {
  const jar = createCookies(
    parseCookies(request.headers.get('cookie')),
    new URL(request.url),
  );
  return storage.run(
    {
      request,
      host,
      phase: 'render',
      cookies: jar.cookies,
      outgoing: { headers: new Headers(), cookies: jar.lines },
      nonce: freshNonce(),
    },
    fn,
  );
};

/** Runs `fn` as `phase` of the request in progress. */
export const inPhase = <T>(phase: Phase, fn: () => T): T => {
  const current = storage.getStore();
  if (current === undefined) return fn();
  return storage.run({ ...current, phase }, fn);
};

/**
 * Runs `fn` as the request in progress answered into a file — mode: 'static'
 * — where the request API refuses whoever reads it. The build names every
 * module of the application that imports it; one inside a dependency it
 * never compiles is only seen here, when it is called.
 */
export const writingFile = <T>(fn: () => T): T => {
  const current = storage.getStore();
  if (current === undefined) return fn();
  return storage.run({ ...current, file: true }, fn);
};

const fileRefusal = (caller: string): Error =>
  new Error(
    `${caller} answers a request, and under mode: 'static' a file is written once for every visitor — it was called through an import of @k8ordo/framework/server the build cannot name, such as a dependency's\nthis application wants mode: 'server'`,
  );

/**
 * `response`, carrying what the request in progress added to the final
 * response. Built anew rather than changed in place: `Response.redirect()`
 * and a fetched response hand out headers that cannot be written.
 */
export const answer = (response: Response): Response => {
  const outgoing = storage.getStore()?.outgoing;
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
  const scope = storage.getStore();
  if (scope === undefined) {
    throw new Error(
      `${caller} needs a request — call it from a guard.ts, a route.ts or a Server Action, while the request is being answered`,
    );
  }
  if (scope.file === true) throw fileRefusal(caller);
  if (scope.phase === 'render') {
    throw new Error(
      `${caller} belongs to what answers the request, and a page is a render — call it from a guard.ts, a route.ts or a Server Action; a page reads the request from its props`,
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
 * `Set-Cookie` on the answer. From a `guard.ts`, a `route.ts` or a Server
 * Action; a page
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

/**
 * The nonce this answer's inline scripts carry: the framework's own — the
 * payload written into the HTML, React's — and any the application signs
 * with it, as `<ColorSchemeScript nonce={nonce()} />`. A new one per
 * request. Readable wherever the request is in progress, the render
 * included: signing a script is not writing the response. A guard names it
 * in the `Content-Security-Policy` it writes; a build into files turns what
 * carries it into hashes.
 */
export const nonce = (): string => {
  const scope = storage.getStore();
  if (scope === undefined) {
    throw new Error(
      'nonce() needs a request — call it while one is answered: from a guard.ts, a layout or page, or a Server Action',
    );
  }
  if (scope.file === true) throw fileRefusal('nonce()');
  return scope.nonce;
};

/**
 * `body`, read as part of the request in progress. A stream's `pull` runs in
 * the async context of whoever reads it — the host writing the answer out,
 * which is in no request — so what a route.ts calls from inside the stream
 * it answered with would find none.
 */
export const readInRequest = (
  body: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> => {
  const scope = storage.getStore();
  if (scope === undefined) return body;
  const reader = body.getReader();
  return new ReadableStream<Uint8Array>(
    {
      pull: (controller) =>
        storage.run(scope, async () => {
          const { done, value } = await reader.read();
          if (done) controller.close();
          else controller.enqueue(value);
        }),
      cancel: (reason) => storage.run(scope, () => reader.cancel(reason)),
    },
    // 元のストリームが自分で決めた以上には先読みしない
    { highWaterMark: 0 },
  );
};

/**
 * Keeps the host from stopping this request's work before `promise` settles:
 * what goes on after the answer has left — a generation read to its end and
 * saved once the visitor is gone. As a Service Worker's `waitUntil`: the
 * work has already started, and nothing here runs it again. Callable
 * wherever the request is in progress, the render included, since it writes
 * nothing to the response. A rejection is logged, once, and goes no further.
 */
export const waitUntil = (promise: Promise<unknown>): void => {
  const scope = storage.getStore();
  if (scope === undefined) {
    throw new Error(
      'waitUntil() needs a request — call it while one is answered: from a guard.ts, a route.ts, a Server Action, or a layout or page',
    );
  }
  if (scope.file === true) throw fileRefusal('waitUntil()');
  const { request, host } = scope;
  // ホストに渡すのは失敗を報告し終えたほう。元の promise を渡すと、reject の
  // 行き先がホストごとに変わり、口の無いホストでは未処理の rejection になる
  const reported = promise.then(
    () => undefined,
    (error: unknown) => {
      // メソッドと pathname は引数として渡す。第 1 引数はフォーマット文字列
      // なので、`%s` を含む URL では error が食われて消える
      console.error(
        'k8ordo: waitUntil() of %s %s failed',
        request.method,
        new URL(request.url).pathname,
        error,
      );
    },
  );
  // ホストのメソッドのまま呼ぶ。Worker の ctx.waitUntil は ctx から外すと動かない
  host.waitUntil?.(reported);
};

/**
 * The nonce the handler signs its own inline scripts with, in either mode: a
 * build into files turns what it signed into hashes.
 */
export const signingNonce = (): string => {
  const scope = storage.getStore();
  if (scope === undefined) {
    throw new Error(
      'the handler signs its scripts while a request is answered',
    );
  }
  return scope.nonce;
};
