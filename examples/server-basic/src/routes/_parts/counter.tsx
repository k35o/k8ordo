'use client';

import { useState } from 'react';

// 実行環境は React 自身の語彙で宣言する。routes/ の下でも _ 付きの
// ディレクトリはルートにならないので、ページ私有の部品はここに置く。
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
