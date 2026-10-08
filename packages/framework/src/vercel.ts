import path from 'node:path';

import type { Logger, Plugin } from 'vite';

import type { StaticOutput } from './static';
import { writeStaticVercelOutput, writeVercelOutput } from './vercel-output';

/**
 * Deploys the application to Vercel: after `vite build`, the build is also
 * written as `.vercel/output/` in the Build Output API's shape, which
 * `vercel build` and `vercel deploy --prebuilt` take as they are. The client
 * build becomes static files on Vercel's CDN. Under `mode: 'server'` the
 * request handler is the one function behind them — a function holds
 * nothing but its own directory, which is all the handler needs: server mode
 * builds it with every dependency bundled in. Under `mode: 'static'` there is
 * no function, only the rewrites that answer a value the build did not write
 * with its shell — Vercel never reads `_redirects`.
 */
export const vercel = (): Plugin => {
  let isStatic = false;
  let logger: Logger | undefined;
  return {
    name: 'k8ordo:vercel',
    apply: 'build',

    configResolved(config) {
      // 前後どちらに置かれても、ここではすべてのプラグインが並んでいる
      isStatic = config.plugins.some(
        (plugin) => plugin.name === 'k8ordo:static',
      );
      ({ logger } = config);
    },

    // 静的ビルドのページは k8ordo:static の buildApp が書き終えて初めて揃う。
    // こちらの buildApp はその前にも後にも並びうるので、書き終えた側から呼ぶ
    api: {
      async writeStatic(output: StaticOutput): Promise<void> {
        await writeStaticVercelOutput(output);
        logger?.info('k8ordo: wrote .vercel/output');
      },
    },

    buildApp: {
      // After the RSC plugin's own buildApp, which builds every environment.
      order: 'post',
      async handler(builder) {
        if (isStatic) return;
        const dirOf = (name: string): string => {
          const outDir = builder.environments[name]?.config.build.outDir;
          if (outDir === undefined) {
            throw new Error(
              `the build for Vercel ran without the ${name} build`,
            );
          }
          return path.resolve(builder.config.root, outDir);
        };
        await writeVercelOutput(
          builder.config.root,
          { client: dirOf('client'), rsc: dirOf('rsc'), ssr: dirOf('ssr') },
          builder.config.base,
        );
        builder.config.logger.info('k8ordo: wrote .vercel/output');
      },
    },
  };
};
