'use client';

import { matchPath, usePathname } from '@k8ordo/router';
import { SideNav } from '@k8ordo/ui';

import type { NavCategory } from '../data/nav-types';
import { href } from '../links';

type Props = {
  label: string;
  categories: NavCategory[];
  onNavigate?: () => void;
};

export function SideNavigation({ label, categories, onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <div className="overflow-y-auto py-4">
      <SideNav.Root label={label}>
        {categories.map((category) => (
          <SideNav.Group key={category.title()} title={category.title()}>
            {category.items.map((item) => (
              <SideNav.Link
                current={matchPath(item.path, pathname) !== null}
                href={href(item.path)}
                key={item.path}
                onClick={onNavigate}
              >
                {item.name}
              </SideNav.Link>
            ))}
          </SideNav.Group>
        ))}
      </SideNav.Root>
    </div>
  );
}
