import { Suspense } from 'react';

import { wait } from '../../lib/wait';

async function Fails(): Promise<never> {
  await wait(50);
  throw new Error('the database is down');
}

export default function BrokenPage() {
  return (
    <Suspense fallback={<p>streaming…</p>}>
      <Fails />
    </Suspense>
  );
}
