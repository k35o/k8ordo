import { describe, expect, it } from 'vite-plus/test';

import { Redirect, redirect, resolveRedirects } from './redirect';
import { inPhase, withRequest } from './request-scope';

describe('redirect', () => {
  it('throws a Redirect carrying where it sends the visitor', () => {
    let caught: unknown;
    try {
      redirect('/talks');
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(Redirect);
    expect(caught).toMatchObject({ to: '/talks' });
  });

  it.each(['guard', 'route', 'action'] as const)(
    'ends what answers the request in the %s phase',
    (phase) => {
      expect(() =>
        withRequest(new Request('https://example.test/'), () =>
          inPhase(phase, () => redirect('/talks')),
        ),
      ).toThrow(Redirect);
    },
  );

  it('refuses by name while a page renders, which answers nothing', () => {
    expect(() =>
      withRequest(new Request('https://example.test/'), () =>
        redirect('/talks'),
      ),
    ).toThrow(
      'redirect() ends what answers the request, and a page is a render — redirect from a guard.ts, a route.ts or a Server Action, or answer the URL with a redirect.ts (it was asked for /talks)',
    );
  });
});

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

  it('moves every segment a rest param took, as the URL spelled them', () => {
    const redirectFor = resolveRedirects({ '/old/:path+': '/new/:path+' });
    expect(
      redirectFor('/old/:path+', pathnameOf('/old/a%2Fb/café/c')),
    ).toStrictEqual({ to: '/new/a%2Fb/caf%C3%A9/c', permanent: false });
  });

  it('refuses a target that names a rest param as one segment', () => {
    const redirectFor = resolveRedirects({ '/old/:path+': '/new/:path' });
    expect(() => redirectFor('/old/:path+', pathnameOf('/old/a/b'))).toThrow(
      'redirect target "/new/:path" needs a value for ":path"',
    );
  });

  it('answers null for a pattern no redirect declares', () => {
    const redirectFor = resolveRedirects({ '/old': '/new' });
    expect(redirectFor('/products', pathnameOf('/products'))).toBeNull();
  });

  it('refuses a target that names a param the pattern did not match', () => {
    const redirectFor = resolveRedirects({ '/old': '/:missing' });
    expect(() => redirectFor('/old', pathnameOf('/old'))).toThrow(/:missing/u);
  });
});
