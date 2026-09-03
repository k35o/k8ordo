import path from 'node:path';
import { fileURLToPath } from 'node:url';

import rsc from '@vitejs/plugin-rsc';
import type { Plugin, PluginOption } from 'vite';

import { generate } from '../generate/write';

export type EngineOptions = {
  /** Where the route files live, relative to the project root. */
  readonly routesDir?: string;
};

const VIRTUAL_ROUTES = 'virtual:k8ordo/routes';
const OUT_DIR = '.k8ordo';

const runtime = (name: string): string =>
  fileURLToPath(new URL(`../runtime/${name}.mjs`, import.meta.url));

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

const SERVER_ONLY = /\.server(\.[cm]?[jt]sx?)?$/u;

/**
 * The machinery both modes stand on: the route grammar compiled into a
 * table, the RSC pipeline configured, and the execution boundary enforced.
 * `@k8ordo/static` and `@k8ordo/server` add only what makes them different.
 */
export const engine = (options: EngineOptions = {}): PluginOption[] => {
  let root = '';
  let routesDir = '';
  let outDir = '';

  const plugin: Plugin = {
    name: 'k8ordo:engine',
    // Ahead of the RSC plugin's own resolver, so a server-only import is
    // refused before anything else gets a chance to accept it.
    enforce: 'pre',

    config(_config, env) {
      return {
        // React's entry picks its build from `process.env.NODE_ENV` at
        // require time. Left unresolved, both builds end up in the bundle
        // and the copy that renders is not always the copy the renderer set
        // its dispatcher on — hooks then fail inside a perfectly ordinary
        // client component.
        define: {
          'process.env.NODE_ENV': JSON.stringify(
            env.command === 'build' && env.mode !== 'development'
              ? 'production'
              : 'development',
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
              rollupOptions: { input: { index: runtime('entry.rsc') } },
            },
          },
          ssr: {
            resolve: { noExternal: ['@k8ordo/framework-engine'] },
            build: {
              rollupOptions: { input: { index: runtime('entry.ssr') } },
            },
          },
          client: {
            optimizeDeps: { include: CLIENT_DEPS },
            build: {
              rollupOptions: { input: { index: runtime('entry.browser') } },
            },
          },
        },
      };
    },

    configResolved(config) {
      root = config.root;
      routesDir = path.resolve(root, options.routesDir ?? 'src/routes');
      outDir = path.resolve(root, OUT_DIR);
    },

    async buildStart() {
      const { problems } = await generate({ root, routesDir, outDir });
      for (const problem of problems) {
        this.error(`routes/${problem.path}: ${problem.message}`);
      }
    },

    configureServer(server) {
      server.watcher.add(routesDir);
      const regenerate = async (file: string): Promise<void> => {
        if (!file.startsWith(routesDir)) return;
        const { problems } = await generate({ root, routesDir, outDir });
        for (const problem of problems) {
          server.config.logger.error(
            `routes/${problem.path}: ${problem.message}`,
          );
        }
      };
      server.watcher.on('add', regenerate);
      server.watcher.on('unlink', regenerate);
    },

    resolveId(source, importer) {
      if (source === VIRTUAL_ROUTES) {
        // Resolves to the real generated file rather than an in-memory
        // module, so the table is something a person can open, TypeScript can
        // check, and HMR can invalidate like any other source.
        return path.join(outDir, 'routes.gen.ts');
      }
      if (
        this.environment.name === 'client' &&
        importer !== undefined &&
        SERVER_ONLY.test(source.split('?')[0] as string)
      ) {
        this.error(
          `"${source}" is server-only and cannot be reached from the client — imported by ${path.relative(root, importer)}`,
        );
      }
      return null;
    },

    generateBundle(_options, bundle) {
      if (this.environment.name !== 'client') return;
      // The authoritative check. Resolution can be intercepted, and a client
      // component's graph is assembled by the RSC plugin rather than crawled
      // from the client entry — so the promise is kept where nothing is left
      // to interpret: the modules that actually made it into the bundle.
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk') continue;
        for (const id of chunk.moduleIds) {
          if (!SERVER_ONLY.test(id.split('?')[0] as string)) continue;
          const importers = this.getModuleInfo(id)?.importers ?? [];
          const via = importers
            .map((importer) => path.relative(root, importer))
            .join(', ');
          this.error(
            `${path.relative(root, id)} is server-only but reached the client bundle${via === '' ? '' : ` — imported by ${via}`}`,
          );
        }
      }
    },
  };

  return [rsc(), plugin];
};
