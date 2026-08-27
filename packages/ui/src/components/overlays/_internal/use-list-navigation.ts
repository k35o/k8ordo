'use client';

import { useEffect, useRef } from 'react';
import type { Dispatch, KeyboardEvent, SetStateAction } from 'react';

export type ListItemProps = {
  ref: (node: HTMLElement | null) => void;
  tabIndex: number;
  onFocus: () => void;
};

export type ListNavigation = {
  getContentProps: () => {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  };
  getItemProps: (index: number) => ListItemProps;
};

const isVerticalWritingMode = (el: HTMLElement): boolean => {
  const wm = getComputedStyle(el).writingMode;
  return wm.startsWith('vertical') || wm.startsWith('sideways');
};

/**
 * 矢印キーによる roving-tabindex のリストナビゲーション。
 * floating-ui の useListNavigation / useInteractions / FloatingList / useListItem を置換する。
 *
 * コンテンツの書字方向に追従してキーを割り当てる:
 * - 横書き: ↑=前 / ↓=次
 * - 縦書き(vertical-rl, 項目は右→左に並ぶ): ←=次 / →=前（↑/↓ も保険として有効）
 *
 * roving-tabindex: アクティブな項目だけ tabIndex=0、他は -1。アクティブ変更時に
 * その項目へフォーカスを移す。開いたら先頭（選択済みがあればそれ）をアクティブにする。
 * hover で開くサブメニューのようにフォーカスを奪ってはいけない場合は
 * autoActivateOnOpen=false にし、キーボード開時だけ呼び出し側が setActiveIndex する。
 */
export const useListNavigation = ({
  open,
  activeIndex,
  setActiveIndex,
  selectedIndex = null,
  loop = true,
  autoActivateOnOpen = true,
}: {
  open: boolean;
  activeIndex: number | null;
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
  selectedIndex?: number | null;
  loop?: boolean;
  autoActivateOnOpen?: boolean;
}): ListNavigation => {
  const itemElementsRef = useRef<Array<HTMLElement | null>>([]);

  // 開いたら先頭（選択済みがあればそれ）をアクティブに、閉じたらリセット。
  useEffect(() => {
    if (!open) {
      setActiveIndex(null);
      return;
    }
    if (!autoActivateOnOpen) {
      return;
    }
    setActiveIndex(
      (prev) =>
        prev ??
        (selectedIndex !== null && selectedIndex >= 0 ? selectedIndex : 0),
    );
  }, [open, selectedIndex, setActiveIndex, autoActivateOnOpen]);

  // アクティブ項目へフォーカスを移す。
  useEffect(() => {
    if (open && activeIndex !== null) {
      itemElementsRef.current[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  const count = (): number => itemElementsRef.current.filter(Boolean).length;

  const move = (delta: 1 | -1) => {
    const total = count();
    if (total === 0) {
      return;
    }
    setActiveIndex((prev) => {
      const base = prev ?? (delta === 1 ? -1 : total);
      const next = base + delta;
      if (loop) {
        return (next + total) % total;
      }
      return Math.max(0, Math.min(total - 1, next));
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const vertical = isVerticalWritingMode(event.currentTarget);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'ArrowLeft':
        if (vertical) {
          event.preventDefault();
          move(1);
        }
        break;
      case 'ArrowRight':
        if (vertical) {
          event.preventDefault();
          move(-1);
        }
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(count() > 0 ? 0 : null);
        break;
      case 'End': {
        const total = count();
        event.preventDefault();
        setActiveIndex(total > 0 ? total - 1 : null);
        break;
      }
      default:
        break;
    }
  };

  return {
    getContentProps: () => ({ onKeyDown }),
    getItemProps: (index) => ({
      ref: (node) => {
        itemElementsRef.current[index] = node;
      },
      tabIndex: activeIndex === index ? 0 : -1,
      onFocus: () => {
        setActiveIndex(index);
      },
    }),
  };
};
