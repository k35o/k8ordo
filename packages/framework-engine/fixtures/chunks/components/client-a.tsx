'use client';

import './client-a.css';
import { pageWord } from './kit';
import { sharedMark } from './shared';

export function ClientA() {
  return (
    <p data-kit={pageWord()} data-mark-a="" data-shared={sharedMark(2)}>
      MARK_A_CLIENT
    </p>
  );
}
