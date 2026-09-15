'use client';

import {
  startTransition,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  ViewTransition,
} from 'react';
import type {
  CSSProperties,
  FC,
  KeyboardEvent,
  PropsWithChildren,
  RefObject,
} from 'react';

import { FOCUS_RING } from '../../_internal/focus-ring';
import { cn } from './../../../helpers/cn';
import { createSafeContext } from './../../../helpers/create-safe-context';
import { useControllableState } from './../../../hooks/controllable-state';
import { useWritingMode } from './../../../hooks/writing-mode';
import type { WritingMode } from './../../../hooks/writing-mode';

type TabsContext = {
  rootId: string;
  ids: [string, ...string[]];
  selectedId: string;
  setSelectedId: (id: string) => void;
};

// React の CSSProperties はまだ anchor positioning 系プロパティを型に持たない
type AnchorCSSProperties = CSSProperties & {
  anchorName?: string;
  anchorScope?: string;
  positionAnchor?: string;
};

// useId() の戻り値は CSS の dashed-ident として無効な文字を含むので無害化する
const toAnchorName = (rootId: string): string =>
  `--ao-tab-${rootId.replaceAll(/[^a-zA-Z0-9_-]/gu, '')}`;

const [TabsProvider, useTabsState] = createSafeContext<TabsContext>(
  'useTabsState must be used within a TabsProvider',
);

export const Root: FC<
  PropsWithChildren<{
    defaultSelectedId?: string | null;
    selectedId?: string;
    onChange?: (id: string) => void;
    ids: [string, ...string[]];
  }>
> = ({ defaultSelectedId = null, selectedId, onChange, ids, children }) => {
  const defaultIndex =
    defaultSelectedId !== null && defaultSelectedId !== ''
      ? ids.indexOf(defaultSelectedId)
      : 0;
  const [currentId, setCurrentId] = useControllableState<string>({
    value: selectedId,
    defaultValue: defaultSelectedId ?? ids[defaultIndex] ?? ids[0],
    onChange,
  });
  // 選択は transition にする。パネルの入れ替わりを <ViewTransition> が
  // クロスフェードできるのは transition の中の更新だけで、suspend する
  // パネルは用意できるまで今のパネルを残せる
  const setSelectedId = useCallback(
    (id: string) => {
      startTransition(() => {
        setCurrentId(id);
      });
    },
    [setCurrentId],
  );
  const rootId = useId();
  const contextValue = useMemo<TabsContext>(
    () => ({
      rootId,
      ids,
      selectedId: currentId,
      setSelectedId,
    }),
    [rootId, ids, currentId, setSelectedId],
  );

  return (
    <TabsProvider value={contextValue}>
      <div className="flex flex-col gap-1 overflow-x-auto p-0.5">
        {children}
      </div>
    </TabsProvider>
  );
};

const [TabsListProvider, useTabsListState] = createSafeContext<{
  setFocusRef: RefObject<boolean>;
  writingMode: WritingMode;
}>('useTabListState must be used within a TabListProvider');

export const List: FC<
  PropsWithChildren<{
    label: string;
  }>
> = ({ label, children }) => {
  const { rootId } = useTabsState();
  const setFocusRef = useRef<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);
  const writingMode = useWritingMode(listRef);
  const listContextValue = useMemo(
    () => ({ setFocusRef, writingMode }),
    [writingMode],
  );
  return (
    <div
      aria-label={label}
      aria-orientation={writingMode === 'vertical' ? 'vertical' : 'horizontal'}
      className="border-border-base vertical:border-b-0 vertical:border-l vertical:overflow-x-hidden vertical:overflow-y-auto relative flex overflow-x-auto overflow-y-hidden border-b p-0.5 wrap-normal"
      id={`${rootId}-tablist`}
      ref={listRef}
      role="tablist"
      style={
        // useId は React ルートを跨ぐと衝突しうるので、anchor 名の解決を
        // この tablist のサブツリーに限定する
        { anchorScope: toAnchorName(rootId) } satisfies AnchorCSSProperties
      }
    >
      <TabsListProvider value={listContextValue}>{children}</TabsListProvider>
      <div
        aria-hidden="true"
        className="ao-tab-indicator bg-primary-border"
        style={
          { positionAnchor: toAnchorName(rootId) } satisfies AnchorCSSProperties
        }
      />
    </div>
  );
};

export const Tab: FC<PropsWithChildren<{ id: string }>> = ({
  id,
  children,
}) => {
  const { rootId, ids, selectedId, setSelectedId } = useTabsState();
  const { setFocusRef, writingMode } = useTabsListState();
  const ref = useRef<HTMLAnchorElement & HTMLDivElement>(null);
  const activeIndex = ids.indexOf(selectedId);
  const index = ids.indexOf(id);

  useEffect(() => {
    if (activeIndex === index && setFocusRef.current) {
      ref.current?.focus();
      setFocusRef.current = false;
    }
  }, [activeIndex, index, setFocusRef]);

  const moveTo = (direction: 1 | -1) => {
    const nextActiveIndex =
      direction === 1
        ? index === ids.length - 1
          ? 0
          : index + 1
        : index === 0
          ? ids.length - 1
          : index - 1;
    setSelectedId(ids[nextActiveIndex] ?? ids[0]);
    setFocusRef.current = true;
  };

  return (
    <div
      aria-controls={selectedId === id ? `${rootId}-panel-${id}` : undefined}
      aria-selected={selectedId === id}
      className={cn(
        'ao-tab relative cursor-pointer rounded-lg p-2 transition-colors',
        selectedId !== id && 'hover:bg-primary-bg-subtle hover:text-primary-fg',
        FOCUS_RING,
      )}
      id={`${rootId}-tab-${id}`}
      onClick={() => {
        setSelectedId(id);
      }}
      onKeyDown={(e: KeyboardEvent) => {
        // 縦書きでは tablist の inline 軸が縦になるので、prev/next を上下キーに割り当てる。
        const prevKey = writingMode === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
        const nextKey = writingMode === 'vertical' ? 'ArrowDown' : 'ArrowRight';
        if (e.key === prevKey) {
          moveTo(-1);
          return;
        }
        if (e.key === nextKey) {
          moveTo(1);
        }
      }}
      ref={ref}
      role="tab"
      style={
        // 選択中のタブをインジケータ(ao-tab-indicator)のアンカーにする
        (selectedId === id
          ? { anchorName: toAnchorName(rootId) }
          : undefined) satisfies AnchorCSSProperties | undefined
      }
      tabIndex={activeIndex === index ? 0 : -1}
    >
      {children}
    </div>
  );
};

export const Panel: FC<PropsWithChildren<{ id: string }>> = ({
  id,
  children,
}) => {
  const { rootId, selectedId } = useTabsState();

  if (selectedId !== id) {
    return null;
  }

  // 入退場だけを animate する（default="none"）。パネルの中身の更新まで
  // 拾うと、パネル内の transition（Button の action など）で毎回
  // クロスフェードしてしまう
  return (
    <ViewTransition default="none" enter="auto" exit="auto">
      <div
        aria-labelledby={`${rootId}-tab-${id}`}
        className={cn('grow rounded-lg p-2', FOCUS_RING)}
        id={`${rootId}-panel-${id}`}
        role="tabpanel"
      >
        {children}
      </div>
    </ViewTransition>
  );
};
