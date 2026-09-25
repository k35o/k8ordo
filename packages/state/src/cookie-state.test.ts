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
  it('writes the percent-encoded JSON of every field, defaults filled in', () => {
    expect(density.cookieValue({ density: 'compact' })).toBe(
      '%7B%22density%22%3A%22compact%22%2C%22fontSize%22%3A16%7D',
    );
  });

  it('runs the values through the schema first', () => {
    expect(density.cookieValue({ fontSize: 3 })).toBe(
      '%7B%22density%22%3A%22comfortable%22%2C%22fontSize%22%3A16%7D',
    );
  });

  it('holds only characters a cookie value may carry, whatever the values are', () => {
    const note = defineCookieState(
      'note',
      z.object({ text: z.string().default('') }),
    );

    // 入力は、RFC 6265 の cookie-octet に入らない文字（空白・`"`・`,`・`;`・
    // `\`・非 ASCII）をひととおり含む
    const value = note.cookieValue({ text: 'a; b, "c" \\ d ü' });

    for (const outside of [' ', '"', ',', ';', '\\', 'ü']) {
      expect(value).not.toContain(outside);
    }
  });

  it('is read back by parseCookies once a server has decoded it', () => {
    const value = density.cookieValue({ density: 'compact', fontSize: 20 });
    // サーバーの Cookie パーサー（@k8ordo/server の request.cookies）は値を
    // decodeURIComponent してから渡す
    const cookies = new Map([[density.cookieName, decodeURIComponent(value)]]);

    expect(density.parseCookies(cookies)).toStrictEqual({
      density: 'compact',
      fontSize: 20,
    });
  });
});
