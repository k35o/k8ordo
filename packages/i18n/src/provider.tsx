'use client';

import { createContext, use } from 'react';
import type { FC, PropsWithChildren } from 'react';

import type { Locales } from './locales';

// 未設置で throw する context にしない理由は無い（ロケールが無いまま描画して
// よい文言は無い）が、`null` を初期値に持つのはエラーを useLocale で出す
// ためで、Provider 側では何も検査しない。
const LocaleContext = createContext<string | null>(null);

/**
 * Carries the current locale to client components. The prop is a string on
 * purpose: a Server Component layout renders this with `params.locale`
 * directly, and nothing that cannot cross the RSC boundary (the locale set,
 * the dictionary) is asked to.
 */
export const LocaleProvider: FC<PropsWithChildren<{ locale: string }>> = ({
  locale,
  children,
}) => <LocaleContext value={locale}>{children}</LocaleContext>;

/**
 * The current locale. Given the locale set, the value is checked against it
 * and typed as one of its members; without it, the string the provider was
 * given.
 */
export function useLocale(): string;
export function useLocale<L extends string>(locales: Locales<L, L>): L;
export function useLocale<L extends string>(locales?: Locales<L, L>): string {
  const locale = use(LocaleContext);
  if (locale === null) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  if (locales !== undefined && !locales.is(locale)) {
    throw new Error(
      `useLocale: the provider carries ${JSON.stringify(locale)}, which is not one of ${JSON.stringify(locales.all)}`,
    );
  }
  return locale;
}
