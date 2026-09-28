'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  FC,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
} from 'react';

import { createSafeContext } from '../../../helpers/create-safe-context';
import { useListNavigation } from '../_internal';
import { MenuContextProvider } from '../dropdown-menu/hooks';
import { Popover, useOpenContext } from '../popover';
import { usePopoverContext } from '../popover/hooks';

type Point = { x: number; y: number };

const [ContextMenuProvider, useContextMenu] = createSafeContext<{
  openAt: (point: Point, returnFocusTo: HTMLElement | null) => void;
}>('useContextMenu must be used within a ContextMenu.Root');

export const Root: FC<
  PropsWithChildren<{
    isOpen?: boolean;
    defaultOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
  }>
> = ({ children, isOpen, defaultOpen, onChange }) => (
  <Popover.Root
    defaultOpen={defaultOpen}
    isOpen={isOpen}
    onChange={onChange}
    placement="bottom-start"
    role="menu"
  >
    <MenuRoot>{children}</MenuRoot>
  </Popover.Root>
);

const MenuRoot: FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useOpenContext();
  const { setTriggerRef } = usePopoverContext();
  const [point, setPoint] = useState<Point>({ x: 0, y: 0 });
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const nav = useListNavigation({
    open: isOpen,
    activeIndex,
    setActiveIndex,
    loop: true,
  });

  // メニューの anchor は見えない点なので、Popover はそこへフォーカスを戻せない。
  // 閉じたときフォーカスがまだメニューの中（隠れた項目。body へ落ちるのは次の
  // 描画の後）か行き場を失っていたら、開く前にフォーカスがあった要素へ戻す。
  // 外側をクリックして閉じたときは、クリックした先のフォーカスを奪わない
  const wasOpenRef = useRef(false);
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = isOpen;
    if (!wasOpen || isOpen) {
      return;
    }
    const active = document.activeElement;
    if (
      active === null ||
      active === document.body ||
      active.closest('[role="menu"]') !== null
    ) {
      returnFocusRef.current?.focus();
    }
  }, [isOpen]);

  const openAt = useCallback(
    (next: Point, returnFocusTo: HTMLElement | null) => {
      returnFocusRef.current = returnFocusTo;
      setPoint(next);
      onOpen();
    },
    [onOpen],
  );
  const contextValue = useMemo(() => ({ openAt }), [openAt]);

  return (
    <ContextMenuProvider value={contextValue}>
      <MenuContextProvider value={{ ...nav, closeRoot: onClose }}>
        {/* メニューを出す点。Popover はここを anchor にし、画面からはみ出せば反転する */}
        <span
          aria-hidden
          ref={setTriggerRef}
          style={{ position: 'fixed', left: point.x, top: point.y }}
        />
        {children}
      </MenuContextProvider>
    </ContextMenuProvider>
  );
};

export const Trigger: FC<{
  renderItem: (props: {
    onContextMenu: MouseEventHandler<HTMLElement>;
  }) => ReactElement;
}> = ({ renderItem }) => {
  const { openAt } = useContextMenu();
  return renderItem({
    onContextMenu: (event) => {
      event.preventDefault();
      const active = document.activeElement;
      openAt(
        { x: event.clientX, y: event.clientY },
        active instanceof HTMLElement ? active : null,
      );
    },
  });
};
