'use client';

import { clsx } from 'clsx';
import {
  useDeferredValue,
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
  selectedId: string;
  shownId: string;
  setSelectedId: (id: string) => void;
};

// useId() の戻り値は CSS の dashed-ident として無効な文字を含むので無害化する
const toAnchorName = (rootId: string): string =>
  `--ao-tab-${rootId.replaceAll(/[^a-zA-Z0-9_-]/gu, '')}`;

const [TabsProvider, useTabsState] = createSafeContext<TabsContext>(
  'useTabsState must be used within a TabsProvider',
);

type RootProps = PropsWithChildren<
  {
    onChange?: (id: string) => void;
  } & (
    | { selectedId: string; defaultSelectedId?: never }
    | { defaultSelectedId: string; selectedId?: never }
  )
>;

export const Root: FC<RootProps> = ({
  defaultSelectedId,
  selectedId,
  onChange,
  children,
}) => {
  const [currentId, setCurrentId] = useControllableState<string>({
    value: selectedId,
    defaultValue: defaultSelectedId ?? '',
    onChange,
  });
  // パネルは選択の遅延値で描く。選択が同期の更新（外部ストアの値）で来ても、
  // パネルの入れ替わりは後回しの描画になり、<ViewTransition> のクロスフェードと
  // suspend 中の前のパネルの保持が効く
  const shownId = useDeferredValue(currentId);
  const rootId = useId();
  const contextValue = useMemo<TabsContext>(
    () => ({
      rootId,
      selectedId: currentId,
      shownId,
      setSelectedId: setCurrentId,
    }),
    [rootId, currentId, shownId, setCurrentId],
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
        { anchorScope: toAnchorName(rootId) } satisfies CSSProperties
      }
    >
      <TabsListProvider value={listContextValue}>{children}</TabsListProvider>
      <div
        aria-hidden="true"
        className={styles.indicator}
        style={
          {
            positionAnchor: toAnchorName(rootId),
          } satisfies CSSProperties
        }
      />
    </div>
  );
};

const inDocumentOrder = (
  [, a]: [string, HTMLElement],
  [, b]: [string, HTMLElement],
): number =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

export const Tab: FC<PropsWithChildren<{ id: string }>> = ({
  id,
  children,
}) => {
  const { rootId, selectedId, shownId, setSelectedId } = useTabsState();
  const { tabsRef, writingMode } = useTabsListState();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = [...tabsRef.current].toSorted(inDocumentOrder);
    const index = tabs.findIndex(([tabId]) => tabId === id);
    // 縦書きでは tablist の inline 軸が縦になるので、前後を上下キーに割り当てる
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const [previousKey, nextKey] =
      writingMode === 'vertical'
        ? ['ArrowUp', 'ArrowDown']
        : rtl
          ? ['ArrowRight', 'ArrowLeft']
          : ['ArrowLeft', 'ArrowRight'];
    const target = {
      [previousKey]: (index - 1 + tabs.length) % tabs.length,
      [nextKey]: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    const entry = target === undefined ? undefined : tabs[target];
    if (entry === undefined) {
      return;
    }
    event.preventDefault();
    const [targetId, targetElement] = entry;
    if (targetId === id) {
      return;
    }
    // 選択を effect で追ってフォーカスを移すと遅れる。パネルの入れ替わりは
    // <ViewTransition> で animate し、React はそれが終わるまで effect を走らせず、
    // その間に押したキーが元のタブに届いて取りこぼす
    targetElement.focus();
    setSelectedId(targetId);
  };

  return (
    <div
      aria-controls={shownId === id ? `${rootId}-panel-${id}` : undefined}
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
          : undefined) satisfies CSSProperties | undefined
      }
      tabIndex={selectedId === id ? 0 : -1}
    >
      {children}
    </div>
  );
};

export const Panel: FC<PropsWithChildren<{ id: string }>> = ({
  id,
  children,
}) => {
  const { rootId, shownId } = useTabsState();

  if (shownId !== id) {
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
