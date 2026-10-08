import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import react from '@vitejs/plugin-react';
import rsc from '@vitejs/plugin-rsc';
import type { Logger, Plugin, PluginOption, ViteDevServer } from 'vite';

import { generate } from '../generate/write';
import { FRAMEWORK } from '../host';
import type { EngineOptions, Mode } from '../host';
import { sharedDir } from './shared-dir';

/** What the framework tells the engine about the application it is building. */
export type EngineHost = {
  readonly mode: Mode;
  /** Absolute path of the directory holding `entry.{rsc,ssr,browser}.mjs`. */
  readonly runtimeDir: string;
};

const VIRTUAL_ROUTES = 'virtual:k8ordo/routes';

/**
 * The warning a module gets when the RSC plugin's list of Server Actions is
 * the only thing importing it dynamically. Another dynamic importer beside
 * it keeps the warning, since that one is the application's.
 */
const SERVER_REFERENCES_ONLY =
  /dynamically imported by \S*virtual:vite-rsc\/server-references but /u;
const OUT_DIR = '.k8ordo';

// Vite は package.json の type が module でないアプリで入口を .mjs にするが、
// RSC プラグインは ../ssr/index.js を、静的化・serve・vercel() は
// rsc/index.js を名指しする。.js に固定し、ESM であることは
// dist/package.json が言う
const ESM_ENTRY = '[name].js';

/** Vite's own answer, so nothing downstream can disagree with it. */
const isProduction = (mode: string): boolean =>
  (process.env['NODE_ENV'] ?? process.env['VITE_USER_NODE_ENV'] ?? mode) ===
  'production';

/**
 * Client components reach the browser as RSC references, discovered while
 * rendering rather than by crawling the client entry — so React itself is
 * invisible to the dependency optimizer until it is too late, and the page
 * ends up holding two copies. Declaring them is the framework's job, not
 * the application's.
 */
const CLIENT_DEPS = [
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom',
  'react-dom/client',
];

/**
 * 'use client' のモジュールを持つ、またはそれを再 export する @k8ordo/* は、
 * client の事前バンドルに入れない。どれも入口が 'use client' のモジュールを
 * 束ねる形（@k8ordo/framework は router のそれを再 export する形）で、RSC
 * プラグインは入口から辿ったそれを事前バンドルを通さずファイルのままブラウザに
 * 読ませる。事前バンドルにも入ると、ページにコピーが 2 つ載り、サーバーで描いた
 * Provider の context を client コンポーネントのフックが読めない。アプリが
 * 入れていない名前を挙げても何も起きないので、family のものは全部挙げる
 */
const CLIENT_UNBUNDLED = [
  '@k8ordo/color-scheme',
  '@k8ordo/form',
  FRAMEWORK,
  '@k8ordo/router',
  '@k8ordo/state',
  '@k8ordo/ui',
];

/**
 * The machinery both modes stand on: the route grammar compiled into a
 * table, the RSC pipeline configured, and the execution boundary enforced.
 * The framework's static and server modes add only what makes them
 * different.
 */
export const engine = (
  options: EngineOptions,
  host: EngineHost,
): PluginOption[] => {
  let root = '';
  let routesDir = '';
  let outDir = '';
  let logger: Logger;
  let devServer: ViteDevServer | undefined;
  let generating: Promise<void> = Promise.resolve();
  const runtime = (name: string): string =>
    path.join(host.runtimeDir, `${name}.mjs`);
  const routesModule = (): string => path.join(outDir, 'routes.gen.ts');
  const generateOptions = () => ({ root, routesDir, outDir, mode: host.mode });

  const plugin: Plugin = {
    name: 'k8ordo:engine',
    // Ahead of the RSC plugin's own resolver: the virtual routes module has
    // to resolve to the generated file before anything else claims it.
    enforce: 'pre',

    config(_config, env) {
      return {
        // React's entry picks its build from `process.env.NODE_ENV` at
        // require time. Left unresolved, both builds end up in the bundle
        // and the copy that renders is not always the copy the renderer set
        // its dispatcher on — hooks then fail inside a perfectly ordinary
        // client component.
        //
        // 決め打ちではなく Vite と同じ規則で解く。JSX の変換は Vite の
        // isProduction に従うので、こちらが別の答えを出すと、production の
        // React に jsxDEV を呼ぶ木が渡って描画ごと落ちる(NODE_ENV=test の
        // ビルドで実際に踏んだ)
        define: {
          'process.env.NODE_ENV': JSON.stringify(
            isProduction(env.mode) ? 'production' : 'development',
          ),
          // The handler is the same function in both modes; this is how it
          // knows whether there is a request to hand a page.
          'import.meta.env.K8ORDO_MODE': JSON.stringify(host.mode),
        },
        // The engine's runtime lives in node_modules while the application's
        // pages live in its own tree; without this they resolve React
        // through different chains and the bundle ends up with two copies —
        // one the renderer sets its dispatcher on, one the components read.
        resolve: { dedupe: ['react', 'react-dom'] },
        environments: {
          rsc: {
            build: {
              rolldownOptions: {
                input: { index: runtime('entry.rsc') },
                output: { entryFileNames: ESM_ENTRY },
                onLog(level, log, handle) {
                  // The RSC plugin imports every 'use server' module
                  // dynamically, so a Server Component importing an action
                  // — the ordinary way to hand one to a form — would warn on
                  // every build that the dynamic import moves nothing.
                  if (
                    log.code === 'INEFFECTIVE_DYNAMIC_IMPORT' &&
                    SERVER_REFERENCES_ONLY.test(log.message)
                  ) {
                    return;
                  }
                  handle(level, log);
                },
              },
            },
          },
          ssr: {
            build: {
              rolldownOptions: {
                input: { index: runtime('entry.ssr') },
                output: { entryFileNames: ESM_ENTRY },
              },
            },
          },
          client: {
            optimizeDeps: { include: CLIENT_DEPS, exclude: CLIENT_UNBUNDLED },
            build: {
              rolldownOptions: { input: { index: runtime('entry.browser') } },
            },
          },
        },
      };
    },

    configEnvironment(_name, config) {
      // The RSC plugin is the framework's dependency, not the application's,
      // so the entries it asks the optimizer to prebundle cannot be resolved
      // from the project root. Pointing them through the framework is how it
      // documents framework use.
      const include = config.optimizeDeps?.include;
      if (include !== undefined) {
        config.optimizeDeps = {
          ...config.optimizeDeps,
          include: include.map((entry) =>
            entry.startsWith('@vitejs/plugin-rsc')
              ? `${FRAMEWORK} > ${entry}`
              : entry,
          ),
        };
      }
    },

    configResolved(config) {
      // ページは base の下に置かれ、リンクもペイロードもそこから数える。
      // 相対（'./'）や別オリジンの base では、どの URL がページかが決まらない
      if (!config.base.startsWith('/') || config.base.startsWith('//')) {
        throw new Error(
          `k8ordo serves its pages under Vite's base, so base has to be a path from the root, like '/docs/' — got '${config.base}'`,
        );
      }
      ({ root, logger } = config);
      routesDir = path.resolve(root, options.routesDir ?? 'src/routes');
      outDir = path.resolve(root, OUT_DIR);
    },

    // The `.js` entries are ES modules whatever the application's own
    // package.json says, and a `dist/` copied out of the application has no
    // package.json above it at all. This plugin is `enforce: 'pre'`, so the
    // file is there before the modes' own `post` hooks — static mode imports
    // the handler in one.
    buildApp: {
      // After the RSC plugin's own buildApp, which builds every environment.
      order: 'post',
      async handler(builder) {
        const dirOf = (name: string): string => {
          const out = builder.environments[name]?.config.build.outDir;
          if (out === undefined) {
            throw new Error(`the build ran without the ${name} environment`);
          }
          return path.resolve(root, out);
        };
        // The RSC entry imports the SSR one by a relative path, so the file
        // goes where both are below it. Where that is the application's own
        // directory, or above it, the file there is the application's.
        const shared = sharedDir(dirOf('rsc'), dirOf('ssr'));
        const toRoot = path.relative(shared, root);
        if (!toRoot.startsWith('..') && !path.isAbsolute(toRoot)) {
          throw new Error(
            `the rsc and ssr builds share ${path.relative(root, shared) || '.'}, which holds the application, and the build writes a package.json saying type: module where they meet — put both in a directory of their own, as dist/rsc and dist/ssr`,
          );
        }
        await writeFile(
          path.join(shared, 'package.json'),
          `${JSON.stringify({ type: 'module' }, null, 2)}\n`,
        );
      },
    },

    async buildStart() {
      const { problems } = await generate(generateOptions());
      // this.error は投げるので、1 件ずつ渡すと最初の 1 件しか出ない。文法は
      // 全部集めて返してくるのだから、全部見せる。
      if (problems.length > 0) {
        this.error(
          `routes/ is not a valid pathname space:\n${problems
            .map((problem) => `  routes/${problem.path}: ${problem.message}`)
            .join('\n')}`,
        );
      }
    },

    configureServer(server) {
      server.watcher.add(routesDir);
      devServer = server;
    },

    // Vite waits for this hook before it moves a change through the module
    // graph. A route file deleted while the old table still imports it would
    // otherwise be re-imported from that table, and fail, before the table
    // caught up. A file gaining or losing its `paramsSchema` export changes
    // the table too; writeIfChanged keeps an edit that changed nothing from
    // restarting HMR.
    async watchChange(file) {
      // `routes` と `routes-x` を取り違えないよう、区切りまで含めて見る
      if (!path.resolve(file).startsWith(`${routesDir}${path.sep}`)) return;
      // One at a time: Vite does not wait for one change before the next, and
      // a run that read the directory before a deletion would otherwise write
      // its table after the deletion's own.
      const run = generating.then(() => generate(generateOptions()));
      generating = run.then(
        () => undefined,
        () => undefined,
      );
      const { problems } = await run;
      for (const problem of problems) {
        logger.error(`routes/${problem.path}: ${problem.message}`);
      }
      // The update that follows only soft-invalidates the table, as an
      // importer of the file that changed: it keeps the code it compiled
      // from the old table, imports of a deleted file included.
      for (const environment of Object.values(devServer?.environments ?? {})) {
        const { moduleGraph } = environment;
        for (const module of moduleGraph.getModulesByFile(routesModule()) ??
          []) {
          moduleGraph.invalidateModule(module);
        }
      }
    },

    resolveId(source) {
      if (source === VIRTUAL_ROUTES) {
        // Resolves to the real generated file rather than an in-memory
        // module, so the table is something a person can open, TypeScript can
        // check, and HMR can invalidate like any other source.
        return routesModule();
      }
      return null;
    },
  };

  // React 自身のプラグインはフレームワークが持つ。無くてもビルドは通るが、
  // クライアントコンポーネントの編集が Fast Refresh ではなくページ再読み込みに
  // なる。アプリごとに書き忘れても気づけない類の配線なので、ここに置く。
  return [react(), rsc(), plugin];
};
