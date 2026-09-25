/**
 * What the two mode packages and their tests need from the engine, and
 * nothing else. This is internal and never published: an application installs
 * `@k8ordo/static` or `@k8ordo/server`, and each of those bundles this package
 * at pack time.
 */
export { parseRouteTree, slotOf } from './grammar/tree';
export type { RouteDir, Slot } from './grammar/tree';
export { buildTable, declaredPatterns } from './generate/emit';
export type { DeclaredPattern } from './generate/emit';
export { decodePathname, NOT_FOUND_SEGMENT } from './runtime/pathname';
export { NOT_FOUND_HEADER } from './runtime/payload';
export { scanRoutes } from './generate/write';
export { engine } from './plugin/core';
export type { EngineOptions } from './plugin/core';
export {
  isServerActionModule,
  serverActionModules,
} from './plugin/server-actions';
export { payloadPathFor } from './runtime/payload-path';
export { redirect } from './runtime/redirect';
export type { RedirectTarget } from './runtime/redirect';
export type { RouteRequest } from './runtime/request';
export type { Guard, GuardContext } from './runtime/guard';
export {
  cookies,
  requestHeaders,
  responseHeaders,
} from './runtime/request-scope';
export type { CookieOptions, Cookies, CookieScope } from './runtime/cookies';
