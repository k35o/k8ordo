'use client';

import type { CSSProperties, FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { useControllableState } from '../../../hooks/controllable-state';
import { HIGH_CONTRAST_EDGE } from '../../_internal/high-contrast';
import { rangeInputClass } from './range-input-class';

type BaseProps = {
  invalid?: boolean;
  step?: number;
  max?: number;
  min?: number;
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
  defaultValue?: number;
  value?: never;
  onChange?: (value: number) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

export const Slider: FC<Props> = ({
  invalid = false,
  disabled = false,
  required = false,
  value,
  defaultValue,
  onChange,
  ref,
  step = 1,
  max = 100,
  min = 0,
  ...rest
}) => {
  const [currentValue, handleChange] = useControllableState({
    value,
    defaultValue: defaultValue ?? min,
    onChange,
  });
  const { pending } = useFormStatus();
  const disabledResolved = disabled || pending;
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
        ref={ref}
        required={required}
        step={step}
        type="range"
        value={currentValue}
      />
    </div>
  );
};
