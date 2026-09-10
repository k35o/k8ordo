'use client';

import type { Dictionary, Messages, Translator } from './dictionary';
import { useLocale } from './provider';

export type Translation<L extends string, M extends Messages> = {
  readonly t: Translator<M>;
  readonly locale: L;
};

/**
 * The current locale's `t`, from the dictionary the calling component
 * imports. The dictionary is an argument rather than a provider value so
 * that it never has to cross the RSC boundary as a prop — the client module
 * that needs the messages is the one that loads them.
 */
export const useTranslation = <
  L extends string,
  D extends L,
  M extends Messages,
>(
  dictionary: Dictionary<L, D, M>,
): Translation<L, M> => {
  // `Locales<L, D>` を `Locales<L, L>` として渡す。既定値の型が広がるだけで
  // 検査は同じ。
  const locale = useLocale<L>(dictionary.locales);
  // translator はロケールごとに同じ関数を返すので、ここで memo する必要は無い。
  return { t: dictionary.translator(locale), locale };
};
