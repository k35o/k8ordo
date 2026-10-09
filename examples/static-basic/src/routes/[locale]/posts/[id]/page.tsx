import { notFound } from '@k8ordo/framework';
import type { PageProps } from '@k8ordo/framework';

import { PostArticle } from '../../../../components/post';
import { PostLinks } from '../../../../components/post-links';
import { TimeZone } from '../../../../components/time-zone';
import { findPost } from '../../../../lib/posts.server';

// id の形は、殻の中でブラウザが URL を確かめるのと同じスキーマで決める
export { postParams as paramsSchema } from '../../../../lib/post-params';

// paths が並べた id（1 と 2）だけを、ビルドがこのページで書く
export default async function PostPage({
  params,
}: PageProps<'/:locale/posts/:id'>) {
  const post = await findPost(params.id);
  if (post === undefined) notFound();
  return (
    <>
      <PostArticle post={post} />
      <PostLinks />
      <TimeZone />
    </>
  );
}
