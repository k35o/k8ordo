import * as z from 'zod/mini';

import * as m from '../../../messages';

// ディレクティブ無し: ページ（Server Component）だけが読む。文言は関数のまま
// 渡すので、描画の中で formFields が呼んだときのロケールで引かれる。
export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        name: z
          .string()
          .check(z.minLength(1, { error: m.formNested.demoNameMissing })),
        quantity: z.coerce
          .number({ error: m.formNested.demoQuantityMissing })
          .check(
            z.int({ error: m.formNested.demoQuantityWhole }),
            z.gte(1, { error: m.formNested.demoQuantityMin }),
          ),
      }),
    )
    .check(
      z.minLength(1, { error: m.formNested.demoItemsMin }),
      z.maxLength(3, { error: m.formNested.demoItemsMax }),
    ),
});
