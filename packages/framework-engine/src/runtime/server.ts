/**
 * `@k8ordo/framework/server`: what code inside the request handler imports
 * under mode: 'server' — the response API a guard and a Server Action answer
 * through, a Server Action's `redirect()`, the nonce the answer's inline
 * scripts carry, and the types a route file names. The framework points that
 * entry at this file in the runtime it copies rather than at a bundle of its
 * own, so an application's import and the handler are one module: one
 * request in progress, one `Redirect`. The handler runs on any runtime with
 * `AsyncLocalStorage`, and whatever this entry imports is bundled into it,
 * which is why `serve` — Node's HTTP server — has an entry of its own. Under
 * mode: 'static' the build refuses any module importing it.
 */
export { redirect } from './redirect';
export type { RedirectTarget } from './redirect-file';
export type { RouteRequest } from './request';
export type { Guard, GuardContext } from './guard';
export {
  cookies,
  nonce,
  requestHeaders,
  responseHeaders,
} from './request-scope';
export type { CookieOptions, Cookies, CookieScope } from './cookies';
