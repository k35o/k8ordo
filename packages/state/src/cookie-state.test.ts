import { describe, expect, it } from 'vite-plus/test';
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

  it("reads through any get(name), as a server's cookie API offers it", () => {
    const jar: Record<string, string> = {
      'k8ordo-state.density': '{"density":"compact","fontSize":18}',
    };

    expect(density.parseCookies({ get: (name) => jar[name] })).toStrictEqual({
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

describe('cookie', () => {
  it('gives the name, the JSON of every field and the attributes the browser store writes', () => {
    expect(density.cookie({ density: 'compact' }, new Map())).toStrictEqual([
      'k8ordo-state.density',
      '{"density":"compact","fontSize":16}',
      { path: '/', sameSite: 'lax', maxAge: 34_560_000, httpOnly: false },
    ]);
  });

  it('lays the patch over the cookie the request carries, as update() does', () => {
    const current = new Map([
      ['k8ordo-state.density', '{"density":"comfortable","fontSize":18}'],
    ]);

    expect(density.cookie({ density: 'compact' }, current)[1]).toBe(
      '{"density":"compact","fontSize":18}',
    );
  });

  it('runs the merged values through the schema', () => {
    const current = new Map([
      ['k8ordo-state.density', '{"density":"cosy","fontSize":18}'],
    ]);

    expect(density.cookie({ fontSize: 3 }, current)[1]).toBe(
      '{"density":"comfortable","fontSize":16}',
    );
  });

  it('refuses a field the definition does not declare, as update() does', () => {
    expect(() =>
      // @ts-expect-error -- 型の外から来たフィールドを実行時にも断ることを確かめる
      density.cookie({ zoom: 2 }, new Map()),
    ).toThrow(/"density" has no field "zoom"/u);
  });
});
