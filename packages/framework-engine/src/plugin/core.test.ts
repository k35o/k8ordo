import { glob, readFile } from 'node:fs/promises';
import path from 'node:path';

import { parseSync } from 'vite';
import type { ConfigEnv, Plugin, ResolvedConfig, UserConfig } from 'vite';

import { engine } from './core';

const enginePlugin = (): Plugin | undefined =>
  engine({}, { mode: 'static', runtimeDir: '/runtime' })
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

// RSC プラグインと同じく、先頭の指令で見る。文字列やコメントの中は数えない。
// 型でない再 export の先も拾う。'use client' のモジュールを再 export する入口は、
// 事前バンドルに入るとそのモジュールのコピーをもう 1 つ作る
const readModule = (
  file: string,
  source: string,
): { client: boolean; reexported: string[] } => {
  const { program, module } = parseSync(file, source, {
    sourceType: 'module',
  });
  return {
    client: program.body.some(
      (statement) =>
        statement.type === 'ExpressionStatement' &&
        statement.directive === 'use client',
    ),
    reexported: module.staticExports.flatMap((statement) =>
      statement.entries.flatMap((entry) =>
        entry.isType || entry.moduleRequest === null
          ? []
          : [entry.moduleRequest.value],
      ),
    ),
  };
};

// 公開している @k8ordo/* のうち、'use client' のモジュールを出荷するものと、
// それを再 export するもの
const packagesShippingClientModules = async (): Promise<string[]> => {
  const shipping = new Set<string>();
  const reexportedFrom = new Map<string, ReadonlySet<string>>();
  for await (const manifest of glob('*/package.json', { cwd: packagesDir })) {
    const { name, private: unpublished } = JSON.parse(
      await readFile(path.join(packagesDir, manifest), 'utf8'),
    ) as { name: string; private?: boolean };
    if (unpublished === true) continue;
    const dir = path.join(packagesDir, path.dirname(manifest));
    const from = new Set<string>();
    for await (const file of glob('src/**/*.{ts,tsx}', { cwd: dir })) {
      if (/\.(?:test|stories)\.tsx?$/u.test(file)) continue;
      const { client, reexported } = readModule(
        file,
        await readFile(path.join(dir, file), 'utf8'),
      );
      if (client) shipping.add(name);
      for (const specifier of reexported) from.add(specifier);
    }
    reexportedFrom.set(name, from);
  }
  // 再 export の再 export も同じなので、増えなくなるまで辿る
  for (let grew = true; grew;) {
    grew = false;
    for (const [name, from] of reexportedFrom) {
      if (shipping.has(name)) continue;
      if ([...shipping].some((each) => from.has(each))) {
        shipping.add(name);
        grew = true;
      }
    }
  }
  return [...shipping];
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

  it('keeps every published package that ships or re-exports a client module out of the browser prebundle', async () => {
    const shipping = await packagesShippingClientModules();
    const { include, exclude } = clientOptimizeDeps();
    expect(exclude.toSorted()).toStrictEqual(shipping.toSorted());
    expect(include.filter((name) => shipping.includes(name))).toStrictEqual([]);
  });
});
