import * as z from 'zod/mini';

// ファイルは search がどうであれ同じ。静的化はこのページを名指しで断る
export const search = z.object({ q: z.optional(z.string()) });

export default function ProductsPage() {
  return <h1>products</h1>;
}
