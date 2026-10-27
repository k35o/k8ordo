#!/usr/bin/env node
import type { EngineApi } from '@k8ordo/framework-engine';
import { resolveConfig } from 'vite';

const USAGE = `usage: k8ordo generate

Writes .k8ordo/ from the Vite config in this directory, as vite build does
when it begins, and builds nothing.
`;

/**
 * `.k8ordo/` without a build: the config resolved as `vite build` resolves
 * it, and the engine's plugin, which knows the routes directory and the
 * mode, asked to generate. No environment is built and no page rendered, so
 * `paths` and whatever data a page reads are never touched.
 */
const generate = async (): Promise<void> => {
  const config = await resolveConfig({}, 'build', 'production', 'production');
  const engine = config.plugins.find(({ name }) => name === 'k8ordo:engine');
  if (engine === undefined) {
    throw new Error(
      `the Vite config in ${config.root} does not use framework() from @k8ordo/framework/vite, so there is nothing to generate`,
    );
  }
  // Vite の型では api は any なので、エンジンが渡す形をここで言う
  await (engine.api as EngineApi).generate();
  config.logger.info('k8ordo: wrote .k8ordo/');
};

const args = process.argv.slice(2);
if (args.length !== 1 || args[0] !== 'generate') {
  process.stderr.write(USAGE);
  process.exitCode = 1;
} else {
  try {
    await generate();
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
