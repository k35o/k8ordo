'use client';

import { useLocation } from '@funstack/router';
import { DropdownMenu, NavigationMenuIcon } from '@k8ordo/ui';

import type { MessageKey } from '../i18n';
import { localizeHref, useTranslation } from '../i18n';
import { LanguageSwitcher } from './language-switcher';
import { LocaleAnchor } from './locale-anchor';
import { ThemeSwitcher } from './theme-switcher';

type NavItem = { path: string; labelKey: MessageKey };

/**
 * セクションはパッケージに属する。メンバーが増えたらここにグループを足す。
 * 全グループを常に並べているのは、1メンバーのうちは「現在地のパッケージだけ
 * 出す」と結果が変わらないため。切り替えが要るのは、2つ目が自分のセクションを
 * 持ってから。
 */
type NavGroup = { name: string; path: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    name: 'UI',
    path: '/ui',
    items: [
      { path: '/ui/get-started', labelKey: 'nav.getStarted' },
      { path: '/ui/theming', labelKey: 'nav.theming' },
      { path: '/ui/i18n', labelKey: 'nav.i18n' },
      { path: '/ui/components', labelKey: 'nav.components' },
      { path: '/ui/hooks', labelKey: 'nav.hooks' },
      { path: '/ui/helpers', labelKey: 'nav.helpers' },
      { path: '/ui/ai', labelKey: 'nav.ai' },
    ],
  },
];

/**
 * モバイルのメニュー用に「パッケージ → そのセクション」を平坦に並べたもの。
 * SubMenu で1段深くすると 1 メンバーのうちは操作が増えるだけなので平坦にする。
 * DropdownMenu.Content は子に index を注入するため Fragment で包めず、
 * 平坦な配列である必要がある。
 */
type MobileEntry = { path: string } & (
  | { name: string; labelKey?: never }
  | { labelKey: MessageKey; name?: never }
);

const MOBILE_ENTRIES: MobileEntry[] = [];
for (const group of NAV_GROUPS) {
  MOBILE_ENTRIES.push({ path: group.path, name: group.name });
  for (const item of group.items) {
    MOBILE_ENTRIES.push({ path: item.path, labelKey: item.labelKey });
  }
}

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
        {NAV_GROUPS.map((group) => (
          <div className="hidden items-center gap-1 md:flex" key={group.name}>
            <a
              className="text-fg-base hover:bg-bg-mute focus-visible:ring-border-info rounded-md px-2 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:outline-hidden"
              href={localizeHref(group.path, locale)}
            >
              {group.name}
            </a>
            <span aria-hidden className="bg-border-mute h-4 w-px" />
            <ul className="flex items-center gap-1">
              {group.items.map((item) => {
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
          </div>
        ))}
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
                {MOBILE_ENTRIES.map((entry) => (
                  <DropdownMenu.Item
                    key={entry.path}
                    label={entry.name ?? t(entry.labelKey)}
                    onAction={() => {
                      navigation.navigate(localizeHref(entry.path, locale));
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
