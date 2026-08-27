'use client';

import { useMemo, useRef } from 'react';
import type {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  RefCallback,
  RefObject,
} from 'react';

import type { Placement } from '../../../types/variables';
import { createSafeContext } from './../../../helpers/create-safe-context';
import { useClickAway } from './../../../hooks/click-away';

type PopoverContext = {
  rootId: string;
  role: 'dialog' | 'menu' | 'listbox';
  closeOnClickAway: boolean;
  trapFocus: boolean;
  isOpen: boolean;
  toggleOpen: () => void;
  onOpen: () => void;
  onClose: () => void;

  // 要求された placement。位置決めは CSS Anchor Positioning が行うため、
  // flip 後の解決値ではなく利用側が指定した値をそのまま保持する。
  placement: Placement;
  // この Popover インスタンス固有の anchor-name（trigger に付与し content から参照）。
  anchorName: string;
  flipDisabled: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  setTriggerRef: (node: HTMLElement | null) => void;
};

export const [PopoverProvider, usePopoverContext] =
  createSafeContext<PopoverContext>(
    'usePopoverContext must be used within a Popover.Root',
  );

export const useOpenContext = () => {
  const popover = usePopoverContext();
  return useMemo(
    () => ({
      isOpen: popover.isOpen,
      onOpen: popover.onOpen,
      onClose: popover.onClose,
      toggleOpen: popover.toggleOpen,
    }),
    [popover.isOpen, popover.onClose, popover.onOpen, popover.toggleOpen],
  );
};

export type PopoverContentProps = {
  id: string;
  ref: RefObject<HTMLDivElement | null>;
  role: 'dialog' | 'menu' | 'listbox';
  'aria-orientation'?: 'vertical';
};

export const usePopoverContent = () => {
  const popover = usePopoverContext();
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(
    ref,
    (event) => {
      if (!popover.isOpen) {
        return;
      }
      if (
        event.target instanceof Node &&
        popover.triggerRef.current?.contains(event.target) === true
      ) {
        return;
      }
      popover.onClose();
    },
    popover.closeOnClickAway,
  );

  const itemProps = useMemo<PopoverContentProps>(() => {
    const id = `${popover.rootId}_list`;
    switch (popover.role) {
      case 'dialog':
        return { id, ref, role: 'dialog' };
      case 'menu':
        return {
          id,
          ref,
          role: 'menu',
          'aria-orientation': 'vertical',
        };
      case 'listbox':
        return { id, ref, role: 'listbox' };
      default: {
        const exhaustive: never = popover.role;
        return exhaustive;
      }
    }
  }, [popover.rootId, popover.role, ref]);

  return useMemo(
    () => ({
      id: `${popover.rootId}_list`,
      ref,
      isOpen: popover.isOpen,
      trapFocus: popover.trapFocus,
      anchorName: popover.anchorName,
      placement: popover.placement,
      flipDisabled: popover.flipDisabled,
      itemProps,
    }),
    [
      popover.rootId,
      popover.isOpen,
      popover.anchorName,
      popover.placement,
      popover.flipDisabled,
      ref,
      popover.trapFocus,
      itemProps,
    ],
  );
};

export type PopoverTriggerProps = {
  ref: RefCallback<HTMLElement>;
  onClick: MouseEventHandler<HTMLElement>;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
  'aria-haspopup': 'dialog' | 'menu' | 'listbox';
  'aria-expanded': boolean;
  'aria-controls'?: string;
  role?: 'combobox';
};

export const usePopoverTrigger = (): PopoverTriggerProps => {
  const popover = usePopoverContext();
  return useMemo(() => {
    const listId = popover.isOpen ? `${popover.rootId}_list` : undefined;
    switch (popover.role) {
      case 'dialog':
        return {
          onClick: popover.toggleOpen,
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              popover.toggleOpen();
            }
          },
          'aria-haspopup': 'dialog',
          'aria-expanded': popover.isOpen,
          'aria-controls': listId,
          ref: popover.setTriggerRef,
        };
      case 'menu':
        return {
          onClick: popover.toggleOpen,
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              popover.toggleOpen();
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              popover.onOpen();
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              popover.onOpen();
            }
          },
          'aria-haspopup': 'menu',
          'aria-expanded': popover.isOpen,
          'aria-controls': listId,
          ref: popover.setTriggerRef,
        };
      case 'listbox':
        return {
          onClick: popover.toggleOpen,
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              popover.toggleOpen();
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              popover.onOpen();
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              popover.onOpen();
            }
          },
          role: 'combobox',
          'aria-haspopup': 'listbox',
          'aria-expanded': popover.isOpen,
          'aria-controls': listId,
          ref: popover.setTriggerRef,
        };
      default: {
        const exhaustive: never = popover.role;
        return exhaustive;
      }
    }
  }, [popover]);
};
