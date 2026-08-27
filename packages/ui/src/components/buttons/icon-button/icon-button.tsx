'use client';

import type { ComponentPropsWithRef, FC, MouseEvent, ReactNode } from 'react';
import { useTransition } from 'react';
import { useFormStatus } from 'react-dom';

import type { Placement } from '../../../types/variables';
import { FOCUS_RING } from '../../_internal/focus-ring';
import { Tooltip } from '../../overlays/tooltip';
import type { TooltipTriggerProps } from '../../overlays/tooltip';
import { chain } from './../../../helpers/chain';
import { cn } from './../../../helpers/cn';
import { mergeRefs } from './../../../helpers/merge-refs';

export type IconButtonTriggerProps = Partial<TooltipTriggerProps>;

type Props = {
  size?: 'sm' | 'md' | 'lg';
  color?: 'transparent' | 'base' | 'primary' | 'secondary';
  label: string;
  tooltipPlacement?: Placement;
  tooltipDisabled?: boolean;
  /**
   * クリック時の処理。`onAction` は非同期処理を `useTransition` で包み、保留中は
   * `aria-busy` を立てる糖衣。素のクリックイベントが必要なら `onClick` を使う。
   * 両者は併用可能で `onClick` → `onAction` の順に実行される（`onClick` が
   * `preventDefault` した場合は `onAction` をスキップ）。
   */
  onAction?: () => void | Promise<void>;
  renderItem?: (props: {
    className: string;
    children: ReactNode;
    'aria-label': string;
    triggerProps: IconButtonTriggerProps;
  }) => ReactNode;
} & Omit<ComponentPropsWithRef<'button'>, 'type' | 'className' | 'style'>;

const joinIds = (
  ...ids: ReadonlyArray<string | undefined>
): string | undefined => {
  const filtered = ids.filter(Boolean);
  return filtered.length === 0 ? undefined : filtered.join(' ');
};

export const IconButton: FC<Props> = ({
  ref,
  size = 'md',
  color = 'transparent',
  label,
  tooltipPlacement = 'top',
  tooltipDisabled = false,
  children,
  onAction,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  disabled,
  renderItem,
  'aria-describedby': describedBy,
  ...props
}) => {
  const [transitionPending, startTransition] = useTransition();
  const { pending: formPending } = useFormStatus();
  const isPending = transitionPending || formPending;
  const isDisabled = Boolean(disabled) || isPending;

  const handleClick =
    onClick || onAction
      ? (event: MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (onAction) {
            startTransition(async () => {
              await onAction();
            });
          }
        }
      : undefined;

  const className = cn(
    'inline-flex rounded-full transition-colors',
    FOCUS_RING,
    (color === 'transparent' || color === 'base') &&
      'hover:bg-bg-subtle active:bg-bg-mute',
    color === 'base' && 'bg-bg-base',
    color === 'transparent' && 'bg-transparent',
    color === 'primary' &&
      'bg-primary-bg hover:bg-primary-bg-emphasize/80 active:bg-primary-bg-emphasize',
    color === 'secondary' &&
      'bg-secondary-bg hover:bg-secondary-bg-emphasize/80 active:bg-secondary-bg-emphasize',
    size === 'sm' && 'p-1',
    size === 'md' && 'p-2',
    size === 'lg' && 'p-3',
    !renderItem && 'cursor-pointer',
    !renderItem &&
      isDisabled &&
      'cursor-not-allowed opacity-50 hover:bg-transparent active:bg-transparent',
  );

  if (tooltipDisabled) {
    if (renderItem) {
      return (
        <>
          {renderItem({
            className,
            children,
            'aria-label': label,
            triggerProps: {},
          })}
        </>
      );
    }
    return (
      <button
        {...props}
        aria-busy={isPending || undefined}
        aria-describedby={describedBy}
        aria-label={label}
        className={className}
        disabled={isDisabled}
        onBlur={onBlur}
        onClick={handleClick}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={ref}
        type="button"
      >
        {children}
      </button>
    );
  }

  return (
    <Tooltip.Root placement={tooltipPlacement}>
      <Tooltip.Trigger
        renderItem={(triggerProps) => {
          if (renderItem) {
            return (
              <>
                {renderItem({
                  className,
                  children,
                  'aria-label': label,
                  triggerProps: {
                    ...triggerProps,
                    'aria-describedby': joinIds(
                      describedBy,
                      triggerProps['aria-describedby'],
                    ),
                  },
                })}
              </>
            );
          }
          return (
            <button
              {...props}
              aria-busy={isPending || undefined}
              aria-describedby={joinIds(
                describedBy,
                triggerProps['aria-describedby'],
              )}
              aria-label={label}
              className={className}
              disabled={isDisabled}
              onBlur={chain(triggerProps.onBlur, onBlur)}
              onClick={handleClick}
              onFocus={chain(triggerProps.onFocus, onFocus)}
              onMouseEnter={chain(triggerProps.onMouseEnter, onMouseEnter)}
              onMouseLeave={chain(triggerProps.onMouseLeave, onMouseLeave)}
              ref={mergeRefs(ref, triggerProps.ref)}
              type="button"
            >
              {children}
            </button>
          );
        }}
      />
      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip.Root>
  );
};
