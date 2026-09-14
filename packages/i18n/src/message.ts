import { currentLocale, registeredDefault } from './current';
import type { RegisteredLocale } from './register';

/**
 * A message: a function of the values its text needs (none for a plain
 * string), returning the text in the current locale. What a component that
 * takes a message as a prop should accept.
 */
export type Message<A extends readonly unknown[] = []> = (...args: A) => string;

/** One value per locale — every locale, no locale twice. */
export type Variants<V> = Readonly<Record<RegisteredLocale, V>>;

/**
 * Declares one message with its text in every locale. The result reads the
 * locale where it is called — the request on a server, the URL in the
 * browser — so the same call renders on either side, and a bundler keeps
 * only the messages a client module names.
 *
 * ```ts
 * export const home = message({ ja: 'ホーム', en: 'Home' });
 * export const greeting = message({
 *   ja: (name: string) => `こんにちは、${name}`,
 *   en: (name) => `Hello, ${name}`,
 * });
 * ```
 *
 * When nothing names a locale, the text is the default locale's — the one
 * `defineLocales` registered, else the first variant written.
 */
export function message(variants: Variants<string>): Message;
export function message<A extends readonly unknown[]>(
  variants: Variants<(...args: A) => string>,
): Message<A>;
export function message<A extends readonly unknown[]>(
  variants: Readonly<Record<string, string | ((...args: A) => string)>>,
): Message<A> {
  // ここで検査して throw しない。宣言はモジュールの先頭で走るので、throw
  // し得る呼び出しはバンドラに副作用と見なされ、使われない文言が消えなく
  // なる。欠けは描画で言う。
  return (...args: A): string => {
    // 何も指名していないときだけ、書かれた先頭の文言に落ちる。指名された
    // ロケールの文言が無いのは翻訳漏れなので、隠さず言う。
    const locale = currentLocale() ?? registeredDefault();
    const variant =
      locale === null
        ? variants[Object.keys(variants)[0] ?? '']
        : variants[locale];
    if (variant === undefined) {
      throw new TypeError(
        `message: no text for ${JSON.stringify(locale)} in ${JSON.stringify(Object.keys(variants))}`,
      );
    }
    return typeof variant === 'function' ? variant(...args) : variant;
  };
}
