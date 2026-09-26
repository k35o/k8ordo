import type { RouteContext } from '@k8ordo/router';

import { listProducts } from '../_data/catalog.server';

const escape = (text: string): string =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');

// ページではなく、ファイルのような答え。ディレクトリ名がそのまま URL になる
export async function GET({ request }: RouteContext<'/feed.xml'>) {
  const { origin } = new URL(request.url);
  const items = (await listProducts())
    .map(
      (product) =>
        `<item><title>${escape(product.name)}</title><link>${origin}/products/${String(product.id)}</link></item>`,
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>products</title><link>${origin}/</link>${items}</channel></rss>`,
    { headers: { 'content-type': 'application/rss+xml;charset=utf-8' } },
  );
}
