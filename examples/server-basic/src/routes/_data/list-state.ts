import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

// 商品一覧の絞り込み。URL の search に置き、ページ（サーバー）もこの
// スキーマで読む
export const listState = definePageState('products', {
  url: z.object({ q: z.optional(z.string()) }),
});
