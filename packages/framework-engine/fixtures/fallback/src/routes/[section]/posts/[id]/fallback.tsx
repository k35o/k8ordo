import { Suspense } from 'react';

import { Where } from '../../../../components/where';

export default function PostShell() {
  return (
    <>
      <p>shell</p>
      <Suspense fallback={<p>waiting</p>}>
        <Where />
      </Suspense>
    </>
  );
}
