import { listPosts } from '../../lib/posts.server';

// ビルドはこの GET を 1 度呼び、答えを dist/client/posts.json に書く。
// 殻はビルドが書かなかった記事を、ブラウザでここから読む
export async function GET() {
  return Response.json(await listPosts());
}
