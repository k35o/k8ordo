'use client';

import { clsx } from 'clsx';
import { useRef, useState } from 'react';
import type { FC, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';

import { useControllableState } from '../../../hooks/controllable-state';
import { readWritingMode } from '../../../hooks/writing-mode';
import { ChevronIcon } from '../../icons';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './tree.module.css';

export type TreeItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: readonly TreeItem[];
};

type VisibleItem = {
  item: TreeItem;
  parentId: string | null;
  level: number;
  setSize: number;
  posInSet: number;
};

// 開いている枝だけをたどった、画面に見えている順の一覧。矢印キーの
// 上下はこの一覧の前後へ動く
const visibleItemsOf = (
  items: readonly TreeItem[],
  expandedIds: readonly string[],
  parentId: string | null = null,
  level = 1,
): VisibleItem[] =>
  items.flatMap((item, index) => [
    { item, parentId, level, setSize: items.length, posInSet: index + 1 },
    ...(item.children !== undefined && expandedIds.includes(item.id)
      ? visibleItemsOf(item.children, expandedIds, item.id, level + 1)
      : []),
  ]);

const hasChildren = (item: TreeItem): boolean =>
  item.children !== undefined && item.children.length > 0;

type Direction = 'next' | 'previous' | 'expand' | 'collapse';

// 縦書きでは項目が右から左へ並び、深い階層ほど下へ下がる
const directionOf = (
  key: string,
  isVertical: boolean,
): Direction | undefined => {
  const keys: Record<string, Direction> = isVertical
    ? {
        ArrowLeft: 'next',
        ArrowRight: 'previous',
        ArrowDown: 'expand',
        ArrowUp: 'collapse',
      }
    : {
        ArrowDown: 'next',
        ArrowUp: 'previous',
        ArrowRight: 'expand',
        ArrowLeft: 'collapse',
      };
  return keys[key];
};

// 既定の空の配列。描画ごとに作り直すと、同じ値でも別の参照になる
const NONE: readonly string[] = [];

type Props = {
  label: string;
  items: readonly TreeItem[];
  expandedIds?: readonly string[];
  defaultExpandedIds?: readonly string[];
  onExpandedChange?: (ids: readonly string[]) => void;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onChange?: (id: string) => void;
} & Omit<
  HTMLAttributes<HTMLUListElement>,
  'children' | 'className' | 'style' | 'onChange' | 'role' | 'aria-label'
>;

export const Tree: FC<Props> = ({
  label,
  items,
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
  selectedId,
  defaultSelectedId = null,
  onChange,
  ...rest
}) => {
  const [expanded, setExpanded] = useControllableState<readonly string[]>({
    value: expandedIds,
    defaultValue: defaultExpandedIds ?? NONE,
    onChange: onExpandedChange,
  });
  const [selected, setSelected] = useControllableState<string | null>({
    value: selectedId,
    defaultValue: defaultSelectedId,
    onChange: (id) => {
      if (id !== null) onChange?.(id);
    },
  });
  const visible = visibleItemsOf(items, expanded);
  const entryById = new Map(visible.map((entry) => [entry.item.id, entry]));
  // Tab で入ったときにフォーカスを受ける 1 つ（roving tabindex）
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const tabbableId =
    [focusedId, selected].find(
      (id): id is string => id !== null && entryById.has(id),
    ) ?? visible[0]?.item.id;
  const elements = useRef(new Map<string, HTMLElement>());

  const focus = (id: string | undefined) => {
    if (id === undefined) return;
    setFocusedId(id);
    elements.current.get(id)?.focus();
  };

  const toggle = (id: string) => {
    setExpanded((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id],
    );
  };

  const typeahead = (from: number, character: string) => {
    const lower = character.toLowerCase();
    const ordered = [...visible.slice(from + 1), ...visible.slice(0, from + 1)];
    return ordered.find(({ item }) =>
      item.label.toLowerCase().startsWith(lower),
    )?.item.id;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>, entry: VisibleItem) => {
    const index = visible.indexOf(entry);
    const { item } = entry;
    const direction = directionOf(
      event.key,
      readWritingMode(event.currentTarget) === 'vertical',
    );
    const isExpanded = expanded.includes(item.id);

    if (direction === 'next') {
      focus(visible[index + 1]?.item.id);
    } else if (direction === 'previous') {
      focus(visible[index - 1]?.item.id);
    } else if (direction === 'expand') {
      if (!hasChildren(item)) return;
      if (isExpanded) {
        focus(item.children?.[0]?.id);
      } else {
        toggle(item.id);
      }
    } else if (direction === 'collapse') {
      if (hasChildren(item) && isExpanded) {
        toggle(item.id);
      } else {
        focus(entry.parentId ?? undefined);
      }
    } else if (event.key === 'Home') {
      focus(visible[0]?.item.id);
    } else if (event.key === 'End') {
      focus(visible.at(-1)?.item.id);
    } else if (event.key === 'Enter' || event.key === ' ') {
      setSelected(item.id);
    } else if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      focus(typeahead(index, event.key));
    } else {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    // 項目は入れ子にせず、階層は aria-level で伝える。li が子の枝まで含むと、
    // 子の項目の文字も親の見えているラベルに数えられ、名前と食い違う
    <ul {...rest} aria-label={label} className={styles.root} role="tree">
      {visible.map((entry) => {
        const { item, level, setSize, posInSet } = entry;
        const isParent = hasChildren(item);
        const isExpanded = isParent && expanded.includes(item.id);
        const isSelected = selected === item.id;
        return (
          <li
            aria-expanded={isParent ? isExpanded : undefined}
            aria-level={level}
            aria-posinset={posInSet}
            aria-selected={isSelected}
            aria-setsize={setSize}
            className={clsx(
              styles.item,
              focusRing.ringNoBorder,
              isSelected ? styles.selected : styles.unselected,
            )}
            key={item.id}
            onClick={() => {
              setSelected(item.id);
              focus(item.id);
              if (isParent) toggle(item.id);
            }}
            onFocus={() => {
              setFocusedId(item.id);
            }}
            onKeyDown={(event) => {
              onKeyDown(event, entry);
            }}
            ref={(element) => {
              if (element === null) {
                elements.current.delete(item.id);
                return;
              }
              elements.current.set(item.id, element);
            }}
            role="treeitem"
            style={{
              paddingInlineStart: `${String((level - 1) * 0.75 + 0.25)}rem`,
            }}
            tabIndex={item.id === tabbableId ? 0 : -1}
          >
            <span
              aria-hidden="true"
              className={clsx(
                styles.chevron,
                !isParent && styles.leaf,
                isExpanded && styles.expanded,
              )}
            >
              <ChevronIcon direction="right" size="sm" />
            </span>
            {item.icon === undefined ? null : (
              <span aria-hidden="true" className={styles.icon}>
                {item.icon}
              </span>
            )}
            {item.label}
          </li>
        );
      })}
    </ul>
  );
};
