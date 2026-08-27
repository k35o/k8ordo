import { cn } from '../../../helpers';
import type { Placement } from '../../../types/variables';

/**
 * trigger との 8px の隙間（anchor-positioning の offset 相当）を覆う透明ブリッジ。
 *
 * 隙間を渡る途中で mouseleave 扱いにならないよう、当たり判定を「trigger と
 * content の幅の合併」に広げる。1 枚では表現できないため 2 枚の帯を重ねる:
 * - ::before … content の幅の帯（通常の absolute 配置）
 * - ::after … trigger の幅の帯。anchor() は containing block が initial
 *   containing block でないと trigger を参照できない（acceptable anchor 制約）
 *   ため、fixed 配置で CB を ICB に切り替えた上で 4 辺を anchor() で
 *   trigger に張り付ける。anchor 名は popover が配る --ao-anchor を使う。
 *
 * ブリッジが守るのは「まっすぐ渡る」「content 上に留まる」経路だけで、
 * content 中央へ斜めに向かう軌跡は Tooltip の closeDelay（時間側）が守る。
 */
const bridgeBase = cn(
  'before:absolute',
  'after:fixed after:[position-anchor:var(--ao-anchor)]',
);

const BRIDGE_BY_SIDE: Record<'top' | 'bottom' | 'left' | 'right', string> = {
  top: cn(
    'before:inset-x-0 before:-bottom-2 before:h-2',
    'after:h-2 after:bottom-[anchor(top)] after:left-[anchor(left)] after:right-[anchor(right)]',
  ),
  bottom: cn(
    'before:inset-x-0 before:-top-2 before:h-2',
    'after:h-2 after:top-[anchor(bottom)] after:left-[anchor(left)] after:right-[anchor(right)]',
  ),
  left: cn(
    'before:inset-y-0 before:-right-2 before:w-2',
    'after:w-2 after:right-[anchor(left)] after:top-[anchor(top)] after:bottom-[anchor(bottom)]',
  ),
  right: cn(
    'before:inset-y-0 before:-left-2 before:w-2',
    'after:w-2 after:left-[anchor(right)] after:top-[anchor(top)] after:bottom-[anchor(bottom)]',
  ),
};

// 要求 placement 基準の辺に付ける。flip した場合は closeDelay 側が渡りを補う。
export const bridgeClass = (placement: Placement): string => {
  const side = (placement.split('-')[0] ?? 'bottom') as
    | 'top'
    | 'bottom'
    | 'left'
    | 'right';
  return cn(bridgeBase, BRIDGE_BY_SIDE[side]);
};
