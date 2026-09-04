'use client';

import { usePathname } from '@k8ordo/router';

import type { NavCategory } from '../data/nav-types';
import { localizeHref, useTranslation } from '../i18n';
import { LocaleAnchor } from './locale-anchor';

type Props = {
  categories: NavCategory[];
  onNavigate?: () => void;
};

export function SideNavigation({ categories, onNavigate }: Props) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 overflow-y-auto py-4">
      {categories.map((category) => (
        <div className="flex flex-col gap-1" key={category.titleKey}>
          <span className="text-fg-subtle px-3 text-xs font-bold tracking-normal">
            {t(category.titleKey)}
          </span>
          {/* 傍線インデックス: 親罫 border-l に -ml-px のアクティブ罫を重ねる */}
          <ul className="border-border-mute mt-1 ml-3 flex flex-col gap-0.5 border-l">
            {category.items.map((item) => {
              const href = localizeHref(item.path, locale);
              const isActive = pathname === href;
              return (
                <li key={item.path}>
                  <LocaleAnchor
                    className={`-ml-px block border-l-2 py-1.5 pr-3 pl-4 text-sm ${
                      isActive
                        ? 'border-primary-border bg-primary-bg-subtle text-fg-base font-medium'
                        : 'text-fg-mute hover:border-border-emphasize hover:text-fg-base border-transparent transition-colors duration-150 ease-out'
                    }`}
                    onClick={onNavigate}
                    path={item.path}
                  >
                    {item.name}
                  </LocaleAnchor>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
