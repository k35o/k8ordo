import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import rsc from '@vitejs/plugin-rsc';
import type { Plugin, PluginOption } from 'vite';

import { generate } from '../generate/write';

export type EngineOptions = {
  /** Where the route files live, relative to the project root. */
  readonly routesDir?: string;
};

/**
 * The package the application actually installed. Under a strict node_modules
 * layout only that name is resolvable from the project root, so anything this
 * package asks the optimizer to prebundle has to be addressed through it.
 */
export type EngineHost = {
  readonly via: string;
};

const VIRTUAL_ROUTES = 'virtual:k8ordo/routes';
const OUT_DIR = '.k8ordo';

const runtime = (name: string): string =>
  fileURLToPath(new URL(`../runtime/${name}.mjs`, import.meta.url));

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
  '@k8ordo/router',
];

/**
 * The machinery both modes stand on: the route grammar compiled into a
 * table, the RSC pipeline configured, and the execution boundary enforced.
 * `@k8ordo/static` and `@k8ordo/server` add only what makes them different.
 */
export const engine = (
  options: EngineOptions,
  host: EngineHost,
): PluginOption[] => {
  let root = '';
  let routesDir = '';
  let outDir = '';

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
        },
        // The engine's runtime lives in node_modules while the application's
        // pages live in its own tree; without this they resolve React
        // through different chains and the bundle ends up with two copies —
        // one the renderer sets its dispatcher on, one the components read.
        resolve: { dedupe: ['react', 'react-dom'] },
        environments: {
          rsc: {
            resolve: { noExternal: ['@k8ordo/framework-engine'] },
            build: {
              rolldownOptions: { input: { index: runtime('entry.rsc') } },
            },
          },
          ssr: {
            resolve: { noExternal: ['@k8ordo/framework-engine'] },
            build: {
              rolldownOptions: { input: { index: runtime('entry.ssr') } },
            },
          },
          client: {
            optimizeDeps: { include: CLIENT_DEPS },
            build: {
              rolldownOptions: { input: { index: runtime('entry.browser') } },
            },
          },
        },
      };
    },

    configEnvironment(_name, config) {
      // The RSC plugin is this package's dependency, not the application's,
      // so the entries it asks the optimizer to prebundle cannot be resolved
      // from the project root. Pointing them through this package is how it
      // documents framework use.
      const include = config.optimizeDeps?.include;
      if (include !== undefined) {
        config.optimizeDeps = {
          ...config.optimizeDeps,
          include: include.map((entry) =>
            entry.startsWith('@vitejs/plugin-rsc')
              ? `${host.via} > @k8ordo/framework-engine > ${entry}`
              : entry,
          ),
        };
      }
    },

    configResolved(config) {
      ({ root } = config);
      routesDir = path.resolve(root, options.routesDir ?? 'src/routes');
      outDir = path.resolve(root, OUT_DIR);
    },

    async buildStart() {
      const { problems } = await generate({ root, routesDir, outDir });
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
      const regenerate = (file: string): void => {
        // `routes` と `routes-x` を取り違えないよう、区切りまで含めて見る
        if (!file.startsWith(`${routesDir}${path.sep}`)) return;
        void (async () => {
          const { problems } = await generate({ root, routesDir, outDir });
          for (const problem of problems) {
            server.config.logger.error(
              `routes/${problem.path}: ${problem.message}`,
            );
          }
        })();
      };
      server.watcher.on('add', (file: string) => {
        regenerate(file);
      });
      server.watcher.on('unlink', (file: string) => {
        regenerate(file);
      });
    },

    resolveId(source) {
      if (source === VIRTUAL_ROUTES) {
        // Resolves to the real generated file rather than an in-memory
        // module, so the table is something a person can open, TypeScript can
        // check, and HMR can invalidate like any other source.
        return path.join(outDir, 'routes.gen.ts');
      }
      return null;
    },
  };

  // React 自身のプラグインはフレームワークが持つ。無くてもビルドは通るが、
  // クライアントコンポーネントの編集が Fast Refresh ではなくページ再読み込みに
  // なる。アプリごとに書き忘れても気づけない類の配線なので、ここに置く。
  return [react(), rsc(), plugin];
};
