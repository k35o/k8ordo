import { defineLocales } from './locales';
import { message } from './message';

declare module './register' {
  // oxlint-disable-next-line typescript/consistent-type-definitions -- augmentation needs a merge-open interface
  interface Register {
    locale: 'ja' | 'en';
  }
}

const locales = defineLocales(['ja', 'en']);
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
});
