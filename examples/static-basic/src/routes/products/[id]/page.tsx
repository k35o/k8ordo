import type { PageProps } from '@k8ordo/router';
import * as z from 'zod/mini';

import { findProduct } from '../../_data/catalog.server';

// [id] が受け取る値の形。合わないパスはこのルートが答えない（404）
export const paramsSchema = z.object({
  id: z.coerce.number().check(z.int(), z.positive()),
});

// params はスキーマの出力型: Register 経由で number になる
export default async function ProductPage({
  params,
}: PageProps<'/products/:id'>) {
  const product = await findProduct(params.id);
  const name = product?.name ?? 'unknown product';
  return (
    <>
      <title>{name}</title>
      <h1 data-testid="title">{name}</h1>
      <p data-testid="product-id">{`${typeof params.id}:${String(params.id)}`}</p>
    </>
  );
}
