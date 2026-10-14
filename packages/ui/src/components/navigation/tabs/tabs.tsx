'use client';

import { clsx } from 'clsx';
import {
  startTransition,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  ViewTransition,
} from 'react';
import type {
  CSSProperties,
  FC,
  KeyboardEvent,
  PropsWithChildren,
  RefObject,
} from 'react';

import { createSafeContext } from './../../../helpers/create-safe-context';
import { useControllableState } from './../../../hooks/controllable-state';
import { useWritingMode } from './../../../hooks/writing-mode';
import type { WritingMode } from './../../../hooks/writing-mode';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './tabs.module.css';

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
      <div className={styles.root}>{children}</div>
    </TabsProvider>
  );
};

const [TabsListProvider, useTabsListState] = createSafeContext<{
  tabsRef: RefObject<Map<string, HTMLDivElement>>;
  writingMode: WritingMode;
}>('useTabListState must be used within a TabListProvider');

export const List: FC<
  PropsWithChildren<{
    label: string;
  }>
> = ({ label, children }) => {
  const { rootId } = useTabsState();
  const tabsRef = useRef(new Map<string, HTMLDivElement>());
  const [tablist, setTablist] = useState<HTMLDivElement | null>(null);
  const writingMode = useWritingMode(tablist);
  const listContextValue = useMemo(
    () => ({ tabsRef, writingMode }),
    [writingMode],
  );
  return (
    <div
      aria-label={label}
      aria-orientation={writingMode === 'vertical' ? 'vertical' : 'horizontal'}
      className={styles.list}
      id={`${rootId}-tablist`}
      ref={setTablist}
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
        className={styles.indicator}
        style={
          {
            positionAnchor: toAnchorName(rootId),
          } satisfies AnchorCSSProperties
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
  const { tabsRef, writingMode } = useTabsListState();
  const activeIndex = ids.indexOf(selectedId);
  const index = ids.indexOf(id);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // 縦書きでは tablist の inline 軸が縦になるので、前後を上下キーに割り当てる
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const [previousKey, nextKey] =
      writingMode === 'vertical'
        ? ['ArrowUp', 'ArrowDown']
        : rtl
          ? ['ArrowRight', 'ArrowLeft']
          : ['ArrowLeft', 'ArrowRight'];
    const target = {
      [previousKey]: (index - 1 + ids.length) % ids.length,
      [nextKey]: (index + 1) % ids.length,
      Home: 0,
      End: ids.length - 1,
    }[event.key];
    const targetId = target === undefined ? undefined : ids[target];
    if (targetId === undefined) {
      return;
    }
    event.preventDefault();
    if (targetId === id) {
      return;
    }
    // 選択を effect で追ってフォーカスを移すと遅れる。選択は transition で、React は
    // <ViewTransition> の animate が終わるまで effect を走らせず、その間に押した
    // キーが元のタブに届いて取りこぼす
    tabsRef.current.get(targetId)?.focus();
    setSelectedId(targetId);
  };

  return (
    <div
      aria-controls={selectedId === id ? `${rootId}-panel-${id}` : undefined}
      aria-selected={selectedId === id}
      className={clsx(
        styles.tab,
        selectedId !== id && styles.unselected,
        focusRing.ring,
      )}
      id={`${rootId}-tab-${id}`}
      onClick={() => {
        setSelectedId(id);
      }}
      onKeyDown={handleKeyDown}
      ref={(element) => {
        if (element === null) {
          tabsRef.current.delete(id);
          return;
        }
        tabsRef.current.set(id, element);
      }}
      role="tab"
      style={
        // 選択中のタブをインジケータのアンカーにする
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
        className={clsx(styles.panel, focusRing.ring)}
        id={`${rootId}-panel-${id}`}
        role="tabpanel"
      >
        {children}
      </div>
    </ViewTransition>
  );
};
