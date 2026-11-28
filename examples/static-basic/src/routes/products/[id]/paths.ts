import type { Paths } from '@k8ordo/framework';

import { listProducts } from '../../../lib/catalog.server';

// ページと同じデータの読み方で、書き出す商品を決める。値はリンクと同じく
// ページのスキーマが読む型（number）で返す
const paths: Paths<'/products/:id'> = async () =>
  (await listProducts()).map((product) => product.id);

export default paths;
