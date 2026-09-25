import type { LocaleDefinition } from './locales';

/**
 * `Intl.DateTimeFormatOptions` without a `timeZone`: the locale's own is the
 * only one a date is written in, so the server's HTML and the browser's
 * render agree. A date that should follow each visitor's zone is `Intl`'s own
 * business, in a part that renders in the browser only.
 */
export type LocaleDateTimeFormatOptions = Intl.DateTimeFormatOptions & {
  readonly timeZone?: never;
};

/**
 * `Intl`, drawn for the current locale. Each returns the `Intl` object
 * itself — `format`, `formatToParts`, `formatRange`, `select`,
 * `resolvedOptions` are all there — made once per locale and options and
 * reused after that.
 */
export type IntlFormats = {
  /** `Intl.DateTimeFormat` in the current locale and that locale's `timeZone`. */
  readonly dateTimeFormat: (
    options?: LocaleDateTimeFormatOptions,
  ) => Intl.DateTimeFormat;
  /** `Intl.NumberFormat` in the current locale. */
  readonly numberFormat: (
    options?: Intl.NumberFormatOptions,
  ) => Intl.NumberFormat;
  /** `Intl.RelativeTimeFormat` in the current locale. */
  readonly relativeTimeFormat: (
    options?: Intl.RelativeTimeFormatOptions,
  ) => Intl.RelativeTimeFormat;
  /** `Intl.PluralRules` in the current locale. */
  readonly pluralRules: (options?: Intl.PluralRulesOptions) => Intl.PluralRules;
  /** `Intl.ListFormat` in the current locale. */
  readonly listFormat: (options?: Intl.ListFormatOptions) => Intl.ListFormat;
};

/**
 * An `Intl` constructor behind a cache keyed by locale and options. The
 * options are keyed by their JSON: two spellings of the same options make two
 * entries, which costs a duplicate, never a wrong answer.
 */
const cached = <L extends string, O extends object, T>(
  current: () => L,
  create: (locale: L, options: O | undefined) => T,
): ((options?: O) => T) => {
  const made = new Map<string, T>();
  return (options) => {
    const locale = current();
    const key = `${locale}\u0000${JSON.stringify(options ?? {})}`;
    const existing = made.get(key);
    if (existing !== undefined) return existing;
    const created = create(locale, options);
    made.set(key, created);
    return created;
  };
};

/** The members of a locale set that draw `Intl` for its current locale. */
export const intlFormats = <L extends string>(
  getLocale: () => L,
  definitions: Readonly<Record<L, LocaleDefinition>>,
): IntlFormats => ({
  dateTimeFormat: cached(
    getLocale,
    (locale, options: LocaleDateTimeFormatOptions | undefined) =>
      // 型が timeZone を拒んでも、`as` で通した値が来うる。ロケールの
      // タイムゾーンを後に書いて、必ずそちらを使う。
      new Intl.DateTimeFormat(locale, {
        ...options,
        timeZone: definitions[locale].timeZone,
      }),
  ),
  numberFormat: cached(
    getLocale,
    (locale, options: Intl.NumberFormatOptions | undefined) =>
      new Intl.NumberFormat(locale, options),
  ),
  relativeTimeFormat: cached(
    getLocale,
    (locale, options: Intl.RelativeTimeFormatOptions | undefined) =>
      new Intl.RelativeTimeFormat(locale, options),
  ),
  pluralRules: cached(
    getLocale,
    (locale, options: Intl.PluralRulesOptions | undefined) =>
      new Intl.PluralRules(locale, options),
  ),
  listFormat: cached(
    getLocale,
    (locale, options: Intl.ListFormatOptions | undefined) =>
      new Intl.ListFormat(locale, options),
  ),
});
