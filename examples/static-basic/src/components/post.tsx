export type Post = { readonly id: number; readonly title: string };

// ページ（サーバー）も、殻の中でブラウザが読んだ記事（クライアント）も、
// 同じこれで描く
export function PostArticle({ post }: { post: Post }) {
  return (
    <article>
      <title>{post.title}</title>
      <h1 data-testid="title">{post.title}</h1>
    </article>
  );
}
