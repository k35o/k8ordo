import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'node:util';

import { createBuilder, createLogger, createServer } from 'vite';
import type { ViteDevServer } from 'vite';
import { vi } from 'vite-plus/test';

// 試すのは配る形のプラグイン。src の vite.ts は engine の runtime を自分の隣の
// runtime/ に探すが、そこへコピーされるのはビルドした dist だけ
import { framework } from '../dist/vite.mjs';
import type { StaticOptions } from '../dist/vite.mjs';

type Options = Omit<StaticOptions, 'mode'>;

const rootOf = (name: string): string =>
  fileURLToPath(new URL(`./${name}/`, import.meta.url));

export type FailedBuild = {
  /**
   * What the build said as it stopped: what it threw, then whatever it and
   * the pages it rendered reported as errors.
   */
  readonly said: string;
  /** Where the build wrote what it wrote before it stopped. */
  readonly client: string;
};

/**
 * Builds the application under `fixtures/<name>/` in static mode, expecting
 * it to stop. Its pages are rendered in this process, so what they report
 * goes to this process's `console.error`.
 */
export const failedBuild = async (
  name: string,
  options: Options = {},
): Promise<FailedBuild> => {
  const root = rootOf(name);
  const out = path.join(root, 'dist');
  await rm(out, { recursive: true, force: true });
  const reported: string[] = [];
  const logger = createLogger('error');
  const reporting = vi
    .spyOn(console, 'error')
    .mockImplementation((...args: unknown[]) => {
      reported.push(format(...args));
    });
  try {
    const builder = await createBuilder({
      root,
      configFile: false,
      logLevel: 'error',
      customLogger: {
        ...logger,
        error: (message) => {
          reported.push(message);
        },
      },
      plugins: [framework({ mode: 'static', ...options })],
    });
    await builder.buildApp();
  } catch (error) {
    return {
      said: [
        error instanceof Error ? error.message : String(error),
        ...reported,
      ].join('\n'),
      client: path.join(out, 'client'),
    };
  } finally {
    reporting.mockRestore();
  }
  throw new Error(`fixtures/${name} built, and it was expected to stop`);
};

/**
 * Builds the application under `fixtures/<name>/` in static mode with
 * `reactCompiler` and source maps, and says where each environment's output
 * went.
 */
export const compiledBuild = async (
  name: string,
): Promise<Readonly<Record<'client' | 'ssr' | 'rsc', string>>> => {
  const root = rootOf(name);
  const out = path.join(root, 'dist');
  await rm(out, { recursive: true, force: true });
  const builder = await createBuilder({
    root,
    configFile: false,
    logLevel: 'error',
    plugins: [framework({ mode: 'static', reactCompiler: true })],
    build: { sourcemap: true },
  });
  await builder.buildApp();
  return {
    client: path.join(out, 'client'),
    ssr: path.join(out, 'ssr'),
    rsc: path.join(out, 'rsc'),
  };
};

/**
 * A dev server for the application under `fixtures/<name>/` in `mode`,
 * `'static'` unless told, not listening.
 */
export const devServer = (
  name: string,
  mode: 'static' | 'server' = 'static',
): Promise<ViteDevServer> =>
  createServer({
    root: rootOf(name),
    configFile: false,
    logLevel: 'silent',
    plugins: [framework({ mode })],
    server: { port: 0 },
  });
