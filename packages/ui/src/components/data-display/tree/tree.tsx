'use client';

import { useId, useRef, useState } from 'react';
import type { FC, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';

import { cn } from '../../../helpers/cn';
import { useControllableState } from '../../../hooks/controllable-state';
import { readWritingMode } from '../../../hooks/writing-mode';
import { ChevronIcon } from '../../icons';

export type TreeItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: readonly TreeItem[];
};

type VisibleItem = {
  item: TreeItem;
  depth: number;
  parentId: string | null;
};

// 開いている枝だけをたどった、画面に見えている順の一覧。矢印キーの
// 上下はこの一覧の前後へ動く
const visibleItemsOf = (
  items: readonly TreeItem[],
  expandedIds: readonly string[],
  depth = 1,
  parentId: string | null = null,
): VisibleItem[] =>
  items.flatMap((item) => [
    { item, depth, parentId },
    ...(item.children !== undefined && expandedIds.includes(item.id)
      ? visibleItemsOf(item.children, expandedIds, depth + 1, item.id)
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
  const baseId = useId();
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
  // Tab で入ったときにフォーカスを受ける 1 つ（roving tabindex）
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const tabbableId =
    visible.find(({ item }) => item.id === focusedId)?.item.id ??
    visible.find(({ item }) => item.id === selected)?.item.id ??
    visible[0]?.item.id;
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

  const renderItems = (level: readonly TreeItem[], depth: number): ReactNode =>
    level.map((item) => {
      const entry = visible.find((candidate) => candidate.item.id === item.id);
      const isParent = hasChildren(item);
      const isExpanded = isParent && expanded.includes(item.id);
      const isSelected = selected === item.id;
      const labelId = `${baseId}-${item.id}`;
      return (
        <li
          aria-expanded={isParent ? isExpanded : undefined}
          aria-labelledby={labelId}
          aria-selected={isSelected}
          className="[&:focus-visible>div]:ring-border-info focus-visible:outline-none [&:focus-visible>div]:ring-2 [&:focus-visible>div]:outline-hidden"
          key={item.id}
          onClick={(event) => {
            // 入れ子の項目のクリックが、親の項目まで泡立たないようにする
            event.stopPropagation();
            setSelected(item.id);
            focus(item.id);
            if (isParent) toggle(item.id);
          }}
          onFocus={(event) => {
            if (event.target === event.currentTarget) setFocusedId(item.id);
          }}
          onKeyDown={(event) => {
            if (entry !== undefined && event.target === event.currentTarget) {
              onKeyDown(event, entry);
            }
          }}
          ref={(element) => {
            if (element === null) {
              elements.current.delete(item.id);
              return;
            }
            elements.current.set(item.id, element);
          }}
          role="treeitem"
          tabIndex={item.id === tabbableId ? 0 : -1}
        >
          <div
            className={cn(
              'flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 pe-3 text-sm transition-colors',
              isSelected
                ? 'bg-primary-bg-subtle text-fg-base font-medium forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]'
                : 'text-fg-mute hover:bg-bg-mute hover:text-fg-base',
            )}
            style={{ paddingInlineStart: `${String(depth * 0.75 + 0.25)}rem` }}
          >
            <span
              aria-hidden="true"
              className={cn(
                'inline-flex size-4 shrink-0 transition-transform',
                !isParent && 'invisible',
                isExpanded && 'rotate-90',
              )}
            >
              <ChevronIcon direction="right" size="sm" />
            </span>
            {item.icon === undefined ? null : (
              <span aria-hidden="true" className="inline-flex shrink-0">
                {item.icon}
              </span>
            )}
            <span id={labelId}>{item.label}</span>
          </div>
          {isExpanded && item.children !== undefined ? (
            <ul role="group">{renderItems(item.children, depth + 1)}</ul>
          ) : null}
        </li>
      );
    });

  return (
    <ul {...rest} aria-label={label} className="flex flex-col" role="tree">
      {renderItems(items, 0)}
    </ul>
  );
};
