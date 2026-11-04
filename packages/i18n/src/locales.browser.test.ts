import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vite-plus/test';

import { currentLocale } from './current';
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

// @k8ordo/framework の runtime が、別の pathname のために描いた HTML を
// hydrate する間だけ置き、終えたら消す
const HYDRATING = Symbol.for('@k8ordo/i18n/hydrating-pathname');
const hydrating = globalThis as { [HYDRATING]?: string | undefined };

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

  it('gives a library the URL locale, or null without a set whatever the URL spells', () => {
    const key = Symbol.for('@k8ordo/i18n/locales');
    const registry = globalThis as { [key]?: unknown };
    const saved = registry[key];
    const original = location.pathname;
    try {
      history.replaceState(null, '', '/en/ui');
      expect(currentLocale()).toBe('en');
      history.replaceState(null, '', '/fr/ui');
      expect(currentLocale()).toBe('ja');
      registry[key] = undefined;
      history.replaceState(null, '', '/ja/ui');
      expect(currentLocale()).toBeNull();
    } finally {
      registry[key] = saved;
      history.replaceState(null, '', original);
    }
  });
});

describe('getLocale under a base', () => {
  beforeEach(() => {
    vi.stubEnv('BASE_URL', '/docs/');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('reads the first segment below the base Vite serves the application under', () => {
    const original = location.pathname;
    try {
      history.replaceState(null, '', '/docs/en/ui');
      expect(locales.getLocale()).toBe('en');
      expect(home()).toBe('Home');
      history.replaceState(null, '', '/docs/');
      expect(locales.getLocale()).toBe('ja');
    } finally {
      history.replaceState(null, '', original);
    }
  });

  it('reads the pathname a framework is hydrating as it is given, in the table’s terms', () => {
    const original = location.pathname;
    try {
      history.replaceState(null, '', '/docs/ja/posts/3');
      hydrating[HYDRATING] = '/en/posts/!fallback';
      expect(home()).toBe('Home');
    } finally {
      hydrating[HYDRATING] = undefined;
      history.replaceState(null, '', original);
    }
  });
});

describe('while a framework hydrates HTML rendered for another pathname', () => {
  it('reads the locale of the pathname the HTML was rendered for, and the URL’s once hydration is done', () => {
    const original = location.pathname;
    try {
      // 404.html はビルドの番兵の pathname で描かれ、どの URL でも配られる
      history.replaceState(null, '', '/en/missing');
      hydrating[HYDRATING] = '/__k8ordo-not-found__/__k8ordo-not-found__';
      expect(home()).toBe('ホーム');
      expect(locales.getLocale()).toBe('ja');
      expect(currentLocale()).toBe('ja');

      hydrating[HYDRATING] = undefined;

      expect(home()).toBe('Home');
      expect(locales.getLocale()).toBe('en');
    } finally {
      hydrating[HYDRATING] = undefined;
      history.replaceState(null, '', original);
    }
  });
});
