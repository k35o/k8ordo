import { defineCookieState } from '@k8ordo/state';
import * as z from 'zod/mini';

// 表示の好み。Cookie に置くので、ページ（サーバー）はリクエストの Cookie
// から読み、JavaScript の無いフォームを受けた Server Action も書ける
export const prefsState = defineCookieState(
  'prefs',
  z.object({
    // oxlint-disable-next-line no-underscore-dangle -- `_default` は zod/mini における `.default()` の綴り
    density: z._default(z.enum(['comfortable', 'compact']), 'comfortable'),
  }),
);
