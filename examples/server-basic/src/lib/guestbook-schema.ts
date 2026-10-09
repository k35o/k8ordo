import * as z from 'zod/mini';

// zod/mini はロケールを同梱しない (既定の文言は "Invalid input")。ページに
// 出す文言も parseForm が返す文言も zod 自身のものなので、英語を読み込んで
// おけば両側が同じ言葉になる。
z.config(z.locales.en());

// ディレクティブなし: Server Component (page) と Server Action (sign) の
// 両方から import されるが、どちらもサーバーで動くので zod はブラウザに届かない
export const guestbookSchema = z.object({
  name: z.string().check(z.minLength(1), z.maxLength(40)),
});
