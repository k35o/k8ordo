import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vite-plus/test';

import { bindParams, href } from './links';

describe('bindParams', () => {
  const bound = bindParams(() => ({ locale: 'ja' }));

  it('fills the bound param from the source and takes the rest as before', () => {
    expect(bound('/:locale/products/:id', { id: 42 })).toBe('/ja/products/42');
    expect(bound('/:locale')).toBe('/ja');
    expect(bound('/about')).toBe('/about');
  });

  it('reads the source at each call, not once', () => {
    let locale = 'ja';
    const live = bindParams(() => ({ locale }));
    expect(live('/:locale/about')).toBe('/ja/about');
    locale = 'en';
    expect(live('/:locale/about')).toBe('/en/about');
  });

  it('lets a call override what the source supplies', () => {
    expect(bound('/:locale/about', { locale: 'en' })).toBe('/en/about');
  });

  it('still requires the params the source does not supply', () => {
    const call = (): string =>
      // @ts-expect-error -- ":id" is not bound, so a link to the page names it
      bound('/:locale/products/:id');
    expect(call).toBeTypeOf('function');
  });

  it('takes a rest param beside the bound one', () => {
    expect(bound('/:locale/files/:path+', { path: ['a b', 'c'] })).toBe(
      '/ja/files/a%20b/c',
    );
    expect(() => bound('/:locale/files/:path+', { path: [] })).toThrow(
      '"/:locale/files/:path+" needs at least one segment for ":path+"',
    );
  });

  it('builds the same path the unbound href would', () => {
    expect(bound('/:locale/products/:id', { id: 'a b' })).toBe(
      href('/:locale/products/:id', { locale: 'ja', id: 'a b' }),
    );
  });
});

describe('links under a base', () => {
  beforeEach(() => {
    vi.stubEnv('BASE_URL', '/docs/');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('puts the base Vite serves the application under in front of every href', () => {
    expect(href('/:locale/products/:id', { locale: 'ja', id: 42 })).toBe(
      '/docs/ja/products/42',
    );
    expect(href('/')).toBe('/docs/');
  });

  it('puts it in front of a bound href too', () => {
    const bound = bindParams(() => ({ locale: 'ja' }));
    expect(bound('/:locale/about')).toBe('/docs/ja/about');
  });
});
