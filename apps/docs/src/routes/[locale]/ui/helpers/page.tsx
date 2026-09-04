'use client';

import { Heading } from '@k8ordo/ui';

import { CatalogSections } from '../../../../components/catalog-sections';
import { T } from '../../../../components/t';
import { helperCategories } from '../../../../data/helpers-nav';
import { useTranslation } from '../../../../i18n';

export default function Helpers() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:px-8">
      <header className="flex flex-col gap-4">
        <Heading level="h1">{t('nav.helpers')}</Heading>
        <p className="text-fg-mute max-w-2xl text-lg leading-relaxed">
          <T k="helpers.description" />
        </p>
      </header>
      <CatalogSections categories={helperCategories} />
    </div>
  );
}
