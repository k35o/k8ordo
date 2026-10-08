import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'vite';
import type { EnvironmentOptions, Plugin } from 'vite';

import { precompress } from './precompress';

// パッケージ名でなく、このファイル（dist/vite.mjs）の隣の dist/serve.mjs を
// 指す。アプリの root から @k8ordo/framework が解決できるとは限らない
const SERVE = fileURLToPath(new URL('./serve.mjs', import.meta.url));

const LAUNCHER = 'virtual:k8ordo/launcher';

/**
 * `dist/server.js`: the build it sits in, served on `PORT` and `HOST` when
 * they are set and on `serve`'s own defaults when they are not.
 */
// SIGTERM を待つのは、コンテナの PID 1 の Node がハンドラの無いシグナルを
// 無視するから。docker stop が猶予を使い切って SIGKILL で切ることになる。
// close は処理中の答えを書き終えてから閉じる
const launcher = `import { serve } from ${JSON.stringify(SERVE)};

const server = await serve({
  dist: import.meta.dirname,
  port: process.env.PORT ? Number(process.env.PORT) : undefined,
  host: process.env.HOST || undefined,
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.once(signal, () => {
    void server.close().then(() => process.exit(0));
  });
}
`;

/**
 * `serve` and everything it imports, bundled into one file beside the
 * environments the way the handler is: nothing but Node's own modules is
 * left to resolve where the build is deployed.
 */
const writeLauncher = async (root: string, dist: string): Promise<void> => {
  await build({
    root,
    configFile: false,
    logLevel: 'warn',
    publicDir: false,
    plugins: [
      {
        name: 'k8ordo:launcher',
        resolveId: (id) => (id === LAUNCHER ? `\0${LAUNCHER}` : null),
        load: (id) => (id === `\0${LAUNCHER}` ? launcher : null),
      },
    ],
    environments: { ssr: { resolve: { noExternal: true } } },
    build: {
      // ssr に文字列で渡すと root からのパスとして解かれ、仮想モジュールに届かない
      ssr: true,
      outDir: dist,
      emptyOutDir: false,
      rolldownOptions: {
        input: LAUNCHER,
        output: { entryFileNames: 'server.js' },
        onLog(level, log, handle) {
          // serve が router から読むのは withoutBase だけで、router の入口が
          // 並べる 'use client' のモジュールは木から落ちる。その指示子が
          // 束ねると消えるという警告は、どのビルドにも出て誰の役にも立たない
          if (log.code === 'MODULE_LEVEL_DIRECTIVE') return;
          handle(level, log);
        },
      },
    },
  });
};

/** How the `rsc` and `ssr` environments are built: with every dependency in. */
const bundledEnvironment = (): EnvironmentOptions => ({
  resolve: { noExternal: true },
});

/**
 * What a server mode build adds to the engine's: a `dist/` that runs on its
 * own. The handler is built with every dependency bundled in, `server.js`
 * beside it starts `serve` (an ES module, as the engine's `dist/package.json`
 * says), and the client build is compressed once, at build time, so
 * `serve` answers a request for a script with bytes it already has rather
 * than compressing the same file for every visitor. `node dist/server.js`
 * is then all a host has to run — no install, no `node_modules`.
 */
export const serverMode = (): Plugin => ({
  name: 'k8ordo:server',
  apply: 'build',

  config: () => ({
    environments: { rsc: bundledEnvironment(), ssr: bundledEnvironment() },
  }),

  buildApp: {
    // After the RSC plugin's own buildApp, which builds every environment.
    order: 'post',
    async handler(builder) {
      const { root, logger } = builder.config;
      const clientOut = builder.environments['client']?.config.build.outDir;
      if (clientOut === undefined) {
        throw new Error('server build ran without the client build');
      }
      const client = path.resolve(root, clientOut);
      const count = await precompress(client);
      logger.info(`k8ordo: precompressed ${String(count)} files`);

      // serve は dist の下の client/ と rsc/ を読む。server.js はその dist に置く
      const dist = path.dirname(client);
      await writeLauncher(root, dist);
      logger.info(
        `k8ordo: wrote ${path.relative(root, path.join(dist, 'server.js'))}`,
      );
    },
  },
});
