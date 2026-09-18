'use client';

import type { ChangeEvent, FC, HTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import type { Option } from '../../../types/variables';
import { FOCUS_RING_PEER } from '../../_internal/focus-ring';
import { cn } from './../../../helpers/cn';

type BaseProps = {
  'aria-labelledby': string;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  options: readonly Option[];
  ref?: Ref<HTMLDivElement>;
} & Omit<
  HTMLAttributes<HTMLDivElement>,
  'role' | 'className' | 'style' | 'children' | 'aria-labelledby' | 'onChange'
>;

type ControlledProps = {
  value: string;
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  defaultValue?: string;
  value?: never;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

export const Radio: FC<Props> = ({
  'aria-labelledby': labelledbyId,
  name,
  disabled = false,
  invalid = false,
  required = false,
  value,
  defaultValue,
  onChange,
  options,
  ref,
  ...rest
}) => {
  const { pending } = useFormStatus();
  const isControlled = value !== undefined;
  const disabledResolved = disabled || pending;

  return (
    <div
      {...rest}
      aria-invalid={invalid}
      aria-labelledby={labelledbyId}
      className={cn(
        'flex cursor-pointer flex-col gap-2',
        disabledResolved && 'cursor-not-allowed',
      )}
      ref={ref}
      role="radiogroup"
    >
      {options.map((option) => (
        <label
          className={cn(
            'flex items-center gap-2 text-left',
            disabledResolved ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
          key={option.value}
        >
          <input
            {...(isControlled
              ? { checked: value === option.value }
              : { defaultChecked: defaultValue === option.value })}
            className="peer sr-only"
            disabled={disabledResolved}
            name={name ?? labelledbyId}
            onChange={(event) => {
              onChange?.(option.value, event);
            }}
            required={required}
            type="radio"
            value={option.value}
          />
          <span
            aria-hidden
            className={cn(
              'inline-flex size-5 items-center justify-center rounded-full border-2 transition-colors',
              FOCUS_RING_PEER,
              // 非制御のとき、form の reset は change を飛ばさずに checked を戻すので、
              // 見た目は state ではなく input の :checked から引く
              disabledResolved
                ? 'border-border-mute bg-bg-mute'
                : 'border-border-mute bg-bg-base peer-checked:border-border-base peer-checked:bg-primary-bg',
              'peer-checked:*:opacity-100',
              invalid && 'border-border-error peer-checked:border-border-error',
            )}
          >
            <span className="bg-primary-border size-2 rounded-full opacity-0 transition-opacity" />
          </span>
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};
