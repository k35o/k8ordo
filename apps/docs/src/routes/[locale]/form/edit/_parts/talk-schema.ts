import * as z from 'zod/mini';

import * as m from '../../../../../messages';

// ディレクティブ無し: ページ（Server Component）だけが読む。文言は関数のまま
// 渡すので、描画の中で formFields が呼んだときのロケールで引かれる。
export const talkSchema = z.object({
  title: z
    .string()
    .check(
      z.minLength(1, { error: m.formEdit.demoTitleMissing }),
      z.maxLength(60, { error: m.formEdit.demoTitleTooLong }),
    ),
  public: z.boolean(),
});
