/**
 * What the two mode packages need from the engine, and nothing else. This is
 * internal: an application installs `@k8ordo/static` or `@k8ordo/server`, and
 * this package is published only so those two can resolve it.
 */
export { parseRouteTree } from './grammar/tree';
export type {
  ParseResult,
  Problem,
  RouteDir,
  RouteDirKind,
} from './grammar/tree';
export { buildTable } from './generate/emit';
export type { TableBranch, TableNode } from './generate/emit';
export { scanRoutes } from './generate/write';
export { engine } from './plugin/core';
export type { EngineOptions } from './plugin/core';
export { payloadPathFor } from './runtime/payload-path';
