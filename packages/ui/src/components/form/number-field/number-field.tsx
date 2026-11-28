'use client';

import { clsx } from 'clsx';
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { getMessages } from '../../../i18n/current';
import { ChevronIcon } from '../../icons/chevron';
import { chain, mergeRefs } from './../../../helpers';
import { useControllableState } from './../../../hooks/controllable-state';
import { clamp } from './../../../internal/clamp';
import { toPrecision } from './../../../internal/to-precision';
import { cast } from './cast';

import focusRing from '../../_internal/focus-ring.module.css';
import srOnly from '../../_internal/sr-only.module.css';
import styles from './number-field.module.css';

type BaseProps = {
  invalid?: boolean;
  /** 小数の桁数。省略すると step の桁数に合わせ、step が 'any' なら丸めない */
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
    step?: number | 'any';
    min?: number;
    max?: number;
  };

type ControlledProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  // 送信に失敗した値を formFields が描き直すときは文字列で渡る
  defaultValue?: number | string;
  value?: never;
  onChange?: (value: number | null) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

const format = (
  value: number | null,
  precision: number | undefined,
): string => {
  if (value === null) {
    return '';
  }
  return precision === undefined ? String(value) : value.toFixed(precision);
};

const decimalsOf = (step: number): number =>
  String(step).split('.')[1]?.length ?? 0;

export const NumberField: FC<Props> = ({
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
  value,
  defaultValue,
  onChange,
  onBlur,
  onKeyDown,
  ref,
  step = 1,
  precision: precisionProp,
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
  ...rest
}) => {
  const messages = getMessages();
  const inputRef = useRef<HTMLInputElement>(null);
  // 参照が変わるたびに React が ref の解除と再設定を行うため、
  // 利用者が副作用付きのコールバック ref を渡しても毎レンダー走らないようにする
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const isControlled = value !== undefined;
  const stepSize = step === 'any' ? 1 : step;
  const precision =
    precisionProp ?? (step === 'any' ? undefined : decimalsOf(step));
  const initialValue =
    typeof defaultValue === 'string'
      ? cast(defaultValue, precision)
      : (defaultValue ?? null);
  const [currentValue, setCurrentValue] = useControllableState<number | null>({
    value,
    defaultValue: initialValue,
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
  const readOnlyResolved = readOnly || pending;

  if (isControlled && currentValue !== shownValue) {
    setDisplayValue(format(currentValue, precision));
    setShownValue(currentValue);
  }

  const handleReset = useEffectEvent(() => {
    if (!isControlled) {
      setCurrentValue(initialValue);
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

  // コードから書き換えた値は input イベントを出さないので、変わったときだけ自分で
  // 出して @k8ordo/form などの form 側に知らせる。値トラッカーは代入を覚えるので、
  // この input 自身の React onChange は二重に走らない
  const commit = (input: HTMLInputElement, next: number | null) => {
    const text = format(next, precision);
    const changed = input.value !== text;
    if (isControlled) {
      setDisplayValue(text);
      setShownValue(next);
    }
    input.value = text;
    setCurrentValue(next);
    if (changed) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const commitTyped = (input: HTMLInputElement) => {
    const parsed = cast(input.value, precision);
    commit(input, parsed === null ? null : clamp(parsed, min, max));
  };

  const stepBy = (input: HTMLInputElement, delta: number) => {
    if (readOnlyResolved) {
      return;
    }
    const current = cast(input.value, precision);
    commit(
      input,
      current === null
        ? clamp(0, min, max)
        : clamp(toPrecision(current + delta, precision), min, max),
    );
  };

  return (
    <div className={clsx(styles.root, focusRing.ringWithin)}>
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
          : { defaultValue: format(initialValue, precision) })}
        aria-invalid={invalid}
        aria-required={required}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={currentValue ?? undefined}
        className={styles.input}
        disabled={disabled}
        readOnly={readOnlyResolved}
        required={required}
        onBlur={chain(onBlur, (e) => {
          commitTyped(e.currentTarget);
        })}
        onKeyDown={chain(onKeyDown, (e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            commitTyped(e.currentTarget);
          }
          if (e.key === 'ArrowUp') {
            stepBy(e.currentTarget, stepSize);
          }
          if (e.key === 'ArrowDown') {
            stepBy(e.currentTarget, -stepSize);
          }
        })}
        ref={mergedRef}
        role="spinbutton"
        type="text"
      />
      <div aria-hidden="true" className={styles.steppers}>
        <button
          className={styles.step}
          disabled={disabled || readOnlyResolved}
          onClick={() => {
            if (inputRef.current) {
              stepBy(inputRef.current, stepSize);
            }
          }}
          tabIndex={-1}
          type="button"
        >
          <span className={srOnly.srOnly}>{messages.numberFieldIncrement}</span>
          <ChevronIcon direction="up" size="sm" />
        </button>
        <button
          className={styles.step}
          disabled={disabled || readOnlyResolved}
          onClick={() => {
            if (inputRef.current) {
              stepBy(inputRef.current, -stepSize);
            }
          }}
          tabIndex={-1}
          type="button"
        >
          <span className={srOnly.srOnly}>{messages.numberFieldDecrement}</span>
          <ChevronIcon direction="down" size="sm" />
        </button>
      </div>
    </div>
  );
};
