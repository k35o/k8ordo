'use client';

import { clsx } from 'clsx';
import type { ChangeEvent, FC, HTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import type { Option } from '../../../types/variables';
import { ignoreClick } from '../../_internal/ignore-changes';

import srOnly from '../../_internal/sr-only.module.css';
import styles from './radio.module.css';

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
      className={clsx(styles.root, disabledResolved && styles.disabled)}
      ref={ref}
      role="radiogroup"
    >
      {options.map((option) => (
        <label
          className={clsx(
            styles.option,
            disabledResolved && styles.optionDisabled,
          )}
          key={option.value}
          onClickCapture={pending ? ignoreClick : undefined}
        >
          <input
            {...(isControlled
              ? { checked: value === option.value }
              : { defaultChecked: defaultValue === option.value })}
            aria-disabled={pending || undefined}
            className={clsx(srOnly.srOnly, styles.input)}
            disabled={disabled}
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
            className={clsx(
              styles.circle,
              disabledResolved ? styles.circleDisabled : styles.circleEnabled,
              invalid && styles.invalid,
            )}
          >
            <span className={styles.dot} />
          </span>
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};
