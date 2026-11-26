import { Catalog } from '@a2ui/web_core';
import { catalog as k8ordo } from '@k8ordo/ui/catalog';
import { describe, expect, it } from 'vite-plus/test';

import { CATALOG_ID, catalogDocument } from './catalog';

const refsIn = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap(refsIn);
  }
  if (typeof value !== 'object' || value === null) {
    return [];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    key === '$ref' && typeof child === 'string' ? [child] : refsIn(child),
  );
};

const isOwnOrCommonRef = (ref: string): boolean =>
  ref.startsWith('common_types.json#/$defs/') ||
  ref.startsWith('#/components/');

describe('A2UI のカタログ文書', () => {
  it('@k8ordo/ui/catalog の部品をすべて同じ名前で持つ', () => {
    expect(Object.keys(catalogDocument.components).toSorted()).toStrictEqual(
      Object.keys(k8ordo).toSorted(),
    );
  });

  it('common_types と自分の部品のほかを参照しない', () => {
    expect(
      refsIn(catalogDocument).filter((ref) => !isOwnOrCommonRef(ref)),
    ).toStrictEqual([]);
  });

  it('A2UI の Catalog として読み込める', () => {
    const loaded = Catalog.fromJson(catalogDocument);

    expect(loaded.id).toBe(CATALOG_ID);
    expect([...loaded.components.keys()].toSorted()).toStrictEqual(
      Object.keys(k8ordo).toSorted(),
    );
  });
});
