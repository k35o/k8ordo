import { defineLocales } from './locales';
import { message } from './message';

declare module './register' {
  // oxlint-disable-next-line typescript/consistent-type-definitions -- augmentation needs a merge-open interface
  interface Register {
    locale: 'ja' | 'en';
  }
}

const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'America/New_York', dir: 'ltr' },
});
const home = message({ ja: 'ホーム', en: 'Home' });

describe('getLocale (browser)', () => {
  it('is the first segment of location.pathname, or the default when the URL has none', () => {
    const original = location.pathname;
    try {
      history.replaceState(null, '', '/en/ui');
      expect(locales.getLocale()).toBe('en');
      expect(home()).toBe('Home');
      history.replaceState(null, '', '/ja');
      expect(home()).toBe('ホーム');
      history.replaceState(null, '', '/');
      expect(locales.getLocale()).toBe('ja');
      history.replaceState(null, '', '/fr/ui');
      expect(home()).toBe('ホーム');
    } finally {
      history.replaceState(null, '', original);
    }
  });

  it('treats a segment no message has text for as no locale until a set is defined', () => {
    // ロケール集合を定義するモジュールが client のグラフに無いアプリでは、
    // 文言が最初に呼ばれる時点で集合が未登録のことがある。404 ページの
    // `/fr/…` で throw せず、既定（先頭の文言）に落ちること。
    const key = Symbol.for('@k8ordo/i18n/locales');
    const registry = globalThis as { [key]?: unknown };
    const saved = registry[key];
    const original = location.pathname;
    try {
      registry[key] = undefined;
      history.replaceState(null, '', '/fr/ui');
      expect(home()).toBe('ホーム');
      history.replaceState(null, '', '/en/ui');
      expect(home()).toBe('Home');
    } finally {
      registry[key] = saved;
      history.replaceState(null, '', original);
    }
  });

  it('accepts a locale in paramsSchema without anywhere to keep it: the URL already is the locale', () => {
    expect(
      locales.paramsSchema['~standard'].validate({ locale: 'en' }),
    ).toStrictEqual({ value: { locale: 'en' } });
  });

  it('refuses run: the URL is the locale here', () => {
    expect(() => locales.run('en', () => 'x')).toThrow(
      /the URL is the locale/u,
    );
  });

  it("writes a date in the time zone of the URL's locale, not the browser's", () => {
    // 東京は 3/6 0:30、ニューヨークは 3/5 10:30。ブラウザのタイムゾーンが
    // どちらでも、片方のアサーションが落ちる。
    const instant = new Date('2022-03-05T15:30:00Z');
    const numeric = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    } as const;
    const original = location.pathname;
    try {
      history.replaceState(null, '', '/ja/ui');
      expect(locales.dateTimeFormat(numeric).format(instant)).toBe('2022/3/6');
      history.replaceState(null, '', '/en/ui');
      expect(locales.dateTimeFormat(numeric).format(instant)).toBe('3/5/2022');
    } finally {
      history.replaceState(null, '', original);
    }
  });
});
