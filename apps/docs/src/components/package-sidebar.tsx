'use client';

import { matchPath, usePathname } from '@k8ordo/framework';
import { SideNav } from '@k8ordo/ui';
import { useState } from 'react';

import type { NavCategory } from '../data/nav-types';
import type { PackageEntry, PackageSection } from '../data/packages';
import { href } from '../links';
import type { SitePath } from '../links';
import * as m from '../messages';

// 開閉の状態を覚えるための、分類の鍵
const keyOf = (path: SitePath, category: NavCategory) =>
  `${path} ${category.title()}`;

/** A section whose pages are listed by category, such as `/ui/components`. */
export type Catalogs = Partial<Record<SitePath, readonly NavCategory[]>>;

type Props = {
  pkg: PackageEntry;
  catalogs: Catalogs;
  onNavigate?: () => void;
};

/**
 * A package's pages, grouped the way `PACKAGES` groups them. A section with a
 * catalog becomes a group of its own: its overview, then each category as a
 * level that opens and closes. A category opens once it holds the current page
 * and stays open until the reader closes it. A catalog of one category lists
 * its pages directly.
 */
export function PackageSidebar({ pkg, catalogs, onNavigate }: Props) {
  const pathname = usePathname();
  const isCurrent = (path: SitePath) => matchPath(path, pathname) !== null;
  const catalogOf = (section: PackageSection) => catalogs[section.path];

  // 開いている段は、今のページを含むたびに足していくだけで、閉じない。閉じる
  // のは人だけにする。前のページの段を閉じると、押したリンクより上が縮んで
  // リンクの位置がずれる
  const currentKeys = Object.entries(catalogs).flatMap(([path, categories]) =>
    categories
      .filter((category) => category.items.some((item) => isCurrent(item.path)))
      .map((category) => keyOf(path as SitePath, category)),
  );
  const [opened, setOpened] = useState<ReadonlySet<string>>(
    () => new Set(currentKeys),
  );
  if (currentKeys.some((key) => !opened.has(key))) {
    setOpened(new Set([...opened, ...currentKeys]));
  }

  return (
    <SideNav.Root label={pkg.name}>
      {pkg.groups.flatMap((group) => {
        const pages = group.sections.filter(
          (section) => catalogOf(section) === undefined,
        );
        const listed = group.sections.flatMap((section) => {
          const categories = catalogOf(section);
          return categories === undefined ? [] : [{ section, categories }];
        });
        return [
          ...(pages.length === 0
            ? []
            : [
                <SideNav.Group key={group.label()} title={group.label()}>
                  {pages.map((section) => (
                    <SideNav.Link
                      current={isCurrent(section.path)}
                      href={href(section.path)}
                      key={section.path}
                      onClick={onNavigate}
                    >
                      {section.label()}
                    </SideNav.Link>
                  ))}
                </SideNav.Group>,
              ]),
          ...listed.map(({ section, categories }) => (
            <SideNav.Group key={section.path} title={section.label()}>
              <SideNav.Link
                current={isCurrent(section.path)}
                href={href(section.path)}
                onClick={onNavigate}
              >
                {m.sideNav.overview()}
              </SideNav.Link>
              {categories.length === 1
                ? categories[0]?.items.map((item) => (
                    <SideNav.Link
                      current={isCurrent(item.path)}
                      href={href(item.path)}
                      key={item.path}
                      onClick={onNavigate}
                    >
                      {item.name}
                    </SideNav.Link>
                  ))
                : categories.map((category) => (
                    <SideNav.Sub
                      defaultOpen={opened.has(keyOf(section.path, category))}
                      key={category.title()}
                      title={category.title()}
                    >
                      {category.items.map((item) => (
                        <SideNav.Link
                          current={isCurrent(item.path)}
                          href={href(item.path)}
                          key={item.path}
                          onClick={onNavigate}
                        >
                          {item.name}
                        </SideNav.Link>
                      ))}
                    </SideNav.Sub>
                  ))}
            </SideNav.Group>
          )),
        ];
      })}
    </SideNav.Root>
  );
}
