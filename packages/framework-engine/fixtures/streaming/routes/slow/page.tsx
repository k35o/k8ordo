import { wait } from '../../lib/wait';

// loading.tsx の無い、データを待つページ。待ち時間はリンクに乗った時点の
// 先読みから数えるので、負荷の高い CI でテストがクリックで追い越すより
// 先に届き終えない長さにしておく
export default async function SlowPage() {
  await wait(5000);
  return <h1>slow</h1>;
}
