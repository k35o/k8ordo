'use client';

import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { useMessages } from '../../../i18n/context';
import { FOCUS_RING_WITHIN } from '../../_internal/focus-ring';
import { ChevronIcon } from '../../icons';
import { chain, cn, mergeRefs } from './../../../helpers';
import { useControllableState } from './../../../hooks/controllable-state';
import { clamp } from './../../../internal/clamp';
import { toPrecision } from './../../../internal/to-precision';
import { cast } from './cast';

type BaseProps = {
  invalid?: boolean;
  precision?: number;
  ref?: Ref<HTMLInputElement>;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'role'
  | 'className'
  | 'style'
  | 'value'
  | 'onChange'
  | 'defaultValue'
  | 'children'
  | 'step'
  | 'min'
  | 'max'
> & {
    step?: number;
    min?: number;
    max?: number;
  };

type ControlledProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  defaultValue?: number;
  value?: never;
  onChange?: (value: number | null) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

const format = (value: number | null, precision: number): string =>
  value === null ? '' : value.toFixed(precision);

export const NumberField: FC<Props> = ({
  invalid = false,
  disabled = false,
  required = false,
  value,
  defaultValue,
  onChange,
  onBlur,
  onKeyDown,
  ref,
  step = 1,
  precision = 0,
  max = 9_007_199_254_740_991,
  min = -9_007_199_254_740_991,
  ...rest
}) => {
  const messages = useMessages();
  const inputRef = useRef<HTMLInputElement>(null);
  // 参照が変わるたびに React が ref の解除と再設定を行うため、
  // 利用者が副作用付きのコールバック ref を渡しても毎レンダー走らないようにする
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const isControlled = value !== undefined;
  const [currentValue, setCurrentValue] = useControllableState<number | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange,
  });
  // 入力途中の文字列を React が持つのは制御モードだけ。非制御では DOM に持たせる。
  // React の制御下に置くと value 属性が現在の文字列に同期され続け、form.reset() が
  // 戻る先（描画時の defaultValue）を失うため。
  const [displayValue, setDisplayValue] = useState(() =>
    format(currentValue, precision),
  );
  // 確定のたびに表示している値も進めておく。親が onChange を採らずに value を
  // 据え置いたとき（openui は null を受けると defaultValue に戻す）、次の描画で
  // value との食い違いに気づいて表示を value へ戻せるように。
  const [shownValue, setShownValue] = useState(currentValue);
  const { pending } = useFormStatus();

  if (isControlled && currentValue !== shownValue) {
    setDisplayValue(format(currentValue, precision));
    setShownValue(currentValue);
  }

  const handleReset = useEffectEvent(() => {
    if (!isControlled) {
      setCurrentValue(defaultValue ?? null);
    }
  });

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) {
      return undefined;
    }
    const listener = () => {
      handleReset();
    };
    form.addEventListener('reset', listener);
    return () => {
      form.removeEventListener('reset', listener);
    };
  }, []);

  const commit = (input: HTMLInputElement, next: number | null) => {
    const text = format(next, precision);
    if (isControlled) {
      setDisplayValue(text);
      setShownValue(next);
    } else {
      input.value = text;
    }
    setCurrentValue(next);
  };

  const stepBy = (input: HTMLInputElement, delta: number) => {
    const current = cast(input.value, precision);
    commit(
      input,
      current === null
        ? clamp(0, min, max)
        : clamp(toPrecision(current + delta, precision), min, max),
    );
  };

  return (
    <div
      className={cn(
        'relative flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-border-base bg-bg-base vertical:h-auto vertical:w-12',
        FOCUS_RING_WITHIN,
        'has-aria-invalid:border-border-error',
        'has-disabled:cursor-not-allowed has-disabled:border-border-mute has-disabled:bg-bg-mute hover:has-disabled:has-hover:bg-bg-mute',
      )}
    >
      <input
        autoComplete="off"
        autoCorrect="off"
        inputMode="decimal"
        {...rest}
        {...(isControlled
          ? {
              value: displayValue,
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                if (
                  e.nativeEvent instanceof InputEvent &&
                  e.nativeEvent.isComposing
                ) {
                  return;
                }
                setDisplayValue(e.target.value);
              },
            }
          : { defaultValue: format(defaultValue ?? null, precision) })}
        aria-invalid={invalid}
        aria-required={required}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={currentValue ?? undefined}
        className={cn(
          'grow bg-transparent pe-8 ps-3 focus-visible:outline-hidden size-full',
          'disabled:cursor-not-allowed',
          'read-only:cursor-not-allowed',
        )}
        disabled={disabled}
        readOnly={pending || undefined}
        required={required}
        onBlur={chain(onBlur, (e) => {
          const parsed = cast(e.currentTarget.value, precision);
          commit(
            e.currentTarget,
            parsed === null ? null : clamp(parsed, min, max),
          );
        })}
        onKeyDown={chain(onKeyDown, (e) => {
          if (e.key === 'ArrowUp') {
            stepBy(e.currentTarget, step);
          }
          if (e.key === 'ArrowDown') {
            stepBy(e.currentTarget, -step);
          }
        })}
        pattern="[0-9]*(.[0-9]+)?"
        ref={mergedRef}
        role="spinbutton"
        type="text"
      />
      <div
        aria-hidden="true"
        className="vertical:inset-e-auto vertical:bottom-1 vertical:h-auto vertical:w-full vertical:flex-row vertical:px-1 vertical:py-0 absolute inset-e-1 flex h-full flex-col py-1"
      >
        <button
          className={cn(
            'flex w-6 grow items-center justify-center rounded-md text-fg-mute transition-colors vertical:h-6 vertical:w-auto',
            'hover:bg-bg-mute hover:text-fg-base',
            'disabled:cursor-not-allowed disabled:text-fg-mute hover:disabled:bg-transparent',
          )}
          disabled={disabled || pending}
          onClick={() => {
            if (inputRef.current) {
              stepBy(inputRef.current, step);
            }
          }}
          tabIndex={-1}
          type="button"
        >
          <span className="sr-only">{messages.numberFieldIncrement}</span>
          <ChevronIcon direction="up" size="sm" />
        </button>
        <button
          className={cn(
            'flex w-6 grow items-center justify-center rounded-md text-fg-mute transition-colors vertical:h-6 vertical:w-auto',
            'hover:bg-bg-mute hover:text-fg-base',
            'disabled:cursor-not-allowed disabled:text-fg-mute hover:disabled:bg-transparent',
          )}
          disabled={disabled || pending}
          onClick={() => {
            if (inputRef.current) {
              stepBy(inputRef.current, -step);
            }
          }}
          tabIndex={-1}
          type="button"
        >
          <span className="sr-only">{messages.numberFieldDecrement}</span>
          <ChevronIcon direction="down" size="sm" />
        </button>
      </div>
    </div>
  );
};
