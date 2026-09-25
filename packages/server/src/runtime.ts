/**
 * What code inside the request handler imports — a guard's response API, a
 * Server Action's `redirect()`, and the types a route file names. The handler
 * runs on any runtime with `AsyncLocalStorage`, and whatever this entry
 * imports is bundled into it, which is why `serve` — Node's HTTP server — has
 * an entry of its own.
 */
export { redirect, responseHeaders } from '@k8ordo/framework-engine';
export type {
  Guard,
  GuardContext,
  RedirectTarget,
  RouteRequest,
} from '@k8ordo/framework-engine';
