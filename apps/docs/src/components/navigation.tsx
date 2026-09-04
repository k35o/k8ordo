'use client';

import { usePathname } from '@k8ordo/router';
import { DropdownMenu, NavigationMenuIcon } from '@k8ordo/ui';

import type { MessageKey } from '../i18n';
import { deLocalizeHref, localizeHref, useTranslation } from '../i18n';
import { LanguageSwitcher } from './language-switcher';
import { LocaleAnchor } from './locale-anchor';
import { ThemeSwitcher } from './theme-switcher';

type NavItem = { path: string; labelKey: MessageKey };

/**
 * 第一階層はパッケージで、セクションはパッケージに属する。だから常に並ぶのは
 * パッケージ名だけで、セクションは今いるパッケージのものしか出さない。全部を
 * 並べると、セクションを持つパッケージ（今は UI だけ）がサイトの背骨に見える。
 */
type PackageNav = { name: string; path: string; sections: NavItem[] };

const PACKAGES: PackageNav[] = [
  {
    name: 'UI',
    path: '/ui',
    sections: [
      { path: '/ui/get-started', labelKey: 'nav.getStarted' },
      { path: '/ui/theming', labelKey: 'nav.theming' },
      { path: '/ui/i18n', labelKey: 'nav.i18n' },
      { path: '/ui/components', labelKey: 'nav.components' },
      { path: '/ui/hooks', labelKey: 'nav.hooks' },
      { path: '/ui/helpers', labelKey: 'nav.helpers' },
      { path: '/ui/ai', labelKey: 'nav.ai' },
    ],
  },
  { name: 'Form', path: '/form', sections: [] },
  { name: 'State', path: '/state', sections: [] },
  { name: 'Router', path: '/router', sections: [] },
  { name: 'Static', path: '/static', sections: [] },
  { name: 'Server', path: '/server', sections: [] },
];

const packageOf = (pathname: string): PackageNav | undefined => {
  const { path } = deLocalizeHref(pathname);
  return PACKAGES.find(
    (pkg) => path === pkg.path || path.startsWith(`${pkg.path}/`),
  );
};

const itemClass = (isActive: boolean) =>
  isActive
    ? 'text-fg-base decoration-primary-border rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap underline decoration-2 underline-offset-8'
    : 'text-fg-mute hover:bg-bg-mute hover:text-fg-base rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors duration-150 ease-out';

export function Navigation() {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const current = packageOf(pathname);

  /**
   * DropdownMenu.Content は子に index を注入するため Fragment で包めず、平坦な
   * 配列である必要がある。並びはデスクトップと同じで、パッケージのあとに今いる
   * パッケージのセクションが続く。
   */
  const mobileEntries: Array<{ path: string; label: string }> = [
    ...PACKAGES.map((pkg) => ({ path: pkg.path, label: pkg.name })),
    ...(current?.sections ?? []).map((item) => ({
      path: item.path,
      label: t(item.labelKey),
    })),
  ];

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
          {PACKAGES.map((pkg) => {
            const href = localizeHref(pkg.path, locale);
            const isHere = pkg === current;
            return (
              <li key={pkg.path}>
                <a
                  aria-current={pathname === href ? 'page' : undefined}
                  className={itemClass(isHere)}
                  href={href}
                >
                  {pkg.name}
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
                {mobileEntries.map((entry) => (
                  <DropdownMenu.Item
                    key={entry.path}
                    label={entry.label}
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
      {current !== undefined && current.sections.length > 0 && (
        <div className="border-border-subtle hidden border-t md:block">
          <ul className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-2 md:px-8">
            {current.sections.map((item) => {
              const href = localizeHref(item.path, locale);
              const isActive = pathname === href;
              return (
                <li key={item.path}>
                  <a
                    aria-current={isActive ? 'page' : undefined}
                    className={itemClass(isActive)}
                    href={href}
                  >
                    {t(item.labelKey)}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
