import { withBase } from '@k8ordo/framework';

import type { Post } from '../components/post';

// ブラウザから記事を読む。このサンプルではサイト自身が配る posts.json だが、
// 実際のアプリでは CMS の API にあたる。ビルドの後に増えた記事（3）も、
// ここからなら読める。use() に渡すので、約束は 1 つを使い回す
let posts: Promise<readonly Post[]> | undefined;

export const readPosts = (): Promise<readonly Post[]> =>
  (posts ??= fetch(withBase('/posts.json')).then(async (response) => {
    if (!response.ok) {
      throw new Error(
        `the posts could not be read (${String(response.status)})`,
      );
    }
    return (await response.json()) as readonly Post[];
  }));
