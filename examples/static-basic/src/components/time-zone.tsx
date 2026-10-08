'use client';

import { Suspense, use } from 'react';
import { browser } from 'react-dom';

// ビルド（Node）に訪問者のタイムゾーンは無い。`use(browser())` がそれを言い、
// ビルドは <Suspense> の fallback を書き、ブラウザが hydrate 後にここを描く
function BrowserTimeZone() {
  use(browser('the time zone is the visitor’s'));
  return (
    <p data-testid="time-zone">
      time zone: {new Intl.DateTimeFormat().resolvedOptions().timeZone}
    </p>
  );
}

export function TimeZone() {
  return (
    <Suspense fallback={<p data-testid="time-zone">time zone: not yet</p>}>
      <BrowserTimeZone />
    </Suspense>
  );
}
