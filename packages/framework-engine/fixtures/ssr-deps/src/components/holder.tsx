'use client';

import type { ReactNode } from 'react';

// 受け取ったものを描かない。描かないタブの中身のように、props で渡される
// だけの要素や部品
export const Holder: (props: { later: unknown }) => ReactNode = () => (
  <p>MARK_HOLDER</p>
);
