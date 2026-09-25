/**
 * What the application's own code imports — its production process, its
 * guards and its Server Actions — kept apart from the plugin entry, which
 * loads Vite. A deployed application has only its production dependencies
 * installed.
 */
export { serve } from './serve';
export type { Server, ServeOptions } from './serve';
export { redirect, responseHeaders } from '@k8ordo/framework-engine';
export type {
  Guard,
  GuardContext,
  RedirectTarget,
  RouteRequest,
} from '@k8ordo/framework-engine';
