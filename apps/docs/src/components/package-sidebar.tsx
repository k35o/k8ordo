'use client';

import { matchPath, usePathname } from '@k8ordo/router';
import { SideNav } from '@k8ordo/ui';

import type { PackageEntry } from '../data/packages';
import { href } from '../links';

type Props = {
  pkg: PackageEntry;
  onNavigate?: () => void;
};

/** A package's pages, grouped the way `PACKAGES` groups them. */
export function PackageSidebar({ pkg, onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <SideNav.Root label={pkg.name}>
      {pkg.groups.map((group) => (
        <SideNav.Group key={group.label()} title={group.label()}>
          {group.sections.map((section) => (
            <SideNav.Link
              current={matchPath(section.path, pathname) !== null}
              href={href(section.path)}
              key={section.path}
              onClick={onNavigate}
            >
              {section.label()}
            </SideNav.Link>
          ))}
        </SideNav.Group>
      ))}
    </SideNav.Root>
  );
}
