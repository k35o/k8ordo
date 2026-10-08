import type { RedirectTarget } from '@k8ordo/framework/server';

// 最初の記事の古い住所。殻と同じ /:locale/posts/… の下にある、ページでない URL
export default '/:locale/posts/1' satisfies RedirectTarget;
