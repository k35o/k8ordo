import { parseAcceptLanguage } from './accept-language';
import { readCookie } from './cookie';
import { browserPathname, inBrowser, localeStorage, register } from './current';
import type { LocaleStorage } from './current';
import { intlFormats } from './format';
import type { IntlFormats } from './format';

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
 * What a locale carries besides its tag. Both are declared rather than
 * derived: the runtime's own time zone differs between a server and each
 * visitor's browser, and `Intl.Locale#getTextInfo` has not reached every
 * browser.
 */
export type LocaleDefinition = {
  /**
   * The IANA time zone this locale's dates are shown in (`'Asia/Tokyo'`) —
   * the same one on the server and in every browser, so a date renders the
   * same on both sides.
   */
  readonly timeZone: string;
  /** The direction its text runs in: `<html dir>`. */
  readonly dir: 'ltr' | 'rtl';
};

/**
 * An application's locale set. `L` is the union of its tags, `D` the default
 * among them.
 */
export type Locales<
  L extends string = string,
  D extends L = L,
> = IntlFormats & {
  /** Every locale, in the order defined; the first is the default unless told otherwise. */
  readonly all: readonly L[];
  /** Each locale's definition, as given: `definitions[locale].dir` for `<html dir>`. */
  readonly definitions: Readonly<Record<L, LocaleDefinition>>;
  /** The locale used when negotiation finds nothing better, and when nothing names one. */
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
  /**
   * The locale a request asks for, for a server that answers before any
   * page renders — sending `/` to a locale. The cookie named in `options`
   * comes first, when the request carries it: it is the visitor's own choice,
   * written where they switched language. Then the `Accept-Language` header,
   * in its order of preference. Each goes through `negotiate`, so a cookie
   * holding a locale the set no longer has falls through to the header, and
   * nothing matching is the default.
   */
  readonly negotiateRequest: (
    request: Request,
    options?: NegotiateRequestOptions,
  ) => L;
  /**
   * `'/ui'` → `'/en/ui'`, `'/'` → `'/en'`. Hand it a pathname without a
   * locale segment, as `delocalize` returns one: that is not checked, so
   * `localize('/en/ui', 'ja')` is `'/ja/en/ui'`.
   */
  readonly localize: (pathname: string, locale: L) => string;
  /** The inverse: `'/en/ui'` → `{ locale: 'en', pathname: '/ui' }`, `'/x'` → `{ locale: null, pathname: '/x' }`. */
  readonly delocalize: (pathname: string) => Delocalized<L>;
  /**
   * The static build's `paths` option: every pattern that has a `/:locale`
   * segment, once per locale, so `framework({ paths: locales.paths })` is
   * the whole answer for a site whose only parameter is the locale. A
   * pattern with another parameter comes back still holding it
   * (`/ja/blog/:slug`), which the build does not render: expand the rest in
   * the same function.
   */
  readonly paths: (patterns: readonly string[]) => string[];
  /**
   * A params schema for a `[locale]` route segment, in the shape
   * `@k8ordo/static` / `@k8ordo/server` run: `export const paramsSchema =
   * locales.paramsSchema` makes `/fr/…` a pathname the pattern does not
   * answer. On a server, accepting a locale also makes it the current one for
   * the render of the page that accepted it, which is how `getLocale()` knows
   * it there; a server runtime without `AsyncLocalStorage` throws instead.
   */
  readonly paramsSchema: LocaleParamsSchema<L>;
  /**
   * The locale of the render in progress. In the browser it is the first
   * segment of `location.pathname` below Vite's `base`; on the server it is what `paramsSchema`
   * accepted for this request, or what `run` set. Neither names one → the
   * default. Not a hook: call it anywhere, including inside a message.
   */
  readonly getLocale: () => L;
  /**
   * Runs `fn` with `locale` as the current one for everything it starts —
   * a test, a Server Action, code outside a `[locale]` route. Server only:
   * in the browser the URL is the locale.
   */
  readonly run: <T>(locale: L, fn: () => T) => T;
};

export type NegotiateRequestOptions = {
  /**
   * The cookie holding the visitor's choice (`'locale'`). The name is the
   * application's: whatever writes it — a language switcher's
   * `cookieStore.set` — uses the same one. Omitted, only `Accept-Language`
   * is read.
   */
  readonly cookie?: string;
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
 * Where a server keeps the locale. Without one this throws rather than
 * falling back: the locale set would be ignored and the page rendered in the
 * default.
 */
const serverStorage = (caller: string): LocaleStorage => {
  const storage = localeStorage();
  if (storage === null) {
    throw new Error(
      `${caller}: this runtime has no AsyncLocalStorage to scope a locale to`,
    );
  }
  return storage;
};

/** Server only: the browser has no request, and its URL already is the locale. */
const run = <T>(locale: string, fn: () => T): T => {
  if (inBrowser) {
    throw new Error(
      'locales.run: in the browser the URL is the locale — navigate instead',
    );
  }
  return serverStorage('locales.run').run(locale, fn);
};

/**
 * `Intl.DateTimeFormat` throws a RangeError on a time zone it does not know,
 * and quietly takes the runtime's own for a missing one — the very value
 * that differs between a server and a browser — so both are `null` here.
 */
const resolveTimeZone = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  try {
    return new Intl.DateTimeFormat('en', { timeZone: value }).resolvedOptions()
      .timeZone;
  } catch {
    return null;
  }
};

/**
 * Declares the locale set once. Everything that needs to know which locales
 * exist — the params schema of the `[locale]` segment, the static build's
 * path expansion, the language switcher, negotiation for a `/` redirect,
 * every message — reads this value, so the list is spelled in one place.
 *
 * ```ts
 * export const locales = defineLocales({
 *   ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
 *   en: { timeZone: 'America/New_York', dir: 'ltr' },
 * });
 * ```
 */
export const defineLocales = <
  const Definitions extends Readonly<Record<string, LocaleDefinition>>,
  D extends keyof Definitions & string = keyof Definitions & string,
>(
  definitions: Definitions,
  options?: LocalesOptions<D>,
): Locales<keyof Definitions & string, D> => {
  type L = keyof Definitions & string;
  // BCP 47 のタグは英字で始まるので、整数に見えるキーは無く、オブジェクトの
  // キーは書いた順に並ぶ。
  const byTag: Readonly<Record<L, LocaleDefinition>> = definitions;
  const list = Object.keys(byTag) as L[];
  if (list.length === 0) {
    throw new TypeError('defineLocales: no locale is defined');
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
    // 型は必須で 'ltr' | 'rtl' に絞るが、JS からの呼び出しは通り抜ける。
    const { timeZone, dir }: { timeZone: unknown; dir: unknown } = byTag[tag];
    if (resolveTimeZone(timeZone) === null) {
      throw new TypeError(
        `defineLocales: the timeZone of ${JSON.stringify(tag)}, ${JSON.stringify(timeZone)}, is not a time zone`,
      );
    }
    if (dir !== 'ltr' && dir !== 'rtl') {
      throw new TypeError(
        `defineLocales: the dir of ${JSON.stringify(tag)}, ${JSON.stringify(dir)}, is neither "ltr" nor "rtl"`,
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

  const negotiateRequest = (
    request: Request,
    { cookie }: NegotiateRequestOptions = {},
  ): L => {
    const chosen =
      cookie === undefined
        ? null
        : readCookie(request.headers.get('cookie'), cookie);
    return negotiate([
      ...(chosen === null ? [] : [chosen]),
      ...parseAcceptLanguage(request.headers.get('accept-language')),
    ]);
  };

  // By segment, not by substring: `:localeCode` is somebody else's param.
  const paths = (patterns: readonly string[]): string[] =>
    patterns.flatMap((pattern) => {
      const segments = pattern.split('/');
      if (!segments.includes(':locale')) return [pattern];
      return list.map((locale) =>
        segments
          .map((segment) => (segment === ':locale' ? locale : segment))
          .join('/'),
      );
    });

  const delocalize = (pathname: string): Delocalized<L> => {
    const first = pathname.split('/')[1] ?? '';
    if (!is(first)) return { locale: null, pathname };
    const rest = pathname.slice(first.length + 1);
    return { locale: first, pathname: rest === '' ? '/' : rest };
  };

  const getLocale = (): L => {
    if (inBrowser) {
      return delocalize(browserPathname()).locale ?? fallback;
    }
    const current = localeStorage()?.getStore();
    return is(current) ? current : fallback;
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
        if (!is(locale)) {
          return {
            issues: [
              {
                message: `expected one of ${JSON.stringify(list)}, received ${JSON.stringify(locale)}`,
                path: ['locale'],
              },
            ],
          };
        }
        // validate は描画を包めないので run ではなく enterWith で書く。値が
        // どの描画に届くかは、スキーマを走らせる側（フレームワーク）が決める。
        if (!inBrowser) serverStorage('locales.paramsSchema').enterWith(locale);
        return { value: { locale } };
      },
    },
  };

  // message() は集合を引数に取らない（取ると宣言がバンドラに副作用と映る）
  // ので、既定値と membership はここで登録して、そちらから読ませる。
  register({ default: fallback, is });

  return {
    all: list,
    definitions: byTag,
    default: fallback,
    is,
    negotiate,
    negotiateRequest,
    localize,
    delocalize,
    paths,
    paramsSchema,
    getLocale,
    run,
    ...intlFormats(getLocale, byTag),
  };
};
