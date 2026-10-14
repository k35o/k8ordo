'use client';

import { useAppState } from '@k8ordo/state';
import { Button, Checkbox, Code } from '@k8ordo/ui';

import * as m from '../../../messages';
import { listState } from './list-state';

import styles from './products-demo.module.css';

const t = m.stateGetStarted;

const PAGE_SIZE = 2;

const PRODUCTS = [
  { id: 'lamp', name: t.tryProductLamp, inStock: true },
  { id: 'chair', name: t.tryProductChair, inStock: false },
  { id: 'shelf', name: t.tryProductShelf, inStock: true },
  { id: 'rug', name: t.tryProductRug, inStock: true },
  { id: 'plant', name: t.tryProductPlant, inStock: false },
  { id: 'clock', name: t.tryProductClock, inStock: true },
] as const;

export function ProductsDemo() {
  const [current, update] = useAppState(listState);
  const matching = PRODUCTS.filter(
    (product) => !current.inStock || product.inStock,
  );
  const pages = Math.ceil(matching.length / PAGE_SIZE);
  // 手で書き換えた ?page=9 のような値でも空の一覧にしないよう、表示だけ丸める
  const page = Math.min(current.page, pages);
  const visible = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const search = listState.search(current);

  return (
    <div className={styles.root}>
      <Checkbox
        checked={current.inStock}
        label={t.tryInStock()}
        onChange={(checked) => {
          update({ inStock: checked, page: 1 });
        }}
      />
      <ul className={styles.list}>
        {visible.map((product) => (
          <li className={styles.product} key={product.id}>
            <span>{product.name()}</span>
            <span className={styles.stock}>
              {product.inStock ? t.tryAvailable() : t.trySoldOut()}
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.pager}>
        <Button
          color="base"
          disabled={page <= 1}
          onClick={() => {
            update({ page: page - 1 }, { history: 'push' });
          }}
          size="sm"
          variant="outline"
        >
          {t.tryPrevious()}
        </Button>
        <span className={styles.page}>
          {page} / {pages}
        </span>
        <Button
          color="base"
          disabled={page >= pages}
          onClick={() => {
            update({ page: page + 1 }, { history: 'push' });
          }}
          size="sm"
          variant="outline"
        >
          {t.tryNext()}
        </Button>
      </div>
      <dl className={styles.values}>
        <dt className={styles.term}>{t.tryQuery()}</dt>
        <dd className={styles.value}>
          <Code>{search === '' ? t.tryQueryEmpty() : `?${search}`}</Code>
        </dd>
      </dl>
    </div>
  );
}
