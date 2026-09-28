import { listProducts } from '../_data/catalog.server';
import { ProductList } from '../_parts/product-list';

export default async function ProductsPage() {
  // Server Component なので、データは直接読む。絞り込みはブラウザの仕事
  const products = await listProducts();
  return (
    <>
      <h1 data-testid="title">products</h1>
      <ProductList products={products} />
    </>
  );
}
