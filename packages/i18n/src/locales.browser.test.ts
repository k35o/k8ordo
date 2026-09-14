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

  it('refuses run: the URL is the locale here', () => {
    expect(() => locales.run('en', () => 'x')).toThrow(
      /the URL is the locale/u,
    );
  });
});
