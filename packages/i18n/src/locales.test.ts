import { defineLocales } from './locales';
import { message } from './message';

declare module './register' {
  // oxlint-disable-next-line typescript/consistent-type-definitions -- augmentation needs a merge-open interface
  interface Register {
    locale: 'ja' | 'en';
  }
}

const locales = defineLocales(['ja', 'en']);

describe('defineLocales', () => {
  it('takes the first locale as the default unless told otherwise', () => {
    expect(locales.default).toBe('ja');
    expect(defineLocales(['ja', 'en'], { default: 'en' }).default).toBe('en');
    expectTypeOf(locales.default).toEqualTypeOf<'ja'>();
    expectTypeOf(locales.all).toEqualTypeOf<ReadonlyArray<'ja' | 'en'>>();
  });

  it('refuses a default that is not listed, a repeated locale, and a tag that is not BCP 47', () => {
    expect(() =>
      // @ts-expect-error -- the default must be one of the list; the runtime check is for JS callers
      defineLocales(['ja', 'en'], { default: 'fr' }),
    ).toThrow(/default "fr" is not in/u);
    expect(() => defineLocales(['ja', 'ja'])).toThrow(/listed twice/u);
    expect(() => defineLocales(['ja', 'not a tag'])).toThrow(
      /not a BCP 47 language tag/u,
    );
  });

  it('checks membership as a type guard', () => {
    expect(locales.is('en')).toBe(true);
    expect(locales.is('fr')).toBe(false);
    expect(locales.is('EN')).toBe(false);
    expect(locales.is(undefined)).toBe(false);
    expectTypeOf(locales.is).guards.toEqualTypeOf<'ja' | 'en'>();
  });
});

describe('negotiate', () => {
  it('tries each requested tag in order: the exact tag, then its language', () => {
    const set = defineLocales(['ja', 'en', 'en-GB']);
    expect(set.negotiate(['en-GB'])).toBe('en-GB');
    expect(set.negotiate(['en-GB', 'en'])).toBe('en-GB');
    expect(set.negotiate(['en-US', 'en-GB'])).toBe('en');
    expect(set.negotiate(['en-US', 'ja'])).toBe('en');
    expect(set.negotiate(['ja-JP', 'en'])).toBe('ja');
  });

  it('falls back to the first supported locale that speaks a requested language', () => {
    expect(locales.negotiate(['en-US'])).toBe('en');
    expect(locales.negotiate(['fr', 'en-AU', 'ja'])).toBe('en');
    expect(defineLocales(['en-US', 'en-GB']).negotiate(['en'])).toBe('en-US');
  });

  it('matches tags case-insensitively', () => {
    expect(locales.negotiate(['EN'])).toBe('en');
    expect(defineLocales(['en-GB']).negotiate(['en-gb'])).toBe('en-GB');
  });

  it('returns the default when nothing matches, and skips tags that are not BCP 47', () => {
    expect(locales.negotiate([])).toBe('ja');
    expect(locales.negotiate(['fr', 'de'])).toBe('ja');
    expect(locales.negotiate(['***', 'en'])).toBe('en');
  });

  it('accepts any iterable, so navigator.languages passes as is', () => {
    expect(locales.negotiate(new Set(['en']))).toBe('en');
  });
});

describe('localize / delocalize', () => {
  it('puts the locale in front of a pathname and takes it back off', () => {
    expect(locales.localize('/ui', 'en')).toBe('/en/ui');
    expect(locales.localize('/', 'en')).toBe('/en');
    expect(locales.localize('', 'en')).toBe('/en');
    expect(locales.delocalize('/en/ui')).toStrictEqual({
      locale: 'en',
      pathname: '/ui',
    });
    expect(locales.delocalize('/en')).toStrictEqual({
      locale: 'en',
      pathname: '/',
    });
    expect(locales.delocalize('/en/')).toStrictEqual({
      locale: 'en',
      pathname: '/',
    });
  });

  it('reports a pathname without a locale segment as such, rather than guessing', () => {
    expect(locales.delocalize('/')).toStrictEqual({
      locale: null,
      pathname: '/',
    });
    expect(locales.delocalize('/fr/ui')).toStrictEqual({
      locale: null,
      pathname: '/fr/ui',
    });
    expect(locales.delocalize('/english')).toStrictEqual({
      locale: null,
      pathname: '/english',
    });
  });

  it('refuses to localize something that is not a pathname', () => {
    expect(() => locales.localize('ui', 'en')).toThrow(/not a pathname/u);
  });
});

describe('paths', () => {
  it('expands the locale segment once per locale and leaves other params to the build', () => {
    expect(
      locales.paths([
        '/:locale',
        '/:locale/ui/components/:name',
        '/blog/:slug',
      ]),
    ).toStrictEqual([
      '/ja',
      '/en',
      '/ja/ui/components/:name',
      '/en/ui/components/:name',
      '/blog/:slug',
    ]);
  });

  it('expands the segment, not a param whose name merely starts with it', () => {
    expect(locales.paths(['/:localeCode/x'])).toStrictEqual(['/:localeCode/x']);
  });
});

describe('paramsSchema', () => {
  it('accepts a listed locale and refuses anything else, in the Standard Schema shape', () => {
    const { validate } = locales.paramsSchema['~standard'];
    // 受理は enterWith で現在のロケールを置く。この describe の外に漏れない
    // よう、run の中で走らせる（run のスコープが終われば元に戻る）。
    expect(locales.run('ja', () => validate({ locale: 'en' }))).toStrictEqual({
      value: { locale: 'en' },
    });
    expect(validate({ locale: 'fr' })).toMatchObject({
      issues: [{ path: ['locale'] }],
    });
    expect(validate({})).toMatchObject({ issues: [{ path: ['locale'] }] });
    expect(validate(null)).toMatchObject({ issues: [{ path: ['locale'] }] });
  });

  it('strips everything but the locale, so sibling params keep their strings', () => {
    const { validate } = locales.paramsSchema['~standard'];
    expect(
      locales.run('ja', () => validate({ locale: 'ja', slug: 'x' })),
    ).toStrictEqual({
      value: { locale: 'ja' },
    });
  });
});

describe('message', () => {
  // 登録は後勝ちで、上の describe が別の集合を inline で定義しているので、
  // 文言が読む集合をここで戻す。
  beforeEach(() => {
    defineLocales(['ja', 'en']);
  });

  const nav = {
    home: message({ ja: 'ホーム', en: 'Home' }),
    greeting: message({
      ja: (name: string) => `こんにちは、${name}`,
      en: (name) => `Hello, ${name}`,
    }),
  };

  it('renders in the current locale, which is the default when nothing names one', () => {
    expect(nav.home()).toBe('ホーム');
    expect(nav.greeting('k8o')).toBe('こんにちは、k8o');
    expectTypeOf(nav.home).toEqualTypeOf<() => string>();
    expectTypeOf(nav.greeting).toEqualTypeOf<(name: string) => string>();
  });

  it('types the arguments from the annotated variant and holds the others to them', () => {
    expectTypeOf(nav.greeting).parameters.toEqualTypeOf<[name: string]>();
    // @ts-expect-error -- a plain message takes no arguments
    nav.home('x');
    // @ts-expect-error -- the argument is a string
    nav.greeting(1);
    message({
      // @ts-expect-error -- every locale takes the same arguments
      ja: (count: number) => `${String(count)} 件`,
      en: (count: string) => `${count} items`,
    });
  });

  it('refuses a message that lacks a locale where it is read, not where it is declared', () => {
    // 宣言時に throw すると、バンドラが宣言を副作用と見なして使われない文言を
    // 落とせなくなる。だから欠けは描画の瞬間に言う。
    // @ts-expect-error -- every locale needs a text
    const partial = message({ ja: 'x' });
    expect(locales.run('ja', () => partial())).toBe('x');
    expect(() => locales.run('en', () => partial())).toThrow(
      /no text for "en"/u,
    );
  });
});

describe('getLocale / run (server)', () => {
  it('reads what paramsSchema accepted for the rest of that request, and what run set', async () => {
    expect(locales.getLocale()).toBe('ja');
    const rendered = await locales.run('en', async () => {
      await Promise.resolve();
      return locales.getLocale();
    });
    expect(rendered).toBe('en');
    const viaSchema = await locales.run('ja', async () => {
      locales.paramsSchema['~standard'].validate({ locale: 'en' });
      await Promise.resolve();
      return locales.getLocale();
    });
    expect(viaSchema).toBe('en');
    expect(locales.getLocale()).toBe('ja');
  });

  it('refuses to accept or run a locale where there is no AsyncLocalStorage to keep it in', () => {
    const key = Symbol.for('@k8ordo/i18n/storage');
    const registry = globalThis as { [key]?: unknown };
    const saved = registry[key];
    const { getBuiltinModule } = process;
    try {
      registry[key] = undefined;
      Object.assign(process, { getBuiltinModule: undefined });
      const { validate } = locales.paramsSchema['~standard'];
      expect(() => validate({ locale: 'en' })).toThrow(/no AsyncLocalStorage/u);
      expect(() => locales.run('en', () => 'x')).toThrow(
        /no AsyncLocalStorage/u,
      );
      expect(validate({ locale: 'fr' })).toMatchObject({
        issues: [{ path: ['locale'] }],
      });
    } finally {
      Object.assign(process, { getBuiltinModule });
      registry[key] = saved;
    }
  });

  it('keeps concurrent renders apart', async () => {
    const seen = await Promise.all(
      (['en', 'ja', 'en'] as const).map((locale) =>
        locales.run(locale, async () => {
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 1);
          });
          return locales.getLocale();
        }),
      ),
    );
    expect(seen).toStrictEqual(['en', 'ja', 'en']);
  });
});
