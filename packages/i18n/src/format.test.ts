import { defineLocales } from './locales';

// ja と en でタイムゾーンの日付が分かれる瞬間（東京は 3/6 0:30、ニューヨーク
// は 3/5 10:30）を使う。実行環境のタイムゾーンが東京でも UTC でも、どちらか
// のアサーションが落ちるので、ロケールのタイムゾーンを使っていることが分かる。
const instant = new Date('2022-03-05T15:30:00Z');
const numeric = { year: 'numeric', month: 'numeric', day: 'numeric' } as const;

const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'America/New_York', dir: 'ltr' },
  de: { timeZone: 'Europe/Berlin', dir: 'ltr' },
});

describe('dateTimeFormat', () => {
  it("writes a date in the current locale's time zone, whatever the runtime's", () => {
    expect(
      locales.run('ja', () => locales.dateTimeFormat(numeric).format(instant)),
    ).toBe('2022/3/6');
    expect(
      locales.run('en', () => locales.dateTimeFormat(numeric).format(instant)),
    ).toBe('3/5/2022');
    expect(
      locales.run('en', () =>
        locales.dateTimeFormat({ timeZoneName: 'short' }).resolvedOptions(),
      ).timeZone,
    ).toBe('America/New_York');
  });

  it('refuses another time zone in its type, and keeps the locale’s when one is forced through', () => {
    // @ts-expect-error -- the locale's time zone is the only one; a visitor's own zone is Intl's business
    locales.dateTimeFormat({ timeZone: 'UTC' });
    const forced = { ...numeric, timeZone: 'UTC' } as object;
    expect(
      locales.run('ja', () => locales.dateTimeFormat(forced).format(instant)),
    ).toBe('2022/3/6');
  });

  it('renders in the default locale when nothing names one', () => {
    expect(locales.dateTimeFormat(numeric).format(instant)).toBe('2022/3/6');
  });
});

describe('numberFormat / relativeTimeFormat / pluralRules / listFormat', () => {
  it('draws each in the current locale', () => {
    expect(locales.run('de', () => locales.numberFormat().format(1234.5))).toBe(
      '1.234,5',
    );
    expect(
      locales.run('en', () =>
        locales.relativeTimeFormat({ numeric: 'auto' }).format(-1, 'day'),
      ),
    ).toBe('yesterday');
    expect(
      locales.run('ja', () =>
        locales.relativeTimeFormat({ numeric: 'auto' }).format(-1, 'day'),
      ),
    ).toBe('昨日');
    expect(locales.run('en', () => locales.pluralRules().select(1))).toBe(
      'one',
    );
    expect(locales.run('ja', () => locales.pluralRules().select(1))).toBe(
      'other',
    );
    expect(
      locales.run('en', () => locales.listFormat().format(['a', 'b', 'c'])),
    ).toBe('a, b, and c');
  });
});

describe('the cache', () => {
  it('returns the same object for the same locale and options, and a new one otherwise', () => {
    const first = locales.run('en', () => locales.numberFormat());
    expect(locales.run('en', () => locales.numberFormat())).toBe(first);
    expect(locales.run('en', () => locales.numberFormat({}))).toBe(first);
    expect(locales.run('ja', () => locales.numberFormat())).not.toBe(first);
    expect(
      locales.run('en', () => locales.numberFormat({ style: 'percent' })),
    ).not.toBe(first);
  });
});
