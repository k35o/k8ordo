/**
 * What `@k8ordo/framework` and its tests need from the engine, and nothing
 * else, apart from the request API its `./server` entry re-exports, which is
 * this package's `./server`. This is internal and never published: an application installs
 * `@k8ordo/framework`, which bundles this package at pack time.
 */
export { fallbackShapes, parseRouteTree, slotOf } from './grammar/tree';
export type { FallbackShape, RouteDir, Slot } from './grammar/tree';
export { buildTable, declaredPatterns } from './generate/emit';
export type { DeclaredPattern } from './generate/emit';
export {
  decodePathname,
  FALLBACK_SEGMENT,
  NOT_FOUND_SEGMENT,
} from './runtime/pathname';
export {
  CLIENT_DEPS_HEADER,
  clientDepsHeader,
  NONCE_HEADER,
  NOT_FOUND_HEADER,
  readClientDeps,
  SHELL_HEADER,
  STYLESHEET_ORDER_HREF,
} from './runtime/payload';
export type { ClientDeps } from './runtime/payload';
export {
  exportsOf,
  pagesReadingSearch,
  readExports,
  REEXPORTS_ALL,
  scanRoutes,
} from './generate/write';
export { ROUTE_METHODS } from './runtime/route';
export { engine } from './plugin/core';
export type { EngineApi } from './plugin/core';
export { sharedDir } from './plugin/shared-dir';
export type { EngineOptions } from './host';
export {
  isServerActionModule,
  serverActionModules,
} from './plugin/server-actions';
export {
  isPayloadPath,
  pagePathFor,
  payloadPathFor,
} from './runtime/payload-path';
