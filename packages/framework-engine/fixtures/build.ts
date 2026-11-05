import { mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
import { createServer as createHttpServer } from 'node:http';
import type { IncomingMessage } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream as NodeReadableStream } from 'node:stream/web';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { chromium, firefox, webkit } from 'playwright';
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
// それに同梱される側なので依存に持てない。その入口が値として出すのは
// router の再 export だけなので、router を直接読ませる。search を読むページの表が import
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
    build: {
      // テストの下（NODE_ENV=test）では React の開発版を束ねるので、ブラウザの
      // 入口のチャンクは本番の出力よりずっと大きい。大きさの警告は数えない
      chunkSizeWarningLimit: Number.POSITIVE_INFINITY,
      // プラグインにかかった時間の警告は、マシンの混み具合で出たり出なかったりする
      rolldownOptions: { checks: { bundlerTimings: false } },
    },
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

/**
 * The engines a test opens pages in. CI runs one engine per job, narrowed
 * by `TEST_BROWSER`.
 */
export const browserTypes = [chromium, firefox, webkit]
  .filter(
    (type) =>
      process.env.TEST_BROWSER === undefined ||
      process.env.TEST_BROWSER === type.name(),
  )
  .map((type) => ({ name: type.name(), type }));

export type ServedBuild = {
  /** Where the server listens, with no trailing slash. */
  readonly origin: string;
  /** Stops the server. The build stays. */
  readonly close: () => void;
};

const ASSET_TYPES: Readonly<Record<string, string>> = {
  '.css': 'text/css',
  '.js': 'text/javascript',
};

/** The request a browser sent, as the handler takes one. */
const requestOf = async (
  incoming: IncomingMessage,
  url: URL,
): Promise<Request> => {
  const headers = new Headers();
  for (const [name, value] of Object.entries(incoming.headers)) {
    for (const each of [value ?? []].flat()) headers.append(name, each);
  }
  const method = incoming.method ?? 'GET';
  return new Request(url, {
    method,
    headers,
    body:
      method === 'GET' || method === 'HEAD'
        ? null
        : new Uint8Array(
            Buffer.concat((await Array.fromAsync(incoming)) as Buffer[]),
          ),
  });
};

/**
 * Serves a build as `@k8ordo/framework/serve` splits the work: a file under
 * `/assets/` from the client build, everything else from the handler, with
 * the request's method, headers and body, and the answer streamed as it
 * comes. `hold` is awaited before an asset is sent, so a test can keep one
 * back; `rewrite` hands the handler another URL than the one asked for.
 */
export const serveBuilt = async (
  built: BuiltFixture,
  {
    hold,
    rewrite = (url) => url,
  }: {
    readonly hold?: (url: URL) => Promise<void> | undefined;
    readonly rewrite?: (url: URL) => URL;
  } = {},
): Promise<ServedBuild> => {
  let origin = '';
  const answer = async (incoming: IncomingMessage): Promise<Response> => {
    const url = new URL(incoming.url ?? '/', origin);
    if (!url.pathname.startsWith('/assets/')) {
      return built.handler(await requestOf(incoming, rewrite(url)));
    }
    await hold?.(url);
    try {
      return new Response(
        await readFile(path.join(built.out, 'client', url.pathname)),
        {
          headers: {
            'content-type':
              ASSET_TYPES[path.extname(url.pathname)] ??
              'application/octet-stream',
          },
        },
      );
    } catch {
      return new Response(null, { status: 404 });
    }
  };
  const server = createHttpServer((incoming, outgoing) => {
    void (async () => {
      const response = await answer(incoming);
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body === null) {
        outgoing.end();
        return;
      }
      // 訪問者が去れば読むのをやめる
      await pipeline(
        Readable.fromWeb(response.body as unknown as NodeReadableStream),
        outgoing,
      ).catch(() => undefined);
    })();
  });
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  origin = `http://127.0.0.1:${String((server.address() as AddressInfo).port)}`;
  return {
    origin,
    close: () => {
      server.close();
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
