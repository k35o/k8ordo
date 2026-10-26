import { Bump } from '../../components/bump';
import { tally } from '../../lib/tally';
import { wait } from '../../lib/wait';

// loading.tsx の無い、データを待つページ。アクションの答えもこのページを
// 描き直したものなので、その木は本体が届くまで当てられない
export default async function TallyPage() {
  const count = `tally ${String(tally())}`;
  await wait(1000);
  return (
    <>
      <title>{count}</title>
      <h1>{count}</h1>
      <Bump />
    </>
  );
}
