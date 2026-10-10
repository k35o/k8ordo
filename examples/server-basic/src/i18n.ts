import { defineLocales } from '@k8ordo/i18n';

// ロケールは [locale] の下のページだけのもの。ほかのページは既定の en で描く
export const locales = defineLocales({
  en: { timeZone: 'UTC', dir: 'ltr' },
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
});
