'use client';

import type { FC, OlHTMLAttributes, Ref } from 'react';

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
                'grid size-8 shrink-0 place-items-center rounded-full border text-sm font-bold tabular-nums',
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
                  'flex items-center gap-2 rounded-lg transition-colors hover:bg-bg-subtle',
                  FOCUS_RING,
                )}
                onClick={() => {
                  setCurrent(index);
                }}
                type="button"
              >
                {body}
              </button>
            ) : (
              <span className="flex items-center gap-2">{body}</span>
            )}
            {isLast ? null : (
              <span
                aria-hidden
                className={cn(
                  'rounded-full',
                  vertical ? 'ms-4 min-h-4 w-px self-stretch' : 'h-px flex-1',
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
