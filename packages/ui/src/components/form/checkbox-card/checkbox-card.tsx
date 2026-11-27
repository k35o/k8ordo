'use client';

import { clsx } from 'clsx';
import type {
  ChangeEvent,
  FC,
  FieldsetHTMLAttributes,
  ReactNode,
  Ref,
} from 'react';
import { useId } from 'react';

import { checkedValuesAround } from '../../_internal/checked-values';
import { CheckIcon } from '../../icons/check';

import srOnly from '../../_internal/sr-only.module.css';
import styles from './checkbox-card.module.css';

export type CheckboxCardOption = Readonly<{
  value: string;
  label: string;
  description?: string;
  visual?: ReactNode;
  disabled?: boolean;
}>;

type BaseProps = {
  'aria-labelledby': string;
  invalid?: boolean;
  options: readonly CheckboxCardOption[];
  ref?: Ref<HTMLFieldSetElement>;
  // fieldset にも、1 つのチェックボックスにも「1 つ以上」を求める required は無い。
  // FormControl の束を広げても属性として描かないように受けて捨てる
  required?: boolean;
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
  value: readonly string[];
  onChange: (value: string[]) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  defaultValue?: readonly string[];
  value?: never;
  onChange?: (value: string[]) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

export const CheckboxCard: FC<Props> = ({
  'aria-labelledby': labelledbyId,
  name,
  disabled = false,
  invalid = false,
  options,
  value,
  defaultValue,
  onChange,
  ref,
  required: _required,
  ...rest
}) => {
  const groupId = useId();
  const isControlled = value !== undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(checkedValuesAround(event.currentTarget));
  };

  return (
    <fieldset
      {...rest}
      aria-labelledby={labelledbyId}
      className={clsx(styles.root, disabled && styles.rootDisabled)}
      ref={ref}
      role="group"
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
              invalid && styles.invalid,
              optionDisabled && styles.disabled,
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
                ? { checked: value.includes(option.value) }
                : { defaultChecked: defaultValue?.includes(option.value) })}
              className={clsx(srOnly.srOnly, styles.input)}
              disabled={optionDisabled}
              name={name}
              onChange={handleChange}
              type="checkbox"
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
            <span aria-hidden className={styles.box}>
              <CheckIcon size="sm" />
            </span>
          </label>
        );
      })}
    </fieldset>
  );
};
