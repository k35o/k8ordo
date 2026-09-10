import { defineLocales } from '@k8ordo/i18n';
import type { LocaleOf } from '@k8ordo/i18n';

// サイトのロケールはここにしか書かない。`[locale]` の paramsSchema、静的化の
// パス展開（vite.config.ts）、言語切替、`/` の振り分けは全部この値を読む。
export const locales = defineLocales(['ja', 'en']);

export type Locale = LocaleOf<typeof locales>;
