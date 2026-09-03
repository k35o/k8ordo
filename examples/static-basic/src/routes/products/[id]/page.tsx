import { findProduct } from '../../_data/catalog.server';

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = findProduct(params.id);
  return (
    <>
      <h1 data-testid="title">{product?.name ?? 'unknown product'}</h1>
      <p data-testid="product-id">{params.id}</p>
    </>
  );
}
