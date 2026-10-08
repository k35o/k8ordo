'use client';

import { useState } from 'react';

// 実行環境は React 自身の語彙で宣言する。
export function Counter() {
  const [n, setN] = useState(0);
  return (
    <button
      data-testid="counter"
      onClick={() => {
        setN(n + 1);
      }}
      type="button"
    >
      count {n}
    </button>
  );
}
