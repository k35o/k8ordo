import { wait } from '../_parts/wait';

// フィクスチャのビルドは @k8ordo/state をこの読み方そのものに差し替える
export const search = (params: URLSearchParams): { q: string } => ({
  q: params.get('q') ?? '',
});

// search を読む、loading.tsx の無いページ。q が slow で始まると待つ
export default async function SearchPage({
  search: { q },
}: {
  search: { q: string };
}) {
  if (q.startsWith('slow')) await wait(1500);
  return <h1>{`results for ${q}`}</h1>;
}
