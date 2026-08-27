import type { CSSProperties } from 'react';

import type { Placement } from '../../../types/variables';

/**
 * CSS Anchor Positioning による配置ヘルパー。
 *
 * placement を position-area / position-try-fallbacks / 対向辺マージン（offset 相当）へ
 * 変換する。旧 floating-ui のミドルウェア（offset / flip / autoUpdate）の置き換え。
 *
 * 注意: CSS Anchor Positioning は Baseline newly available（2026-01）で、
 * 縦書き / RTL のインライン軸補正にエンジン差（既知の interop バグ）がある。
 */

// React の CSSProperties はまだ anchor positioning 系プロパティを型に持たないため拡張する。
type AnchorCSSProperties = CSSProperties & {
  positionAnchor?: string;
  positionArea?: string;
  positionTryFallbacks?: string;
  // position-anchor は継承されないため、content 内の疑似要素（Tooltip のブリッジなど)
  // が同じ anchor を参照できるよう、名前を CSS 変数としても配る。
  '--ao-anchor'?: string;
};

// floating-ui の物理 Placement を position-area へ写像する。
// `span-*` は anchor 中央から該当方向へ伸びる領域を指し、その先頭辺に揃うため、
// `-start` は開始辺揃え（span を反対側へ）、`-end` は終了辺揃えになる。
const POSITION_AREA: Record<Placement, string> = {
  top: 'top',
  'top-start': 'top span-right',
  'top-end': 'top span-left',
  bottom: 'bottom',
  'bottom-start': 'bottom span-right',
  'bottom-end': 'bottom span-left',
  left: 'left',
  'left-start': 'left span-bottom',
  'left-end': 'left span-top',
  right: 'right',
  'right-start': 'right span-bottom',
  'right-end': 'right span-top',
};

// offset(8) 相当。anchor と対向する辺にだけ余白を付けて 8px の隙間を作る。
const GAP = '8px';
const sideGap = (side: string): CSSProperties => {
  switch (side) {
    case 'top':
      return { marginBottom: GAP };
    case 'bottom':
      return { marginTop: GAP };
    case 'left':
      return { marginRight: GAP };
    case 'right':
      return { marginLeft: GAP };
    default:
      return {};
  }
};

// useId() の戻り値（`:r1:` など）は CSS の dashed-ident として無効なので無害化する。
export const toAnchorName = (id: string): string =>
  `--ao-popover-${id.replaceAll(/[^a-zA-Z0-9_-]/gu, '')}`;

/**
 * Popover content（位置決め対象）に適用する style。
 * `flipDisabled` のときは position-try-fallbacks を付けず、はみ出しても反転しない。
 */
export const getContentAnchorStyle = (
  anchorName: string,
  placement: Placement,
  flipDisabled: boolean,
): AnchorCSSProperties => {
  const side = placement.split('-')[0] ?? 'bottom';
  return {
    position: 'fixed',
    // UA の `[popover]` は inset:0 / margin:auto で中央寄せするため、
    // position-area で配置できるよう打ち消す。
    inset: 'auto',
    margin: 0,
    // UA の `[popover] { overflow: auto }` は内側の影・角丸をクリップするため visible に戻す。
    overflow: 'visible',
    // UA の `[popover]` 既定 `background-color: Canvas`（OS のカラースキームに追従し
    // アプリの .dark と一致しない）/ `border: solid` / `padding: 0.25em` を打ち消す。
    // 見た目（背景・余白・角丸）は内側の renderItem 側が持つため、ラッパーは透明にする。
    background: 'transparent',
    border: 0,
    padding: 0,
    ...sideGap(side),
    positionAnchor: anchorName,
    '--ao-anchor': anchorName,
    positionArea: POSITION_AREA[placement],
    ...(flipDisabled
      ? {}
      : {
          positionTryFallbacks:
            'flip-block, flip-inline, flip-block flip-inline',
        }),
  };
};
