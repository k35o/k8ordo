'use client';

import { Heading, TextField } from '@k8ordo/ui';
import type { ReactNode } from 'react';
import { useState } from 'react';

import type { NavCategory } from '../data/nav-types';
import { useTranslation } from '../i18n';
import { CatalogCard } from './catalog-card';
import { T } from './t';

type Props = {
  categories: NavCategory[];
  previews?: Record<string, ReactNode>;
};

export function CatalogSections({ categories, previews }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const filtered = categories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          q === '' ||
          item.name.toLowerCase().includes(q) ||
          t(item.descKey).toLowerCase().includes(q),
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <>
      <search className="max-w-sm">
        <TextField
          aria-label={t('catalog.searchPlaceholder')}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder={t('catalog.searchPlaceholder')}
          value={query}
        />
      </search>
      {filtered.length === 0 ? (
        <p className="text-fg-mute">{t('catalog.noResults')}</p>
      ) : (
        filtered.map((category) => (
          <section className="flex flex-col gap-6" key={category.titleKey}>
            <Heading level="h2">
              <T k={category.titleKey} />
            </Heading>
            <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => (
                <CatalogCard
                  item={item}
                  key={item.name}
                  preview={previews?.[item.name]}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
