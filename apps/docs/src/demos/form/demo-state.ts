import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

import * as m from '../../messages';

// ディレクティブ無し: Server Component（page.tsx が formFields に渡す）と
// client component（フォームと読み出し）の両方から import される。
// 1 つのスキーマが、フォームの制約属性と URL 状態の両方の出所になる。
export const demoState = definePageState('form-demo', {
  url: z.object({
    q: z._default(z.string(), ''),
    min: z._default(
      z.coerce
        .number({ error: m.form.demoMinInvalid })
        .check(
          z.int({ error: m.form.demoMinInvalid }),
          z.gte(0, { error: m.form.demoMinInvalid }),
        ),
      0,
    ),
    inStock: z._default(z.stringbool(), false),
  }),
});
