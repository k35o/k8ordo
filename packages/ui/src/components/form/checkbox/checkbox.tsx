'use client';

import { clsx } from 'clsx';
import { useCallback, useMemo } from 'react';
import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { mergeRefs } from '../../../helpers/merge-refs';
import { ignoreClick } from '../../_internal/ignore-changes';
import { CheckIcon } from '../../icons/check';
import { MinusIcon } from '../../icons/minus';

import srOnly from '../../_internal/sr-only.module.css';
import styles from './checkbox.module.css';

type BaseProps = {
  indeterminate?: boolean;
  invalid?: boolean;
  label: string;
  labelHidden?: boolean;
  ref?: Ref<HTMLInputElement>;
  value?: string;
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
  const { pending } = useFormStatus();

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

  const disabledResolved = disabled || pending;

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
        {...(checked === undefined ? { defaultChecked } : { checked })}
        aria-disabled={pending || undefined}
        aria-invalid={invalid}
        className={clsx(srOnly.srOnly, styles.input)}
        disabled={disabled}
        onChange={(event) => {
          onChange?.(event.target.checked, event);
        }}
        ref={mergedRef}
        type="checkbox"
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
