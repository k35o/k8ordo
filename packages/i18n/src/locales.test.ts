import { defineLocales } from './locales';

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

describe('paramsSchema', () => {
  it('accepts a listed locale and refuses anything else, in the Standard Schema shape', () => {
    const { validate } = locales.paramsSchema['~standard'];
    expect(validate({ locale: 'en' })).toStrictEqual({
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
    expect(validate({ locale: 'ja', slug: 'x' })).toStrictEqual({
      value: { locale: 'ja' },
    });
  });
});
