'use client';

import { clsx } from 'clsx';
import type { FC, FieldsetHTMLAttributes, ReactNode, Ref } from 'react';
import { useId } from 'react';

import srOnly from '../../_internal/sr-only.module.css';
import styles from './radio-card.module.css';

export type RadioCardOption = Readonly<{
  value: string;
  label: string;
  description?: string;
  visual?: ReactNode;
  disabled?: boolean;
}>;

type BaseProps = {
  'aria-labelledby': string;
  invalid?: boolean;
  required?: boolean;
  options: readonly RadioCardOption[];
  ref?: Ref<HTMLFieldSetElement>;
} & Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  | 'className'
  | 'style'
  | 'children'
  | 'onChange'
  | 'defaultValue'
  | 'aria-labelledby'
  | 'role'
>;

type ControlledProps = {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  defaultValue?: string;
  value?: never;
  onChange?: (value: string) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

export const RadioCard: FC<Props> = ({
  'aria-labelledby': labelledbyId,
  name,
  disabled = false,
  invalid = false,
  required = false,
  options,
  value,
  defaultValue,
  onChange,
  ref,
  ...rest
}) => {
  const groupId = useId();
  const isControlled = value !== undefined;

  return (
    <fieldset
      {...rest}
      aria-labelledby={labelledbyId}
      className={clsx(styles.root, disabled && styles.disabled)}
      ref={ref}
      role="radiogroup"
    >
      {options.map((option) => {
        const optionDisabled = disabled || option.disabled === true;
        const hasDescription =
          option.description !== undefined && option.description !== '';
        const hasVisual = option.visual !== undefined && option.visual !== null;
        const optionId = `${groupId}-${option.value}`;

        return (
          <label
            className={clsx(
              styles.card,
              invalid ? styles.invalid : styles.valid,
              optionDisabled && styles.optionDisabled,
            )}
            id={optionId}
            key={option.value}
          >
            <input
              aria-describedby={
                hasDescription ? `${optionId}-description` : undefined
              }
              aria-labelledby={`${optionId}-label`}
              {...(isControlled
                ? { checked: value === option.value }
                : { defaultChecked: defaultValue === option.value })}
              className={clsx(srOnly.srOnly, styles.input)}
              disabled={optionDisabled}
              // 矢印キーのローミングと単一選択はブラウザが name 単位で束ねる。
              // name 未指定でも束ねるために一意な名前を割り当てる。
              name={name ?? groupId}
              onChange={() => {
                onChange?.(option.value);
              }}
              required={required}
              type="radio"
              value={option.value}
            />
            {hasVisual ? (
              <span aria-hidden className={styles.visual}>
                {option.visual}
              </span>
            ) : null}
            <span className={styles.text}>
              <span className={styles.label} id={`${optionId}-label`}>
                {option.label}
              </span>
              {hasDescription ? (
                <span
                  className={styles.description}
                  id={`${optionId}-description`}
                >
                  {option.description}
                </span>
              ) : null}
            </span>
            <span aria-hidden className={styles.indicator}>
              <span className={styles.dot} />
            </span>
          </label>
        );
      })}
    </fieldset>
  );
};
