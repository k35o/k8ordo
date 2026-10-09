import { mkdir, readdir, writeFile, readFile } from 'node:fs/promises';
import type { ServerResponse } from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
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
  readExports,
  REEXPORTS_ALL,
  ROUTE_METHODS,
  scanRoutes,
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
import type { Connect, Logger, Plugin, ResolvedConfig } from 'vite';

import { asFile, policyProblems, redirectPage, sitemap } from './documents';
import type { ContentSecurityPolicy } from './documents';
import {
  answeredByRoute,
  catchAllPath,
  catchAllPatterns,
  dirFor,
  patternsNeedingPaths,
  planPaths,
  planRefusals,
  shadowedShells,
} from './paths';
import type { Shell } from './paths';
import {
  builtRules,
  cloudflareCounts,
  cloudflareMatches,
  formatRedirects,
  rewriteFor,
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
   * Pathnames for routes with parameters, in the table's terms — without
   * Vite's `base`. Static rendering cannot invent them, and a build that
   * quietly skipped half the site would be worse than one that refuses.
   *
   * The patterns that need covering are handed in, so a site whose parameter
   * takes the same values everywhere — a locale segment, say — expands them
   * rather than listing every page twice.
   *
   * For a page with a `fallback.tsx` beside it, a pathname that still holds
   * a parameter (`/ja/posts/:id`) is where its shell stands: the values the
   * build did not write are answered there. Without one, the bare pattern
   * is the shell's location.
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
 * place: `vercel()`'s `api.writeStatic` is handed it.
 */
export type StaticOutput = {
  readonly root: string;
  /** The client build, absolute: the files to publish. */
  readonly client: string;
  readonly base: string;
  /**
   * The rewrites a host applies only when no file answers: the payload URL
   * of a built URL that is not a page answered with HTML, then the shells'
   * rules — `_redirects`' order, its built URLs' own rules aside.
   */
  readonly rewrites: readonly Rewrite[];
  /** Whether `404.html` was written. */
  readonly notFound: boolean;
};

/** What the plugin `vercel()` adds lends the static build. */
type VercelApi = {
  readonly writeStatic?: (output: StaticOutput) => void | Promise<void>;
};

/** What `vite dev` reads of the routes: the tree, and its shells' shapes. */
type DevRoutes = {
  readonly tree: RouteDir;
  readonly failed: boolean;
  readonly shapes: readonly FallbackShape[];
};

/** What `vite dev` reads of `paths`: what the build would write. */
type DevShells = {
  readonly paths: ReadonlySet<string>;
  readonly shells: readonly Shell[];
};

const NO_SHELLS: DevShells = { paths: new Set(), shells: [] };

/**
 * What ends a tag's name in HTML: `</script` followed by anything else is
 * still the script's text.
 */
const ENDS_TAG_NAME = new Set(['\t', '\n', '\f', '\r', ' ', '/', '>']);

/** Where the next `<script` or `</script` tag starts, in any case. */
const tagAt = (html: string, tag: string, from: number): number => {
  for (
    let at = html.indexOf('<', from);
    at !== -1;
    at = html.indexOf('<', at + 1)
  ) {
    if (
      html.slice(at, at + tag.length).toLowerCase() === tag &&
      ENDS_TAG_NAME.has(html.charAt(at + tag.length))
    ) {
      return at;
    }
  }
  return -1;
};

/**
 * Whether `text` is in the HTML outside its script elements — what a layout
 * wrote into the page, not the payload the page hydrates from. Scanned rather
 * than stripped with a pattern: an end tag may be `</SCRIPT >`, and a pattern
 * that misses one swallows the page up to the next script's.
 */
const outsideScripts = (html: string, text: string): boolean => {
  for (let from = 0; ;) {
    const open = tagAt(html, '<script', from);
    const written = open === -1 ? html.slice(from) : html.slice(from, open);
    if (written.includes(text)) return true;
    if (open === -1) return false;
    const close = tagAt(html, '</script', open + 1);
    if (close === -1) return false;
    const end = html.indexOf('>', close);
    if (end === -1) return false;
    from = end + 1;
  }
};

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
  // The plugin list the RSC pipeline's registry is reached through, kept the
  // way `root` is: empty until Vite resolves the config, which is before any
  // module is compiled.
  let plugins: ResolvedConfig['plugins'] = [];
  // Who imports the request API, found while the environments build and
  // named once they have — no module graph lists an import by the specifier
  // it was written as.
  const serverImporters = new Set<string>();

  // vite dev: what the routes and `paths` say, read once per change. `paths`
  // is called only for an application with a fallback.tsx, and again only
  // when the patterns handed to it changed.
  let routesRead: Promise<DevRoutes> | undefined;
  let shellsRead: Promise<DevShells> | undefined;
  let suppliedFor: string | undefined;
  let suppliedInDev: Promise<readonly string[]> = Promise.resolve([]);
  const noticed = new Set<string>();

  const devRoutes = (): Promise<DevRoutes> =>
    (routesRead ??= (async () => {
      const { tree, problems } = parseRouteTree(await scanRoutes(routesDir));
      const failed = problems.length > 0;
      return { tree, failed, shapes: failed ? [] : fallbackShapes(tree) };
    })());

  const devShells = (): Promise<DevShells> =>
    (shellsRead ??= (async () => {
      const { tree } = await devRoutes();
      const patterns = patternsNeedingPaths(tree);
      const key = JSON.stringify(patterns);
      if (key !== suppliedFor) {
        suppliedFor = key;
        noticed.clear();
        suppliedInDev = (async () => (await options.paths?.(patterns)) ?? [])();
      }
      let given: readonly string[];
      try {
        given = await suppliedInDev;
      } catch (error) {
        // 次の変更でもう一度呼ぶ
        suppliedFor = undefined;
        logger?.error(
          `k8ordo: the "paths" option failed, so vite dev renders every value with page.tsx: ${messageOf(error)}`,
        );
        return NO_SHELLS;
      }
      const plan = planPaths(tree, given);
      for (const refusal of planRefusals(
        plan,
        shadowedShells(tree, plan.shells, new Set(plan.paths)),
      )) {
        logger?.warn(`k8ordo: the build will refuse "paths": ${refusal}`);
      }
      return { paths: new Set(plan.paths), shells: plan.shells };
    })());

  /**
   * Under `vite dev`, a value of a fallback.tsx's pattern that `paths` does
   * not list is answered with the shell, as a host's rule answers it — so it
   * can be tried locally. The URL is rewritten to the shell pathname before
   * the RSC plugin's handler reads it; everything else passes untouched.
   */
  const answerUnbuilt = async (
    request: Connect.IncomingMessage,
    next: Connect.NextFunction,
  ): Promise<void> => {
    try {
      await rewriteUnbuilt(request);
    } catch (error) {
      next(error);
      return;
    }
    next();
  };

  const rewriteUnbuilt = async (
    request: Connect.IncomingMessage,
  ): Promise<void> => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return;
    }
    // RSC プラグインと同じく originalUrl を読む。base はそちらに残っている
    const url = new URL(
      request.originalUrl ?? request.url ?? '/',
      'http://k8ordo.localhost',
    );
    const own = withoutBase(url.pathname, base);
    if (own === null) {
      return;
    }
    const payload = isPayloadPath(own);
    const page = payload ? pagePathFor(own) : own;
    const routes = await devRoutes();
    if (routes.failed || routes.shapes.length === 0) {
      return;
    }
    // 殻の形に合わない URL は、遅い paths を待たせない
    if (
      !routes.shapes.some((shape) =>
        new URLPattern({ pathname: shape.pattern }).test({ pathname: page }),
      )
    ) {
      return;
    }
    const state = await devShells();
    if (state.shells.length === 0) {
      return;
    }
    const pathname = normalizePathname(page);
    if (
      state.paths.has(pathname) ||
      pathname
        .split('/')
        .some((segment) => decodePathname(segment) === FALLBACK_SEGMENT)
    ) {
      return;
    }
    // ホストと同じ規則を同じ順に試す。殻を渡された順に試すと、具体的な場所を
    // 先に並べた _redirects とは別の殻で答えることがある。ペイロードもページの
    // pathname で比べるので、文書の規則だけで足りる
    const answered = shellRules(state.shells, '/')
      .filter((rule) => rule.to.endsWith('/'))
      .find((rule) => rewriteFor([rule], page) !== null);
    if (answered === undefined) {
      return;
    }
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
    if (fallback !== undefined && !noticed.has(fallback)) {
      noticed.add(fallback);
      logger?.info(
        `k8ordo: ${pathname} is not in "paths", so vite dev answers it with ${fallback}'s shell — list it in "paths" to render page.tsx`,
      );
    }
  };

  /**
   * Writes `dist/client/_redirects` once every file is in place — the
   * built URLs a shell rule would also catch, the application's own rules
   * from `public/_redirects`, then the shells' — and says what a host would
   * get wrong reading it. Returns the rewrites a host adapter applies after
   * its files: the payload URLs of built non-pages, then the shells'.
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
  }): Promise<Rewrite[]> => {
    const warn = (message: string): void => {
      logger?.warn(message);
    };
    const shellRewrites = shellRules(shells, base);
    // dist/client/ のものは、emptyOutDir: false なら前のビルドが重ねた後の
    // ファイルが残っている。アプリのものは public から読む
    const ownFile =
      publicDir === null ? null : path.join(publicDir, '_redirects');
    let own: string | null = null;
    if (ownFile !== null) {
      try {
        own = await readFile(ownFile, 'utf8');
      } catch {
        own = null;
      }
    }
    const ownRules = own === null ? [] : rulesOf(own);
    const hiding = ownRules.flatMap(({ line, from }) => {
      if (!from.includes('*') && !/:[A-Za-z]/u.test(from)) return [];
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
    for (const message of hiding) warn(message);
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
        : `"${/:[A-Za-z]\w*/u.exec(from)?.[0] ?? ':'}" as a placeholder`;
      warn(
        `k8ordo: _redirects cannot list ${from} — Cloudflare and Netlify read ${read}, so on Cloudflare a shell answers it`,
      );
    }
    const text = formatRedirects(built.rules, own, shellRewrites);
    await writeFile(path.join(clientDir, '_redirects'), text);
    const counted = cloudflareCounts(text);
    if (counted.static > 2000) {
      warn(
        `k8ordo: _redirects has ${String(counted.static)} rules Cloudflare counts as static; it reads 2,000 and skips the rest, so a built page past them is answered by its shell there`,
      );
    }
    if (counted.dynamic > 100) {
      warn(
        `k8ordo: _redirects has ${String(counted.dynamic)} rules Cloudflare counts as dynamic; it reads 100 and ignores the rest of the file — the shell payload rules go first (navigations to those values become document loads), then document rules (those values 404)`,
      );
    }
    // ファイルが先に答えるホストには、ページでない URL のペイロードの規則だけが要る
    return [
      ...built.rules.filter(
        (rule) => rule.from.endsWith('/index.rsc') && rule.to.endsWith('/'),
      ),
      ...shellRewrites,
    ];
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
        void devRoutes()
          .then((routes) =>
            routes.shapes.length > 0 ? devShells() : undefined,
          )
          .catch(() => undefined);
        return () => {
          server.middlewares.use((request, _response, next) => {
            void answerUnbuilt(request, next);
          });
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
        config.environments['client']?.build.outDir ?? 'dist/client',
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
      server.middlewares.use((request, response, next) => {
        void (async () => {
          let answered: boolean;
          try {
            answered = await answeredHere(request, response);
          } catch (error) {
            next(error);
            return;
          }
          if (!answered) next();
        })();
      });
    },

    watchChange(file) {
      // `routes` と `routes-x` を取り違えないよう、区切りまで含めて見る
      if (!path.resolve(file).startsWith(`${routesDir}${path.sep}`)) return;
      routesRead = undefined;
      shellsRead = undefined;
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
          ? exportsOf(await readFile(module, 'utf8'))
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
        const supplied =
          (await options.paths?.(patternsNeedingPaths(tree))) ?? [];
        const plan = planPaths(tree, supplied);
        const catchAlls = catchAllPatterns(tree);
        const unplanned = [
          ...planRefusals(
            plan,
            shadowedShells(tree, plan.shells, new Set(plan.paths)),
          ),
          ...(catchAlls.length > 1
            ? [
                `a static host answers every unknown URL from one file, so only one not-found.tsx can be represented — this table declares ${catchAlls.join(', ')}`,
              ]
            : []),
        ];
        if (unplanned.length > 0) throw new Error(unplanned.join('\n\n'));

        // A file cannot receive a POST. The RSC pipeline compiles an action
        // in either mode, so the mode's promise only holds if the build says
        // no — before writing an application whose form posts into nothing.
        // The request API compiles in either mode as well, for the same
        // reason refused by name.
        const actions = serverActionModules(builder.config);
        const importers = [...serverImporters].toSorted();
        const unanswerable = [
          ...(actions.length > 0 ? [actionRefusal(actions)] : []),
          ...(importers.length > 0 ? [serverImportRefusal(importers)] : []),
        ];
        if (unanswerable.length > 0) {
          throw new Error(unanswerable.join('\n\n'));
        }

        const rscOut = builder.environments['rsc']?.config.build.outDir;
        const client = builder.environments['client']?.config;
        if (rscOut === undefined || client === undefined) {
          throw new Error('static build ran without the rsc/client builds');
        }

        // outDir はすでに絶対パスのことがあるので resolve で受ける
        const clientDir = path.resolve(root, client.build.outDir);
        // ページは表の pathname で数え、ハンドラには base を付けた URL で頼む。
        // 書き出す先は client/ の中の表の pathname（client/ が base に置かれる）
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
        // 殻もディレクトリとして書くので、route.ts のファイルの下に来てはいけない
        const directories = [
          ...plan.paths,
          ...plan.shells.map((shell) => shell.pathname),
        ];
        const unfileable = [...byRoute].flatMap((route) => {
          if (route === '/') {
            return [`${route} — a static host serves / from index.html`];
          }
          const below = directories.find((pathname) =>
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
                  csp,
                  { notFoundIsPage: false },
                );
                if (status === 404) {
                  (notFound ? disowned : refused).push(pathname);
                }
                if (status === 500) failed.push(pathname);
                if (status === 307 || status === 308) redirected.add(pathname);
                // Only a page has a payload. A client navigation to a redirect
                // finds nothing at index.rsc and hands the URL to the browser,
                // which loads the HTML above and follows it.
                if (status === 200) {
                  await write(
                    path.join(dir, 'index.rsc'),
                    handler,
                    urlFor(payloadPathFor(pathname)),
                    csp,
                    { notFoundIsPage: false },
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
            csp,
            { notFoundIsPage: true },
          );
          if (status === 500) failed.push('404.html');
        }

        // A value the build did not write is answered by its fallback.tsx's
        // shell: rendered once for the shell pathname, HTML and payload,
        // where a host's rule finds it. Only an answer that says it is this
        // pattern's shell is written — the table walks in its own order.
        const fallbacks = new Map(
          fallbackShapes(tree).map((shape) => [shape.pattern, shape.file]),
        );
        const shellRefused: string[] = [];
        const shellDisowned: string[] = [];
        const shellTaken: string[] = [];
        await inParallel(
          plan.shells.map((shell) => async () => {
            const dir = path.join(clientDir, dirFor(shell.pathname));
            const answered = await write(
              path.join(dir, 'index.html'),
              handler,
              urlFor(shell.pathname),
              csp,
              { notFoundIsPage: false, shell: shell.pattern },
            );
            const named = `${shell.location} (${fallbacks.get(shell.pattern) ?? ''})`;
            if (answered.status === 500) {
              failed.push(shell.location);
            } else if (answered.status === 404) {
              (answered.notFound ? shellDisowned : shellRefused).push(
                shell.location,
              );
            } else if (answered.shell === null) {
              shellTaken.push(
                `the shell for ${named} was answered by another route, which took "${FALLBACK_SEGMENT}" as a value`,
              );
            } else if (answered.shell === shell.pattern) {
              await write(
                path.join(dir, 'index.rsc'),
                handler,
                urlFor(payloadPathFor(shell.pathname)),
                csp,
                { notFoundIsPage: false, shell: shell.pattern },
              );
            } else {
              shellTaken.push(
                `the shell for ${named} was answered by ${fallbacks.get(answered.shell) ?? answered.shell}, which the table tries first — supply shell locations that pattern cannot match`,
              );
            }
          }),
        );
        // Each kind is a different mistake, and fixing one should not be
        // what reveals the next.
        const unwritten = [
          ...(failed.length > 0
            ? [
                `static build could not render ${failed.toSorted().join(', ')} — see the error above`,
              ]
            : []),
          ...(unanswered.length > 0
            ? [
                `static build writes a route.ts from a GET that answers 200, and these did not: ${unanswered.toSorted().join(', ')}`,
              ]
            : []),
          ...(refused.length > 0
            ? [
                `the "paths" option supplied pathnames a params schema refused: ${refused.toSorted().join(', ')}`,
              ]
            : []),
          ...(disowned.length > 0
            ? [
                `the "paths" option supplied pathnames whose page called notFound(): ${disowned.toSorted().join(', ')}`,
              ]
            : []),
          ...(shellRefused.length > 0
            ? [
                `the "paths" option supplied shell locations a params schema refused: ${shellRefused.toSorted().join(', ')}`,
              ]
            : []),
          ...(shellDisowned.length > 0
            ? [
                shellDisowned
                  .toSorted()
                  .map(
                    (location) =>
                      `the shell for ${location} called notFound() while it rendered, and a shell has no value to disown — call notFound() from the client component that reads the value in the browser`,
                  )
                  .join('\n'),
              ]
            : []),
          ...(shellTaken.length > 0 ? [shellTaken.toSorted().join('\n')] : []),
        ];
        if (unwritten.length > 0) throw new Error(unwritten.join('\n\n'));

        // Every layout renders a shell with the shell pathname as `pathname`.
        // What one wrote of it into the page is the same for every value the
        // shell answers — a link, a canonical URL — so the build says so.
        const leaking = await Promise.all(
          plan.shells.map(async (shell) => {
            const html = await readFile(
              path.join(clientDir, dirFor(shell.pathname), 'index.html'),
              'utf8',
            );
            return outsideScripts(html, FALLBACK_SEGMENT)
              ? [shell.location]
              : [];
          }),
        );
        for (const location of leaking.flat()) {
          builder.config.logger.warn(
            `k8ordo: the shell for ${location} has "${FALLBACK_SEGMENT}" in its HTML — a layout wrote the shell's pathname into the page (a link, a canonical URL); derive what depends on the URL in a client component`,
          );
        }

        // The build knows every page it wrote, which is what a sitemap is.
        // Redirects and route.ts files are not pages, a not-found is not a
        // URL to offer, and a shell is not one either — it stands for values
        // the build never saw.
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

        const rewrites =
          plan.shells.length === 0
            ? []
            : await writeRedirects({
                clientDir,
                shells: plan.shells,
                notPages: [...redirected, ...byRoute],
                publicDir:
                  client.build.copyPublicDir && builder.config.publicDir !== ''
                    ? builder.config.publicDir
                    : null,
              });

        const vercel = builder.config.plugins.find(
          (plugin) => plugin.name === 'k8ordo:vercel',
        );
        // Vite の型では api は any なので、静的ビルドが呼ぶ形をここで言う
        const writeStatic = (vercel?.api as VercelApi | undefined)?.writeStatic;
        if (writeStatic !== undefined) {
          await writeStatic({
            root,
            client: clientDir,
            base,
            rewrites,
            notFound: unmatched !== null,
          });
        } else if (
          vercel === undefined &&
          process.env['VERCEL'] !== undefined &&
          plan.shells.length > 0
        ) {
          builder.config.logger.warn(
            'k8ordo: this build runs on Vercel, which does not read _redirects — add vercel() from @k8ordo/framework/vercel, or the shells are never served',
          );
        }

        const shells =
          plan.shells.length === 0
            ? ''
            : `, ${String(plan.shells.length)} ${plan.shells.length === 1 ? 'shell' : 'shells'} (${plan.shells.map((shell) => shell.location).join(', ')})`;
        builder.config.logger.info(
          `k8ordo: wrote ${String(plan.paths.length)} routes${shells}${unmatched === null ? '' : ' and 404.html'}${options.site === undefined ? '' : ' and sitemap.xml'}${plan.shells.length === 0 ? '' : ' and _redirects'}`,
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
        const exported = await readExports(routesDir, files);
        const routes = [...exported]
          .filter(([file]) => slotOf(file) === 'route')
          .map(([file, names]) => [named(file), unwritable(names)] as const)
          .filter(([, methods]) => methods.length > 0);
        const searching = [...pagesReadingSearch(exported)].map((file) =>
          named(file),
        );
        const reexporting = [...exported]
          .filter(
            ([file, names]) =>
              READ_BY_NAME.has(slotOf(file) ?? '') && names.has(REEXPORTS_ALL),
          )
          .map(([file]) => named(file));
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
  /** The pattern whose shell the handler said it rendered, if any. */
  readonly shell: string | null;
};

/**
 * Writes what the handler answered, and says with which status. A page's
 * HTML says the nonce the framework signed its scripts with, which the file
 * says as hashes in the application's policy, if it gave one.
 */
const write = async (
  file: string,
  handler: Handler,
  url: string,
  csp: ContentSecurityPolicy | undefined,
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
  const written = { status: response.status, notFound, shell: answered };
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
  } else {
    await writeFile(file, asFile(await response.text(), nonce, csp));
  }
  return written;
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
