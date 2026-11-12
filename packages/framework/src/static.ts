import { mkdir, readdir, writeFile, readFile } from 'node:fs/promises';
import type { ServerResponse } from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  CLIENT_DEPS_HEADER,
  CLIENT_FILES_PATH,
  decodePathname,
  exportsOf,
  FALLBACK_SEGMENT,
  fallbackShapes,
  isPayloadPath,
  isServerActionModule,
  pagePathFor,
  pagesReadingSearch,
  NONCE_HEADER,
  NOT_FOUND_HEADER,
  parseRouteTree,
  payloadPathFor,
  readClientDeps,
  readExports,
  readServerStylesheets,
  REEXPORTS_ALL,
  ROUTE_METHODS,
  scanRoutes,
  SERVER_STYLESHEETS_HEADER,
  serverActionModules,
  SHELL_HEADER,
  slotOf,
} from '@k8ordo/framework-engine';
import type {
  EngineOptions,
  FallbackShape,
  RouteDir,
} from '@k8ordo/framework-engine';
import { normalizePathname, withBase, withoutBase } from '@k8ordo/router';
import { contentType } from 'mime-types';
import type {
  Connect,
  Logger,
  Plugin,
  ResolvedConfig,
  RunnableDevEnvironment,
  ViteDevServer,
} from 'vite';

import {
  asFile,
  clientFiles,
  policyProblems,
  redirectPage,
  sitemap,
  writtenOutsideScripts,
} from './documents';
import type { ContentSecurityPolicy } from './documents';
import {
  answersOf,
  catchAllPath,
  catchAllRefusals,
  dirFor,
  fileAt,
  isConcrete,
  patternsNeedingPaths,
  patternsOf,
  planPaths,
  planRefusals,
  routeFileRefusals,
  shadowedShells,
  suppliedFrom,
} from './paths';
import type { PathPlan, Shell } from './paths';
import {
  builtRules,
  cloudflareCounts,
  cloudflareMatches,
  formatRedirects,
  PLACEHOLDER,
  rewriteFor,
  rewritesAfterFiles,
  rulesOf,
  shellRules,
} from './rewrites';
import type { Rewrite } from './rewrites';
import { readRules, resolveStatic } from './static-host';

export type StaticOptions = EngineOptions & {
  /**
   * Every route rendered at build time and written to files; no server at
   * run time, so nothing that answers a request (Server Actions, guards, the
   * request API) builds.
   */
  readonly mode: 'static';
  /**
   * The origin the site is served from — `https://example.com`. With it the
   * build also writes `sitemap.xml`, listing every page it rendered at its
   * URL, Vite's `base` included; without it, no sitemap, because a sitemap of
   * relative URLs is not one. A `route.ts` that writes `sitemap.xml` as well
   * stops the build, naming both: keep one of them.
   */
  readonly site?: string;
  /**
   * The `Content-Security-Policy` every page carries, as directives and
   * their sources. The framework decides no policy: it writes this one into
   * each page's `<meta>`, adding to `script-src` the hashes of its own inline
   * scripts on that page — the payload and React's. An inline script of the
   * application's is allowed by its hash here, as
   * `colorSchemeScriptHash()` gives `@k8ordo/color-scheme`'s. Without it, no
   * policy is written.
   */
  readonly csp?: ContentSecurityPolicy;
};

type Handler = (request: Request) => Promise<Response>;

/**
 * What a host adapter writes a static build from, once every file is in
 * place, besides the client build it publishes.
 */
export type StaticOutput = {
  /** `rewritesAfterFiles`. */
  readonly rewrites: readonly Rewrite[];
  /** Whether `404.html` was written. */
  readonly notFound: boolean;
  /**
   * The `Content-Type` each route.ts's `GET` answered with, by the file it
   * wrote: its path inside the client build, `/`-separated. A `GET` that
   * named none is not here.
   */
  readonly types: ReadonlyMap<string, string>;
};

/** What a host adapter's plugin lends the static build: `vercel()`'s. */
export type StaticAdapter = {
  readonly writeStatic: (output: StaticOutput) => void | Promise<void>;
};

/** What `vite dev` reads of the routes: the tree, and its shells' shapes. */
type DevRoutes = {
  readonly tree: RouteDir;
  readonly failed: boolean;
  readonly shapes: readonly FallbackShape[];
  /** The patterns a paths.ts has to give values for, as URLPatterns. */
  readonly needing: readonly URLPattern[];
  /** Every pattern but the catch-alls, in the matcher's order. */
  readonly declared: ReadonlyArray<{
    readonly pattern: string;
    readonly matcher: URLPattern;
  }>;
};

/** What `vite dev` reads of the paths.ts files: what the build would write. */
type DevPlan = {
  readonly paths: ReadonlySet<string>;
  readonly shells: readonly Shell[];
  /** A paths.ts threw: nothing is known, so every value is rendered. */
  readonly failed: boolean;
};

const NO_PLAN: DevPlan = { paths: new Set(), shells: [], failed: true };

/** Every file below a directory, relative to it, POSIX separators. */
const filesBelow = async (dir: string): Promise<string[]> =>
  (await readdir(dir, { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) =>
      path
        .relative(dir, path.join(entry.parentPath, entry.name))
        .split(path.sep)
        .join('/'),
    )
    .toSorted();

const messageOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const ORIGIN = 'http://k8ordo.localhost';

const WANTS_SERVER = "this application wants mode: 'server'";

/** The entry whose every export answers a request. */
const SERVER_ENTRY = '@k8ordo/framework/server';

/**
 * The request API answers a request — its cookies, its headers, a redirect
 * from an action — and a file is written once for every visitor. Named every
 * importer at once, as the Server Action refusal names every action module.
 */
const serverImportRefusal = (files: readonly string[]): string =>
  `static build cannot answer a request — a file is written once for every visitor, and these import ${SERVER_ENTRY}:\n${files
    .map((file) => `  ${file}`)
    .join('\n')}\n${WANTS_SERVER}`;

/** The Server Action refusal, naming every module that declares one. */
const actionRefusal = (files: readonly string[]): string =>
  `static build cannot ship Server Actions — a file cannot receive one, and ${files.length === 1 ? 'this declares' : 'these declare'} 'use server':\n${files
    .map((file) => `  ${file}`)
    .join('\n')}\n${WANTS_SERVER}`;

/**
 * A `guard.ts` decides how a request is answered, and a file is never
 * requested of anything that could run one. Named every one at once, as the
 * Server Action refusal names every action module.
 */
const guardRefusal = (files: readonly string[]): string =>
  `static build cannot run guard.ts — a file has no request to guard, and these are guards:\n${files
    .map((file) => `  ${file}`)
    .join('\n')}\n${WANTS_SERVER}`;

/**
 * A page that reads the search is rendered for each search it is given, and a
 * file is the same whatever the search holds. Named every one at once.
 */
const searchRefusal = (pages: readonly string[]): string =>
  `static build cannot hand a page the search — a file is the same for every search, and these pages export search:\n${pages
    .map((page) => `  ${page}`)
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

/**
 * A route.ts's methods and a page's `search` are read from the file by name,
 * and `export *` names nothing — what it brings could be a `POST` the build
 * never sees and `vite dev` answers. Named every one at once.
 */
const reexportRefusal = (files: readonly string[]): string =>
  `static build reads a route.ts's methods and a page's search by name, and export * names none of them — ${files.length === 1 ? 'this re-exports' : 'these re-export'} another module whole:\n${files
    .map((file) => `  ${file}`)
    .join(
      '\n',
    )}\nname what ${files.length === 1 ? 'it exports' : 'they export'}, as export { GET } from '../../lib/feed' does`;

/** The route files whose exports static mode reads. */
const READ_BY_NAME = new Set(['route', 'page']);

/**
 * Static mode: the same request handler the server mode runs per request is
 * called at build time — for each route's HTML and again for its payload —
 * and its answers are written to files.
 * There is no server here, and the build refuses a Server Action, because a
 * file cannot receive one.
 */
export const staticMode = (options: StaticOptions): Plugin[] => {
  const { csp } = options;
  const unwritablePolicy = csp === undefined ? [] : policyProblems(csp);
  if (unwritablePolicy.length > 0) {
    throw new Error(
      `the "csp" option cannot go into a page's <meta> as it is:\n${unwritablePolicy
        .map((problem) => `  ${problem}`)
        .join('\n')}`,
    );
  }
  let root = '';
  let routesDir = '';
  let base = '/';
  let logger: Logger | undefined;
  let plugins: ResolvedConfig['plugins'] = [];
  // Who imports the request API, found while the environments build and
  // named once they have — no module graph lists an import by the specifier
  // it was written as.
  const serverImporters = new Set<string>();

  let routesRead: Promise<DevRoutes> | undefined;
  let planRead: Promise<DevPlan> | undefined;
  let devServer: ViteDevServer | undefined;
  const noticed = new Set<string>();
  const warned = new Set<string>();

  const fromRoot = (file: string): string =>
    path.relative(root, path.join(routesDir, file));

  const devRoutes = (): Promise<DevRoutes> =>
    (routesRead ??= (async () => {
      const { tree, problems } = parseRouteTree(await scanRoutes(routesDir));
      const failed = problems.length > 0;
      return {
        tree,
        failed,
        shapes: failed ? [] : fallbackShapes(tree),
        needing: failed
          ? []
          : patternsNeedingPaths(tree).map(
              (pathname) => new URLPattern({ pathname }),
            ),
        declared: failed
          ? []
          : patternsOf(tree)
              .filter((pattern) => !pattern.endsWith('/*'))
              .map((pattern) => ({
                pattern,
                matcher: new URLPattern({ pathname: pattern }),
              })),
      };
    })());

  /**
   * A paths.ts under `vite dev`, read through the RSC environment's runner —
   * the graph the pages are in, so it sees the application's aliases and an
   * edit to it, or to what it imports, is what the next call reads.
   */
  const devValues = async (
    file: string,
    params: Readonly<Record<string, string>>,
  ): Promise<unknown> => {
    const environment = devServer?.environments.rsc;
    if (environment === undefined || !('runner' in environment)) {
      throw new Error('the rsc environment cannot run a paths.ts');
    }
    const { runner } = environment as RunnableDevEnvironment;
    const { default: values } = (await runner.import(
      path.join(routesDir, file),
    )) as { default?: unknown };
    if (typeof values !== 'function') {
      throw new TypeError(
        `${fromRoot(file)} has to export default a function returning its parameter's values`,
      );
    }
    return (values as (above: typeof params) => unknown)(params);
  };

  /**
   * What the build would write, as the paths.ts files say now. Kept until a
   * file under `routes/` changes — and asked for again when a request names
   * a value it does not hold, since the values come from data that changes
   * with no file changing.
   */
  const devPlan = (again = false): Promise<DevPlan> => {
    if (again) planRead = undefined;
    return (planRead ??= (async () => {
      const { tree } = await devRoutes();
      let supplied;
      try {
        supplied = await suppliedFrom(tree, devValues);
      } catch (error) {
        // 覚えない。値の出どころが直れば、ファイルが変わらなくても次で読める
        planRead = undefined;
        const message = `k8ordo: a paths.ts failed, so vite dev renders every value with page.tsx: ${messageOf(error)}`;
        if (!warned.has(message)) {
          warned.add(message);
          logger?.error(message);
        }
        return NO_PLAN;
      }
      const plan = planPaths(tree, supplied.locations);
      for (const refusal of [
        ...supplied.problems,
        ...planRefusals(
          plan,
          shadowedShells(tree, plan.shells, new Set(plan.paths)),
        ),
      ]) {
        if (warned.has(refusal)) continue;
        warned.add(refusal);
        logger?.warn(`k8ordo: the build will refuse this: ${refusal}`);
      }
      return { paths: new Set(plan.paths), shells: plan.shells, failed: false };
    })());
  };

  /**
   * Under `vite dev`, a value no paths.ts returns is answered as the build's
   * host would answer it — so what works locally is what is deployed. With a
   * fallback.tsx beside its page, that is the shell: the URL is rewritten to
   * the shell pathname before the RSC plugin's handler reads it. Without
   * one, it is the not-found: a document is rewritten to the pathname the
   * build renders `404.html` from, and a payload — a file the host does not
   * have — is a plain 404, which the browser answers by loading the
   * document. Everything else passes untouched.
   */
  const answerUnbuilt = async (
    request: Connect.IncomingMessage,
    response: ServerResponse,
  ): Promise<boolean> => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return false;
    }
    // RSC プラグインと同じく originalUrl を読む。base はそちらに残っている
    const url = new URL(request.originalUrl ?? request.url ?? '/', ORIGIN);
    const own = withoutBase(url.pathname, base);
    if (own === null) {
      return false;
    }
    const payload = isPayloadPath(own);
    const page = payload ? pagePathFor(own) : own;
    const routes = await devRoutes();
    if (routes.failed) {
      return false;
    }
    // 値の要らない URL（モジュールやアセットを含む）は、遅い paths.ts を待たせない
    if (!routes.needing.some((matcher) => matcher.test({ pathname: page }))) {
      return false;
    }
    const pathname = normalizePathname(page);
    // 表で先に宣言された、値の要らないパターンが答える URL（/posts/new など）
    const first = routes.declared.find(({ matcher }) =>
      matcher.test({ pathname }),
    );
    if (first === undefined || isConcrete(first.pattern)) {
      return false;
    }
    if (
      pathname
        .split('/')
        .some((segment) => decodePathname(segment) === FALLBACK_SEGMENT)
    ) {
      return false;
    }
    let state = await devPlan();
    if (!state.failed && !state.paths.has(pathname)) {
      state = await devPlan(true);
    }
    if (state.failed || state.paths.has(pathname)) {
      return false;
    }
    const notice = (key: string, message: string): void => {
      if (noticed.has(key)) return;
      noticed.add(key);
      logger?.info(message);
    };
    // ホストと同じ規則を同じ順に試す。殻を渡された順に試すと、具体的な場所を
    // 先に並べた _redirects とは別の殻で答えることがある。ペイロードもページの
    // pathname で比べるので、文書の規則だけで足りる
    const answered = shellRules(state.shells, '/')
      .filter((rule) => rule.to.endsWith('/'))
      .find((rule) => rewriteFor([rule], page) !== null);
    if (answered !== undefined) {
      const shell = answered.to.slice(0, -1);
      const target = `${withBase(payload ? `${shell}/index.rsc` : shell, base)}${url.search}`;
      request.originalUrl = target;
      request.url = target;
      const pattern = state.shells.find((each) =>
        shellRules([each], '/').some((rule) => rule.from === answered.from),
      )?.pattern;
      const fallback = routes.shapes.find(
        (shape) => shape.pattern === pattern,
      )?.file;
      if (fallback !== undefined) {
        notice(
          fallback,
          `k8ordo: no paths.ts returns ${pathname}, so vite dev answers it with ${fallback}'s shell, as the build's host will`,
        );
      }
      return false;
    }
    notice(
      first.pattern,
      `k8ordo: no paths.ts returns ${pathname}, so vite dev answers it with the not-found, as the build's host will — return its value from the paths.ts of ${first.pattern} to render it`,
    );
    const notFoundAt = catchAllPath(routes.tree);
    if (payload || notFoundAt === null) {
      response.writeHead(404).end();
      return true;
    }
    const target = `${withBase(notFoundAt, base)}${url.search}`;
    request.originalUrl = target;
    request.url = target;
    return false;
  };

  /**
   * Writes `dist/client/_redirects` once every file is in place — the
   * built URLs a shell rule would also catch, the application's own rules
   * from `public/_redirects`, then the shells' — and returns what Cloudflare
   * would get wrong reading it.
   */
  const writeRedirects = async ({
    clientDir,
    shells,
    notPages,
    publicDir,
  }: {
    readonly clientDir: string;
    readonly shells: readonly Shell[];
    readonly notPages: readonly string[];
    readonly publicDir: string | null;
  }): Promise<string[]> => {
    const misread: string[] = [];
    const shellRewrites = shellRules(shells, base);
    // dist/client/ のものは、emptyOutDir: false なら前のビルドが重ねた後の
    // ファイルが残っている。アプリのものは public から読む
    const ownFile =
      publicDir === null ? null : path.join(publicDir, '_redirects');
    let own: string | null = null;
    if (ownFile !== null) {
      try {
        own = await readFile(ownFile, 'utf8');
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
    }
    const ownRules = own === null ? [] : rulesOf(own);
    const hiding = ownRules.flatMap(({ line, from }) => {
      if (!from.includes('*') && !PLACEHOLDER.test(from)) return [];
      const hidden = shells.find((shell) =>
        cloudflareMatches(from, withBase(shell.pathname, base)),
      );
      return hidden === undefined
        ? []
        : [
            `k8ordo: ${path
              .relative(root, ownFile ?? '')
              .split(path.sep)
              .join(
                '/',
              )} line "${line}" matches ${hidden.location} before its shell's rule, so that shell is never served`,
          ];
    });
    misread.push(...hiding);
    const built = builtRules(
      await filesBelow(clientDir),
      notPages,
      shellRewrites,
      ownRules.map(({ from }) => from),
      base,
    );
    for (const from of built.unlisted) {
      const read = from.includes('*')
        ? '"*" as a splat'
        : `"${PLACEHOLDER.exec(from)?.[0] ?? ':'}" as a placeholder`;
      misread.push(
        `k8ordo: _redirects cannot list ${from} — Cloudflare and Netlify read ${read}, so on Cloudflare a shell answers it`,
      );
    }
    const text = formatRedirects(built.rules, own, shellRewrites);
    await writeFile(path.join(clientDir, '_redirects'), text);
    const counted = cloudflareCounts(text);
    if (counted.static > 2000) {
      misread.push(
        `k8ordo: _redirects has ${String(counted.static)} rules Cloudflare counts as static; it reads 2,000 and skips the rest, so a built page past them is answered by its shell there`,
      );
    }
    if (counted.dynamic > 100) {
      misread.push(
        `k8ordo: _redirects has ${String(counted.dynamic)} rules Cloudflare counts as dynamic; it reads 100 and ignores the rest of the file — the shell payload rules go first (navigations to those values become document loads), then document rules (those values 404)`,
      );
    }
    return misread;
  };

  const prerender: Plugin = {
    name: 'k8ordo:static',

    configResolved(config) {
      ({ root, plugins, base, logger } = config);
      routesDir = path.resolve(root, options.routesDir ?? 'src/routes');
    },

    configureServer: {
      // pre の返す関数は、Vite の内部ミドルウェアの後、RSC プラグインの
      // ハンドラの前に入る。モジュールの URL を殻の規則が取ることはない
      order: 'pre',
      handler(server) {
        devServer = server;
        return () => {
          server.middlewares.use(middlewareOf(answerUnbuilt));
        };
      },
    },

    // vite preview serves a static build the way a host does: the written
    // files with their policy <meta>, the build's `_redirects`, a real
    // 404.html — never a render of the handler, which only the build runs.
    // Ahead of Vite's own middlewares, so the base is still on the URL and
    // the RSC plugin's handler is never reached under it.
    async configurePreviewServer(server) {
      const { config } = server;
      const client = path.resolve(
        config.root,
        config.environments.client?.build.outDir ?? 'dist/client',
      );
      const rules = await readRules(client);
      const answeredHere = async (
        request: Connect.IncomingMessage,
        response: ServerResponse,
      ): Promise<boolean> => {
        const url = new URL(`${ORIGIN}${request.url ?? '/'}`);
        if (withoutBase(url.pathname, config.base) === null) return false;
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          response.writeHead(405, { allow: 'GET, HEAD' }).end();
          return true;
        }
        const served = await resolveStatic(
          client,
          rules,
          url.pathname,
          config.base,
        );
        if (served === null) {
          response.writeHead(404).end();
          return true;
        }
        const file = path
          .relative(client, served.file)
          .split(path.sep)
          .join('/');
        // Vite の静的ファイルはディレクトリの index.html を引かないので、
        // ファイルそのものの URL に書き換えて渡す。ただし Vite（sirv）は
        // decodeURI でしか戻さず、? と # を含む名前はどう綴っても届かない
        if (served.status === 200 && !/[?#]/u.test(file)) {
          request.url = `${withBase(encodeURI(`/${file}`), config.base)}${url.search}`;
          return false;
        }
        const type = contentType(path.extname(served.file));
        response.writeHead(served.status, {
          'content-type': type === false ? 'application/octet-stream' : type,
        });
        response.end(
          request.method === 'HEAD' ? undefined : await readFile(served.file),
        );
        return true;
      };
      server.middlewares.use(middlewareOf(answeredHere));
    },

    watchChange(file) {
      // `routes` と `routes-x` を取り違えないよう、区切りまで含めて見る
      if (!path.resolve(file).startsWith(`${routesDir}${path.sep}`)) return;
      routesRead = undefined;
      planRead = undefined;
      noticed.clear();
      warned.clear();
    },

    // Ahead of Vite's own resolver, which would answer the specifier first.
    resolveId: {
      order: 'pre',
      handler(source, importer) {
        if (source !== SERVER_ENTRY || importer === undefined) return null;
        const [module = importer] = importer.split('?');
        // The RSC plugin resolves a specifier that lands in node_modules a
        // second time, from the root's index.html, to see whether the root
        // sees the same package — an importer no application has.
        if (module === path.join(root, 'index.html')) return null;
        const file = path.relative(root, module);
        // vite dev は使われた時点で、ビルドは全部集めてから名指しする
        if (this.environment.mode === 'dev') {
          throw new Error(serverImportRefusal([file]));
        }
        serverImporters.add(file);
        return null;
      },
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
        const names = READ_BY_NAME.has(slot ?? '')
          ? exportsOf(await readFile(module, 'utf8'), file)
          : new Set<string>();
        if (names.has(REEXPORTS_ALL)) {
          throw new Error(reexportRefusal([path.relative(root, module)]));
        }
        const methods = slot === 'route' ? unwritable(names) : [];
        if (methods.length > 0) {
          throw new Error(
            routeRefusal([[path.relative(root, module), methods]]),
          );
        }
        if (slot === 'page' && names.has('search')) {
          throw new Error(searchRefusal([path.relative(root, module)]));
        }
        if (!isServerActionModule({ plugins }, id)) return null;
        throw new Error(actionRefusal([path.relative(root, id)]));
      },
    },

    buildApp: {
      order: 'post',
      async handler(builder) {
        const { tree } = parseRouteTree(await scanRoutes(routesDir));
        const rscOut = builder.environments.rsc?.config.build.outDir;
        const client = builder.environments.client?.config;
        if (rscOut === undefined || client === undefined) {
          throw new Error('static build ran without the rsc/client builds');
        }
        // 値を返す paths.ts も、ページと同じく組み上がったバンドルから読む
        const built = (await import(
          pathToFileURL(path.resolve(root, rscOut, 'index.js')).href
        )) as {
          default: Handler;
          pathValues: (
            file: string,
            params: Readonly<Record<string, string>>,
          ) => Promise<unknown>;
        };
        const supplied = await suppliedFrom(tree, built.pathValues);
        const plan = planPaths(tree, supplied.locations);
        const answers = answersOf(tree, plan.paths);
        // RSC の仕組みは action とリクエストの API をどちらのモードでもコンパイル
        // するので、static で受けないと言えるのはビルドが断るときだけ
        const actions = serverActionModules(builder.config);
        const importers = [...serverImporters].toSorted();
        const refusals = [
          ...supplied.problems,
          ...planRefusals(
            plan,
            shadowedShells(tree, plan.shells, new Set(plan.paths)),
          ),
          ...catchAllRefusals(tree),
          ...(actions.length > 0 ? [actionRefusal(actions)] : []),
          ...(importers.length > 0 ? [serverImportRefusal(importers)] : []),
          ...routeFileRefusals(tree, plan, answers, {
            site: options.site !== undefined,
            named: fromRoot,
          }),
        ];
        if (refusals.length > 0) throw new Error(refusals.join('\n\n'));

        // outDir はすでに絶対パスのことがあるので resolve で受ける
        const clientDir = path.resolve(root, client.build.outDir);
        const origin =
          options.site === undefined ? ORIGIN : new URL(options.site).origin;
        const render: Render = {
          handler: built.default,
          clientDir,
          urlFor: (pathname) => `${origin}${withBase(pathname, base)}`,
          csp,
        };
        const notFoundAt = catchAllPath(tree);
        const fallbacks = new Map(
          fallbackShapes(tree).map((shape) => [shape.pattern, shape.file]),
        );
        const rendered = [
          ...(await inParallel(
            plan.paths.map(
              (pathname) => () =>
                answers.get(pathname)?.kind === 'route'
                  ? renderRoute(render, pathname)
                  : renderPage(render, pathname),
            ),
          )),
          ...(notFoundAt === null
            ? []
            : [await renderNotFound(render, notFoundAt)]),
          ...(await inParallel(
            plan.shells.map(
              (shell) => () => renderShell(render, shell, fallbacks),
            ),
          )),
        ];
        const failures = failureMessages(rendered);
        if (failures.length > 0) throw new Error(failures.join('\n\n'));

        for (const location of await leakingShells(clientDir, plan.shells)) {
          builder.config.logger.warn(
            `k8ordo: the shell for ${location} has "${FALLBACK_SEGMENT}" in its HTML — a layout wrote the shell's pathname into the page (a link, a canonical URL); derive what depends on the URL in a client component`,
          );
        }
        await writeClientFiles(clientDir, rendered);
        const notPages = rendered.flatMap((each) =>
          each.kind === 'route' || each.kind === 'redirect'
            ? [each.pathname]
            : [],
        );
        if (options.site !== undefined) {
          await writeSitemap(
            clientDir,
            options.site,
            plan.paths
              .filter((pathname) => !notPages.includes(pathname))
              .map((pathname) => withBase(pathname, base)),
          );
        }
        const adapter = adapterOf(builder.config.plugins);
        if (plan.shells.length > 0) {
          const misread = await writeRedirects({
            clientDir,
            shells: plan.shells,
            notPages,
            publicDir:
              client.build.copyPublicDir && builder.config.publicDir !== ''
                ? builder.config.publicDir
                : null,
          });
          // アダプタのあるホストは _redirects を読まない。それでも書くのは
          // vite preview と serve のため
          if (adapter === undefined) {
            for (const message of misread) builder.config.logger.warn(message);
          }
        }
        await adapter?.writeStatic({
          rewrites: rewritesAfterFiles(plan.shells, notPages, base),
          notFound: notFoundAt !== null,
          types: typesOf(rendered),
        });

        builder.config.logger.info(
          `k8ordo: wrote ${summaryOf(plan, {
            notFound: notFoundAt !== null,
            sitemap: options.site !== undefined,
          })}`,
        );
      },
    },
  };

  const refuse: Plugin = {
    name: 'k8ordo:static-refuses',
    buildApp: {
      order: 'pre',
      async handler() {
        const files = await scanRoutes(routesDir);
        const guards = files
          .filter((file) => slotOf(file) === 'guard')
          .map((file) => fromRoot(file));
        const exported = await readExports(routesDir, files);
        const routes = [...exported]
          .filter(([file]) => slotOf(file) === 'route')
          .map(([file, names]) => [fromRoot(file), unwritable(names)] as const)
          .filter(([, methods]) => methods.length > 0);
        const searching = [...pagesReadingSearch(exported)].map((file) =>
          fromRoot(file),
        );
        const reexporting = [...exported]
          .filter(
            ([file, names]) =>
              READ_BY_NAME.has(slotOf(file) ?? '') && names.has(REEXPORTS_ALL),
          )
          .map(([file]) => fromRoot(file));
        const refusals = [
          ...(guards.length > 0 ? [guardRefusal(guards)] : []),
          ...(routes.length > 0 ? [routeRefusal(routes)] : []),
          ...(searching.length > 0 ? [searchRefusal(searching)] : []),
          ...(reexporting.length > 0 ? [reexportRefusal(reexporting)] : []),
        ];
        if (refusals.length > 0) throw new Error(refusals.join('\n\n'));
      },
    },
  };

  return [refuse, prerender];
};

/**
 * A Connect middleware from a step that says whether it answered the request
 * — Connect awaits nothing, so a step that rejects reaches `next` this way.
 */
const middlewareOf =
  (
    answered: (
      request: Connect.IncomingMessage,
      response: ServerResponse,
    ) => Promise<boolean>,
  ): Connect.NextHandleFunction =>
  (request, response, next) => {
    void (async () => {
      let done: boolean;
      try {
        done = await answered(request, response);
      } catch (error) {
        next(error);
        return;
      }
      if (!done) next();
    })();
  };

/** The host adapter among the plugins, if any. */
const adapterOf = (
  plugins: ResolvedConfig['plugins'],
): StaticAdapter | undefined =>
  plugins
    // Vite の型では api は any なので、静的ビルドが呼ぶ形をここで言う
    .map((plugin) => plugin.api as Partial<StaticAdapter> | undefined)
    .find(
      (api): api is StaticAdapter => typeof api?.writeStatic === 'function',
    );

/**
 * A render is a whole page: components, their data, and whatever the app's
 * own highlighting or markdown does. Starting every one of them at once ties
 * peak memory to the size of the site, which is the number that grows. A
 * fixed width keeps the machine's cost flat while still overlapping the
 * waiting.
 */
const WIDTH = 8;

const inParallel = async <T>(
  tasks: ReadonlyArray<() => Promise<T>>,
): Promise<T[]> => {
  const results: T[] = [];
  let next = 0;
  const worker = async (): Promise<void> => {
    for (let at = next++; at < tasks.length; at = next++) {
      // A worker is sequential on purpose — that is what bounds the width.
      results[at] = await (tasks[at] as () => Promise<T>)();
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(WIDTH, tasks.length) }, worker),
  );
  return results;
};

/** What the build asks the handler with, and where it writes the answers. */
type Render = {
  readonly handler: Handler;
  /** The client build, absolute. */
  readonly clientDir: string;
  /** A pathname in the table's terms as the URL the handler is asked for. */
  readonly urlFor: (pathname: string) => string;
  readonly csp: ContentSecurityPolicy | undefined;
};

/** What stops the build, by kind; `FAILURES` words each. */
type Failure = keyof typeof FAILURES;

/** What writing one pathname, `404.html` or a shell came to. */
type Rendered =
  | {
      readonly kind: 'failure';
      readonly failure: Failure;
      /** How the message names it. */
      readonly name: string;
    }
  | {
      readonly kind: 'route';
      readonly pathname: string;
      /** The `Content-Type` its `GET` answered with. */
      readonly type: string | null;
    }
  | { readonly kind: 'redirect'; readonly pathname: string }
  | {
      readonly kind: 'document';
      /** `null` when the handler did not say. */
      readonly files: readonly string[] | null;
      /** A page's payload, as a browser's URL spells its path. */
      readonly payload: string | null;
    };

const FAILURES = {
  render: (names: readonly string[]) =>
    `static build could not render ${names.join(', ')} — see the error above`,
  route: (names: readonly string[]) =>
    `static build writes a route.ts from a GET that answers 200, and these did not: ${names.join(', ')}`,
  refused: (names: readonly string[]) =>
    `a paths.ts returned values a params schema refused: ${names.join(', ')}`,
  disowned: (names: readonly string[]) =>
    `a paths.ts returned values whose page called notFound(): ${names.join(', ')}`,
  shellRefused: (names: readonly string[]) =>
    `the shells stand where a params schema refuses the values above them: ${names.join(', ')}`,
  shellDisowned: (names: readonly string[]) =>
    names
      .map(
        (location) =>
          `the shell for ${location} called notFound() while it rendered, and a shell has no value to disown — call notFound() from the client component that reads the value in the browser`,
      )
      .join('\n'),
  shellTaken: (names: readonly string[]) => names.join('\n'),
};

const failed = (failure: Failure, name: string): Rendered => ({
  kind: 'failure',
  failure,
  name,
});

/** Every kind that stopped the build, in `FAILURES`' order, each sorted. */
const failureMessages = (rendered: readonly Rendered[]): string[] =>
  Object.entries(FAILURES).flatMap(([failure, message]) => {
    const names = rendered
      .flatMap((each) =>
        each.kind === 'failure' && each.failure === failure ? [each.name] : [],
      )
      .toSorted();
    return names.length === 0 ? [] : [message(names)];
  });

const renderRoute = async (
  { handler, clientDir, urlFor }: Render,
  pathname: string,
): Promise<Rendered> => {
  const { status, type } = await writeBody(
    path.join(clientDir, dirFor(pathname)),
    handler,
    urlFor(pathname),
  );
  return status === 200
    ? { kind: 'route', pathname, type }
    : failed('route', `${pathname} (${String(status)})`);
};

const renderPage = async (
  render: Render,
  pathname: string,
): Promise<Rendered> => {
  // URL はエスケープのまま頼み、ファイルの名前だけを復号する
  const dir = path.join(render.clientDir, dirFor(pathname));
  const { status, notFound, files } = await writeHtml(
    path.join(dir, 'index.html'),
    render,
    render.urlFor(pathname),
    { notFoundIsPage: false },
  );
  if (status === 500) return failed('render', pathname);
  if (status === 404)
    return failed(notFound ? 'disowned' : 'refused', pathname);
  // リダイレクトにペイロードは無い。クライアントの遷移は index.rsc に何も
  // 見つけず、URL をブラウザに渡し、上の HTML がリダイレクトする
  if (status === 307 || status === 308) return { kind: 'redirect', pathname };
  if (status !== 200) return { kind: 'document', files, payload: null };
  const payload = render.urlFor(payloadPathFor(pathname));
  const written = await writeBody(
    path.join(dir, 'index.rsc'),
    render.handler,
    payload,
  );
  return written.status === 200
    ? { kind: 'document', files, payload: new URL(payload).pathname }
    : failed('render', pathname);
};

const renderNotFound = async (
  render: Render,
  pathname: string,
): Promise<Rendered> => {
  const { status, files } = await writeHtml(
    path.join(render.clientDir, '404.html'),
    render,
    render.urlFor(pathname),
    { notFoundIsPage: true },
  );
  return status === 500
    ? failed('render', '404.html')
    : { kind: 'document', files, payload: null };
};

const renderShell = async (
  render: Render,
  shell: Shell,
  fallbacks: ReadonlyMap<string, string>,
): Promise<Rendered> => {
  const dir = path.join(render.clientDir, dirFor(shell.pathname));
  const answered = await writeHtml(
    path.join(dir, 'index.html'),
    render,
    render.urlFor(shell.pathname),
    { notFoundIsPage: false, shell: shell.pattern },
  );
  const named = `${shell.location} (${fallbacks.get(shell.pattern) ?? ''})`;
  if (answered.status === 500) return failed('render', shell.location);
  if (answered.status === 404) {
    return failed(
      answered.notFound ? 'shellDisowned' : 'shellRefused',
      shell.location,
    );
  }
  if (answered.shell === null) {
    return failed(
      'shellTaken',
      `the shell for ${named} was answered by another route, which took "${FALLBACK_SEGMENT}" as a value`,
    );
  }
  if (answered.shell !== shell.pattern) {
    return failed(
      'shellTaken',
      `the shell for ${named} was answered by ${fallbacks.get(answered.shell) ?? answered.shell}, which the table tries first — put the shell where that pattern cannot match, with a paths.ts above it`,
    );
  }
  const payload = await writeBody(
    path.join(dir, 'index.rsc'),
    render.handler,
    render.urlFor(payloadPathFor(shell.pathname)),
  );
  return payload.status === 200
    ? { kind: 'document', files: answered.files, payload: null }
    : failed('render', shell.location);
};

/** The shells whose HTML outside its scripts holds the shell pathname. */
const leakingShells = async (
  clientDir: string,
  shells: readonly Shell[],
): Promise<string[]> =>
  (
    await Promise.all(
      shells.map(async (shell) => {
        const html = await readFile(
          path.join(clientDir, dirFor(shell.pathname), 'index.html'),
          'utf8',
        );
        return writtenOutsideScripts(html).some((written) =>
          written.includes(FALLBACK_SEGMENT),
        )
          ? [shell.location]
          : [];
      }),
    )
  ).flat();

const writeClientFiles = async (
  clientDir: string,
  rendered: readonly Rendered[],
): Promise<void> => {
  const documents = rendered.flatMap((each) =>
    each.kind === 'document' && each.files !== null ? [each] : [],
  );
  await writeFile(
    path.join(clientDir, CLIENT_FILES_PATH.slice(1)),
    JSON.stringify(
      clientFiles(
        new Map(
          documents.flatMap(({ payload, files }) =>
            payload === null || files === null ? [] : [[payload, files]],
          ),
        ),
        documents.map(({ files }) => files ?? []),
      ),
    ),
  );
};

const writeSitemap = async (
  clientDir: string,
  site: string,
  pathnames: readonly string[],
): Promise<void> => {
  await writeFile(
    path.join(clientDir, 'sitemap.xml'),
    sitemap(site, pathnames),
  );
};

/** The type each route.ts's `GET` answered with, by the file it wrote. */
const typesOf = (rendered: readonly Rendered[]): Map<string, string> =>
  new Map(
    rendered.flatMap((each) =>
      each.kind === 'route' && each.type !== null
        ? [[fileAt(each.pathname), each.type] as const]
        : [],
    ),
  );

/** What the build says it wrote, after `k8ordo: wrote `. */
const summaryOf = (
  plan: PathPlan,
  {
    notFound,
    sitemap: listed,
  }: { readonly notFound: boolean; readonly sitemap: boolean },
): string => {
  const shells =
    plan.shells.length === 0
      ? ''
      : `, ${String(plan.shells.length)} ${plan.shells.length === 1 ? 'shell' : 'shells'} (${plan.shells.map((shell) => shell.location).join(', ')})`;
  return `${String(plan.paths.length)} routes${shells}${notFound ? ' and 404.html' : ''}${listed ? ' and sitemap.xml' : ''}${plan.shells.length === 0 ? '' : ' and _redirects'}`;
};

type Written = {
  readonly status: number;
  /** The page itself said notFound(), rather than a schema refusing it. */
  readonly notFound: boolean;
  /** The pattern whose shell the handler said it rendered, if any. */
  readonly shell: string | null;
  /**
   * What the payload of the HTML written needs: the files of the client
   * components it names, and the stylesheets its Server Components link;
   * `null` for what was not written as HTML, or whose handler did not say.
   */
  readonly files: readonly string[] | null;
};

/**
 * Writes the HTML the handler answered, and says with which status. A page's
 * HTML says the nonce the framework signed its scripts with, which the file
 * says as hashes in the application's policy, if it gave one.
 */
const writeHtml = async (
  file: string,
  { handler, csp }: Render,
  url: string,
  {
    notFoundIsPage,
    shell,
  }: {
    readonly notFoundIsPage: boolean;
    /** For a shell: the pattern that has to have answered, or nothing is written. */
    readonly shell?: string;
  },
): Promise<Written> => {
  const response = await handler(new Request(url));
  const notFound = response.headers.has(NOT_FOUND_HEADER);
  const answered = response.headers.get(SHELL_HEADER);
  const written = {
    status: response.status,
    notFound,
    shell: answered,
    files: null,
  };
  // A page that failed to render is not a page, and neither is a 404 anywhere
  // but the not-found's own file: nothing is written, and the caller stops
  // the build with its name.
  if (response.status === 500) {
    console.error(`k8ordo: ${url} — ${await response.text()}`);
    return written;
  }
  if (response.status === 404 && !notFoundIsPage) return written;
  if (shell !== undefined && (response.status !== 200 || answered !== shell)) {
    return written;
  }
  await mkdir(path.dirname(file), { recursive: true });
  const location = response.headers.get('location');
  if (
    (response.status === 307 || response.status === 308) &&
    location !== null
  ) {
    await writeFile(file, redirectPage(location));
    return written;
  }
  const nonce = response.headers.get(NONCE_HEADER);
  if (nonce === null) {
    await writeFile(file, Buffer.from(await response.arrayBuffer()));
    return written;
  }
  await writeFile(file, asFile(await response.text(), nonce, csp));
  const named = response.headers.get(CLIENT_DEPS_HEADER);
  const linked = response.headers.get(SERVER_STYLESHEETS_HEADER);
  return {
    ...written,
    files:
      named === null
        ? null
        : [
            ...readClientDeps(named).flatMap(({ js, css }) => js.concat(css)),
            ...(linked === null ? [] : readServerStylesheets(linked)),
          ],
  };
};

/**
 * Writes the body a 200 answered as it is — a route.ts's file, a payload —
 * and says the type it answered with: a file keeps none, so a static host
 * serves it with the type its extension says, and only an adapter that can
 * name a file's type (`vercel()`) serves the GET's. Anything but a 200 is not
 * a file the site has, and nothing is written.
 */
const writeBody = async (
  file: string,
  handler: Handler,
  url: string,
): Promise<{ readonly status: number; readonly type: string | null }> => {
  const response = await handler(new Request(url));
  if (response.status !== 200) {
    if (response.status === 500) {
      console.error(`k8ordo: ${url} — ${await response.text()}`);
    }
    return { status: response.status, type: null };
  }
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await response.arrayBuffer()));
  return {
    status: response.status,
    type: response.headers.get('content-type'),
  };
};
