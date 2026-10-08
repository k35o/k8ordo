import { wait } from '../_parts/wait';

// loading.tsx の無い、データを待つページ
export default async function SlowPage() {
  await wait(1500);
  return <h1>slow</h1>;
}
