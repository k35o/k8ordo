'use client';

import { useRef } from 'react';
import type { FC, OlHTMLAttributes, Ref } from 'react';
import { flushSync } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { useControllableState } from '../../../hooks/controllable-state';
import { getMessages } from '../../../i18n/current';
import { FOCUS_RING } from '../../_internal/focus-ring';
import { CheckIcon } from '../../icons';

export type StepperStep = Readonly<{
  label: string;
  description?: string;
}>;

type Status = 'complete' | 'current' | 'upcoming';

type Props = {
  steps: readonly StepperStep[];
  /** いまの段（0 始まり）。 */
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** 済んだ段を押して戻れるようにする。 */
  interactive?: boolean;
  orientation?: 'horizontal' | 'vertical';
  ref?: Ref<HTMLOListElement>;
} & Omit<
  OlHTMLAttributes<HTMLOListElement>,
  'className' | 'style' | 'children' | 'onChange' | 'defaultValue'
>;

export const Stepper: FC<Props> = ({
  steps,
  value,
  defaultValue,
  onChange,
  interactive = false,
  orientation = 'horizontal',
  ref,
  ...rest
}) => {
  const messages = getMessages();
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue: defaultValue ?? 0,
    onChange,
  });
  const vertical = orientation === 'vertical';
  const currentRef = useRef<HTMLSpanElement>(null);

  return (
    <ol
      {...rest}
      className={cn('flex', vertical ? 'flex-col gap-2' : 'items-start gap-2')}
      ref={ref}
    >
      {steps.map((step, index) => {
        const status: Status =
          index < current
            ? 'complete'
            : index === current
              ? 'current'
              : 'upcoming';
        const isLast = index === steps.length - 1;
        const body = (
          <>
            <span
              aria-hidden
              className={cn(
                // 縦書きの中でも段の番号を横倒しにしない
                'writing-h grid size-8 shrink-0 place-items-center rounded-full border text-sm font-bold tabular-nums',
                status === 'complete' &&
                  'border-transparent bg-primary-bg text-primary-fg forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
                status === 'current' && 'border-primary-border text-primary-fg',
                status === 'upcoming' && 'border-border-base text-fg-mute',
              )}
            >
              {status === 'complete' ? <CheckIcon size="sm" /> : index + 1}
            </span>
            <span className="flex flex-col text-start">
              <span
                className={cn(
                  'font-medium',
                  status === 'upcoming' && 'text-fg-mute',
                )}
              >
                {step.label}
              </span>
              {step.description === undefined ? null : (
                <span className="text-fg-mute text-sm">{step.description}</span>
              )}
              {status === 'complete' ? (
                <span className="sr-only">{messages.stepperComplete}</span>
              ) : null}
            </span>
          </>
        );
        return (
          <li
            aria-current={status === 'current' ? 'step' : undefined}
            className={cn(
              'flex gap-2',
              vertical ? 'flex-col' : 'items-center',
              !isLast && 'flex-1',
            )}
            // 段は並びの位置そのものなので、位置を key にする
            // eslint-disable-next-line react/no-array-index-key
            key={index}
          >
            {interactive && status === 'complete' ? (
              <button
                className={cn(
                  'flex items-center gap-2 rounded-lg transition-colors duration-150 ease-out hover:bg-bg-subtle',
                  FOCUS_RING,
                )}
                onClick={(event) => {
                  const button = event.currentTarget;
                  flushSync(() => {
                    setCurrent(index);
                  });
                  // 押した段はいまの段になり、ボタンから外される。フォーカスが
                  // body へ落ちないよう、同じ段へ移す
                  if (!button.isConnected) {
                    currentRef.current?.focus();
                  }
                }}
                type="button"
              >
                {body}
              </button>
            ) : (
              <span
                className={cn(
                  'flex items-center gap-2',
                  interactive && ['rounded-lg', FOCUS_RING],
                )}
                ref={status === 'current' ? currentRef : undefined}
                tabIndex={interactive && status === 'current' ? -1 : undefined}
              >
                {body}
              </span>
            )}
            {isLast ? null : (
              <span
                aria-hidden
                className={cn(
                  'rounded-full',
                  vertical
                    ? 'ms-4 min-block-4 inline-px self-stretch'
                    : 'block-px flex-1',
                  status === 'complete' ? 'bg-primary-bg' : 'bg-border-base',
                  'forced-colors:bg-[CanvasText]',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};
