'use client';

import { Heading, TextField } from '@k8ordo/ui';
import type { ReactNode } from 'react';
import { useState } from 'react';

import type { NavCategory } from '../data/nav-types';
import * as m from '../messages';
import { CatalogCard } from './catalog-card';
import { Rich } from './rich';

type Props = {
  categories: NavCategory[];
  previews?: Record<string, ReactNode>;
};

export function CatalogSections({ categories, previews }: Props) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const filtered = categories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          q === '' ||
          item.name.toLowerCase().includes(q) ||
          item.description().toLowerCase().includes(q),
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <>
      <search className="max-w-sm">
        <TextField
          aria-label={m.catalog.searchPlaceholder()}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder={m.catalog.searchPlaceholder()}
          value={query}
        />
      </search>
      {filtered.length === 0 ? (
        <p className="text-fg-mute">{m.catalog.noResults()}</p>
      ) : (
        filtered.map((category) => (
          <section className="flex flex-col gap-6" key={category.title()}>
            <Heading level="h2">
              <Rich>{category.title()}</Rich>
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
