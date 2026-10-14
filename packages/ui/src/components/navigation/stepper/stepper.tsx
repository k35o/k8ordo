'use client';

import { clsx } from 'clsx';
import { useRef } from 'react';
import type { FC, OlHTMLAttributes, Ref } from 'react';
import { flushSync } from 'react-dom';

import { useControllableState } from '../../../hooks/controllable-state';
import { getMessages } from '../../../i18n/current';
import { CheckIcon } from '../../icons';

import focusRing from '../../_internal/focus-ring.module.css';
import srOnly from '../../_internal/sr-only.module.css';
import styles from './stepper.module.css';

const MARKER = {
  complete: styles.markerComplete,
  current: styles.markerCurrent,
  upcoming: styles.markerUpcoming,
} as const;

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
      className={clsx(
        styles.root,
        vertical ? styles.rootVertical : styles.rootHorizontal,
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
            className={clsx(
              // 縦書きの中でも段の番号を横倒しにしない
              'writing-h',
              styles.marker,
              MARKER[status],
            )}
          >
            {status === 'complete' ? <CheckIcon size="sm" /> : index + 1}
          </span>
        );
        const connector = isLast ? null : (
          <span
            aria-hidden
            className={clsx(
              styles.connector,
              vertical ? styles.connectorVertical : styles.connectorHorizontal,
              status === 'complete' && styles.connectorComplete,
            )}
          />
        );
        const text = (
          <span className={styles.text}>
            <span
              className={clsx(
                styles.label,
                status === 'upcoming' && styles.labelUpcoming,
              )}
            >
              {step.label}
            </span>
            {step.description === undefined ? null : (
              <span className={styles.description}>{step.description}</span>
            )}
            {status === 'complete' ? (
              <span className={srOnly.srOnly}>{messages.stepperComplete}</span>
            ) : null}
          </span>
        );
        // 横に並べるときは、1 行目に段の印と線、その下に文言を置く。線を
        // 文言の横に置くと、長い文言に幅を取られて線が潰れる
        const body = (
          <>
            {marker}
            {text}
          </>
        );
        const bodyLayout = clsx(
          styles.body,
          vertical ? styles.bodyVertical : styles.bodyHorizontal,
          interactive && styles.interactive,
        );
        return (
          <li
            aria-current={status === 'current' ? 'step' : undefined}
            className={clsx(
              styles.item,
              vertical ? styles.itemVertical : styles.itemHorizontal,
            )}
            // 段は並びの位置そのものなので、位置を key にする
            // eslint-disable-next-line react/no-array-index-key
            key={index}
          >
            {interactive && status === 'complete' ? (
              <button
                className={clsx(bodyLayout, styles.button, focusRing.ring)}
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
                className={clsx(bodyLayout, interactive && focusRing.ring)}
                ref={status === 'current' ? currentRef : undefined}
                tabIndex={interactive && status === 'current' ? -1 : undefined}
              >
                {body}
              </span>
            )}
            {connector}
          </li>
        );
      })}
    </ol>
  );
};
