'use client';

import { Heading } from '@k8ordo/ui';

import { CatalogSections } from '../../../../components/catalog-sections';
import { componentPreviews } from '../../../../components/component-previews';
import { PageTitle } from '../../../../components/page-title';
import { Rich } from '../../../../components/rich';
import { componentCategories } from '../../../../data/components-nav';
import * as m from '../../../../messages';

export default function Components() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:px-8">
      <PageTitle title={m.nav.components} />
      <header className="flex flex-col gap-4">
        <Heading level="h1">{m.nav.components()}</Heading>
        <p className="text-fg-mute max-w-2xl text-lg leading-relaxed">
          <Rich>{m.components.description()}</Rich>
        </p>
      </header>
      <CatalogSections
        categories={componentCategories}
        previews={componentPreviews}
      />
    </div>
  );
}
