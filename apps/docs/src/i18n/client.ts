'use client';

import {
  useLocale as useLocaleOf,
  useTranslation as useDictionary,
} from '@k8ordo/i18n';

import { dictionary } from './dictionary';
import { locales } from './locales';

// サイト全体で辞書は 1 つなので、ここで束ねておけば呼ぶ側は引数なしで済む。
export const useLocale = () => useLocaleOf(locales);

export const useTranslation = () => useDictionary(dictionary);
