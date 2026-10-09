'use client';

import { href } from '@k8ordo/framework';
import { useAppState } from '@k8ordo/state';

import { listState } from '../lib/list-state';

type Product = { id: number; name: string };

// ビルドと hydrate の描画は既定値（絞り込み無し）で描き、その次の描画から
// URL の search が効く。GET のフォームで search が変わっても、ルーターは
// ページを取り直さず、ここだけが描き直される
export function ProductList({ products }: { products: readonly Product[] }) {
  const [{ q = '' }] = useAppState(listState, ['q']);
  return (
    <>
      <form action={href('/products')} data-testid="filter">
        {/* 入力は search が変わるたびに作り直し、URL の値から始める */}
        <input aria-label="filter" defaultValue={q} key={q} name="q" />
        <button type="submit">filter</button>
      </form>
      <ul data-testid="list">
        {products
          .filter((product) => product.name.includes(q))
          .map((product) => (
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
