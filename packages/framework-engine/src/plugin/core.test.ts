import type { Plugin, ResolvedConfig } from 'vite';

import { engine } from './core';

// Vite が解いた設定を、エンジンのプラグインにそのまま渡す
const resolveWith = (base: string): void => {
  const plugin = engine({}, { via: '@k8ordo/static', runtimeDir: '/runtime' })
    .flat()
    .find(
      (each): each is Plugin =>
        typeof each === 'object' &&
        each !== null &&
        'name' in each &&
        each.name === 'k8ordo:engine',
    );
  const hook = plugin?.configResolved as
    | ((config: ResolvedConfig) => void)
    | undefined;
  hook?.({ base, root: '/app' } as ResolvedConfig);
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
});
