'use client';

import type { ReactNode } from 'react';

import { componentCategories } from '../data/components-nav';
import { CatalogSections } from './catalog-sections';
import { componentPreviews } from './component-previews';
import type { ServerPreviewName } from './component-previews';

type Props = { serverPreviews: Record<ServerPreviewName, ReactNode> };

export function ComponentCatalog({ serverPreviews }: Props) {
  return (
    <CatalogSections
      categories={componentCategories}
      previews={{ ...componentPreviews, ...serverPreviews }}
    />
  );
}
