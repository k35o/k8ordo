'use client';

import { Heading } from '@k8ordo/ui';

import { aiPreviews } from '../../../../components/ai-previews';
import { CatalogCard } from '../../../../components/catalog-card';
import { PageTitle } from '../../../../components/page-title';
import { Rich } from '../../../../components/rich';
import { aiCategories } from '../../../../data/ai-nav';
import * as m from '../../../../messages';

export default function Ai() {
  const items = aiCategories.flatMap((category) => category.items);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:px-8">
      <PageTitle title={m.nav.ai} />
      <header className="flex flex-col gap-4">
        <Heading level="h1">{m.nav.ai()}</Heading>
        <p className="text-fg-mute max-w-2xl text-lg leading-relaxed">
          <Rich>{m.ai.description()}</Rich>
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
