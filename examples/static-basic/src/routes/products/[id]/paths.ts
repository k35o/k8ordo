import type { Paths } from '@k8ordo/framework';

import { listProducts } from '../../../lib/catalog.server';

// ページと同じデータの読み方で、書き出す商品を決める
const paths: Paths<'/products/:id'> = async () =>
  (await listProducts()).map((product) => String(product.id));

export default paths;
