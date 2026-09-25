import { bindParams, href } from './links';
import type { NavigateToOptions } from './links';

describe('bindParams', () => {
  const links = bindParams(() => ({ locale: 'ja' }));

  it('fills the bound param from the source and takes the rest as before', () => {
    expect(links.href('/:locale/products/:id', { id: 42 })).toBe(
      '/ja/products/42',
    );
    expect(links.href('/:locale')).toBe('/ja');
    expect(links.href('/about')).toBe('/about');
  });

  it('reads the source at each call, not once', () => {
    let locale = 'ja';
    const live = bindParams(() => ({ locale }));
    expect(live.href('/:locale/about')).toBe('/ja/about');
    locale = 'en';
    expect(live.href('/:locale/about')).toBe('/en/about');
  });

  it('lets a call override what the source supplies', () => {
    expect(links.href('/:locale/about', { locale: 'en' })).toBe('/en/about');
  });

  it('takes options after the params, even when every param is bound', () => {
    const options: NavigateToOptions = { history: 'replace' };
    const call = (): void => {
      // @ts-expect-error -- options are not params: a pattern whose params are all bound still takes them second
      links.navigateTo('/:locale', options);
    };
    expect(call).toBeTypeOf('function');
  });

  it('builds the same path the unbound href would', () => {
    expect(links.href('/:locale/products/:id', { id: 'a b' })).toBe(
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
    const links = bindParams(() => ({ locale: 'ja' }));
    expect(links.href('/:locale/about')).toBe('/docs/ja/about');
  });
});
