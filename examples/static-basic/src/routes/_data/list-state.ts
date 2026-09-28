import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

// 商品一覧の絞り込み。URL の search に置く。ファイルは search によらず同じ
// なので、読むのはブラウザの useAppState だけ（ページが search を export
// すると、静的化はそのページを断る）
export const listState = definePageState('products', {
  url: z.object({ q: z.optional(z.string()) }),
});
