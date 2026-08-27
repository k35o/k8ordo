'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import type { FC, FocusEvent, PropsWithChildren, ReactElement } from 'react';

import { cn } from '../../../helpers';
import { useControllableState, useWritingMode } from '../../../hooks';
import { useFocusTrap } from '../../../hooks/focus-trap';
import type { Placement } from '../../../types/variables';
import { getContentAnchorStyle, toAnchorName } from './anchor-positioning';
import { pushEscapeLayer } from './escape-stack';
import {
  PopoverProvider,
  usePopoverContent,
  usePopoverContext,
  usePopoverTrigger,
} from './hooks';
import type { PopoverContentProps, PopoverTriggerProps } from './hooks';

export {
  useOpenContext,
  type PopoverContentProps,
  type PopoverTriggerProps,
} from './hooks';

const Root: FC<
  PropsWithChildren<{
    placement?: Placement;
    role?: 'dialog' | 'menu' | 'listbox';
    flipDisabled?: boolean;
    closeOnClickAway?: boolean;
    trapFocus?: boolean;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
  }>
> = ({
  children,
  role = 'menu',
  placement = 'bottom-start',
  flipDisabled = false,
  closeOnClickAway = true,
  trapFocus = true,
  isOpen: isOpenProp,
  defaultOpen = false,
  onChange,
}) => {
  const id = useId();
  const [isOpen, setIsOpen] = useControllableState({
    value: isOpenProp,
    defaultValue: defaultOpen,
    onChange,
  });

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);
  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  const anchorName = toAnchorName(id);
  const triggerRef = useRef<HTMLElement | null>(null);

  const setTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;
      if (node) {
        node.style.setProperty('anchor-name', anchorName);
      }
    },
    [anchorName],
  );

  // 開いている間だけレイヤースタックに積む。Escape は最上位の 1 枚だけが消費する。
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    return pushEscapeLayer(close);
  }, [isOpen, close]);

  return (
    <PopoverProvider
      value={{
        rootId: id,
        role,
        closeOnClickAway,
        trapFocus,
        isOpen,
        toggleOpen: toggle,
        onOpen: open,
        onClose: close,
        placement,
        anchorName,
        flipDisabled,
        triggerRef,
        setTriggerRef,
      }}
    >
      {children}
    </PopoverProvider>
  );
};

const Content: FC<{
  renderItem: (props: PopoverContentProps) => ReactElement;
  // 開閉アニメーション。scale=ポップ（既定）、fade=フェード（Tooltip 用）。
  animation?: 'scale' | 'fade';
}> = ({ renderItem, animation = 'scale' }) => {
  const { isOpen, trapFocus, anchorName, placement, flipDisabled, itemProps } =
    usePopoverContent();
  const { triggerRef, onClose } = usePopoverContext();

  // content は popover で top-layer に出すためインライン描画になり、trigger 側の
  // writing-mode を継承する。`vertical:` variant は `.writing-v` 祖先を要求するので、
  // 縦書きなら class を付与する。
  const writingMode = useWritingMode(triggerRef);
  const writingClass = writingMode === 'vertical' ? 'writing-v' : undefined;

  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Popover API の top-layer 表示・非表示を isOpen に同期する（FloatingPortal の置換）。
  // manual: native の light-dismiss は使わず、外側クリック / Escape は従来どおり
  // JS（useClickAway / window keydown）で扱い、trigger との二重トグルを避ける。
  // 要素は常時マウントし、開閉アニメは CSS（@starting-style + allow-discrete）で行う。
  useEffect(() => {
    const el = contentWrapperRef.current;
    if (!el) {
      return;
    }
    if (isOpen && !el.matches(':popover-open')) {
      el.showPopover();
    } else if (!isOpen && el.matches(':popover-open')) {
      el.hidePopover();
    }
  }, [isOpen]);

  // floating-ui の FloatingFocusManager(modal=false) 相当を自前フックで代替。
  useFocusTrap(contentWrapperRef, triggerRef, isOpen && trapFocus);

  // FloatingFocusManager の closeOnFocusOut 相当（Tab でメニュー外へ抜けたら閉じる）。
  // trapFocus で絞るのは、focus 管理を使わない Tooltip の hover 挙動に干渉しないため。
  // relatedTarget が null のケース（外側クリックや hidePopover で焦点が body へ落ちる）
  // は Tab 移動と区別できないので閉じず、外側クリックは useClickAway に任せる。
  const handleFocusOut = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (
      !isOpen ||
      !trapFocus ||
      next === null ||
      event.currentTarget.contains(next) ||
      triggerRef.current?.contains(next) === true
    ) {
      return;
    }
    onClose();
  };

  return (
    // outline-hidden: フォーカス管理で当てる tabindex=-1 の管理用フォーカスでは
    // ブラウザ既定の outline を出さない（中の項目・ボタンは各自の focus リングを持つ）。
    <div
      className={cn(
        'z-overlay outline-hidden',
        animation === 'fade' ? 'ao-anim-fade' : 'ao-anim-scale',
        writingClass,
      )}
      onBlur={handleFocusOut}
      popover="manual"
      ref={contentWrapperRef}
      style={getContentAnchorStyle(anchorName, placement, flipDisabled)}
    >
      {renderItem(itemProps)}
    </div>
  );
};

const Trigger: FC<{
  renderItem: (props: PopoverTriggerProps) => ReactElement;
}> = ({ renderItem }) => renderItem(usePopoverTrigger());

export const Popover = {
  Root,
  Content,
  Trigger,
} as const;
