import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { resolveConfig } from 'vite';
import type { PluginOption, ResolvedConfig } from 'vite';

import { vercel } from './vercel';
import { framework } from './vite';

let root = '';

beforeAll(() => {
  root = mkdtempSync(path.join(tmpdir(), 'k8ordo-vercel-'));
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

const resolved = (plugins: PluginOption[]): Promise<ResolvedConfig> =>
  resolveConfig(
    { root, configFile: false, logLevel: 'silent', plugins },
    'build',
  );

type BuildApp = (builder: unknown) => Promise<void>;

/** The plugin vercel() added, as the static build finds it. */
const vercelOf = (config: ResolvedConfig) => {
  const plugin = config.plugins.find(({ name }) => name === 'k8ordo:vercel');
  if (plugin === undefined) throw new Error('no k8ordo:vercel plugin');
  return {
    api: plugin.api as { writeStatic?: unknown },
    buildApp: (plugin.buildApp as unknown as { handler: BuildApp }).handler,
  };
};

describe('vercel', () => {
  it.each([
    ['after', () => [framework({ mode: 'static' }), vercel()]],
    ['before', () => [vercel(), framework({ mode: 'static' })]],
  ])(
    'accepts static mode placed %s framework(), leaving its output to the static build, which has the pages',
    async (_side, plugins) => {
      const { api, buildApp } = vercelOf(await resolved(plugins()));

      expect(api.writeStatic).toBeTypeOf('function');
      // 静的ビルドでは自分の buildApp は何もしない。環境の無い builder でも投げない
      await expect(
        buildApp({ config: {}, environments: {} }),
      ).resolves.toBeUndefined();
    },
  );

  it('deploys server mode from its own buildApp', async () => {
    const { buildApp } = vercelOf(
      await resolved([framework({ mode: 'server' }), vercel()]),
    );

    await expect(
      buildApp({ config: { root }, environments: {} }),
    ).rejects.toThrow('the build for Vercel ran without the client build');
  });
});
