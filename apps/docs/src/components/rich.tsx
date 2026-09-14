import { Code } from '@k8ordo/ui';
import type { FC } from 'react';

/**
 * 文言中の `code` をインラインコードとして描画する（奇数番目が code 部分）。
 * 文言そのものは呼ぶ側が `m.x.y()` で引いて渡す。Server Component からも
 * Client Component からも同じに使える。
 */
export const Rich: FC<{ children: string }> = ({ children: text }) => {
  const parts = text.split(/`([^`]+)`/u);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? <Code key={String(index)}>{part}</Code> : part,
  );
};
