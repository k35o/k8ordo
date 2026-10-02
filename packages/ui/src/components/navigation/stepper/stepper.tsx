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
      className={cn(
        'flex gap-2',
        // 横並びは段を等分するので、置かれた先が flex の行でも幅いっぱいに取る。
        // 取らないと中身の最小幅まで縮み、文言が 1 語ずつ折り返す
        vertical ? 'flex-col' : 'items-start inline-full',
      )}
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
        const marker = (
          <span
            aria-hidden
            className={cn(
              // 縦書きの中でも段の番号を横倒しにしない
              'writing-h grid size-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold tabular-nums',
              // 済んだ段は primary-bg だとダークでページに沈むので、ページの地から
              // はっきり離れる primary-fg で塗り、チェックを反転色で抜く
              status === 'complete' &&
                'border-transparent bg-primary-fg text-fg-inverse forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
              status === 'current' && 'border-primary-border text-primary-fg',
              status === 'upcoming' && 'border-border-base text-fg-mute',
            )}
          >
            {status === 'complete' ? <CheckIcon size="sm" /> : index + 1}
          </span>
        );
        const connector = isLast ? null : (
          <span
            aria-hidden
            className={cn(
              'rounded-full',
              // 縦に並べるときは、段の印（size-8）の中心に 2px の線を通す
              vertical
                ? 'ms-3.75 min-block-4 inline-0.5 self-stretch'
                : 'min-inline-4 block-0.5 flex-1',
              status === 'complete' ? 'bg-primary-fg' : 'bg-border-base',
              'forced-colors:bg-[CanvasText]',
            )}
          />
        );
        const text = (
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
        );
        // 横に並べるときは、段の印と線だけで 1 行目を作り、文言はその下に置く。
        // 線を文言の横に置くと、長い文言に幅を取られて線が潰れる
        const body = vertical ? (
          <>
            {marker}
            {text}
          </>
        ) : (
          <>
            <span className="flex items-center gap-2">
              {marker}
              {connector}
            </span>
            {text}
          </>
        );
        const bodyLayout = vertical
          ? 'flex items-center gap-2'
          : 'flex flex-col gap-2';
        return (
          <li
            aria-current={status === 'current' ? 'step' : undefined}
            className={cn(
              'flex flex-col',
              // 段ごとに同じ幅の列を取り、線の長さを文言の長さから切り離す
              vertical ? 'gap-2' : 'flex-1',
            )}
            // 段は並びの位置そのものなので、位置を key にする
            // eslint-disable-next-line react/no-array-index-key
            key={index}
          >
            {interactive && status === 'complete' ? (
              <button
                className={cn(
                  bodyLayout,
                  'rounded-lg transition-colors duration-150 ease-out hover:bg-bg-subtle',
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
                  bodyLayout,
                  interactive && ['rounded-lg', FOCUS_RING],
                )}
                ref={status === 'current' ? currentRef : undefined}
                tabIndex={interactive && status === 'current' ? -1 : undefined}
              >
                {body}
              </span>
            )}
            {vertical ? connector : null}
          </li>
        );
      })}
    </ol>
  );
};
