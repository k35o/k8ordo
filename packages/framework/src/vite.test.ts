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
