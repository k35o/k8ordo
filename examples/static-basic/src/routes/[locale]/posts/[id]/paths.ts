import type { Paths } from '@k8ordo/framework';

// 記事は 1 と 2 だけを書く。ほかの id（ビルドの後に増えた記事）には、隣の
// fallback.tsx の殻が答える。殻は上の [locale] の値ごとに立つ
const paths: Paths<'/:locale/posts/:id'> = () => ['1', '2'];

export default paths;
