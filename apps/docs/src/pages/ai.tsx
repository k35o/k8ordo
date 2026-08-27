'use client';

import { Heading } from '@k8ordo/ui';

import { aiPreviews } from '../components/ai-previews';
import { CatalogCard } from '../components/catalog-card';
import { T } from '../components/t';
import { aiCategories } from '../data/ai-nav';
import { useTranslation } from '../i18n';

export function Ai() {
  const { t } = useTranslation();
  const items = aiCategories.flatMap((category) => category.items);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:px-8">
      <header className="flex flex-col gap-4">
        <Heading level="h1">{t('nav.ai')}</Heading>
        <p className="text-fg-mute max-w-2xl text-lg leading-relaxed">
          <T k="ai.description" />
        </p>
      </header>
      <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
