import * as z from 'zod/mini';

import * as m from '../../../messages';

// ディレクティブ無し: ページ（Server Component）だけが読む。文言は関数のまま
// 渡すので、描画の中で formFields が呼んだときのロケールで引かれる。
export const entrySchema = z.object({
  name: z
    .string()
    .check(z.minLength(1, { error: m.formMultiStep.demoNameMissing })),
  email: z.email({ error: m.formMultiStep.demoEmailInvalid }),
  title: z
    .string()
    .check(z.minLength(1, { error: m.formMultiStep.demoTitleMissing })),
  minutes: z.coerce
    .number({ error: m.formMultiStep.demoMinutesMissing })
    .check(
      z.int(),
      z.gte(5, { error: m.formMultiStep.demoMinutesRange }),
      z.lte(60, { error: m.formMultiStep.demoMinutesRange }),
    ),
});
