'use client';

import type { ReactNode } from 'react';

// 受け取った要素を描かない。描かないタブの中身のように、props で渡される
// だけの要素
export const Holder: (props: { later: ReactNode }) => ReactNode = () => (
  <p>holding</p>
);
