import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  engine,
  isServerActionModule,
  parseRouteTree,
  payloadPathFor,
  scanRoutes,
  serverActionModules,
} from '@k8ordo/framework-engine';
import type { EngineOptions } from '@k8ordo/framework-engine';
import type { Plugin, PluginOption, ResolvedConfig } from 'vite';

import { redirectPage, sitemap } from './documents';
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
  /**
   * The origin the site is served from — `https://example.com`. With it the
   * build also writes `sitemap.xml`, listing every page it rendered; without
   * it, no sitemap, because a sitemap of relative URLs is not one.
   */
  readonly site?: string;
};

type Handler = (request: Request) => Promise<Response>;

const ORIGIN = 'http://k8ordo.localhost';

// The engine is bundled into this package, and its runtime entries ship
// beside this file — `dist/runtime/` — which is where Vite is pointed.
const RUNTIME_DIR = fileURLToPath(new URL('./runtime/', import.meta.url));

/**
 * Static mode: the same request handler the server mode runs per request is
 * called at build time — for each route's HTML and again for its payload —
 * and its answers are written to files.
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
  // The plugin list the RSC pipeline's registry is reached through, kept the
  // way `root` is: empty until Vite resolves the config, which is before any
  // module is compiled.
  let plugins: ResolvedConfig['plugins'] = [];

  const prerender: Plugin = {
    name: 'k8ordo:static',

    configResolved(config) {
      ({ root, plugins } = config);
      routesDir = path.resolve(root, options.routesDir ?? 'src/routes');
    },

    // The build refuses a Server Action (below); `vite dev` is a running
    // server that would happily accept the POST, and a form that works in
    // development and posts into nothing in production is the worst of the
    // two. So the refusal is said here as well, the moment the module is
    // compiled — and it asks the same registry the build reads, so the two
    // cannot come to disagree about what a Server Action is.
    transform: {
      // After `rsc:use-server`, which is what fills that registry. Its own
      // transform prepends a runtime import, so a module's text stops
      // answering the question the moment it has run — which is why this
      // reads the registry rather than the code it is handed.
      order: 'post',
      handler(_code, id) {
        // Only while a dev server is running. A build asks once at the end,
        // by name, and names every offending module at once; asking here too
        // would replace that list with whichever file compiled first.
        if (this.environment.mode !== 'dev') return null;
        if (!isServerActionModule({ plugins }, id)) return null;
        throw new Error(
          `static build cannot ship Server Actions — a file cannot receive one, and this declares 'use server':\n  ${path.relative(root, id)}\nthis application wants @k8ordo/server`,
        );
      },
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

        // A supplied pathname the route's params schema refuses would be
        // written as a 404 page under a URL the site claims to have. The
        // handler answers it the way it answers any unknown URL; here that
        // answer is a build error naming the pathname.
        const refused: string[] = [];
        // A page that threw while rendering: the handler answers 500 with
        // the message, and a build that wrote it would ship the failure.
        const failed: string[] = [];
        // What was written as a redirect rather than a page.
        const redirected = new Set<string>();
        await inParallel(
          plan.paths.flatMap((pathname) => {
            // The URL keeps its escapes; only the file name is decoded.
            const dir = path.join(clientDir, dirFor(pathname));
            return [
              async () => {
                const status = await write(
                  path.join(dir, 'index.html'),
                  handler,
                  `${ORIGIN}${pathname}`,
                );
                if (status === 404) refused.push(pathname);
                if (status === 500) failed.push(pathname);
                if (status === 307 || status === 308) redirected.add(pathname);
                // A redirect has no payload: a client navigation to it finds
                // nothing at index.rsc and hands the URL to the browser, which
                // loads the HTML above and follows it.
                if (status !== 307 && status !== 308) {
                  await write(
                    path.join(dir, 'index.rsc'),
                    handler,
                    `${ORIGIN}${payloadPathFor(pathname)}`,
                  );
                }
              },
            ];
          }),
        );
        // A static host answers an unknown URL from a file, so the
        // application's own not-found has to be one — otherwise declaring it
        // would mean nothing in this mode.
        const unmatched = catchAllPath(tree);
        if (unmatched !== null) {
          const status = await write(
            path.join(clientDir, '404.html'),
            handler,
            `${ORIGIN}${unmatched}`,
          );
          if (status === 500) failed.push('404.html');
        }
        if (failed.length > 0) {
          throw new Error(
            `static build could not render ${failed.toSorted().join(', ')} — see the error above`,
          );
        }
        if (refused.length > 0) {
          throw new Error(
            `the "paths" option supplied pathnames a params schema refused: ${refused.toSorted().join(', ')}`,
          );
        }
        // The build knows every page it wrote, which is what a sitemap is.
        // Redirects are not pages, and a not-found is not a URL to offer.
        if (options.site !== undefined) {
          await writeFile(
            path.join(clientDir, 'sitemap.xml'),
            sitemap(
              options.site,
              plan.paths.filter((pathname) => !redirected.has(pathname)),
            ),
          );
        }
        builder.config.logger.info(
          `k8ordo: wrote ${String(plan.paths.length)} routes${unmatched === null ? '' : ' and 404.html'}${options.site === undefined ? '' : ' and sitemap.xml'}`,
        );
      },
    },
  };

  return [
    ...engine(options, { via: '@k8ordo/static', runtimeDir: RUNTIME_DIR }),
    prerender,
  ];
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
  tasks: ReadonlyArray<() => Promise<unknown>>,
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

/** Writes what the handler answered, and says with which status. */
const write = async (
  file: string,
  handler: Handler,
  url: string,
): Promise<number> => {
  const response = await handler(new Request(url));
  // A page that failed to render is not a page: nothing is written, and the
  // caller stops the build with its name.
  if (response.status === 500) {
    console.error(`k8ordo: ${url} — ${await response.text()}`);
    return response.status;
  }
  await mkdir(path.dirname(file), { recursive: true });
  const location = response.headers.get('location');
  if (
    (response.status === 307 || response.status === 308) &&
    location !== null
  ) {
    await writeFile(file, redirectPage(location));
  } else {
    await writeFile(file, Buffer.from(await response.arrayBuffer()));
  }
  return response.status;
};
