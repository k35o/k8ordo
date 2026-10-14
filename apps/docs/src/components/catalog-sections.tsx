'use client';

import { Heading, TextField } from '@k8ordo/ui';
import type { ReactNode } from 'react';
import { useState } from 'react';

import type { NavCategory } from '../data/nav-types';
import * as m from '../messages';
import { CatalogCard } from './catalog-card';
import { Rich } from './rich';

import styles from './catalog-sections.module.css';

// 記事の中に置く前提の部品。ページの地の上では溶けるので、白い台で見せる
const ARTICLE_STAGE: ReadonlySet<string> = new Set(['CodeBlock']);

type Props = {
  categories: readonly NavCategory[];
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
      <search className={styles.search}>
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
        <p className={styles.empty}>{m.catalog.noResults()}</p>
      ) : (
        filtered.map((category) => (
          <section className={styles.category} key={category.title()}>
            <Heading level="h2">
              <Rich>{category.title()}</Rich>
            </Heading>
            <div className={styles.cards}>
              {category.items.map((item) => (
                <CatalogCard
                  item={item}
                  key={item.name}
                  preview={previews?.[item.name]}
                  stage={ARTICLE_STAGE.has(item.name) ? 'article' : 'page'}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
