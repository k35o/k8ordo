'use client';

import { useEffect, useEffectEvent, useMemo, useRef } from 'react';
import type { CSSProperties, FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { mergeRefs } from '../../../helpers/merge-refs';
import { useControllableState } from '../../../hooks/controllable-state';
import { HIGH_CONTRAST_EDGE } from '../../_internal/high-contrast';
import { rangeInputClass } from './range-input-class';

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
        className={cn(
          'bg-bg-mute relative rounded-full block-2 inline-full',
          HIGH_CONTRAST_EDGE,
        )}
      >
        <span
          aria-hidden
          className={cn(
            'bg-primary-bg absolute inset-s-0 inset-be-0 block-full inline-(--slider-progress) rounded-full forced-colors:bg-[Highlight]',
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
        className={rangeInputClass(invalid)}
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
