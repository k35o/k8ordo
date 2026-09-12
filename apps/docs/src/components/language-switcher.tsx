'use client';

import { usePathname } from '@k8ordo/router';
import { DropdownMenu } from '@k8ordo/ui';

import type { Locale } from '../i18n';
import { locales, useLocale } from '../i18n';

const LOCALE_LABELS: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
};

export function LanguageSwitcher() {
  const locale = useLocale();
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
            key={l}
            label={LOCALE_LABELS[l]}
            onAction={() => {
              navigation.navigate(locales.localize(path, l));
            }}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
