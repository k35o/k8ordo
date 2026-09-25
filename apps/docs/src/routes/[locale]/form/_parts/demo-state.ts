import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

// ディレクティブ無し: Server Component（page.tsx が formFields に渡す）と
// client component（フォームと読み出し）の両方から import される。
// 1 つのスキーマが、フォームの制約属性と URL 状態の両方の出所になる。
/* oxlint-disable no-underscore-dangle -- `_default` は zod/mini における
   `.default()` の綴り */
export const demoState = definePageState('form-demo', {
  url: z.object({
    q: z._default(z.string(), ''),
    min: z._default(z.coerce.number().check(z.int(), z.gte(0)), 0),
    inStock: z._default(z.stringbool(), false),
  }),
});
/* oxlint-enable no-underscore-dangle */
