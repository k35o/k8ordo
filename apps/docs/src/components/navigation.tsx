'use client';

import type { Message } from '@k8ordo/i18n';
import { matchPath, usePathname } from '@k8ordo/router';
import { DropdownMenu, NavigationMenuIcon } from '@k8ordo/ui';

import { href, navigateTo } from '../links';
import type { SitePath } from '../links';
import * as m from '../messages';
import { LanguageSwitcher } from './language-switcher';
import { LocaleAnchor } from './locale-anchor';
import { ThemeSwitcher } from './theme-switcher';

type NavItem = { path: SitePath; label: Message };

/**
 * 第一階層はパッケージで、セクションはパッケージに属する。だから常に並ぶのは
 * パッケージ名だけで、セクションは今いるパッケージのものしか出さない。全部を
 * 並べると、セクションを持つパッケージ（今は UI だけ）がサイトの背骨に見える。
 */
type PackageNav = { name: string; path: SitePath; sections: NavItem[] };

const PACKAGES: PackageNav[] = [
  {
    name: 'UI',
    path: '/:locale/ui',
    sections: [
      { path: '/:locale/ui/get-started', label: m.nav.getStarted },
      { path: '/:locale/ui/theming', label: m.nav.theming },
      { path: '/:locale/ui/i18n', label: m.nav.i18n },
      { path: '/:locale/ui/components', label: m.nav.components },
      { path: '/:locale/ui/hooks', label: m.nav.hooks },
      { path: '/:locale/ui/helpers', label: m.nav.helpers },
      { path: '/:locale/ui/ai', label: m.nav.ai },
    ],
  },
  { name: 'Form', path: '/:locale/form', sections: [] },
  { name: 'State', path: '/:locale/state', sections: [] },
  { name: 'Router', path: '/:locale/router', sections: [] },
  { name: 'Static', path: '/:locale/static', sections: [] },
  { name: 'Server', path: '/:locale/server', sections: [] },
  { name: 'i18n', path: '/:locale/i18n', sections: [] },
];

// パッケージの区画にいるか: そのランディングか、その下のどこか
const packageOf = (pathname: string): PackageNav | undefined =>
  PACKAGES.find(
    (pkg) => matchPath(`${pkg.path}/*`, pathname, { inclusive: true }) !== null,
  );

const itemClass = (isActive: boolean) =>
  isActive
    ? 'text-fg-base decoration-primary-border rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap underline decoration-2 underline-offset-8'
    : 'text-fg-mute hover:bg-bg-mute hover:text-fg-base rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors duration-150 ease-out';

export function Navigation() {
  const pathname = usePathname();
  const current = packageOf(pathname);

  /**
   * DropdownMenu.Content は子に index を注入するため Fragment で包めず、平坦な
   * 配列である必要がある。並びはデスクトップと同じで、パッケージのあとに今いる
   * パッケージのセクションが続く。
   */
  const mobileEntries: Array<{ path: SitePath; label: string }> = [
    ...PACKAGES.map((pkg) => ({ path: pkg.path, label: pkg.name })),
    ...(current?.sections ?? []).map((item) => ({
      path: item.path,
      label: item.label(),
    })),
  ];

  return (
    <header className="border-border-mute bg-bg-surface border-b">
      <nav className="mx-auto flex max-w-6xl items-center gap-3 p-4 md:gap-6 md:px-8">
        <LocaleAnchor
          className="focus-visible:ring-border-info flex shrink-0 items-baseline gap-1 rounded-md focus-visible:ring-2 focus-visible:outline-hidden"
          path="/:locale"
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
            const isHere = pkg === current;
            return (
              <li key={pkg.path}>
                <a
                  aria-current={
                    matchPath(pkg.path, pathname) === null ? undefined : 'page'
                  }
                  className={itemClass(isHere)}
                  href={href(pkg.path)}
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
                label={m.nav.openMenu()}
              />
              <DropdownMenu.Content>
                {mobileEntries.map((entry) => (
                  <DropdownMenu.Item
                    key={entry.path}
                    label={entry.label}
                    onAction={() => {
                      navigateTo(entry.path);
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
              const isActive = matchPath(item.path, pathname) !== null;
              return (
                <li key={item.path}>
                  <a
                    aria-current={isActive ? 'page' : undefined}
                    className={itemClass(isActive)}
                    href={href(item.path)}
                  >
                    {item.label()}
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
