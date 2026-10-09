import * as z from 'zod/mini';

// 記事の id の形。ページの paramsSchema と、殻がブラウザで URL の値を
// 確かめるのとで、同じものを使う
export const postId = z.coerce.number().check(z.int(), z.positive());

// [id] が受け取る値。合わないパスはこのページが答えない（404）
export const postParams = z.object({ id: postId });
