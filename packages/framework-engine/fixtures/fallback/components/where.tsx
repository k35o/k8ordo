'use client';

import { usePathname } from '@k8ordo/router';

// 殻の中では、ブラウザに着くまで URL を読まない
export function Where() {
  return <p>at {usePathname()}</p>;
}
