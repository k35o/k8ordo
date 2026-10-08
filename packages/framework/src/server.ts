/**
 * What code inside the request handler imports under mode: 'server' — the
 * response API a guard and a Server Action answer through, a Server Action's
 * `redirect()`, the nonce the answer's inline scripts carry, and the types a
 * route file names. The handler runs on any runtime with `AsyncLocalStorage`,
 * and whatever this entry imports is bundled into it, which is why `serve` —
 * Node's HTTP server — has an entry of its own. Under mode: 'static' the
 * build refuses any module importing it.
 */
export {
  cookies,
  nonce,
  redirect,
  requestHeaders,
  responseHeaders,
} from '@k8ordo/framework-engine/server';
export type {
  CookieOptions,
  Cookies,
  CookieScope,
  Guard,
  GuardContext,
  RedirectTarget,
  RouteRequest,
} from '@k8ordo/framework-engine/server';
