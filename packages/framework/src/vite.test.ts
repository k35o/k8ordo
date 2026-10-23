import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vite-plus/test';

import { framework } from './vite';
import type { FrameworkOptions } from './vite';

const pluginNames = (options: FrameworkOptions): string[] =>
  framework(options)
    .flat(3)
    .flatMap((plugin) =>
      typeof plugin === 'object' && plugin !== null && 'name' in plugin
        ? [plugin.name]
        : [],
    );

const files = (): readonly string[] => [];

describe('framework', () => {
  it('writes files in static mode, and nothing it would serve them with', () => {
    const names = pluginNames({ mode: 'static' });
    expect(names).toContain('k8ordo:static');
    expect(names).not.toContain('k8ordo:server');
  });

  it('builds a server in server mode, and writes no pages', () => {
    const names = pluginNames({ mode: 'server' });
    expect(names).toContain('k8ordo:server');
    expect(names).not.toContain('k8ordo:static');
  });

  it('takes paths, site and csp only in static mode, where there are files to describe', () => {
    expect(
      pluginNames({
        mode: 'static',
        paths: files,
        site: 'https://example.test',
        csp: { 'script-src': ["'self'"] },
      }),
    ).toContain('k8ordo:static');
    expect(() =>
      // @ts-expect-error a server renders whatever pathname it is asked for
      framework({ mode: 'server', paths: files, site: 'https://example.test' }),
    ).toThrow(
      "mode: 'server' takes no paths, site — only mode: 'static' writes files for them to describe",
    );
  });

  it('refuses a csp under server mode, rather than serving pages without it', () => {
    expect(() =>
      // @ts-expect-error a server signs a page's scripts with nonce() instead
      framework({ mode: 'server', csp: { 'script-src': ["'self'"] } }),
    ).toThrow(
      "mode: 'server' takes no csp — only mode: 'static' writes files for it to describe; under mode: 'server', a guard.ts writes the Content-Security-Policy header, with nonce()",
    );
  });

  it('refuses a missing or misspelt mode, rather than building neither', () => {
    // @ts-expect-error the mode is always chosen, never assumed
    expect(() => framework({})).toThrow(
      "framework() needs mode: 'static' or 'server', and got undefined",
    );
    // @ts-expect-error the mode is always chosen, never assumed
    expect(() => framework()).toThrow(
      "framework() needs mode: 'static' or 'server', and got undefined",
    );
    // @ts-expect-error a mode is one of the two names, spelt as they are
    expect(() => framework({ mode: 'Static' })).toThrow(
      "framework() needs mode: 'static' or 'server', and got 'Static'",
    );
  });
});

type Manifest = {
  readonly peerDependencies?: Readonly<Record<string, string>>;
  readonly peerDependenciesMeta?: Readonly<
    Record<string, { readonly optional?: boolean }>
  >;
};

const manifestAt = async (url: URL): Promise<Manifest> =>
  JSON.parse(await readFile(url, 'utf8')) as Manifest;

// peer の宣言のうち、名前の 1 つ分
const peerOf = (manifest: Manifest, name: string): unknown => ({
  range: manifest.peerDependencies?.[name],
  meta: manifest.peerDependenciesMeta?.[name],
});

describe('reactCompiler', () => {
  it.each(['static', 'server'] as const)(
    'turns React Compiler on under mode: %s',
    (mode) => {
      expect(pluginNames({ mode, reactCompiler: true })).toContain(
        'vite:react-compiler',
      );
    },
  );

  it('declares oxc-transform-react with the range @vitejs/plugin-react asks', async () => {
    const ours = await manifestAt(new URL('../package.json', import.meta.url));
    // ./package.json は exports に無いので、入口から辿る
    const pluginReact = await manifestAt(
      new URL('../package.json', import.meta.resolve('@vitejs/plugin-react')),
    );
    expect(peerOf(ours, 'oxc-transform-react')).toStrictEqual(
      peerOf(pluginReact, 'oxc-transform-react'),
    );
  });
});
