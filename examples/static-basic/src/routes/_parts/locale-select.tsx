'use client';

import { navigateTo } from '@k8ordo/router';

import { locales } from '../../i18n';
import { language } from '../_data/about';

const NAMES = { en: 'English', ja: '日本語' } as const;

// ブラウザでも文言は URL が名指すロケールで読むので、ビルドが書いた文と
// hydrate の描画が一致する。選ぶと同じページの別ロケールへその場で移る
export function LocaleSelect() {
  return (
    <label>
      {language()}{' '}
      <select
        onChange={(event) => {
          const locale = event.currentTarget.value;
          if (locales.is(locale)) navigateTo('/:locale/about', { locale });
        }}
        value={locales.getLocale()}
      >
        {locales.all.map((locale) => (
          <option key={locale} value={locale}>
            {NAMES[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
