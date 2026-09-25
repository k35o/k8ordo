import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { engine } from '@k8ordo/framework-engine';
import type { EngineOptions } from '@k8ordo/framework-engine';
import type { Plugin, PluginOption } from 'vite';

import { precompress } from './precompress';

export type ServerOptions = EngineOptions;

// The engine is bundled into this package, and its runtime entries ship
// beside this file — `dist/runtime/` — which is where Vite is pointed.
const RUNTIME_DIR = fileURLToPath(new URL('./runtime/', import.meta.url));

/**
 * The client build compressed once, at build time, so `serve` answers a
 * request for a script with bytes it already has rather than compressing
 * the same file for every visitor.
 */
const compressClient: Plugin = {
  name: 'k8ordo:precompress',
  apply: 'build',
  buildApp: {
    // After the RSC plugin's own buildApp, which is what builds the client.
    order: 'post',
    async handler(builder) {
      const clientOut = builder.environments['client']?.config.build.outDir;
      if (clientOut === undefined) {
        throw new Error('server build ran without the client build');
      }
      const count = await precompress(
        path.resolve(builder.config.root, clientOut),
      );
      builder.config.logger.info(
        `k8ordo: precompressed ${String(count)} files`,
      );
    },
  },
};

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
export const framework = (options: ServerOptions = {}): PluginOption[] => [
  ...engine(options, { via: '@k8ordo/server', runtimeDir: RUNTIME_DIR }),
  compressClient,
];
