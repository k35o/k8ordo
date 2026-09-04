import { engine } from '@k8ordo/framework-engine';
import type { EngineOptions } from '@k8ordo/framework-engine';
import type { PluginOption } from 'vite';

export type ServerOptions = EngineOptions;

/**
 * Server mode: the request handler runs per request, so pages can depend on
 * the request and Server Actions have somewhere to arrive. The same handler
 * `@k8ordo/static` calls at build time — the difference is when, not what.
 */
export const k8ordoServer = (options: ServerOptions = {}): PluginOption[] =>
  engine(options, { via: '@k8ordo/server' });

export { serve } from './serve';
export { safeJoin } from './static-file';
export type { ServeOptions } from './serve';
