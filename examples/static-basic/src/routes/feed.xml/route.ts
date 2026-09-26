import type { RouteContext } from '@k8ordo/router';

import { listProducts } from '../_data/catalog.server';

// ビルドはこの GET を 1 度呼び、答えを dist/client/feed.xml に書く。
// site を渡したビルドでは、request の origin がサイトの配信元になる
export async function GET({ request }: RouteContext<'/feed.xml'>) {
  const { origin } = new URL(request.url);
  const items = (await listProducts())
    .map(
      (product) =>
        `<item><title>${product.name}</title><link>${origin}/products/${String(product.id)}</link></item>`,
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>products</title>${items}</channel></rss>`,
    { headers: { 'content-type': 'application/rss+xml;charset=utf-8' } },
  );
}
