'use client';

import { clsx } from 'clsx';
import { useCallback, useId, useMemo } from 'react';
import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { mergeRefs } from '../../../helpers/merge-refs';
import {
  describedByWith,
  FieldMessage,
  hasErrorText,
} from '../../_internal/field-message';
import { ignoreClick } from '../../_internal/ignore-changes';
import { CheckIcon } from '../../icons/check';
import { MinusIcon } from '../../icons/minus';

import fieldMessage from '../../_internal/field-message.module.css';
import srOnly from '../../_internal/sr-only.module.css';
import styles from './checkbox.module.css';

type BaseProps = {
  errorText?: string;
  helpText?: string;
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
  'aria-describedby': describedby,
  disabled = false,
  errorText,
  helpText,
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
  const messageId = useId();
  const message = { id: messageId, errorText, helpText };

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
  const invalidResolved = invalid || hasErrorText(errorText);

  return (
    <span className={fieldMessage.field}>
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
          aria-describedby={describedByWith(describedby, message)}
          aria-disabled={pending || undefined}
          aria-invalid={invalidResolved}
          className={clsx(srOnly.srOnly, styles.input)}
          disabled={disabled}
          onChange={(event) => {
            onChange?.(event.target.checked, event);
          }}
          ref={mergedRef}
          type="checkbox"
        />
        <span
          aria-hidden
          className={clsx(styles.box, invalidResolved && styles.invalid)}
        >
          {indeterminate ? <MinusIcon size="sm" /> : <CheckIcon size="sm" />}
        </span>
        <span className={labelHidden ? srOnly.srOnly : styles.label}>
          {label}
        </span>
      </label>
      <FieldMessage {...message} />
    </span>
  );
};
