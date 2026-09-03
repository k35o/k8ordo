import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  engine,
  parseRouteTree,
  payloadPathFor,
  scanRoutes,
} from '@k8ordo/framework-engine';
import type { EngineOptions } from '@k8ordo/framework-engine';
import type { Plugin, PluginOption } from 'vite';

import { planPaths } from './paths';

export type StaticOptions = EngineOptions & {
  /**
   * Pathnames for routes with parameters. Static rendering cannot invent
   * them, and a build that quietly skipped half the site would be worse than
   * one that refuses.
   */
  readonly paths?: () => readonly string[] | Promise<readonly string[]>;
};

type Handler = (request: Request) => Promise<Response>;

const ORIGIN = 'http://k8ordo.localhost';

/**
 * Static mode: the same request handler the server mode runs per request is
 * called once per route at build time, and its answers are written to files.
 * There is no server here — and no Server Actions either, because a file
 * cannot receive one.
 */
export const k8ordoStatic = (options: StaticOptions = {}): PluginOption[] => {
  let root = '';
  let routesDir = '';

  const prerender: Plugin = {
    name: 'k8ordo:static',

    configResolved(config) {
      root = config.root;
      routesDir = path.resolve(root, options.routesDir ?? 'src/routes');
    },

    buildApp: {
      order: 'post',
      async handler(builder) {
        const { tree } = parseRouteTree(await scanRoutes(routesDir));
        const supplied = (await options.paths?.()) ?? [];
        const plan = planPaths(tree, supplied);
        if (plan.unresolved.length > 0) {
          throw new Error(
            `static build needs pathnames for ${plan.unresolved.join(', ')} — supply them with the "paths" option`,
          );
        }

        const rscOut = builder.environments['rsc']?.config.build.outDir;
        const clientOut = builder.environments['client']?.config.build.outDir;
        if (rscOut === undefined || clientOut === undefined) {
          throw new Error('static build ran without the rsc/client builds');
        }

        // outDir はすでに絶対パスのことがあるので resolve で受ける
        const clientDir = path.resolve(root, clientOut);
        const entry = path.resolve(root, rscOut, 'index.js');
        const module_ = (await import(pathToFileURL(entry).href)) as {
          default: Handler;
        };
        const handler = module_.default;

        for (const pathname of plan.paths) {
          await Promise.all([
            write(
              path.join(clientDir, pathname, 'index.html'),
              handler,
              `${ORIGIN}${pathname}`,
            ),
            write(
              path.join(clientDir, pathname, 'index.rsc'),
              handler,
              `${ORIGIN}${payloadPathFor(pathname)}`,
            ),
          ]);
        }
        builder.config.logger.info(
          `k8ordo: wrote ${String(plan.paths.length)} routes`,
        );
      },
    },
  };

  return [...engine(options), prerender];
};

const write = async (
  file: string,
  handler: Handler,
  url: string,
): Promise<void> => {
  const response = await handler(new Request(url));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await response.arrayBuffer()));
};

export type { PathPlan } from './paths';
export { patternsOf, planPaths } from './paths';
