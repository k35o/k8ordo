import * as z from 'zod/mini';

import * as m from '../../../../../messages';

// ディレクティブ無し: ページ（Server Component）だけが読む。文言は関数のまま
// 渡すので、描画の中で formFields が呼んだときのロケールで引かれる。
export const handleSchema = z.object({
  handle: z
    .string()
    .check(
      z.minLength(3, { error: m.formAsyncCheck.demoHandleTooShort }),
      z.regex(/^[a-z0-9_]+$/u, { error: m.formAsyncCheck.demoHandlePattern }),
    ),
});
