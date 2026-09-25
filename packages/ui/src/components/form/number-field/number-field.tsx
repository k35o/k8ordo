'use client';

import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { getMessages } from '../../../i18n/current';
import type { Messages } from '../../../i18n/messages';
import { FOCUS_RING_WITHIN } from '../../_internal/focus-ring';
import { ChevronIcon } from '../../icons';
import { chain, cn, mergeRefs } from './../../../helpers';
import { useControllableState } from './../../../hooks/controllable-state';
import { clamp } from './../../../internal/clamp';
import { toPrecision } from './../../../internal/to-precision';
import { cast } from './cast';

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
    // @k8ordo/form の formFields は step に 'any' を、min / max に文字列を導く
    // ことがあるので、広げたまま受けられる型にする
    step?: number | 'any';
    min?: number | string;
    max?: number | string;
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

const toBound = (value: number | string | undefined, fallback: number) => {
  const bound =
    value === undefined || value === '' ? Number.NaN : Number(value);
  return Number.isFinite(bound) ? bound : fallback;
};

const decimalsOf = (step: number): number =>
  String(step).split('.')[1]?.length ?? 0;

const rangeErrorOf = (
  value: number | null,
  min: number,
  max: number,
  messages: Messages,
): string => {
  if (value !== null && value < min) {
    return messages.numberFieldRangeUnderflow.replace('{min}', String(min));
  }
  if (value !== null && value > max) {
    return messages.numberFieldRangeOverflow.replace('{max}', String(max));
  }
  return '';
};

// customValidity の枠は @k8ordo/form のルールや非同期チェックと共有なので、
// 自分で書いた文言だけを消す
const ownRangeErrors = new WeakMap<HTMLInputElement, string>();

const applyRangeError = (input: HTMLInputElement, error: string) => {
  if (error !== '') {
    input.setCustomValidity(error);
  } else if (input.validationMessage === ownRangeErrors.get(input)) {
    input.setCustomValidity('');
  }
  ownRangeErrors.set(input, error);
};

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
  max: maxProp,
  min: minProp,
  onInput,
  ...rest
}) => {
  const messages = getMessages();
  const inputRef = useRef<HTMLInputElement>(null);
  // 参照が変わるたびに React が ref の解除と再設定を行うため、
  // 利用者が副作用付きのコールバック ref を渡しても毎レンダー走らないようにする
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const isControlled = value !== undefined;
  const max = toBound(maxProp, Number.MAX_SAFE_INTEGER);
  const min = toBound(minProp, Number.MIN_SAFE_INTEGER);
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
  // type="text" ではブラウザが min / max を検査しないので、範囲の違反は
  // customValidity でブラウザの検証に載せる
  const reportRange = (input: HTMLInputElement, text: string) => {
    applyRangeError(
      input,
      rangeErrorOf(cast(text, precision), min, max, messages),
    );
  };
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

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input === null) {
      return;
    }
    applyRangeError(
      input,
      rangeErrorOf(
        cast(isControlled ? displayValue : input.value, precision),
        min,
        max,
        messages,
      ),
    );
  }, [isControlled, displayValue, precision, min, max, messages]);

  const handleReset = useEffectEvent(() => {
    if (!isControlled) {
      setCurrentValue(initialValue);
    }
  });
  // reset はブラウザが値を戻す前に飛ぶので、戻り切った値で検査し直す
  const handleRestored = useEffectEvent(() => {
    const input = inputRef.current;
    if (input !== null) {
      reportRange(input, input.value);
    }
  });

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) {
      return undefined;
    }
    const listener = () => {
      handleReset();
      setTimeout(() => {
        handleRestored();
      }, 0);
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
    reportRange(input, text);
    if (changed) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
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
          : { defaultValue: format(initialValue, precision) })}
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
        readOnly={readOnlyResolved}
        required={required}
        onInput={chain(onInput, (e) => {
          reportRange(e.currentTarget, e.currentTarget.value);
        })}
        onBlur={chain(onBlur, (e) => {
          const parsed = cast(e.currentTarget.value, precision);
          commit(
            e.currentTarget,
            parsed === null ? null : clamp(parsed, min, max),
          );
        })}
        onKeyDown={chain(onKeyDown, (e) => {
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
          disabled={disabled || readOnlyResolved}
          onClick={() => {
            if (inputRef.current) {
              stepBy(inputRef.current, stepSize);
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
          disabled={disabled || readOnlyResolved}
          onClick={() => {
            if (inputRef.current) {
              stepBy(inputRef.current, -stepSize);
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
