import { mkdtempSync, rmSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { resolveConfig } from 'vite';
import type { PluginOption, ResolvedConfig } from 'vite';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import type { StaticOutput } from './static';
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
    api: plugin.api as {
      writeStatic?: (output: StaticOutput) => Promise<void>;
    },
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

  it('hands its routes to the static output it writes', async () => {
    const { api } = vercelOf(
      await resolved([
        framework({ mode: 'static' }),
        vercel({
          beforeFiles: [
            { src: '^/old$', status: 308, headers: { Location: '/new' } },
          ],
          beforeNotFound: [
            {
              src: '^/.*$',
              has: [
                { type: 'header', key: 'accept', value: '.*text/markdown.*' },
              ],
              dest: '/not-found.md',
              status: 404,
            },
          ],
        }),
      ]),
    );
    const client = path.join(root, 'dist', 'client');
    await mkdir(client, { recursive: true });

    await api.writeStatic?.({
      root,
      client,
      base: '/',
      rewrites: [],
      notFound: false,
      types: new Map(),
    });

    const config = JSON.parse(
      await readFile(
        path.join(root, '.vercel', 'output', 'config.json'),
        'utf8',
      ),
    ) as { routes: unknown };
    expect(config.routes).toStrictEqual([
      { src: '^/old$', status: 308, headers: { Location: '/new' } },
      { handle: 'filesystem' },
      {
        src: '^/.*$',
        has: [{ type: 'header', key: 'accept', value: '.*text/markdown.*' }],
        dest: '/not-found.md',
        status: 404,
      },
      { handle: 'hit' },
      {
        src: '^\\/assets\\/',
        headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        continue: true,
      },
    ]);
  });

  it.each([
    [
      'beforeFiles',
      {
        beforeFiles: [
          { src: '^/old$', status: 308, headers: { Location: '/new' } },
        ],
      },
    ],
    [
      'beforeNotFound',
      {
        beforeNotFound: [{ src: '^/.*$', dest: '/not-found.md', status: 404 }],
      },
    ],
  ])(
    "refuses %s under mode: 'server', where the handler answers what no file names",
    async (_name, options) => {
      await expect(
        resolved([framework({ mode: 'server' }), vercel(options)]),
      ).rejects.toThrow(
        "vercel() takes beforeFiles and beforeNotFound under mode: 'static' only — under mode: 'server' the handler answers every URL no file names",
      );
    },
  );

  it.each(['beforeFiles', 'beforeNotFound'] as const)(
    'refuses a has header key in %s that is not lowercase, naming the route',
    (place) => {
      expect(() =>
        vercel({
          [place]: [
            {
              src: '^/posts/([a-z0-9-]+)$',
              has: [
                { type: 'header', key: 'Accept', value: '.*text/markdown.*' },
              ],
              dest: '/posts/$1/article.md',
              check: true,
            },
          ],
        }),
      ).toThrow(
        'vercel() route ^/posts/([a-z0-9-]+)$ has the header key "Accept" — write it lowercase ("accept"), as Vercel compares it',
      );
    },
  );
});
