import { readFile } from 'node:fs/promises';

import { describe, expect, expectTypeOf, it } from 'vite-plus/test';

import type { TAKEN } from './options';
import { framework } from './vite';
import type { FrameworkOptions, ServerOptions, StaticOptions } from './vite';

const pluginNames = (options: FrameworkOptions): string[] =>
  framework(options)
    .flat(3)
    .flatMap((plugin) =>
      typeof plugin === 'object' && plugin !== null && 'name' in plugin
        ? [plugin.name]
        : [],
    );

describe('framework', () => {
  it('writes files in static mode, and nothing it would serve them with', () => {
    const names = pluginNames({ mode: 'static', site: 'https://example.test' });
    expect(names).toContain('k8ordo:static');
    expect(names).not.toContain('k8ordo:server');
  });

  it('builds a server in server mode, and writes no pages', () => {
    const names = pluginNames({ mode: 'server' });
    expect(names).toContain('k8ordo:server');
    expect(names).not.toContain('k8ordo:static');
  });

  it('refuses a key it does not take, naming the ones the mode takes, rather than ignoring it', () => {
    expect(() =>
      framework({
        mode: 'static',
        site: 'https://example.test',
        // @ts-expect-error the route files always live in src/routes
        routesDir: 'app/routes',
      }),
    ).toThrow(
      "framework() takes no routesDir — under mode: 'static' it takes mode, reactCompiler, headers, site, csp",
    );
    expect(() =>
      // @ts-expect-error a key spelt wrong is no option
      framework({ mode: 'server', reactcompiler: true, paths: [] }),
    ).toThrow(
      "framework() takes no reactcompiler, paths — under mode: 'server' it takes mode, reactCompiler, headers",
    );
  });

  it('takes every key its options types declare, so no option the type accepts is refused when the config loads', () => {
    expectTypeOf<
      Exclude<keyof StaticOptions, (typeof TAKEN.static)[number]>
    >().toBeNever();
    expectTypeOf<
      Exclude<keyof ServerOptions, (typeof TAKEN.server)[number]>
    >().toBeNever();
  });

  it('refuses static mode without the origin it is served from, rather than asking for its pages under one of its own', () => {
    expect(() =>
      // @ts-expect-error a build into files asks for its pages under site
      framework({ mode: 'static' }),
    ).toThrow(
      "mode: 'static' needs site, the origin the site is served from, like 'https://example.com' — and got none",
    );
  });

  it.each([
    ['example.com', 'is not a URL'],
    ['ftp://example.com', 'is served over ftp:, not http: or https:'],
    [
      'https://example.com/docs',
      "has a path, /docs — where under the origin the site sits is Vite's base",
    ],
    ['https://example.com/?lang=ja', 'has a query, ?lang=ja'],
    ['https://example.com/#top', 'has a fragment, #top'],
  ])('says what keeps %s from being an origin', (site, reason) => {
    expect(() => framework({ mode: 'static', site })).toThrow(
      `mode: 'static' needs site, the origin the site is served from, like 'https://example.com' — and '${site}' ${reason}`,
    );
  });

  it.each([
    'https://user:secret@example.com',
    'https://user@example.com/docs',
    'ftp://user:secret@example.com',
    'user:secret@example.com',
    'https://user:secret@exa mple.com',
  ])(
    'never writes a site that may carry a username or a password, nor any part of it, into the error: %s',
    (site) => {
      expect(() => framework({ mode: 'static', site })).toThrow(
        new Error(
          "mode: 'static' needs site, the origin the site is served from, like 'https://example.com' — and the site has an @, which no origin has (a username or a password comes before one, so the value is left out)",
        ),
      );
    },
  );

  it.each([
    [42, 'a number'],
    [null, 'null'],
    [['https://example.com'], 'an array'],
    [new URL('https://example.com'), 'an object'],
  ])('says what a site that is not a string is: %o', (site, kind) => {
    expect(() =>
      // @ts-expect-error site is the origin as a string
      framework({ mode: 'static', site }),
    ).toThrow(
      `mode: 'static' needs site, the origin the site is served from, like 'https://example.com' — and the value is not a string but ${kind}`,
    );
  });

  it('takes an origin however URL respells it', () => {
    for (const site of [
      'https://example.com/',
      'https://Example.com',
      'https://example.com:443',
      'http://localhost:4173',
      'https://例え.jp',
    ]) {
      expect(pluginNames({ mode: 'static', site })).toContain('k8ordo:static');
    }
  });

  it('takes site and csp only in static mode, where there are files to describe', () => {
    expect(
      pluginNames({
        mode: 'static',
        site: 'https://example.test',
        csp: { 'script-src': ["'self'"] },
      }),
    ).toContain('k8ordo:static');
    expect(() =>
      // @ts-expect-error a server renders whatever pathname it is asked for
      framework({ mode: 'server', site: 'https://example.test' }),
    ).toThrow(
      "mode: 'server' takes no site — only mode: 'static' writes files for it to describe",
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

  it('refuses a header HTTP could not send when the config loads, not when a server first meets it', () => {
    expect(() =>
      framework({ mode: 'server', headers: { 'X-A': 'b\r\nX-B: c' } }),
    ).toThrow('framework() cannot send the header X-A');
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
  it.each([
    { mode: 'static', site: 'https://example.test' },
    { mode: 'server' },
  ] as const)('turns React Compiler on under mode: $mode', (options) => {
    expect(pluginNames({ ...options, reactCompiler: true })).toContain(
      'vite:react-compiler',
    );
  });

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
