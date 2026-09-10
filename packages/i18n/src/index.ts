export { defineLocales } from './locales';
export type {
  Delocalized,
  LocaleOf,
  LocaleParamsSchema,
  Locales,
  LocalesOptions,
} from './locales';
export { defineDictionary } from './dictionary';
export type {
  Dictionary,
  Message,
  MessageKeyOf,
  Messages,
  TextKeyOf,
  Translations,
  Translator,
} from './dictionary';
export { parseAcceptLanguage } from './accept-language';
export { LocaleProvider, useLocale } from './provider';
export { useTranslation } from './use-translation';
export type { Translation } from './use-translation';
