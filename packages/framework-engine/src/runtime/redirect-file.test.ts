import { resolveRedirects } from './redirect-file';

// ハンドラが渡すのは URL が綴った pathname なので、テストも URL に綴らせる
const pathnameOf = (spelled: string): string =>
  new URL(spelled, 'http://k8ordo.localhost').pathname;

describe('resolveRedirects', () => {
  it('fills a target pattern with the matched params', () => {
    const redirectFor = resolveRedirects({ '/:locale/legacy': '/:locale/new' });
    expect(
      redirectFor('/:locale/legacy', pathnameOf('/ja/legacy')),
    ).toStrictEqual({ to: '/ja/new', permanent: false });
  });

  it('carries permanent from the target', () => {
    const redirectFor = resolveRedirects({
      '/old': { to: '/new', permanent: true },
    });
    expect(redirectFor('/old', pathnameOf('/old'))).toStrictEqual({
      to: '/new',
      permanent: true,
    });
  });

  it('moves a non-ASCII segment escaped once', () => {
    const redirectFor = resolveRedirects({ '/:slug/legacy': '/:slug/new' });
    expect(redirectFor('/:slug/legacy', pathnameOf('/café/legacy'))?.to).toBe(
      '/caf%C3%A9/new',
    );
  });

  it('keeps an escaped slash inside its segment', () => {
    const redirectFor = resolveRedirects({ '/:id/legacy': '/:id' });
    expect(redirectFor('/:id/legacy', pathnameOf('/a%2Fb/legacy'))?.to).toBe(
      '/a%2Fb',
    );
  });

  it('moves an escape that does not decode as the URL spelled it', () => {
    const redirectFor = resolveRedirects({ '/:slug/legacy': '/:slug/new' });
    expect(
      redirectFor('/:slug/legacy', pathnameOf('/%E0%A4%A/legacy'))?.to,
    ).toBe('/%E0%A4%A/new');
  });

  it.each(['/old/', '/old//'])(
    'reads %s as the table matches it, without the trailing slash',
    (spelled) => {
      const redirectFor = resolveRedirects({ '/old': '/new' });
      expect(redirectFor('/old', pathnameOf(spelled))?.to).toBe('/new');
    },
  );

  it('answers null for a pattern no redirect declares', () => {
    const redirectFor = resolveRedirects({ '/old': '/new' });
    expect(redirectFor('/products', pathnameOf('/products'))).toBeNull();
  });

  it('refuses a target that names a param the pattern did not match', () => {
    const redirectFor = resolveRedirects({ '/old': '/:missing' });
    expect(() => redirectFor('/old', pathnameOf('/old'))).toThrow(/:missing/u);
  });
});
