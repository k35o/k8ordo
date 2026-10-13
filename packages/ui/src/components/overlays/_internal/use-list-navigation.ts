'use client';

import { useEffect, useRef } from 'react';
import type { Dispatch, KeyboardEvent, SetStateAction } from 'react';

export type ListItemProps = {
  id: string;
  ref: (node: HTMLElement | null) => (() => void) | undefined;
  tabIndex: number;
  onFocus: () => void;
};

export type ListNavigation = {
  getContentProps: () => {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  };
  /** `id` は項目自身の `useId`。項目の順番は DOM の並びで決まる */
  getItemProps: (id: string) => ListItemProps;
  /** 先頭の項目をアクティブにする。キーボードで開いたときに呼ぶ */
  activateFirst: () => void;
};

const isVerticalWritingMode = (el: HTMLElement): boolean => {
  const wm = getComputedStyle(el).writingMode;
  return wm.startsWith('vertical') || wm.startsWith('sideways');
};

const inDocumentOrder = (items: ReadonlySet<HTMLElement>): HTMLElement[] =>
  [...items].toSorted((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );

/**
 * 矢印キーによる roving-tabindex のリストナビゲーション。
 *
 * コンテンツの書字方向に追従してキーを割り当てる:
 * - 横書き: ↑=前 / ↓=次
 * - 縦書き(vertical-rl, 項目は右→左に並ぶ): ←=次 / →=前（↑/↓ も保険として有効）
 *
 * roving-tabindex: アクティブな項目だけ tabIndex=0、他は -1。アクティブ変更時に
 * その項目へフォーカスを移す。開いたら先頭（選択済みがあればそれ）をアクティブにする。
 * hover で開くサブメニューのようにフォーカスを奪ってはいけない場合は
 * autoActivateOnOpen=false にし、キーボード開時だけ呼び出し側が activateFirst する。
 *
 * 項目は index を受け取らない。子を合成するメニューでは、項目が自分の位置を
 * 知るには親が数えて注入するしかなく、条件付きで出し入れすると数え直しになる。
 * 登録された要素を DOM の順に並べ直せば、描かれた並びがそのまま順番になる。
 */
export const useListNavigation = ({
  open,
  activeId,
  setActiveId,
  selectedIndex = null,
  loop = true,
  autoActivateOnOpen = true,
}: {
  open: boolean;
  activeId: string | null;
  setActiveId: Dispatch<SetStateAction<string | null>>;
  selectedIndex?: number | null;
  loop?: boolean;
  autoActivateOnOpen?: boolean;
}): ListNavigation => {
  const itemElementsRef = useRef(new Set<HTMLElement>());

  // 開いたら先頭（選択済みがあればそれ）をアクティブに、閉じたらリセット。
  useEffect(() => {
    if (!open) {
      setActiveId(null);
      return;
    }
    if (!autoActivateOnOpen) {
      return;
    }
    const items = inDocumentOrder(itemElementsRef.current);
    const initial =
      selectedIndex !== null && selectedIndex >= 0 ? selectedIndex : 0;
    setActiveId((prev) => prev ?? items[initial]?.id ?? null);
  }, [open, selectedIndex, setActiveId, autoActivateOnOpen]);

  // アクティブ項目へフォーカスを移す。
  useEffect(() => {
    if (!open || activeId === null) {
      return;
    }
    for (const item of itemElementsRef.current) {
      if (item.id === activeId) {
        item.focus();
      }
    }
  }, [open, activeId]);

  const activateAt = (
    pick: (items: HTMLElement[]) => HTMLElement | undefined,
  ) => {
    setActiveId(pick(inDocumentOrder(itemElementsRef.current))?.id ?? null);
  };

  const move = (delta: 1 | -1) => {
    const items = inDocumentOrder(itemElementsRef.current);
    const total = items.length;
    if (total === 0) {
      return;
    }
    setActiveId((prev) => {
      const current = items.findIndex((item) => item.id === prev);
      const base = current === -1 ? (delta === 1 ? -1 : total) : current;
      const next = base + delta;
      const index = loop
        ? (next + total) % total
        : Math.max(0, Math.min(total - 1, next));
      return items[index]?.id ?? prev;
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
        activateAt((items) => items.at(0));
        break;
      case 'End':
        event.preventDefault();
        activateAt((items) => items.at(-1));
        break;
      default:
        break;
    }
  };

  return {
    getContentProps: () => ({ onKeyDown }),
    getItemProps: (id) => ({
      id,
      ref: (node) => {
        if (node === null) {
          return undefined;
        }
        itemElementsRef.current.add(node);
        return () => {
          itemElementsRef.current.delete(node);
        };
      },
      tabIndex: activeId === id ? 0 : -1,
      onFocus: () => {
        setActiveId(id);
      },
    }),
    activateFirst: () => {
      activateAt((items) => items.at(0));
    },
  };
};
