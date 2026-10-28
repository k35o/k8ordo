import { mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createBuilder, createLogger, createServer } from 'vite';
import type { PluginOption, Rolldown } from 'vite';

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
 * A directory holding the runtime's three entries, as `@k8ordo/framework`
 * lays out its own: this package's source, not `dist`, so a fix to the
 * runtime is what gets tried.
 */
const linkRuntime = async (): Promise<string> => {
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
  return runtimeDir;
};

// 生成された表は @k8ordo/framework/generated から読むが、このパッケージは
// それに同梱される側なので依存に持てない。その入口は router の再 export
// だけなので、router を直接読ませる。search を読むページの表が import
// する @k8ordo/state も依存に無いので、フィクスチャの読み方に差し替える
const alias = {
  '@k8ordo/framework/generated': '@k8ordo/router',
  '@k8ordo/state': fileURLToPath(new URL('./state.ts', import.meta.url)),
};

/**
 * Builds the application under `fixtures/<name>/` as the mode builds one —
 * `'server'` unless told — and imports the handler it wrote. A static build
 * goes to `dist-static/`, so a test file building the same fixture in the
 * other mode runs beside it. `clientChunks` splits the browser's build as
 * an application's `codeSplitting` would.
 */
export const buildFixture = async (
  name: string,
  {
    mode = 'server',
    clientChunks,
  }: {
    readonly mode?: Mode;
    readonly clientChunks?: Rolldown.CodeSplittingOptions;
  } = {},
): Promise<BuiltFixture> => {
  const root = fileURLToPath(new URL(`./${name}/`, import.meta.url));
  const out = path.join(root, mode === 'static' ? 'dist-static' : 'dist');
  const runtimeDir = await linkRuntime();

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
    // テストの下（NODE_ENV=test）では React の開発版を束ねるので、ブラウザの
    // 入口のチャンクは本番の出力よりずっと大きい。大きさの警告は数えない
    build: { chunkSizeWarningLimit: Number.POSITIVE_INFINITY },
    resolve: { alias },
    environments: {
      rsc: { build: { outDir: path.join(out, 'rsc') } },
      ssr: { build: { outDir: path.join(out, 'ssr') } },
      client: {
        build: {
          outDir: path.join(out, 'client'),
          ...(clientChunks === undefined
            ? {}
            : { rolldownOptions: { output: { codeSplitting: clientChunks } } }),
        },
      },
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

export type ServedFixture = {
  /** Where the dev server listens, with no trailing slash. */
  readonly origin: string;
  /** Stops the dev server. */
  readonly close: () => Promise<void>;
};

/**
 * Serves the application under `fixtures/<name>/` with `vite dev`, as the
 * mode serves one, with `plugins` beside the engine's. Like a build, it
 * writes the fixture's `.k8ordo/` in the mode's terms, so a fixture is never
 * served while it is built in the other mode.
 */
export const serveFixture = async (
  name: string,
  {
    mode,
    plugins = [],
  }: { readonly mode: Mode; readonly plugins?: readonly PluginOption[] },
): Promise<ServedFixture> => {
  const root = fileURLToPath(new URL(`./${name}/`, import.meta.url));
  const runtimeDir = await linkRuntime();
  const server = await createServer({
    root,
    configFile: false,
    logLevel: 'error',
    plugins: [
      engine({ routesDir: 'routes' }, { mode, runtimeDir }),
      ...plugins,
    ],
    resolve: { alias },
    server: { port: 0 },
  });
  await server.listen();
  const [url] = server.resolvedUrls?.local ?? [];
  if (url === undefined) throw new Error('the dev server is not listening');
  return {
    origin: url.replace(/\/$/u, ''),
    close: async () => {
      await server.close();
      await rm(runtimeDir, { recursive: true, force: true });
    },
  };
};
