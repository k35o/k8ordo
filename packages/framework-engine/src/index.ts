/**
 * What `@k8ordo/framework` and its tests need from the engine, and nothing
 * else, apart from the request API its `./server` entry re-exports, which is
 * this package's `./server`. This is internal and never published: an application installs
 * `@k8ordo/framework`, which bundles this package at pack time.
 */
export { parseRouteTree, slotOf } from './grammar/tree';
export type { RouteDir, Slot } from './grammar/tree';
export { buildTable, declaredPatterns } from './generate/emit';
export type { DeclaredPattern } from './generate/emit';
export { decodePathname, NOT_FOUND_SEGMENT } from './runtime/pathname';
export { NONCE_HEADER, NOT_FOUND_HEADER } from './runtime/payload';
export {
  exportsOf,
  pagesReadingSearch,
  readExports,
  REEXPORTS_ALL,
  scanRoutes,
} from './generate/write';
export { ROUTE_METHODS } from './runtime/route';
export { engine } from './plugin/core';
export { sharedDir } from './plugin/shared-dir';
export type { EngineOptions } from './host';
export {
  isServerActionModule,
  serverActionModules,
} from './plugin/server-actions';
export { payloadPathFor } from './runtime/payload-path';
