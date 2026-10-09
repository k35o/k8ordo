import * as z from 'zod/mini';

import * as m from '../../../messages';

// ディレクティブ無し: ページ（Server Component）だけが読む。文言は関数のまま
// 渡すので、描画の中で formFields が呼んだときのロケールで引かれる。
// ページに載せるコードは zod で書いているが、デモのスキーマは同じ制約を
// zod/mini で書いている（どちらで書いても導かれる欄は同じ）。
export const talkSchema = z.object({
  title: z
    .string()
    .check(
      z.minLength(1, { error: m.formGetStarted.tryErrorTitle }),
      z.maxLength(120, { error: m.formGetStarted.tryErrorTitleLong }),
    ),
  eventUrl: z.url({ error: m.formGetStarted.tryErrorEventUrl }),
  minutes: z.coerce
    .number({ error: m.formGetStarted.tryErrorMinutes })
    .check(
      z.int({ error: m.formGetStarted.tryErrorMinutes }),
      z.gte(5, { error: m.formGetStarted.tryErrorMinutesMin }),
      z.lte(60, { error: m.formGetStarted.tryErrorMinutesMax }),
    ),
});
