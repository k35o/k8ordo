import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  engine,
  parseRouteTree,
  payloadPathFor,
  scanRoutes,
  serverActionModules,
} from '@k8ordo/framework-engine';
import type { EngineOptions } from '@k8ordo/framework-engine';
import type { Plugin, PluginOption } from 'vite';

import {
  catchAllPath,
  catchAllPatterns,
  dirFor,
  patternsNeedingPaths,
  planPaths,
} from './paths';

export type StaticOptions = EngineOptions & {
  /**
   * Pathnames for routes with parameters. Static rendering cannot invent
   * them, and a build that quietly skipped half the site would be worse than
   * one that refuses.
   *
   * The patterns that need covering are handed in, so a site whose parameter
   * takes the same values everywhere — a locale segment, say — expands them
   * rather than listing every page twice.
   */
  readonly paths?: (
    patterns: readonly string[],
  ) => readonly string[] | Promise<readonly string[]>;
};

type Handler = (request: Request) => Promise<Response>;

const ORIGIN = 'http://k8ordo.localhost';

/**
 * Static mode: the same request handler the server mode runs per request is
 * called once per route at build time, and its answers are written to files.
 * There is no server here, and the build refuses a Server Action, because a
 * file cannot receive one.
 *
 * Named for what it brings rather than for the mode, so a `vite.config.ts` is
 * identical under either package and the mode is only ever the import — which
 * is what "the mode is the dependency" says.
 */
export const framework = (options: StaticOptions = {}): PluginOption[] => {
  let root = '';
  let routesDir = '';

  const prerender: Plugin = {
    name: 'k8ordo:static',

    configResolved(config) {
      ({ root } = config);
      routesDir = path.resolve(root, options.routesDir ?? 'src/routes');
    },

    buildApp: {
      order: 'post',
      async handler(builder) {
        const { tree } = parseRouteTree(await scanRoutes(routesDir));
        const supplied =
          (await options.paths?.(patternsNeedingPaths(tree))) ?? [];
        const plan = planPaths(tree, supplied);
        if (plan.unresolved.length > 0) {
          throw new Error(
            `static build needs pathnames for ${plan.unresolved.join(', ')} — supply them with the "paths" option`,
          );
        }
        if (plan.unusable.length > 0) {
          throw new Error(
            `the "paths" option supplied pathnames no route wants: ${plan.unusable.join(', ')}`,
          );
        }
        const catchAlls = catchAllPatterns(tree);
        if (catchAlls.length > 1) {
          throw new Error(
            `a static host answers every unknown URL from one file, so only one not-found.tsx can be represented — this table declares ${catchAlls.join(', ')}`,
          );
        }

        // A file cannot receive a POST. The RSC pipeline compiles an action
        // in either mode, so the mode's promise only holds if the build says
        // no — before writing an application whose form posts into nothing.
        const actions = serverActionModules(builder.config);
        if (actions.length > 0) {
          throw new Error(
            `static build cannot ship Server Actions — a file cannot receive one, and these declare 'use server':\n${actions
              .map((file) => `  ${file}`)
              .join('\n')}\nthis application wants @k8ordo/server`,
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
        const entryModule = (await import(pathToFileURL(entry).href)) as {
          default: Handler;
        };
        const handler = entryModule.default;

        await inParallel(
          plan.paths.flatMap((pathname) => {
            // The URL keeps its escapes; only the file name is decoded.
            const dir = path.join(clientDir, dirFor(pathname));
            return [
              () =>
                write(
                  path.join(dir, 'index.html'),
                  handler,
                  `${ORIGIN}${pathname}`,
                ),
              () =>
                write(
                  path.join(dir, 'index.rsc'),
                  handler,
                  `${ORIGIN}${payloadPathFor(pathname)}`,
                ),
            ];
          }),
        );
        // A static host answers an unknown URL from a file, so the
        // application's own not-found has to be one — otherwise declaring it
        // would mean nothing in this mode.
        const unmatched = catchAllPath(tree);
        if (unmatched !== null) {
          await write(
            path.join(clientDir, '404.html'),
            handler,
            `${ORIGIN}${unmatched}`,
          );
        }
        builder.config.logger.info(
          `k8ordo: wrote ${String(plan.paths.length)} routes${unmatched === null ? '' : ' and 404.html'}`,
        );
      },
    },
  };

  return [...engine(options, { via: '@k8ordo/static' }), prerender];
};

/**
 * A render is a whole page: components, their data, and whatever the app's
 * own highlighting or markdown does. Starting every one of them at once ties
 * peak memory to the size of the site, which is the number that grows. A
 * fixed width keeps the machine's cost flat while still overlapping the
 * waiting.
 */
const WIDTH = 8;

const inParallel = async (
  tasks: ReadonlyArray<() => Promise<void>>,
): Promise<void> => {
  let next = 0;
  const worker = async (): Promise<void> => {
    for (let task = tasks[next++]; task !== undefined; task = tasks[next++]) {
      // A worker is sequential on purpose — that is what bounds the width.
      // oxlint-disable-next-line eslint/no-await-in-loop
      await task();
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(WIDTH, tasks.length) }, worker),
  );
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
