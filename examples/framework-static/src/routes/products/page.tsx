import { href } from '@k8ordo/router';

import { listProducts } from '../_data/catalog.server';

export default function ProductsPage() {
  // Server Component なので、データは直接読む
  const products = listProducts();
  return (
    <>
      <h1 data-testid="title">products</h1>
      <ul data-testid="list">
        {products.map((product) => (
          <li key={product.id}>
            <a href={href('/products/:id', { id: product.id })}>
              {product.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
