import { Suspense } from 'react';

import { PostFromUrl } from '../../../../components/post-from-url';
import { PostLinks } from '../../../../components/post-links';
import { loadingPost } from '../../../../messages/posts';

// paths に無い id（ビルドの後に増えた記事）には、ホストがこの殻で答える。
// レイアウトは HTML のまま書かれ、本文はブラウザが URL を読んで描く。
// 値を持たないので、props は何も受け取らない
export default function PostShell() {
  return (
    <>
      <Suspense fallback={<p data-testid="shell">{loadingPost()}</p>}>
        <PostFromUrl />
      </Suspense>
      <PostLinks />
    </>
  );
}
