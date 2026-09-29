import { mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createBuilder } from 'vite';

import { engine } from '../src/plugin/core';

type Handler = (request: Request) => Promise<Response>;

export type BuiltFixture = {
  readonly handler: Handler;
  /** Where the build went: `rsc/`, `ssr/` and `client/` below it. */
  readonly out: string;
  readonly dispose: () => Promise<void>;
};

/**
 * Builds the application under `fixtures/<name>/` as `@k8ordo/server` builds
 * one, and imports the handler it wrote. The runtime is this package's
 * source, not `dist`, so a fix to the runtime is what gets tried.
 */
export const buildFixture = async (name: string): Promise<BuiltFixture> => {
  const root = fileURLToPath(new URL(`./${name}/`, import.meta.url));
  const out = path.join(root, 'dist');
  const runtimeDir = await mkdtemp(path.join(tmpdir(), 'k8ordo-runtime-'));
  // 再エクスポートするだけの .mjs では、このパッケージの sideEffects: false
  // によって、何も export しない entry.browser が丸ごと落とされる。リンクなら
  // Vite が実体へ解決し、ソースそのものがエントリになる
  await Promise.all(
    ['entry.rsc', 'entry.ssr', 'entry.browser'].map((entry) =>
      symlink(
        fileURLToPath(new URL(`../src/runtime/${entry}.tsx`, import.meta.url)),
        path.join(runtimeDir, `${entry}.mjs`),
      ),
    ),
  );

  const builder = await createBuilder({
    root,
    configFile: false,
    logLevel: 'error',
    plugins: [
      engine({ routesDir: 'routes' }, { via: '@k8ordo/server', runtimeDir }),
    ],
    environments: {
      rsc: { build: { outDir: path.join(out, 'rsc') } },
      ssr: { build: { outDir: path.join(out, 'ssr') } },
      client: { build: { outDir: path.join(out, 'client') } },
    },
  });
  await builder.buildApp();

  const { default: handler } = (await import(
    pathToFileURL(path.join(out, 'rsc', 'index.js')).href
  )) as { default: Handler };
  return {
    handler,
    out,
    dispose: async () => {
      await rm(runtimeDir, { recursive: true, force: true });
      await rm(out, { recursive: true, force: true });
    },
  };
};
