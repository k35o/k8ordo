'use client';

import { Heading } from '@k8ordo/ui';

import { aiPreviews } from '../../../../components/ai-previews';
import { CatalogCard } from '../../../../components/catalog-card';
import { PageTitle } from '../../../../components/page-title';
import { Rich } from '../../../../components/rich';
import { aiCategories } from '../../../../data/ai-nav';
import * as m from '../../../../messages';

import page from '../../../../styles/page.module.css';
import styles from '../../../../styles/pages/ui/ai.module.css';

export default function Ai() {
  const items = aiCategories.flatMap((category) => category.items);

  return (
    <div className={styles.root}>
      <PageTitle title={m.nav.ai} />
      <header className={page.stack}>
        <Heading level="h1">{m.nav.ai()}</Heading>
        <p className={styles.description}>
          <Rich>{m.ai.description()}</Rich>
        </p>
      </header>
      <div className={styles.cards}>
        {items.map((item) => (
          <CatalogCard
            item={item}
            key={item.name}
            preview={aiPreviews[item.name]}
          />
        ))}
      </div>
    </div>
  );
}
