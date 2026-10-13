import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

// ページに載せる定義と同じ形。ページのコードは zod で書いているが、サイトは
// zod/mini で書く（どちらで書いても同じ URL を読み書きする）
export const listState = definePageState('state-get-started-demo', {
  url: z.object({
    inStock: z._default(z.stringbool(), false),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
  }),
});
