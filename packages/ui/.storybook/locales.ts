import { defineLocales } from '@k8ordo/i18n';

// preview.tsx がこの集合を定義する。
export const definitions = {
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'UTC', dir: 'ltr' },
} as const;

/**
 * ストーリーの beforeEach に渡すと英語で描く。既定を en にした同じ集合を定義
 * し直すので、ロケールを名指さない iframe の URL は en になる。終わったら
 * preview の集合に戻す。
 */
export const inEnglish = (): (() => void) => {
  defineLocales(definitions, { default: 'en' });
  return () => {
    defineLocales(definitions);
  };
};
