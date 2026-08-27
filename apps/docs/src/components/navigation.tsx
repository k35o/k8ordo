'use client';

import { useLocation } from '@funstack/router';
import { DropdownMenu, NavigationMenuIcon } from '@k8ordo/ui';

import type { MessageKey } from '../i18n';
import { localizeHref, useTranslation } from '../i18n';
import { LanguageSwitcher } from './language-switcher';
import { LocaleAnchor } from './locale-anchor';
import { ThemeSwitcher } from './theme-switcher';

type NavItem = { path: string; labelKey: MessageKey };

const NAV_ITEMS: NavItem[] = [
  { path: '/get-started', labelKey: 'nav.getStarted' },
  { path: '/theming', labelKey: 'nav.theming' },
  { path: '/i18n', labelKey: 'nav.i18n' },
  { path: '/components', labelKey: 'nav.components' },
  { path: '/hooks', labelKey: 'nav.hooks' },
  { path: '/helpers', labelKey: 'nav.helpers' },
  { path: '/ai', labelKey: 'nav.ai' },
];

export function Navigation() {
  const { t, locale } = useTranslation();
  const location = useLocation();

  return (
    <header className="border-border-mute bg-bg-surface border-b">
      <nav className="mx-auto flex max-w-6xl items-center gap-3 p-4 md:gap-6 md:px-8">
        <LocaleAnchor
          className="focus-visible:ring-border-info flex shrink-0 items-baseline gap-1 rounded-md focus-visible:ring-2 focus-visible:outline-hidden"
          path="/"
          unstyled
        >
          <span className="font-m-plus-2 font-palt text-fg-base text-lg font-bold whitespace-nowrap">
            k8ordo
          </span>
          <span
            aria-hidden
            className="bg-primary-border inline-block size-1.5 rounded-full"
          />
        </LocaleAnchor>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const href = localizeHref(item.path, locale);
            const isActive = location.pathname === href;
            return (
              <li key={item.path}>
                <a
                  aria-current={isActive ? 'page' : undefined}
                  className={
                    isActive
                      ? 'text-fg-base decoration-primary-border rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap underline decoration-2 underline-offset-8'
                      : 'text-fg-mute hover:bg-bg-mute hover:text-fg-base rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors duration-150 ease-out'
                  }
                  href={href}
                >
                  {t(item.labelKey)}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <div className="md:hidden">
            <DropdownMenu.Root>
              <DropdownMenu.IconTrigger
                icon={<NavigationMenuIcon />}
                label={t('nav.openMenu')}
              />
              <DropdownMenu.Content>
                {NAV_ITEMS.map((item) => (
                  <DropdownMenu.Item
                    key={item.path}
                    label={t(item.labelKey)}
                    onAction={() => {
                      navigation.navigate(localizeHref(item.path, locale));
                    }}
                  />
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </nav>
    </header>
  );
}
