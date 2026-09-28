import { defineLocales } from '@k8ordo/i18n';

import { getLocale, getMessages, registerMessages } from './current';
import { en } from './en';
import { ja } from './ja';

// @k8ordo/i18n の集合も ui の辞書も globalThis に登録されるので、テストごとに
// 空へ戻し、終わったら元に戻す。
const LOCALES_KEY = Symbol.for('@k8ordo/i18n/locales');
const MESSAGES_KEY = Symbol.for('@k8ordo/ui/messages');
const registry = globalThis as {
  [LOCALES_KEY]?: unknown;
  [MESSAGES_KEY]?: unknown;
};

const tokyo = { timeZone: 'Asia/Tokyo', dir: 'ltr' } as const;
const utc = { timeZone: 'UTC', dir: 'ltr' } as const;

let saved: { locales: unknown; messages: unknown };
beforeEach(() => {
  saved = { locales: registry[LOCALES_KEY], messages: registry[MESSAGES_KEY] };
  registry[LOCALES_KEY] = undefined;
  registry[MESSAGES_KEY] = undefined;
});
afterEach(() => {
  registry[LOCALES_KEY] = saved.locales;
  registry[MESSAGES_KEY] = saved.messages;
});

describe('getMessages', () => {
  it('speaks English where the application has defined no locale set', () => {
    expect(getLocale()).toBe('en');
    expect(getMessages()).toBe(en);
  });

  it("follows @k8ordo/i18n's current locale, which is the set's default when nothing names one", () => {
    const locales = defineLocales({ ja: tokyo, en: utc });
    expect(getMessages()).toBe(ja);
    expect(locales.run('en', () => getMessages())).toBe(en);
  });

  it("reads a regional tag's language when the tag has no text of its own", () => {
    const locales = defineLocales({ 'ja-JP': tokyo, 'en-US': utc });
    expect(getMessages()).toBe(ja);
    expect(locales.run('en-US', () => getMessages())).toBe(en);
  });

  it('reads a registered dictionary, and a registered one over the built-in', () => {
    const locales = defineLocales({ ja: tokyo, fr: utc });
    const fr = { ...en, close: 'Fermer' };
    registerMessages('fr', fr);
    expect(locales.run('fr', () => getMessages().close)).toBe('Fermer');
    registerMessages('ja', { ...ja, close: '閉じる（Esc）' });
    expect(getMessages().close).toBe('閉じる（Esc）');
  });

  it('refuses a locale nothing has text for, naming how to register it', () => {
    const locales = defineLocales({ ja: tokyo, fr: utc });
    expect(() => locales.run('fr', () => getMessages())).toThrow(
      /no built-in text for "fr" — register it with registerMessages\("fr", …\)/u,
    );
  });
});
