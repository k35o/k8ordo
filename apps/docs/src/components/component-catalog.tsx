'use client';

import type { ReactNode } from 'react';

import { componentCategoriesOf } from '../data/components-nav';
import type { ComponentGroups } from '../data/components-nav';
import { CatalogSections } from './catalog-sections';
import { componentPreviews } from './component-previews';
import type { ServerPreviewName } from './component-previews';

type Props = {
  groups: ComponentGroups;
  serverPreviews: Record<ServerPreviewName, ReactNode>;
};

export function ComponentCatalog({ groups, serverPreviews }: Props) {
  return (
    <CatalogSections
      categories={componentCategoriesOf(groups)}
      previews={{ ...componentPreviews, ...serverPreviews }}
    />
  );
}
