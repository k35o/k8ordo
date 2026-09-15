import { matchPath } from './match';

describe('matchPath', () => {
  it('answers a table pattern with its params', () => {
    expect(matchPath('/products/:id', '/products/42')).toStrictEqual({
      id: '42',
    });
    expect(matchPath('/products/:id', '/about')).toBeNull();
  });

  it('treats a trailing slash as the same pathname, like the table does', () => {
    expect(matchPath('/products', '/products/')).toStrictEqual({});
  });

  it('decodes params, and keeps the spelling when it cannot', () => {
    expect(matchPath('/:slug', '/caf%C3%A9')).toStrictEqual({ slug: 'café' });
    expect(matchPath('/:slug', '/%E0%A4%A')).toStrictEqual({
      slug: '%E0%A4%A',
    });
  });

  it('takes a pattern followed by /* to mean it and everything below', () => {
    expect(
      matchPath('/:locale/ui/*', '/ja/ui/components/button'),
    ).toStrictEqual({ locale: 'ja' });
    expect(matchPath('/:locale/ui/*', '/ja/ui')).toBeNull();
    expect(matchPath('/:locale/ui/*', '/ja/form')).toBeNull();
  });
});

describe('matchPath with inclusive', () => {
  it('counts the section index in when asked, and only then', () => {
    expect(
      matchPath('/:locale/ui/*', '/ja/ui', { inclusive: true }),
    ).toStrictEqual({ locale: 'ja' });
    expect(
      matchPath('/:locale/ui/*', '/ja/ui/components', { inclusive: true }),
    ).toStrictEqual({ locale: 'ja' });
    expect(
      matchPath('/:locale/ui/*', '/ja/ui', { inclusive: false }),
    ).toBeNull();
    expect(
      matchPath('/:locale/ui/*', '/ja/form', { inclusive: true }),
    ).toBeNull();
  });

  it('changes nothing for a pattern without a wildcard', () => {
    expect(
      matchPath('/products/:id', '/products/1', { inclusive: true }),
    ).toStrictEqual({ id: '1' });
  });
});
