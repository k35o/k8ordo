'use client';

import { clsx } from 'clsx';
import type { ChangeEvent, FC, FieldsetHTMLAttributes, Ref } from 'react';

import type { Option } from '../../../types/variables';
import { checkedValuesAround } from '../../_internal/checked-values';
import { Checkbox } from '../checkbox';

import styles from './checkbox-group.module.css';

type BaseProps = {
  'aria-labelledby': string;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  options: readonly Option[];
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
  | 'disabled'
  | 'name'
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

export const CheckboxGroup: FC<Props> = ({
  'aria-labelledby': labelledbyId,
  defaultValue,
  disabled = false,
  invalid = false,
  name,
  onChange,
  options,
  ref,
  required: _required,
  value,
  ...rest
}) => {
  const handleChange = (
    _checked: boolean,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    onChange?.(checkedValuesAround(event.currentTarget));
  };

  return (
    <fieldset
      {...rest}
      aria-invalid={invalid}
      aria-labelledby={labelledbyId}
      className={clsx(styles.root, disabled && styles.disabled)}
      ref={ref}
    >
      {options.map((option) => (
        <Checkbox
          {...(value === undefined
            ? { defaultChecked: defaultValue?.includes(option.value) }
            : { checked: value.includes(option.value) })}
          disabled={disabled}
          key={option.value}
          label={option.label}
          name={name}
          onChange={handleChange}
          value={option.value}
        />
      ))}
    </fieldset>
  );
};
