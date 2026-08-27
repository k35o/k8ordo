'use client';

import { useEffect, useRef, useState } from 'react';
import type { FC, KeyboardEvent, PropsWithChildren } from 'react';

import { cn, mergeRefs } from '../../../helpers';
import { ChevronIcon } from '../../icons';
import { useCanHover, useHoverIntent, useListNavigation } from '../_internal';
import { Popover } from '../popover';
import { useOpenContext, usePopoverContext } from '../popover/hooks';
import { MenuContextProvider, useMenuContext } from './hooks';
import { cloneWithIndex, itemClass, panelClass } from './shared';
import { useSafeTriangle } from './use-safe-triangle';

const SUBMENU_CLOSE_DELAY = 150;

// safe triangle の描画面。座標は useSafeTriangle が pointermove ごとに
// CSS 変数へ書き込む。開いている間だけ className に含める。
const safeTriangleClass = cn(
  'after:absolute after:z-10',
  'after:top-(--safe-top) after:left-(--safe-left)',
  'after:h-(--safe-height) after:w-(--safe-width)',
  'after:[clip-path:var(--safe-clip)]',
);

const NAVIGATION_KEYS = new Set([
  'ArrowDown',
  'ArrowUp',
  'ArrowRight',
  'Home',
  'End',
]);

export type SubMenuProps = PropsWithChildren<{
  label: string;
}>;

export const SubMenu: FC<SubMenuProps & { index?: number }> = ({
  label,
  children,
  index = 0,
}) => {
  const { isOpen: isParentOpen } = useOpenContext();
  return (
    <Popover.Root placement="right-start" trapFocus={false} role="menu">
      <SubMenuInner index={index} isParentOpen={isParentOpen} label={label}>
        {children}
      </SubMenuInner>
    </Popover.Root>
  );
};

const SubMenuInner: FC<
  PropsWithChildren<{
    label: string;
    index: number;
    isParentOpen: boolean;
  }>
> = ({ label, index, isParentOpen, children }) => {
  const parentMenu = useMenuContext();
  const popover = usePopoverContext();
  const canHover = useCanHover('(hover: hover) and (pointer: fine)');
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const intent = useHoverIntent({
    onOpen: popover.onOpen,
    onClose: popover.onClose,
    closeDelay: SUBMENU_CLOSE_DELAY,
    enabled: canHover,
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const nav = useListNavigation({
    open: popover.isOpen,
    activeIndex,
    setActiveIndex,
    loop: true,
    // hover で開いたときにフォーカスを奪わない。キーボード開時のみ下で明示する。
    autoActivateOnOpen: false,
  });

  // popover は常時マウントなので、親メニューが閉じてもサブメニューは自動では
  // 閉じない。親の開閉に追従して畳む。
  useEffect(() => {
    if (!isParentOpen) {
      intent.cancel();
      popover.onClose();
    }
  }, [isParentOpen, intent, popover]);

  // trapFocus を使わない（hover 開時にフォーカスを奪わせないため）ので、
  // 閉じたときにフォーカスがサブメニュー内で行き場を失っていたらトリガーへ戻す。
  // 復帰はキーボードで開いた（＝フォーカスを送り込んだ）場合に限る。閉じる際は
  // display:none でフォーカスが body へ落ちた後にこの effect が走るため
  // activeElement では判別できず、Safari はクリックでボタンにフォーカスを
  // 当てないので body を「喪失」とみなすと hover だけの操作でも奪ってしまう。
  const openedByKeyboardRef = useRef(false);
  const wasOpenRef = useRef(false);
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = popover.isOpen;
    if (!wasOpen || popover.isOpen) {
      return;
    }
    const byKeyboard = openedByKeyboardRef.current;
    openedByKeyboardRef.current = false;
    if (!byKeyboard) {
      return;
    }
    const active = document.activeElement;
    if (
      active === null ||
      active === document.body ||
      (panelRef.current?.contains(active) ?? false)
    ) {
      triggerRef.current?.focus();
    }
  }, [popover.isOpen]);

  const openByKeyboard = () => {
    openedByKeyboardRef.current = true;
    popover.onOpen();
    setActiveIndex(0);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.key === 'ArrowRight'
    ) {
      event.preventDefault();
      openByKeyboard();
    }
  };

  const navContentProps = nav.getContentProps();
  const handlePanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      popover.onClose();
      return;
    }
    navContentProps.onKeyDown(event);
    // 同じキーで親メニューのリストナビゲーションまで動かさない。
    if (NAVIGATION_KEYS.has(event.key)) {
      event.stopPropagation();
    }
  };

  const updateSafeTriangle = useSafeTriangle(
    panelRef,
    popover.isOpen && canHover,
  );

  const parentItemProps = parentMenu.getItemProps(index);

  return (
    <>
      <button
        aria-controls={popover.isOpen ? `${popover.rootId}_list` : undefined}
        aria-expanded={popover.isOpen}
        aria-haspopup="menu"
        className={cn(
          itemClass,
          'relative flex items-center justify-between gap-2',
          popover.isOpen && 'bg-bg-subtle',
          popover.isOpen && canHover && safeTriangleClass,
        )}
        data-submenu-trigger=""
        // hover で開いた直後のクリックで閉じてしまわないよう、クリックは開く専用。
        // 閉じる操作は click-away / Escape / ArrowLeft が担う。
        onClick={popover.onOpen}
        onKeyDown={handleTriggerKeyDown}
        onMouseEnter={intent.hoverStart}
        onMouseLeave={intent.hoverEnd}
        onPointerMove={updateSafeTriangle}
        role="menuitem"
        type="button"
        {...parentItemProps}
        ref={mergeRefs(triggerRef, popover.setTriggerRef, parentItemProps.ref)}
      >
        <span>{label}</span>
        <ChevronIcon direction="right" size="sm" />
      </button>
      <MenuContextProvider value={{ ...nav, closeRoot: parentMenu.closeRoot }}>
        <Popover.Content
          renderItem={(props) => (
            <div
              {...props}
              className={panelClass}
              onKeyDown={handlePanelKeyDown}
              onMouseEnter={intent.hoverStart}
              onMouseLeave={intent.hoverEnd}
              ref={mergeRefs(props.ref, panelRef)}
              role="menu"
              tabIndex={-1}
            >
              {cloneWithIndex(children)}
            </div>
          )}
        />
      </MenuContextProvider>
    </>
  );
};
