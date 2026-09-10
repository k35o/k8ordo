import type { Locales } from './locales';

/** A message: the text itself, or a function of the values the text needs. */
export type Message = string | ((...args: never[]) => string);

/** The messages of one locale, keyed by name. */
export type Messages = Readonly<Record<string, Message>>;

/**
 * What every other locale must supply once the default locale's messages are
 * written: the same keys, a string where the default has a string, and a
 * function of the same parameters where the default has a function. Annotate
 * each translation with it — `export const en: Translations<typeof ja> = …` —
 * so a key added to the default is a compile error until it is translated.
 */
export type Translations<Base extends Messages> = {
  readonly [K in keyof Base]: Base[K] extends (...args: infer A) => string
    ? (...args: A) => string
    : string;
};

/** The keys a dictionary answers to — `MessageKeyOf<typeof dictionary>`. */
export type MessageKeyOf<D> =
  D extends Dictionary<infer _L, infer _D, infer M> ? keyof M & string : never;

/**
 * The keys whose message is plain text, callable as `t(key)` with nothing
 * else — what a component that takes a key as a prop should accept.
 */
export type TextKeyOf<D> =
  D extends Dictionary<infer _L, infer _D, infer M>
    ? { [K in keyof M]: M[K] extends string ? K & string : never }[keyof M]
    : never;

// 分配しない。`'a' | 'b'` のように文字列と関数が混ざった union は、引数なしで
// 呼べてしまう（関数側が引数なしで走る）のではなく、呼べない型にする。
type ArgsOf<M extends Message> = [M] extends [string]
  ? []
  : [M] extends [(...args: infer A) => string]
    ? A
    : never;

/** `t`: a key, plus the arguments its message takes — none for a plain string. */
export type Translator<M extends Messages> = <K extends keyof M & string>(
  key: K,
  ...args: ArgsOf<M[K]>
) => string;

export type Dictionary<
  L extends string = string,
  D extends L = L,
  M extends Messages = Messages,
> = {
  readonly locales: Locales<L, D>;
  /** The messages per locale, as given. */
  readonly messages: Readonly<Record<L, Translations<M>>>;
  /**
   * The `t` of one locale — what a Server Component calls with the
   * `params.locale` it was rendered for. The same locale returns the same
   * function, so it is safe to hand to `useMemo` and to compare.
   */
  readonly translator: (locale: L) => Translator<M>;
};

/**
 * Pairs the locale set with the messages of every locale. The default
 * locale's messages set the shape; each other locale must match it key for
 * key, which is checked where the dictionary is defined, not where a key is
 * read.
 *
 * ```ts
 * export const dictionary = defineDictionary(locales, { ja, en });
 * ```
 */
export const defineDictionary = <
  L extends string,
  D extends L,
  const Msgs extends Readonly<Record<L, Messages>>,
>(
  locales: Locales<L, D>,
  messages: Msgs & Readonly<Record<L, Translations<Msgs[D]>>>,
): Dictionary<L, D, Msgs[D]> => {
  type M = Msgs[D];
  const base = messages[locales.default];
  // 型は既定ロケールの形に他が揃うことを保証するが、JS から呼ばれた辞書や
  // `as` を通した辞書は通り抜ける。キーの不足は t() で undefined を返す
  // のではなく、辞書を作った場所で言う。
  for (const locale of locales.all) {
    const own = messages[locale];
    if (own === undefined) {
      throw new TypeError(
        `defineDictionary: no messages for ${JSON.stringify(locale)}`,
      );
    }
    for (const key of Object.keys(base)) {
      if (!(key in own)) {
        throw new TypeError(
          `defineDictionary: ${JSON.stringify(locale)} has no message for ${JSON.stringify(key)}`,
        );
      }
    }
  }

  const translators = new Map<L, Translator<M>>();
  const translator = (locale: L): Translator<M> => {
    const cached = translators.get(locale);
    if (cached !== undefined) return cached;
    if (!locales.is(locale)) {
      throw new TypeError(
        `translator: ${JSON.stringify(locale)} is not one of ${JSON.stringify(locales.all)}`,
      );
    }
    const own = messages[locale];
    const t: Translator<M> = (key, ...args) => {
      const message: Message = own[key];
      return typeof message === 'function'
        ? message(...(args as never[]))
        : message;
    };
    translators.set(locale, t);
    return t;
  };

  return { locales, messages, translator };
};
