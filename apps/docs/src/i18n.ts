import { defineLocales } from '@k8ordo/i18n';
import type { LocaleOf } from '@k8ordo/i18n';

// サイトのロケールはここにしか書かない。`[locale]` の paramsSchema、静的化の
// パス展開（vite.config.ts）、言語切替、`/` の振り分け、そして src/messages/
// の全文言（フレームワークが生成する Register 経由で型が付く）は、全部この値を読む。
export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'UTC', dir: 'ltr' },
});

export type Locale = LocaleOf<typeof locales>;

// 描画中のロケール。サーバーは受理した params、ブラウザは URL から読む。
export const { getLocale } = locales;
