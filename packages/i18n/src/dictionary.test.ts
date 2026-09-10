import { defineDictionary } from './dictionary';
import type { MessageKeyOf, TextKeyOf, Translations } from './dictionary';
import { defineLocales } from './locales';

const locales = defineLocales(['ja', 'en']);

const ja = {
  'nav.home': 'ホーム',
  greeting: (name: string) => `こんにちは、${name}`,
  items: (count: number) => `${new Intl.NumberFormat('ja').format(count)} 件`,
};

const en: Translations<typeof ja> = {
  'nav.home': 'Home',
  greeting: (name) => `Hello, ${name}`,
  items: (count) =>
    `${new Intl.NumberFormat('en').format(count)} ${new Intl.PluralRules('en').select(count) === 'one' ? 'item' : 'items'}`,
};

const dictionary = defineDictionary(locales, { ja, en });

describe('defineDictionary', () => {
  it('answers a string key with the text and a function key with its result', () => {
    const t = dictionary.translator('en');
    expect(t('nav.home')).toBe('Home');
    expect(t('greeting', 'k8o')).toBe('Hello, k8o');
    expect(t('items', 1)).toBe('1 item');
    expect(dictionary.translator('ja')('items', 1234)).toBe('1,234 件');
  });

  it('types the arguments from the default locale message', () => {
    const t = dictionary.translator('ja');
    // @ts-expect-error -- a plain string takes no arguments
    t('nav.home', 'extra');
    // @ts-expect-error -- greeting takes a string
    t('greeting', 1);
    // @ts-expect-error -- an unknown key
    t('nav.missing');
    expectTypeOf<MessageKeyOf<typeof dictionary>>().toEqualTypeOf<
      'nav.home' | 'greeting' | 'items'
    >();
    expectTypeOf<TextKeyOf<typeof dictionary>>().toEqualTypeOf<'nav.home'>();
  });

  it('refuses to call a key that may be a function without knowing its arguments', () => {
    const t = dictionary.translator('ja');
    const textKey = 'nav.home';
    expect(t(textKey)).toBe('ホーム');
    const anyKey = 'nav.home' as MessageKeyOf<typeof dictionary>;
    // @ts-expect-error -- a union of a string key and a function key cannot be called with no arguments
    expect(t(anyKey)).toBe('ホーム');
  });

  it('holds every locale to the default locale shape at compile time', () => {
    // 型だけの検査。呼ぶと実行時の検査にも引っかかるので、呼ばない関数に包む。
    const typeOnly = () => {
      defineDictionary(locales, {
        ja,
        // @ts-expect-error -- `items` is missing from en
        en: { 'nav.home': 'Home', greeting: (name: string) => name },
      });
      defineDictionary(locales, {
        ja,
        // @ts-expect-error -- greeting takes a string, not a number
        en: { ...en, greeting: (n: number) => `${String(n)}!` },
      });
      // @ts-expect-error -- en is missing altogether
      defineDictionary(locales, { ja });
    };
    expect(typeOnly).toBeTypeOf('function');
  });

  it('refuses at definition time what the types could not see', () => {
    expect(() =>
      defineDictionary(locales, {
        ja,
        en: { 'nav.home': 'Home' } as unknown as typeof en,
      }),
    ).toThrow(/"en" has no message for "greeting"/u);
    expect(() =>
      defineDictionary(locales, { ja } as unknown as {
        ja: typeof ja;
        en: typeof en;
      }),
    ).toThrow(/no messages for "en"/u);
  });

  it('returns the same translator for the same locale', () => {
    expect(dictionary.translator('en')).toBe(dictionary.translator('en'));
    expect(dictionary.translator('en')).not.toBe(dictionary.translator('ja'));
  });

  it('refuses a locale outside the set rather than answering undefined', () => {
    expect(() => dictionary.translator('fr' as 'en')).toThrow(
      /"fr" is not one of/u,
    );
  });

  it('exposes the messages and the locale set it was given', () => {
    expect(dictionary.messages.en['nav.home']).toBe('Home');
    expect(dictionary.locales).toBe(locales);
  });
});
