'use client';

import type { ChangeEvent, FC, HTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import type { Option } from '../../../types/variables';
import { FOCUS_RING_PEER } from '../../_internal/focus-ring';
import { cn } from './../../../helpers/cn';
import { useControllableState } from './../../../hooks/controllable-state';

type BaseProps = {
  'aria-labelledby': string;
  name?: string;
  disabled?: boolean;
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
  value,
  defaultValue,
  onChange,
  options,
  ref,
  ...rest
}) => {
  const [selectedValue, setSelectedValue] = useControllableState<
    string | undefined
  >({
    value,
    defaultValue,
  });
  const { pending } = useFormStatus();
  const isControlled = value !== undefined;
  const disabledResolved = disabled || pending;

  const selectValue = (
    nextValue: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedValue(nextValue);
    onChange?.(nextValue, event);
  };

  return (
    <div
      {...rest}
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
              selectValue(option.value, event);
            }}
            type="radio"
            value={option.value}
          />
          <span
            aria-hidden
            className={cn(
              'inline-flex size-5 items-center justify-center rounded-full border-2 transition-colors',
              FOCUS_RING_PEER,
              selectedValue === option.value
                ? 'border-border-base bg-primary-bg'
                : 'border-border-mute bg-bg-base',
              disabledResolved && 'border-border-mute bg-bg-mute',
            )}
          >
            <span
              className={cn(
                'size-2 rounded-full transition-opacity',
                selectedValue === option.value
                  ? 'bg-primary-border opacity-100'
                  : 'bg-transparent opacity-0',
              )}
            />
          </span>
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};
