import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  engine,
  exportsOf,
  isServerActionModule,
  NOT_FOUND_HEADER,
  parseRouteTree,
  payloadPathFor,
  readExports,
  ROUTE_METHODS,
  scanRoutes,
  serverActionModules,
  slotOf,
} from '@k8ordo/framework-engine';
import type { EngineOptions } from '@k8ordo/framework-engine';
import { withBase } from '@k8ordo/router';
import type { Plugin, PluginOption, ResolvedConfig } from 'vite';

import { redirectPage, sitemap } from './documents';
import {
  answeredByRoute,
  catchAllPath,
  catchAllPatterns,
  dirFor,
  patternsNeedingPaths,
  planPaths,
} from './paths';

export type StaticOptions = EngineOptions & {
  /**
   * Pathnames for routes with parameters, in the table's terms — without
   * Vite's `base`. Static rendering cannot invent them, and a build that
   * quietly skipped half the site would be worse than one that refuses.
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
   * build also writes `sitemap.xml`, listing every page it rendered at its
   * URL, Vite's `base` included; without it, no sitemap, because a sitemap of
   * relative URLs is not one.
   */
  readonly site?: string;
};

type Handler = (request: Request) => Promise<Response>;

const ORIGIN = 'http://k8ordo.localhost';

const WANTS_SERVER = 'this application wants @k8ordo/server';

/**
 * A `guard.ts` decides how a request is answered, and a file is never
 * requested of anything that could run one. Named every one at once, as the
 * Server Action refusal names every action module.
 */
const guardRefusal = (files: readonly string[]): string =>
  `static build cannot run guard.ts — a file has no request to guard, and these are guards:\n${files
    .map((file) => `  ${file}`)
    .join('\n')}\n${WANTS_SERVER}`;

/** What a route.ts exports that a file cannot answer: anything but `GET`. */
const unwritable = (names: ReadonlySet<string>): string[] =>
  ROUTE_METHODS.filter((method) => method !== 'GET' && names.has(method));

/**
 * The build writes a route.ts as the file its `GET` answers, and a file
 * answers nothing else. Named every one at once, with what it exports.
 */
const routeRefusal = (
  routes: ReadonlyArray<readonly [string, readonly string[]]>,
): string =>
  `static build writes a route.ts as the file its GET answers, and a file cannot answer another method — these export one:\n${routes
    .map(([file, methods]) => `  ${file} (${methods.join(', ')})`)
    .join('\n')}\n${WANTS_SERVER}`;

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

    // The build refuses a Server Action and a guard.ts (below); `vite dev` is
    // a running server that would happily accept the POST and run the guard,
    // and what works in development and does nothing in production is the
    // worst of the two. So the refusal is said here as well, the moment the
    // module is compiled — asking the same questions the build asks (the
    // registry for an action, the grammar for a guard), so the two cannot
    // come to disagree.
    transform: {
      // After `rsc:use-server`, which is what fills that registry. Its own
      // transform prepends a runtime import, so a module's text stops
      // answering the question the moment it has run — which is why this
      // reads the registry rather than the code it is handed.
      order: 'post',
      async handler(_code, id) {
        // Only while a dev server is running. A build asks once at the end,
        // by name, and names every offending module at once; asking here too
        // would replace that list with whichever file compiled first.
        if (this.environment.mode !== 'dev') return null;
        const [module = id] = id.split('?');
        // 文法は / 区切りで読む。Windows の path.relative は \ で区切って返す
        const file = path.relative(routesDir, module).split(path.sep).join('/');
        const slot = file.startsWith('..') ? null : slotOf(file);
        if (slot === 'guard') {
          throw new Error(guardRefusal([path.relative(root, module)]));
        }
        if (slot === 'route') {
          const methods = unwritable(exportsOf(await readFile(module, 'utf8')));
          if (methods.length > 0) {
            throw new Error(
              routeRefusal([[path.relative(root, module), methods]]),
            );
          }
        }
        if (!isServerActionModule({ plugins }, id)) return null;
        throw new Error(
          `static build cannot ship Server Actions — a file cannot receive one, and this declares 'use server':\n  ${path.relative(root, id)}\n${WANTS_SERVER}`,
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
              .join('\n')}\n${WANTS_SERVER}`,
          );
        }

        const rscOut = builder.environments['rsc']?.config.build.outDir;
        const clientOut = builder.environments['client']?.config.build.outDir;
        if (rscOut === undefined || clientOut === undefined) {
          throw new Error('static build ran without the rsc/client builds');
        }

        // outDir はすでに絶対パスのことがあるので resolve で受ける
        const clientDir = path.resolve(root, clientOut);
        // ページは表の pathname で数え、ハンドラには base を付けた URL で頼む。
        // 書き出す先は client/ の中の表の pathname（client/ が base に置かれる）
        const { base } = builder.config;
        // With `site`, what a route.ts reads off its request is where the site
        // is served — an RSS feed's links are absolute.
        const origin =
          options.site === undefined ? ORIGIN : new URL(options.site).origin;
        const urlFor = (pathname: string): string =>
          `${origin}${withBase(pathname, base)}`;
        // A route.ts is written as the file its GET answers, at its pathname.
        const byRoute = new Set(
          plan.paths.filter((pathname) => answeredByRoute(tree, pathname)),
        );
        const unfileable = [...byRoute].flatMap((route) => {
          if (route === '/') {
            return [`${route} — a static host serves / from index.html`];
          }
          const below = plan.paths.find((pathname) =>
            pathname.startsWith(`${route}/`),
          );
          return below === undefined
            ? []
            : [`${route} — ${below} is written below it, as a directory`];
        });
        if (unfileable.length > 0) {
          throw new Error(
            `static build cannot write a route.ts as a file at ${unfileable.join('; ')}`,
          );
        }
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
        // The same for a page that said notFound(): the pathname was supplied
        // for a page the application then disowned.
        const disowned: string[] = [];
        // A page that threw while rendering: the handler answers 500 with
        // the message, and a build that wrote it would ship the failure.
        const failed: string[] = [];
        // What was written as a redirect rather than a page.
        const redirected = new Set<string>();
        // A route.ts whose GET did not answer with something to write.
        const unanswered: string[] = [];
        await inParallel(
          plan.paths.flatMap((pathname) => {
            if (byRoute.has(pathname)) {
              return [
                async () => {
                  const status = await writeRoute(
                    path.join(clientDir, dirFor(pathname)),
                    handler,
                    urlFor(pathname),
                  );
                  if (status !== 200) {
                    unanswered.push(`${pathname} (${String(status)})`);
                  }
                },
              ];
            }
            // The URL keeps its escapes; only the file name is decoded.
            const dir = path.join(clientDir, dirFor(pathname));
            return [
              async () => {
                const { status, notFound } = await write(
                  path.join(dir, 'index.html'),
                  handler,
                  urlFor(pathname),
                );
                if (status === 404) {
                  (notFound ? disowned : refused).push(pathname);
                }
                if (status === 500) failed.push(pathname);
                if (status === 307 || status === 308) redirected.add(pathname);
                // A redirect has no payload: a client navigation to it finds
                // nothing at index.rsc and hands the URL to the browser, which
                // loads the HTML above and follows it.
                if (status !== 307 && status !== 308) {
                  await write(
                    path.join(dir, 'index.rsc'),
                    handler,
                    urlFor(payloadPathFor(pathname)),
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
          const { status } = await write(
            path.join(clientDir, '404.html'),
            handler,
            urlFor(unmatched),
          );
          if (status === 500) failed.push('404.html');
        }
        if (failed.length > 0) {
          throw new Error(
            `static build could not render ${failed.toSorted().join(', ')} — see the error above`,
          );
        }
        if (unanswered.length > 0) {
          throw new Error(
            `static build writes a route.ts from a GET that answers 200, and these did not: ${unanswered.toSorted().join(', ')}`,
          );
        }
        if (refused.length > 0) {
          throw new Error(
            `the "paths" option supplied pathnames a params schema refused: ${refused.toSorted().join(', ')}`,
          );
        }
        if (disowned.length > 0) {
          throw new Error(
            `the "paths" option supplied pathnames whose page called notFound(): ${disowned.toSorted().join(', ')}`,
          );
        }
        // The build knows every page it wrote, which is what a sitemap is.
        // Redirects and route.ts files are not pages, and a not-found is not a
        // URL to offer.
        if (options.site !== undefined) {
          await writeFile(
            path.join(clientDir, 'sitemap.xml'),
            sitemap(
              options.site,
              plan.paths
                .filter(
                  (pathname) =>
                    !redirected.has(pathname) && !byRoute.has(pathname),
                )
                .map((pathname) => withBase(pathname, base)),
            ),
          );
        }
        builder.config.logger.info(
          `k8ordo: wrote ${String(plan.paths.length)} routes${unmatched === null ? '' : ' and 404.html'}${options.site === undefined ? '' : ' and sitemap.xml'}`,
        );
      },
    },
  };

  // What only a running server can have is refused before anything is built.
  // Server Actions are the exception: the RSC pipeline finds them only while
  // it compiles, so the build names them once it has.
  const refuse: Plugin = {
    name: 'k8ordo:static-refuses',
    buildApp: {
      order: 'pre',
      async handler() {
        const files = await scanRoutes(routesDir);
        const named = (file: string): string =>
          path.relative(root, path.join(routesDir, file));
        const guards = files
          .filter((file) => slotOf(file) === 'guard')
          .map((file) => named(file));
        const routes = [
          ...(await readExports(
            routesDir,
            files.filter((file) => slotOf(file) === 'route'),
          )),
        ]
          .map(([file, names]) => [named(file), unwritable(names)] as const)
          .filter(([, methods]) => methods.length > 0);
        const refusals = [
          ...(guards.length > 0 ? [guardRefusal(guards)] : []),
          ...(routes.length > 0 ? [routeRefusal(routes)] : []),
        ];
        if (refusals.length > 0) throw new Error(refusals.join('\n\n'));
      },
    },
  };

  return [
    ...engine(options, { via: '@k8ordo/static', runtimeDir: RUNTIME_DIR }),
    refuse,
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

type Written = {
  readonly status: number;
  /** The page itself said notFound(), rather than a schema refusing it. */
  readonly notFound: boolean;
};

/** Writes what the handler answered, and says with which status. */
const write = async (
  file: string,
  handler: Handler,
  url: string,
): Promise<Written> => {
  const response = await handler(new Request(url));
  const notFound = response.headers.has(NOT_FOUND_HEADER);
  // A page that failed to render is not a page: nothing is written, and the
  // caller stops the build with its name.
  if (response.status === 500) {
    console.error(`k8ordo: ${url} — ${await response.text()}`);
    return { status: response.status, notFound };
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
  return { status: response.status, notFound };
};

/**
 * Writes what a route.ts's GET answered, as the file at its pathname — a
 * static host then serves it with the type its extension says. Anything but a
 * 200 is not a file the site has, and nothing is written.
 */
const writeRoute = async (
  file: string,
  handler: Handler,
  url: string,
): Promise<number> => {
  const response = await handler(new Request(url));
  if (response.status !== 200) {
    if (response.status === 500) {
      console.error(`k8ordo: ${url} — ${await response.text()}`);
    }
    return response.status;
  }
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await response.arrayBuffer()));
  return response.status;
};
