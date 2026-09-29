import { z } from 'zod';

import { defineCookieState } from './cookie-state';

const density = defineCookieState(
  'density',
  z.object({
    density: z.enum(['comfortable', 'compact']).default('comfortable'),
    fontSize: z.number().int().min(12).default(16),
  }),
);

describe('defineCookieState', () => {
  it('applies the absence rule to cookie fields too', () => {
    expect(() =>
      defineCookieState('strict-cookie', z.object({ view: z.string() })),
    ).toThrow(/cookie fields.*view/u);
  });

  it('exposes the cookie name the store writes under', () => {
    expect(density.cookieName).toBe('k8ordo-state.density');
  });

  it('refuses a key that cannot name a cookie', () => {
    for (const key of ['a b', 'a;b', 'a=b', 'a:b', 'ä']) {
      expect(() =>
        defineCookieState(key, z.object({ n: z.number().default(0) })),
      ).toThrow(/cannot name a cookie/u);
    }
  });
});

describe('parseCookies', () => {
  it('reads the values out of the request cookies', () => {
    const cookies = new Map([
      ['session', 'opaque'],
      ['k8ordo-state.density', '{"density":"compact","fontSize":18}'],
    ]);

    expect(density.parseCookies(cookies)).toStrictEqual({
      density: 'compact',
      fontSize: 18,
    });
  });

  it('gives the defaults when the cookie is absent', () => {
    expect(density.parseCookies(new Map())).toStrictEqual({
      density: 'comfortable',
      fontSize: 16,
    });
  });

  it('gives the defaults instead of throwing on corrupt JSON', () => {
    const cookies = new Map([['k8ordo-state.density', '{"density":']]);

    expect(density.parseCookies(cookies)).toStrictEqual({
      density: 'comfortable',
      fontSize: 16,
    });
  });

  it('salvages a field an older schema wrote on its own', () => {
    const cookies = new Map([
      ['k8ordo-state.density', '{"density":"cosy","fontSize":18}'],
    ]);

    expect(density.parseCookies(cookies)).toStrictEqual({
      density: 'comfortable',
      fontSize: 18,
    });
  });
});

describe('cookieValue', () => {
  it('writes the JSON of every field, defaults filled in', () => {
    expect(density.cookieValue({ density: 'compact' })).toBe(
      '{"density":"compact","fontSize":16}',
    );
  });

  it('runs the values through the schema first', () => {
    expect(density.cookieValue({ fontSize: 3 })).toBe(
      '{"density":"comfortable","fontSize":16}',
    );
  });
});
