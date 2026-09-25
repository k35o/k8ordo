import path from 'node:path';

import type { Plugin } from 'vite';

import { writeVercelOutput } from './vercel-output';

/**
 * Deploys the application to Vercel: after `vite build`, the build is also
 * written as `.vercel/output/` in the Build Output API's shape, which
 * `vercel build` and `vercel deploy --prebuilt` take as they are. The client
 * build becomes static files on Vercel's CDN, and the request handler the
 * one function behind them.
 *
 * A function holds nothing but its own directory, so under this plugin the
 * handler is built with every dependency bundled in.
 */
export const vercel = (): Plugin => ({
  name: 'k8ordo:vercel',
  apply: 'build',

  config: () => ({
    environments: {
      rsc: { resolve: { noExternal: true } },
      ssr: { resolve: { noExternal: true } },
    },
  }),

  buildApp: {
    // After the RSC plugin's own buildApp, which builds every environment.
    order: 'post',
    async handler(builder) {
      const dirOf = (name: string): string => {
        const outDir = builder.environments[name]?.config.build.outDir;
        if (outDir === undefined) {
          throw new Error(`the build for Vercel ran without the ${name} build`);
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
});
