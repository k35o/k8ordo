'use client';

import { useColorScheme } from '@k8ordo/color-scheme';

// ビルドは訪問者の設定もシステムも知らないので light で書く。ダークの
// 訪問者では hydrate した直後に値が変わり、その下のページ全体へ伝わる
export function SchemeToggle() {
  const { scheme, setPreference } = useColorScheme();
  return (
    <button
      data-testid="scheme"
      onClick={() => {
        setPreference(scheme === 'dark' ? 'light' : 'dark');
      }}
      type="button"
    >
      scheme: {scheme}
    </button>
  );
}
