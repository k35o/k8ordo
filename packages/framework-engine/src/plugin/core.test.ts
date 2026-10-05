import { glob, readFile } from 'node:fs/promises';
import path from 'node:path';

import { parseSync } from 'vite';
import type { ConfigEnv, Plugin, ResolvedConfig, UserConfig } from 'vite';

import { engine } from './core';

const enginePlugin = (): Plugin | undefined =>
  engine({}, { via: '@k8ordo/static', runtimeDir: '/runtime' })
    .flat()
    .find(
      (each): each is Plugin =>
        typeof each === 'object' &&
        each !== null &&
        'name' in each &&
        each.name === 'k8ordo:engine',
    );

// Vite が解いた設定を、エンジンのプラグインにそのまま渡す
const resolveWith = (base: string): void => {
  const hook = enginePlugin()?.configResolved as
    | ((config: ResolvedConfig) => void)
    | undefined;
  hook?.({ base, root: '/app' } as ResolvedConfig);
};

// vite dev のときに、エンジンが client 環境の事前バンドルへ渡す設定
const clientOptimizeDeps = (): { include: string[]; exclude: string[] } => {
  const hook = enginePlugin()?.config as
    | ((config: UserConfig, env: ConfigEnv) => UserConfig)
    | undefined;
  const optimizeDeps = hook?.({}, { command: 'serve', mode: 'development' })
    .environments?.client?.optimizeDeps;
  return {
    include: optimizeDeps?.include ?? [],
    exclude: optimizeDeps?.exclude ?? [],
  };
};

const packagesDir = path.resolve(import.meta.dirname, '../../..');

// RSC プラグインと同じく、先頭の指令で見る。文字列やコメントの中は数えない
const isClientModule = (file: string, source: string): boolean =>
  parseSync(file, source, { sourceType: 'module' }).program.body.some(
    (statement) =>
      statement.type === 'ExpressionStatement' &&
      statement.directive === 'use client',
  );

// 公開している @k8ordo/* のうち、'use client' のモジュールを出荷するもの
const packagesShippingClientModules = async (): Promise<string[]> => {
  const names: string[] = [];
  for await (const manifest of glob('*/package.json', { cwd: packagesDir })) {
    const { name, private: unpublished } = JSON.parse(
      await readFile(path.join(packagesDir, manifest), 'utf8'),
    ) as { name: string; private?: boolean };
    if (unpublished === true) continue;
    const dir = path.join(packagesDir, path.dirname(manifest));
    for await (const file of glob('src/**/*.{ts,tsx}', { cwd: dir })) {
      if (/\.(?:test|stories)\.tsx?$/u.test(file)) continue;
      if (isClientModule(file, await readFile(path.join(dir, file), 'utf8'))) {
        names.push(name);
        break;
      }
    }
  }
  return names;
};

describe('the engine plugin', () => {
  it('takes a base that is a path from the root', () => {
    expect(() => {
      resolveWith('/docs/');
    }).not.toThrow();
  });

  it.each(['./', 'https://cdn.example.com/app/', '//cdn.example.com/app/'])(
    'refuses base %s, under which no URL says which page it is',
    (base) => {
      expect(() => {
        resolveWith(base);
      }).toThrow(/base has to be a path from the root/u);
    },
  );

  it('keeps every published package that ships a client module out of the browser prebundle', async () => {
    const shipping = await packagesShippingClientModules();
    const { include, exclude } = clientOptimizeDeps();
    expect(exclude.toSorted()).toStrictEqual(shipping.toSorted());
    expect(include.filter((name) => shipping.includes(name))).toStrictEqual([]);
  });
});
