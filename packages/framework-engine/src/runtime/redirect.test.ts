import { isRedirect, matchRedirects, redirect } from './redirect';

// ハンドラが渡すのは URL が綴った pathname なので、テストも URL に綴らせる
const pathnameOf = (spelled: string): string =>
  new URL(spelled, 'http://k8ordo.localhost').pathname;

describe('redirect', () => {
  it('throws something the handler can tell apart from any other error', () => {
    let caught: unknown;
    try {
      redirect('/talks');
    } catch (error) {
      caught = error;
    }
    expect(isRedirect(caught)).toBe(true);
    expect(caught).toMatchObject({ to: '/talks' });
    expect(isRedirect(new Error('/talks'))).toBe(false);
    expect(isRedirect(null)).toBe(false);
  });
});

describe('matchRedirects', () => {
  it('fills a target pattern with the matched params', () => {
    const redirectFor = matchRedirects({ '/:locale/legacy': '/:locale/new' });
    expect(redirectFor(pathnameOf('/ja/legacy'))).toStrictEqual({
      to: '/ja/new',
      permanent: false,
    });
  });

  it('carries permanent from the target', () => {
    const redirectFor = matchRedirects({
      '/old': { to: '/new', permanent: true },
    });
    expect(redirectFor(pathnameOf('/old'))).toStrictEqual({
      to: '/new',
      permanent: true,
    });
  });

  it('moves a non-ASCII segment escaped once', () => {
    const redirectFor = matchRedirects({ '/:slug/legacy': '/:slug/new' });
    expect(redirectFor(pathnameOf('/café/legacy'))?.to).toBe('/caf%C3%A9/new');
  });

  it('keeps an escaped slash inside its segment', () => {
    const redirectFor = matchRedirects({ '/:id/legacy': '/:id' });
    expect(redirectFor(pathnameOf('/a%2Fb/legacy'))?.to).toBe('/a%2Fb');
  });

  it('moves an escape that does not decode as the URL spelled it', () => {
    const redirectFor = matchRedirects({ '/:slug/legacy': '/:slug/new' });
    expect(redirectFor(pathnameOf('/%E0%A4%A/legacy'))?.to).toBe(
      '/%E0%A4%A/new',
    );
  });

  it('answers the first declared pattern that matches', () => {
    const redirectFor = matchRedirects({
      '/docs/legacy': '/docs',
      '/:section/legacy': '/:section',
    });
    expect(redirectFor(pathnameOf('/docs/legacy'))?.to).toBe('/docs');
  });

  it('answers null for a pathname no redirect declares', () => {
    const redirectFor = matchRedirects({ '/old': '/new' });
    expect(redirectFor(pathnameOf('/products'))).toBeNull();
  });

  it('refuses a target that names a param the pattern did not match', () => {
    const redirectFor = matchRedirects({ '/old': '/:missing' });
    expect(() => redirectFor(pathnameOf('/old'))).toThrow(/:missing/u);
  });
});
