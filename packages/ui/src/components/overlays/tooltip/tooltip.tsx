'use client';

import { useMemo } from 'react';
import type {
  FC,
  FocusEvent,
  FocusEventHandler,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  RefCallback,
} from 'react';

import { cn, createSafeContext } from '../../../helpers';
import type { Placement } from '../../../types/variables';
import { useCanHover, useHoverIntent } from '../_internal';
import type { HoverIntent } from '../_internal';
import { Popover } from '../popover';
import { usePopoverContext } from '../popover/hooks';
import { bridgeClass } from './bridge';

const [TooltipIntentProvider, useTooltipIntent] =
  createSafeContext<HoverIntent>(
    'useTooltipIntent must be used within a Tooltip.Root',
  );

export type TooltipTriggerProps = {
  ref: RefCallback<HTMLElement>;
  onMouseEnter: MouseEventHandler<HTMLElement>;
  onMouseLeave: MouseEventHandler<HTMLElement>;
  onFocus: FocusEventHandler<HTMLElement>;
  onBlur: FocusEventHandler<HTMLElement>;
  'aria-describedby'?: string;
};

const useTooltipTriggerProps = (): TooltipTriggerProps => {
  const popover = usePopoverContext();
  const intent = useTooltipIntent();
  return useMemo(
    () => ({
      ref: popover.setTriggerRef,
      onMouseEnter: intent.hoverStart,
      onMouseLeave: intent.hoverEnd,
      // キーボード操作は hover と違い誤爆しないため、遅延を挟まず即時に開閉する。
      onFocus: (e: FocusEvent<HTMLElement>) => {
        if (e.target.matches(':focus-visible')) {
          intent.cancel();
          popover.onOpen();
        }
      },
      onBlur: () => {
        intent.cancel();
        popover.onClose();
      },
      'aria-describedby': popover.isOpen ? `${popover.rootId}_list` : undefined,
    }),
    [popover, intent],
  );
};

const IntentProvider: FC<
  PropsWithChildren<{ openDelay: number; closeDelay: number }>
> = ({ openDelay, closeDelay, children }) => {
  const popover = usePopoverContext();
  const canHover = useCanHover();
  const intent = useHoverIntent({
    onOpen: popover.onOpen,
    onClose: popover.onClose,
    openDelay,
    closeDelay,
    enabled: canHover,
  });
  return (
    <TooltipIntentProvider value={intent}>{children}</TooltipIntentProvider>
  );
};

const Root: FC<
  PropsWithChildren<{
    placement?: Placement;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
    /** hover で開くまでの猶予(ms)。ポインタが通過しただけの誤表示を防ぐ。 */
    openDelay?: number;
    /**
     * hover が外れてから閉じるまでの猶予(ms)。ブリッジ（隙間の当たり判定）が
     * 守れない「content の中央へ斜めに向かう軌跡」を時間側でカバーする。
     */
    closeDelay?: number;
  }>
> = ({
  children,
  placement = 'bottom',
  isOpen,
  defaultOpen,
  onChange,
  openDelay = 0,
  closeDelay = 150,
}) => (
  <Popover.Root
    closeOnClickAway={false}
    defaultOpen={defaultOpen}
    isOpen={isOpen}
    onChange={onChange}
    placement={placement}
    trapFocus={false}
    role="dialog"
  >
    <IntentProvider closeDelay={closeDelay} openDelay={openDelay}>
      {children}
    </IntentProvider>
  </Popover.Root>
);

const Trigger: FC<{
  renderItem: (props: TooltipTriggerProps) => ReactElement;
}> = ({ renderItem }) => renderItem(useTooltipTriggerProps());

const Content: FC<PropsWithChildren> = ({ children }) => {
  const popover = usePopoverContext();
  const intent = useTooltipIntent();

  return (
    <Popover.Content
      animation="fade"
      renderItem={({ id, ref }) => (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- WCAG 1.4.13 のため tooltip 自身へのホバー/フォーカス中は表示を維持する
        <div
          className={cn(
            'bg-bg-inverse text-fg-inverse relative rounded-lg px-4 py-2 shadow-md',
            bridgeClass(popover.placement),
          )}
          id={id}
          onBlur={popover.onClose}
          onFocus={popover.onOpen}
          onMouseEnter={intent.hoverStart}
          onMouseLeave={intent.hoverEnd}
          ref={ref}
          role="tooltip"
        >
          {children}
        </div>
      )}
    />
  );
};

export const Tooltip = {
  Root,
  Trigger,
  Content,
} as const;
