'use client';

import { Suspense, use } from 'react';
import { browser } from 'react-dom';

import { frameWord } from './kit';
import { sharedMark } from './shared';

// ブラウザでしか描かれない印。chunks.test.ts はこれを見て hydrate を待つ
function InTheBrowser() {
  use(browser('only the browser runs the client'));
  return (
    <p data-kit={frameWord()} data-shared={sharedMark(1)}>
      hydrated
    </p>
  );
}

export function Hydrated() {
  return (
    <Suspense fallback={<p>not yet</p>}>
      <InTheBrowser />
    </Suspense>
  );
}
