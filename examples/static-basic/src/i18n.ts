import { defineLocales } from '@k8ordo/i18n';

// ロケールは [locale] の下のページだけのもの。ほかのページは既定の en で書く。
// 日付はロケールの timeZone で書くので、同じ時刻でも en と ja で日が変わりうる
export const locales = defineLocales({
  en: { timeZone: 'UTC', dir: 'ltr' },
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
});
