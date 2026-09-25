'use client';

import { useEffect, useEffectEvent, useMemo, useRef } from 'react';
import type { CSSProperties, FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { mergeRefs } from '../../../helpers/merge-refs';
import { useControllableState } from '../../../hooks/controllable-state';

type BaseProps = {
  invalid?: boolean;
  // @k8ordo/form の formFields は step に 'any' を、min / max に文字列を導く
  // ことがあるので、広げたまま受けられる型にする
  step?: number | 'any';
  max?: number | string;
  min?: number | string;
  ref?: Ref<HTMLInputElement>;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'className'
  | 'style'
  | 'value'
  | 'onChange'
  | 'defaultValue'
  | 'children'
  | 'step'
  | 'max'
  | 'min'
>;

type ControlledProps = {
  value: number;
  onChange: (value: number) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  // 送信に失敗した値を formFields が描き直すときは文字列で渡る
  defaultValue?: number | string;
  value?: never;
  onChange?: (value: number) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

const toNumber = (value: number | string | undefined, fallback: number) => {
  const number =
    value === undefined || value === '' ? Number.NaN : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const Slider: FC<Props> = ({
  invalid = false,
  disabled = false,
  required = false,
  value,
  defaultValue,
  onChange,
  ref,
  step = 1,
  max: maxProp,
  min: minProp,
  ...rest
}) => {
  const max = toNumber(maxProp, 100);
  const min = toNumber(minProp, 0);
  const initialValue = toNumber(defaultValue, min);
  const isControlled = value !== undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  // 非制御の値は DOM に持たせ、state は塗りの幅を描くためだけに追う。React の
  // 制御下に置くと value 属性が現在の値に同期され続け、form の reset が戻る先
  // （描画時の既定値）も、変更済みかどうかの基準も失われる
  const [currentValue, handleChange] = useControllableState({
    value,
    defaultValue: initialValue,
    onChange,
  });
  const { pending } = useFormStatus();
  const disabledResolved = disabled || pending;

  const handleReset = useEffectEvent(() => {
    if (!isControlled) {
      handleChange(initialValue);
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

  // max === min（0除算）のときだけ 1 にフォールバックする。
  // Math.max(max - min, 1) だとスパンが 1 未満（例: 0〜0.4）のとき
  // range が 1 に丸められ、塗りの幅だけがネイティブのつまみ位置とズレる。
  const range = max > min ? max - min : 1;
  const progress = ((currentValue - min) / range) * 100;
  const clampedProgress = `${Math.min(Math.max(progress, 0), 100)}%`;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        'block-8 inline-full vertical:inline-48',
        disabledResolved && 'opacity-50',
      )}
      style={{ '--slider-progress': clampedProgress } as CSSProperties}
    >
      <span
        aria-hidden
        className="bg-bg-mute relative rounded-full block-2 inline-full"
      >
        <span
          aria-hidden
          className={cn(
            'bg-primary-bg absolute inset-s-0 inset-be-0 block-full inline-(--slider-progress) rounded-full',
            invalid && 'bg-bg-error',
          )}
        />
      </span>
      <input
        {...rest}
        {...(isControlled
          ? { value: currentValue }
          : { defaultValue: initialValue })}
        aria-invalid={invalid}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={currentValue}
        className={cn(
          'absolute inset-0 z-10 appearance-none bg-transparent',
          'h-8 w-full vertical:h-auto vertical:w-8 vertical:[writing-mode:vertical-lr]',
          'focus:outline-none',
          'disabled:cursor-not-allowed',
          '[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent',
          '[&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-border-base [&::-webkit-slider-thumb]:bg-bg-base [&::-webkit-slider-thumb]:shadow-xs',
          '[&:focus-visible::-webkit-slider-thumb]:border-transparent [&:focus-visible::-webkit-slider-thumb]:ring-2 [&:focus-visible::-webkit-slider-thumb]:ring-border-info',
          '[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent',
          '[&::-moz-range-progress]:h-2 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-transparent',
          '[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-border-base [&::-moz-range-thumb]:bg-bg-base [&::-moz-range-thumb]:shadow-xs',
          '[&:focus-visible::-moz-range-thumb]:border-transparent [&:focus-visible::-moz-range-thumb]:ring-2 [&:focus-visible::-moz-range-thumb]:ring-border-info',
          invalid &&
            '[&::-moz-range-thumb]:border-border-error [&::-webkit-slider-thumb]:border-border-error [&:focus-visible::-moz-range-thumb]:ring-border-error [&:focus-visible::-webkit-slider-thumb]:ring-border-error',
        )}
        disabled={disabledResolved}
        max={max}
        min={min}
        onChange={(event) => {
          handleChange(Number(event.target.value));
        }}
        ref={mergedRef}
        required={required}
        step={step}
        type="range"
      />
    </div>
  );
};
