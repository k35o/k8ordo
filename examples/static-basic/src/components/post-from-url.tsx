'use client';

import { notFound, useMatch } from '@k8ordo/framework';
import { use } from 'react';

import { postId } from '../lib/post-params';
import { readPosts } from '../lib/posts';
import { PostArticle } from './post';

// 殻の本文。値は URL にしか無いので、ブラウザで読む。殻の中の useMatch は
// サーバーではブラウザを待ち、ビルドは fallback.tsx の Suspense の fallback を書く
export function PostFromUrl() {
  const match = useMatch('/:locale/posts/:id');
  // 次のページが届く前に URL だけが先に変わった。去っていくところなので
  // 何も描かない（notFound() と言うと、去り際に not-found が出る）
  if (match === null) return null;
  // ページの paramsSchema は殻では走らない。同じスキーマでここで確かめる
  const id = postId.safeParse(match.id);
  const post = id.success
    ? use(readPosts()).find((each) => each.id === id.data)
    : undefined;
  // 描いている間に言えば、いちばん近い not-found.tsx がその場に出る
  if (post === undefined) notFound();
  return <PostArticle post={post} />;
}
