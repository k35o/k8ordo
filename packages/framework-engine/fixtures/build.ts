import { mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createBuilder, createLogger } from 'vite';

import { engine } from '../src/plugin/core';

type Handler = (request: Request) => Promise<Response>;

export type BuiltFixture = {
  readonly handler: Handler;
  /** Where the build went: `rsc/`, `ssr/` and `client/` below it. */
  readonly out: string;
  /** What the build warned about, as Vite would have printed it. */
  readonly warnings: readonly string[];
  /** Removes the build, once every request the handler took is answered. */
  readonly dispose: () => Promise<void>;
};

/**
 * Builds the application under `fixtures/<name>/` as mode: 'server' builds
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

  const warnings: string[] = [];
  const logger = createLogger('error');
  const builder = await createBuilder({
    root,
    configFile: false,
    logLevel: 'error',
    // 警告は出さずに数えておく
    customLogger: {
      ...logger,
      warn: (message) => {
        warnings.push(message);
      },
      warnOnce: (message) => {
        warnings.push(message);
      },
    },
    plugins: [engine({ routesDir: 'routes' }, { mode: 'server', runtimeDir })],
    // 生成された表は @k8ordo/framework/generated から読むが、このパッケージは
    // それに同梱される側なので依存に持てない。その入口は router の再 export
    // だけなので、router を直接読ませる。search を読むページの表が import
    // する @k8ordo/state も依存に無いので、フィクスチャの読み方に差し替える
    resolve: {
      alias: {
        '@k8ordo/framework/generated': '@k8ordo/router',
        '@k8ordo/state': fileURLToPath(new URL('./state.ts', import.meta.url)),
      },
    },
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
  const answers: Array<Promise<Response>> = [];
  return {
    handler: (request) => {
      const answer = handler(request);
      answers.push(answer);
      return answer;
    },
    out,
    warnings,
    dispose: async () => {
      // 打ち切られたテストのリクエストは、まだ答えている途中のことがある。
      // 先に出力を消すと、その描画が読みに行ったチャンクが見つからず、
      // 打ち切りの隣に「Cannot find module」が並んで出力が壊れたように見える
      await Promise.allSettled(answers);
      await rm(runtimeDir, { recursive: true, force: true });
      await rm(out, { recursive: true, force: true });
    },
  };
};
