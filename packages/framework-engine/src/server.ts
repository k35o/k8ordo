/**
 * What `@k8ordo/framework/server` re-exports, apart from the index: that
 * entry's types must not reach `vite` or React through the modules the index
 * gathers for `framework()`, since the generated `register.gen.ts` of every
 * server-mode application imports them.
 */
export { redirect } from './runtime/redirect';
export type { RedirectTarget } from './runtime/redirect-file';
export type { RouteRequest } from './runtime/request';
export type { Guard, GuardContext } from './runtime/guard';
export {
  cookies,
  nonce,
  requestHeaders,
  responseHeaders,
} from './runtime/request-scope';
export type { CookieOptions, Cookies, CookieScope } from './runtime/cookies';
