import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { vercel } from '@k8ordo/framework/vercel';
import { createBuilder } from 'vite';
import { beforeAll, describe, expect, it } from 'vite-plus/test';

const root = path.resolve(import.meta.dirname, '..');

type Config = {
  readonly routes: ReadonlyArray<{
    readonly handle?: string;
    readonly dest?: string;
    readonly status?: number;
  }>;
  readonly overrides?: Readonly<Record<string, { contentType: string }>>;
};

let config: Config;

// 主張の対象は Vercel 向けに組み上げたアプリ。build.test.ts が組んだ dist を
// 読むテストがあるので、出力先を分けてもう一度組む
beforeAll(async () => {
  const builder = await createBuilder({
    root,
    configFile: path.join(root, 'vite.config.ts'),
    logLevel: 'warn',
    plugins: [vercel()],
    environments: {
      client: { build: { outDir: 'dist/vercel/client' } },
      rsc: { build: { outDir: 'dist/vercel/rsc' } },
      ssr: { build: { outDir: 'dist/vercel/ssr' } },
    },
  });
  await builder.buildApp();
  config = JSON.parse(
    await readFile(path.join(root, '.vercel', 'output', 'config.json'), 'utf8'),
  ) as Config;
}, 120_000);

describe('the application built for Vercel', () => {
  it('serves each file a route.ts wrote with the type its GET answered', () => {
    expect(config.overrides).toStrictEqual({
      'feed.xml': { contentType: 'application/rss+xml;charset=utf-8' },
      'posts.json': { contentType: 'application/json' },
    });
  });

  it('tries the files, then the shells, then 404.html', () => {
    const answering = config.routes.slice(
      0,
      config.routes.findIndex((route) => route.handle === 'hit'),
    );

    expect(answering).toMatchObject([
      { handle: 'filesystem' },
      { dest: '/en/posts/!fallback/index.html' },
      { dest: '/ja/posts/!fallback/index.html' },
      { dest: '/en/posts/!fallback/index.html' },
      { dest: '/ja/posts/!fallback/index.html' },
      { dest: '/en/posts/!fallback/index.rsc' },
      { dest: '/ja/posts/!fallback/index.rsc' },
      { dest: '/404.html', status: 404 },
    ]);
  });
});
