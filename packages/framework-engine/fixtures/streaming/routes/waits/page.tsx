import { Suspense } from 'react';

import { wait } from '../_parts/wait';

async function Late() {
  await wait(800);
  return <p>late</p>;
}

// loading.tsx の下の、データを待つページ。本文は React が完了済みでも
// 外に出す大きさ（既定の progressiveChunkSize）を超える
export default async function WaitsPage() {
  await wait(300);
  return (
    <>
      <h1>waits</h1>
      <ol>
        {Array.from({ length: 600 }, (_, index) => (
          <li key={index}>{`row ${String(index)}`}</li>
        ))}
      </ol>
      <Suspense fallback={<p>streaming…</p>}>
        <Late />
      </Suspense>
    </>
  );
}
