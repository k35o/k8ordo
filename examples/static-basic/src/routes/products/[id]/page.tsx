import type { PageProps } from '@k8ordo/router';
import * as z from 'zod/mini';

import { findProduct } from '../../_data/catalog.server';

// [id] が受け取る値の形。合わないパスはこのルートが答えない（404）
export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

// params はスキーマの出力型: Register 経由で number になる
export default function ProductPage({ params }: PageProps<'/products/:id'>) {
  const product = findProduct(params.id);
  return (
    <>
      <h1 data-testid="title">{product?.name ?? 'unknown product'}</h1>
      <p data-testid="product-id">{`${typeof params.id}:${String(params.id)}`}</p>
    </>
  );
}
