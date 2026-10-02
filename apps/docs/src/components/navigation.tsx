'use client';

import { matchPath, usePathname } from '@k8ordo/router';
import { DropdownMenu, NavigationMenuIcon } from '@k8ordo/ui';

import { PACKAGES } from '../data/packages';
import type { PackageEntry } from '../data/packages';
import { href, navigateTo } from '../links';
import type { SitePath } from '../links';
import * as m from '../messages';
import { LanguageSwitcher } from './language-switcher';
import { LocaleAnchor } from './locale-anchor';
import { ThemeSwitcher } from './theme-switcher';

// パッケージの区画にいるか: そのランディングか、その下のどこか
const packageOf = (pathname: string): PackageEntry | undefined =>
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

  // ページの一覧はサイドバー（狭い幅ではドロワー）が持つので、メニューは
  // パッケージだけを並べる
  const mobileEntries: Array<{ path: SitePath; label: string }> = PACKAGES.map(
    (pkg) => ({ path: pkg.path, label: pkg.label }),
  );

  return (
    <header className="border-border-mute bg-bg-surface border-b">
      <nav className="flex items-center gap-3 px-4 py-3 md:gap-6 md:px-6">
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
                  {pkg.label}
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
    </header>
  );
}
