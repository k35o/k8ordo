import { fileURLToPath } from 'node:url';

import { engine } from '@k8ordo/framework-engine';
import type { EngineOptions } from '@k8ordo/framework-engine';
import type { PluginOption } from 'vite';

export type ServerOptions = EngineOptions;

// The engine is bundled into this package, and its runtime entries ship
// beside this file — `dist/runtime/` — which is where Vite is pointed.
const RUNTIME_DIR = fileURLToPath(new URL('./runtime/', import.meta.url));

/**
 * Server mode: the request handler runs per request, so pages can depend on
 * the request and Server Actions have somewhere to arrive. The same handler
 * `@k8ordo/static` builds and calls at build time, each mode compiling its own
 * — the difference is chiefly when, not what.
 *
 * Named for what it brings rather than for the mode, so a `vite.config.ts` is
 * identical under either package and the mode is only ever the import — which
 * is what "the mode is the dependency" says.
 */
export const framework = (options: ServerOptions = {}): PluginOption[] =>
  engine(options, { via: '@k8ordo/server', runtimeDir: RUNTIME_DIR });
