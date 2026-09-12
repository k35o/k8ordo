/**
 * The one shape every validation library agrees on (Standard Schema), as far
 * as `@k8ordo/static` / `@k8ordo/server` read it for a route's `paramsSchema`.
 * Declared here rather than depended on so the package carries no schema
 * library: a locale set is a list, and a list can check membership itself.
 */
export type LocaleParamsSchema<L extends string> = {
  readonly '~standard': {
    readonly version: 1;
    readonly vendor: '@k8ordo/i18n';
    readonly validate: (value: unknown) =>
      | { readonly value: { readonly locale: L }; readonly issues?: undefined }
      | {
          readonly issues: ReadonlyArray<{
            readonly message: string;
            readonly path: readonly ['locale'];
          }>;
        };
    readonly types?:
      | {
          readonly input: { readonly locale: string };
          readonly output: { readonly locale: L };
        }
      | undefined;
  };
};

export type Delocalized<L extends string> = {
  /** The locale the first segment spelled, or `null` when it spelled none. */
  readonly locale: L | null;
  /** The pathname with that segment removed — never empty, `/` at least. */
  readonly pathname: string;
};

/**
 * An application's locale set. `L` is the union of its tags, `D` the default
 * among them — kept as its own parameter so a dictionary can name which
 * locale's messages set the shape the others must match.
 */
export type Locales<L extends string = string, D extends L = L> = {
  /** Every locale, in the order given; the first is the default unless told otherwise. */
  readonly all: readonly L[];
  /** The locale used when negotiation finds nothing better. */
  readonly default: D;
  /** Membership, as a type guard — the check `params.locale` and a pathname segment go through. */
  readonly is: (value: unknown) => value is L;
  /**
   * The best supported locale for a preference list — `navigator.languages`
   * in the browser, `parseAcceptLanguage(header)` on a server. Each requested
   * tag is tried in order — the exact tag, then the first supported locale
   * that speaks its language — and nothing matching is the default. A tag
   * that is not BCP 47 is skipped, not thrown on: the list is user input.
   */
  readonly negotiate: (requested: Iterable<string>) => L;
  /** `'/ui'` → `'/en/ui'`, `'/'` → `'/en'`. The pathname must not already carry a locale segment. */
  readonly localize: (pathname: string, locale: L) => string;
  /** The inverse: `'/en/ui'` → `{ locale: 'en', pathname: '/ui' }`, `'/x'` → `{ locale: null, pathname: '/x' }`. */
  readonly delocalize: (pathname: string) => Delocalized<L>;
  /**
   * A params schema for a `[locale]` route segment, in the shape
   * `@k8ordo/static` / `@k8ordo/server` run: `export const paramsSchema =
   * locales.paramsSchema` makes `/fr/…` a pathname the pattern does not answer.
   */
  readonly paramsSchema: LocaleParamsSchema<L>;
};

export type LocalesOptions<D extends string> = {
  /** The default locale. Must be one of the list; the first entry when omitted. */
  readonly default?: D;
};

/** The locale union of a `Locales` — `LocaleOf<typeof locales>`. */
export type LocaleOf<Ls> = Ls extends Locales<infer L, infer _D> ? L : never;

/** `Intl.Locale` throws a RangeError on a tag that is not BCP 47; that is the only check a tag needs. */
const parseTag = (tag: string): Intl.Locale | null => {
  try {
    return new Intl.Locale(tag);
  } catch {
    return null;
  }
};

/** `'/ui'` → `'/en/ui'`; `'/'` and `''` → `'/en'`. Pure over strings, so it lives outside the set. */
const localize = (pathname: string, locale: string): string => {
  const rest = pathname === '/' || pathname === '' ? '' : pathname;
  if (rest !== '' && !rest.startsWith('/')) {
    throw new TypeError(
      `localize: ${JSON.stringify(pathname)} is not a pathname — it does not start with "/"`,
    );
  }
  return `/${locale}${rest}`;
};

/**
 * Declares the locale set once. Everything that needs to know which locales
 * exist — the params schema of the `[locale]` segment, the static build's
 * path expansion, the language switcher, negotiation for a `/` redirect —
 * reads this value, so the list is spelled in one place.
 *
 * ```ts
 * export const locales = defineLocales(['ja', 'en']);
 * export const locales = defineLocales(['en-US', 'en-GB', 'ja'], { default: 'ja' });
 * ```
 */
export const defineLocales = <
  const All extends readonly [string, ...string[]],
  D extends All[number] = All[0],
>(
  all: All,
  options?: LocalesOptions<D>,
): Locales<All[number], D> => {
  type L = All[number];
  const list: readonly L[] = all;
  if (new Set(list).size !== list.length) {
    throw new TypeError(
      `defineLocales: a locale is listed twice in ${JSON.stringify(list)}`,
    );
  }
  // 型は既定値が一覧に含まれることを保証するが、`as` で通した値や JS からの
  // 呼び出しは通り抜ける。ここで確かめておけば negotiate が既定値を返した
  // 瞬間に「一覧に無いロケール」が漏れることはない。
  const fallback = (options?.default ?? list[0]) as D;
  if (!list.includes(fallback)) {
    throw new TypeError(
      `defineLocales: the default ${JSON.stringify(fallback)} is not in ${JSON.stringify(list)}`,
    );
  }
  const supported = list.map((tag) => {
    const parsed = parseTag(tag);
    if (parsed === null) {
      throw new TypeError(
        `defineLocales: ${JSON.stringify(tag)} is not a BCP 47 language tag`,
      );
    }
    return { tag, language: parsed.language };
  });
  const byExactTag = new Map(
    supported.map((s) => [s.tag.toLowerCase(), s.tag]),
  );

  const is = (value: unknown): value is L =>
    typeof value === 'string' && list.includes(value);

  const negotiate = (requested: Iterable<string>): L => {
    // 要求の順に、完全一致 → 同じ言語を話す最初の対応ロケール、の順で見る
    // (RFC 4647 の lookup と同じ形)。全要求の完全一致を先に探すと、
    // ['en-US', 'ja'] に対して 'en' を持っていても 'ja' が勝ってしまう。
    for (const tag of requested) {
      const exact = byExactTag.get(tag.toLowerCase());
      if (exact !== undefined) return exact;
      const parsed = parseTag(tag);
      if (parsed === null) continue;
      const spoken = supported.find((s) => s.language === parsed.language);
      if (spoken !== undefined) return spoken.tag;
    }
    return fallback;
  };

  const delocalize = (pathname: string): Delocalized<L> => {
    const first = pathname.split('/')[1] ?? '';
    if (!is(first)) return { locale: null, pathname };
    const rest = pathname.slice(first.length + 1);
    return { locale: first, pathname: rest === '' ? '/' : rest };
  };

  const paramsSchema: LocaleParamsSchema<L> = {
    '~standard': {
      version: 1,
      vendor: '@k8ordo/i18n',
      validate: (value) => {
        const locale =
          typeof value === 'object' && value !== null && 'locale' in value
            ? value.locale
            : undefined;
        return is(locale)
          ? { value: { locale } }
          : {
              issues: [
                {
                  message: `expected one of ${JSON.stringify(list)}, received ${JSON.stringify(locale)}`,
                  path: ['locale'],
                },
              ],
            };
      },
    },
  };

  return {
    all: list,
    default: fallback,
    is,
    negotiate,
    localize,
    delocalize,
    paramsSchema,
  };
};
