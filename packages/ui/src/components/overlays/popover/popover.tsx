'use client';

import { clsx } from 'clsx';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type {
  FC,
  FocusEvent,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from 'react';

import { readWritingMode, useControllableState } from '../../../hooks';
import type { WritingMode } from '../../../hooks';
import { useFocusTrap } from '../../../internal/focus-trap';
import type { Placement } from '../../../types/variables';
import { getContentAnchorStyle } from './anchor-positioning';
import { pushEscapeLayer } from './escape-stack';
import {
  PopoverProvider,
  usePopoverContent,
  usePopoverContext,
  usePopoverTrigger,
} from './hooks';
import type { PopoverContentProps, PopoverTriggerProps } from './hooks';

import highContrast from '../../_internal/high-contrast.module.css';
import styles from './popover.module.css';

export { useOpenContext, type PopoverTriggerProps } from './hooks';

export const Root: FC<
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

  const triggerRef = useRef<HTMLElement | null>(null);
  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);

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
        flipDisabled,
        triggerRef,
        setTriggerRef,
      }}
    >
      {children}
    </PopoverProvider>
  );
};

export const Content: FC<{
  renderItem: (props: PopoverContentProps) => ReactElement;
  // 開閉アニメーション。scale=ポップ（既定）、fade=フェード（Tooltip 用）。
  animation?: 'scale' | 'fade';
  // 位置を決める popover の要素そのものに付けるクラス。暗黙のアンカーを
  // 継ぐ疑似要素（Tooltip のブリッジ）を描くためにだけ使う。
  anchoredClassName?: string;
}> = ({ renderItem, animation = 'scale', anchoredClassName }) => {
  const { isOpen, trapFocus, placement, flipDisabled, itemProps } =
    usePopoverContent();
  const { triggerRef, onClose } = usePopoverContext();

  // content は popover で top-layer に出すため、trigger 側の writing-mode を
  // 継承しない。中の部品は親の --writing を style クエリで読むので、縦書きなら
  // .writing-v を付けて writing-mode と --writing を渡す。trigger は中身に合わせて縮むことが多く、書字方向が
  // 切り替わってもサイズの変化では検出できないので、開く瞬間に読む。
  const [writingMode, setWritingMode] = useState<WritingMode>('horizontal');
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (isOpen && trigger) {
      setWritingMode(readWritingMode(trigger));
    }
  }, [isOpen, triggerRef]);
  const writingClass = writingMode === 'vertical' ? 'writing-v' : undefined;

  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Popover API の top-layer 表示・非表示を isOpen に同期する（FloatingPortal の置換）。
  // manual: native の light-dismiss は使わず、外側クリック / Escape は従来どおり
  // JS（useClickAway / window keydown）で扱い、trigger との二重トグルを避ける。
  // 要素は常時マウントし、開くときのアニメは CSS（base.css の :popover-open）で行う。
  useEffect(() => {
    const el = contentWrapperRef.current;
    if (!el) {
      return;
    }
    // 現在の表示状態を :popover-open で確かめてから呼ぶ。showPopover /
    // hidePopover は既にその状態のときに InvalidStateError を投げる。
    // source に trigger を渡すと、trigger が content の暗黙のアンカーになる。
    // trigger に anchor-name を書き込まないので、同じ要素を trigger にする
    // 別の Popover や Tooltip、利用者の anchor-name と取り合わない。
    if (isOpen && !el.matches(':popover-open')) {
      el.showPopover({ source: triggerRef.current ?? undefined });
    } else if (!isOpen && el.matches(':popover-open')) {
      el.hidePopover();
    }
  }, [isOpen, triggerRef]);

  useFocusTrap(contentWrapperRef, triggerRef, isOpen && trapFocus);

  // Tab でメニュー外へ抜けたら閉じる。
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
    <div
      className={clsx(
        styles.root,
        animation === 'fade' ? styles.fade : styles.scale,
        writingClass,
        anchoredClassName,
      )}
      onBlur={handleFocusOut}
      popover="manual"
      ref={contentWrapperRef}
      style={getContentAnchorStyle(placement, flipDisabled)}
    >
      {renderItem(itemProps)}
    </div>
  );
};

export const Trigger: FC<{
  renderItem: (props: PopoverTriggerProps) => ReactElement;
}> = ({ renderItem }) => renderItem(usePopoverTrigger());

export const PublicRoot: FC<
  PropsWithChildren<{
    placement?: Placement;
    flipDisabled?: boolean;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
  }>
> = ({
  children,
  placement = 'bottom-start',
  flipDisabled = false,
  isOpen,
  defaultOpen = false,
  onChange,
}) => (
  <Root
    defaultOpen={defaultOpen}
    flipDisabled={flipDisabled}
    isOpen={isOpen}
    onChange={onChange}
    placement={placement}
    role="dialog"
  >
    {children}
  </Root>
);

export const PublicContent: FC<{
  /** パネルの名前。`aria-label` になる。 */
  label: string;
  children: ReactNode;
}> = ({ label, children }) => (
  <Content
    renderItem={({ id, ref }) => (
      <div
        aria-label={label}
        className={clsx(styles.surface, highContrast.edge)}
        id={id}
        ref={ref}
        role="dialog"
      >
        {children}
      </div>
    )}
  />
);
