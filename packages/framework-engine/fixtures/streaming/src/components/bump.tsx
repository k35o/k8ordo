'use client';

import { startTransition } from 'react';

import { bump } from '../lib/actions';

// 押すたびにアクションを呼ぶ。答えを待たずに次を呼べる
export function Bump() {
  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await bump();
        });
      }}
      type="button"
    >
      bump
    </button>
  );
}
