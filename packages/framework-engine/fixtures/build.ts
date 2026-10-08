import { mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createBuilder, createLogger } from 'vite';

import type { Mode } from '../src/host';
import { engine } from '../src/plugin/core';

type Handler = (request: Request) => Promise<Response>;

export type BuiltFixture = {
  readonly handler: Handler;
  /** The mode the handler says it was built for (`entry.rsc`'s `mode`). */
  readonly mode: string;
  /** Where the build went: `rsc/`, `ssr/` and `client/` below it. */
  readonly out: string;
  /** What the build warned about, as Vite would have printed it. */
  readonly warnings: readonly string[];
  /** Removes the build, once every request the handler took is answered. */
  readonly dispose: () => Promise<void>;
};

/**
 * Builds the application under `fixtures/<name>/` as the mode builds one —
 * `'server'` unless told — and imports the handler it wrote. The runtime is
 * this package's source, not `dist`, so a fix to the runtime is what gets
 * tried. A static build goes to `dist-static/`, so a test file building the
 * same fixture in the other mode runs beside it.
 */
export const buildFixture = async (
  name: string,
  { mode = 'server' }: { readonly mode?: Mode } = {},
): Promise<BuiltFixture> => {
  const root = fileURLToPath(new URL(`./${name}/`, import.meta.url));
  const out = path.join(root, mode === 'static' ? 'dist-static' : 'dist');
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
    plugins: [engine({ routesDir: 'routes' }, { mode, runtimeDir })],
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

  const { default: handler, mode: built } = (await import(
    pathToFileURL(path.join(out, 'rsc', 'index.js')).href
  )) as { default: Handler; mode: string };
  const answers: Array<Promise<Response>> = [];
  return {
    handler: (request) => {
      const answer = handler(request);
      answers.push(answer);
      return answer;
    },
    mode: built,
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
