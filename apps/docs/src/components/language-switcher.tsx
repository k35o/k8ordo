'use client';

import { usePathname, withBase } from '@k8ordo/framework';
import { DropdownMenu } from '@k8ordo/ui';

import { getLocale, locales } from '../i18n';
import type { Locale } from '../i18n';

const LOCALE_LABELS: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
};

export function LanguageSwitcher() {
  const locale = getLocale();
  const pathname = usePathname();

  const { pathname: path } = locales.delocalize(pathname);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        label={LOCALE_LABELS[locale]}
        size="sm"
        variant="skeleton"
      />
      <DropdownMenu.Content>
        {locales.all.map((l) => (
          <DropdownMenu.Item
            // href() は表のパターンしか受け取らず、ここの行き先は今の
            // pathname から作るので、型を偽らずには書けない。フレームワーク
            // 下のブラウザには、どのパターンが勝ったかが届かない。
            href={withBase(locales.localize(path, l))}
            key={l}
            label={LOCALE_LABELS[l]}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
