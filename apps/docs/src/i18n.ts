import { defineLocales } from '@k8ordo/i18n';
import type { LocaleOf } from '@k8ordo/i18n';

// サイトのロケールはここにしか書かない。`[locale]` の paramsSchema、静的化の
// パス展開（vite.config.ts）、言語切替、`/` の振り分け、そして src/messages/
// の全文言（Register 経由で型が付く）は、全部この値を読む。
export const locales = defineLocales(['ja', 'en']);

export type Locale = LocaleOf<typeof locales>;

declare module '@k8ordo/i18n' {
  // oxlint-disable-next-line typescript/consistent-type-definitions -- augmentation needs a merge-open interface
  interface Register {
    locale: Locale;
  }
}

// 描画中のロケール。サーバーは受理した params、ブラウザは URL から読む。
export const { getLocale } = locales;
