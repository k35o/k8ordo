import * as z from 'zod/mini';

import * as m from '../../../messages';

// ディレクティブ無し: ページ（Server Component）だけが読む。文言は関数のまま
// 渡すので、描画の中で formFields が呼んだときのロケールで引かれる。
export const ratingSchema = z.object({
  rating: z.coerce
    .number({ error: m.formCustomInputs.demoRatingMissing })
    .check(
      z.int({ error: m.formCustomInputs.demoRatingMissing }),
      z.gte(1, { error: m.formCustomInputs.demoRatingMissing }),
      z.lte(5, { error: m.formCustomInputs.demoRatingMissing }),
    ),
});
