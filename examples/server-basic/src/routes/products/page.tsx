import { href } from '@k8ordo/router';
import type { PageProps } from '@k8ordo/router';

import { listProducts } from '../_data/catalog.server';
import { listState } from '../_data/list-state';

// このページが search の何を読むかの宣言。宣言したページだけが型付きの
// search を受け取り、search が変わるとルーターがページを取り直す
export const search = listState.url;

export default async function ProductsPage({
  search: { q },
}: PageProps<'/products'>) {
  // Server Component なので、データは直接読む
  const products = (await listProducts()).filter(
    (product) => q === undefined || product.name.includes(q),
  );
  return (
    <>
      <h1 data-testid="title">products</h1>
      {/* GET のフォーム。JavaScript が無ければ文書の読み込み、あれば取り直し */}
      <form action={href('/products')} data-testid="filter">
        <input aria-label="filter" defaultValue={q} name="q" />
        <button type="submit">filter</button>
      </form>
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
