'use client';

import { clsx } from 'clsx';
import { useCallback, useMemo } from 'react';
import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { mergeRefs } from '../../../helpers/merge-refs';
import { ignoreClick } from '../../_internal/ignore-changes';
import { CheckIcon, MinusIcon } from '../../icons';
import { useCheckboxGroupContext } from '../checkbox-group/checkbox-group';

import srOnly from '../../_internal/sr-only.module.css';
import styles from './checkbox.module.css';

type BaseProps = {
  indeterminate?: boolean;
  invalid?: boolean;
  itemValue?: string;
  label: string;
  labelHidden?: boolean;
  ref?: Ref<HTMLInputElement>;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'className'
  | 'style'
  | 'value'
  | 'onChange'
  | 'defaultChecked'
  | 'checked'
  | 'children'
>;

type ControlledProps = {
  checked: boolean;
  onChange: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  defaultChecked?: never;
};

type UncontrolledProps = {
  defaultChecked?: boolean;
  checked?: never;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

export const Checkbox: FC<Props> = ({
  name,
  itemValue,
  disabled = false,
  indeterminate = false,
  invalid = false,
  label,
  labelHidden = false,
  checked,
  defaultChecked,
  onChange,
  ref,
  ...rest
}) => {
  const groupContext = useCheckboxGroupContext();
  const { pending } = useFormStatus();
  const groupItemValue = itemValue ?? '';

  if (groupContext && (itemValue === undefined || itemValue === '')) {
    throw new Error('Checkbox inside CheckboxGroup requires itemValue');
  }

  // indeterminate は属性ではなく DOM のプロパティにしか無い
  const indeterminateRef = useCallback(
    (input: HTMLInputElement | null) => {
      if (input !== null) input.indeterminate = indeterminate;
    },
    [indeterminate],
  );
  const mergedRef = useMemo(
    () => mergeRefs(ref, indeterminateRef),
    [ref, indeterminateRef],
  );

  const disabledNative = disabled || groupContext?.disabled === true;
  const disabledResolved = disabledNative || pending;
  const isChecked = groupContext
    ? groupContext.value?.includes(groupItemValue)
    : checked;
  const isDefaultChecked = groupContext
    ? groupContext.defaultValue.includes(groupItemValue)
    : defaultChecked;

  return (
    <label
      className={clsx(
        styles.root,
        !labelHidden && styles.withLabel,
        disabledResolved && styles.disabled,
      )}
      onClickCapture={pending ? ignoreClick : undefined}
    >
      <input
        {...rest}
        {...(isChecked === undefined
          ? { defaultChecked: isDefaultChecked }
          : { checked: isChecked })}
        aria-disabled={pending || undefined}
        aria-invalid={invalid}
        className={clsx(srOnly.srOnly, styles.input)}
        disabled={disabledNative}
        name={groupContext?.name ?? name}
        onChange={(event) => {
          if (groupContext) {
            groupContext.notifyChange(event);
            return;
          }

          onChange?.(event.target.checked, event);
        }}
        ref={mergedRef}
        type="checkbox"
        value={itemValue}
      />
      <span aria-hidden className={clsx(styles.box, invalid && styles.invalid)}>
        {indeterminate ? <MinusIcon size="sm" /> : <CheckIcon size="sm" />}
      </span>
      <span className={labelHidden ? srOnly.srOnly : styles.label}>
        {label}
      </span>
    </label>
  );
};
