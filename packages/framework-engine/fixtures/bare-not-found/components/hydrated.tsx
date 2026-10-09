'use client';

import { Suspense, use } from 'react';
import { browser } from 'react-dom';

// ブラウザでしか描かれない印。not-found.test.ts はこれを見て hydrate を待つ
function InTheBrowser() {
  use(browser('only the browser runs the client'));
  return <p>hydrated</p>;
}

export function Hydrated() {
  return (
    <Suspense fallback={<p>not yet</p>}>
      <InTheBrowser />
    </Suspense>
  );
}
