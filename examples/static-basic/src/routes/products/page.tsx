import { ProductList } from '../../components/product-list';
import { listProducts } from '../../lib/catalog.server';

import styles from '../../styles/products.module.css';

export default async function ProductsPage() {
  // Server Component なので、データは直接読む。絞り込みはブラウザの仕事
  const products = await listProducts();
  return (
    <>
      <h1 className={styles.title} data-testid="title">
        products
      </h1>
      <ProductList products={products} />
    </>
  );
}
