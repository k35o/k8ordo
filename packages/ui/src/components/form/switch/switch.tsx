'use client';

import { clsx } from 'clsx';
import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { useId } from 'react';
import { useFormStatus } from 'react-dom';

import {
  describedByWith,
  FieldMessage,
  hasErrorText,
} from '../../_internal/field-message';
import { ignoreClick } from '../../_internal/ignore-changes';

import fieldMessage from '../../_internal/field-message.module.css';
import highContrast from '../../_internal/high-contrast.module.css';
import srOnly from '../../_internal/sr-only.module.css';
import styles from './switch.module.css';

type BaseProps = {
  errorText?: string;
  helpText?: string;
  invalid?: boolean;
  label: string;
  ref?: Ref<HTMLInputElement>;
  value?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'role'
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

export const Switch: FC<Props> = ({
  'aria-describedby': describedby,
  checked,
  defaultChecked,
  id,
  disabled = false,
  errorText,
  helpText,
  invalid = false,
  required = false,
  label,
  onChange,
  ref,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = { id: inputId, errorText, helpText };
  const { pending } = useFormStatus();
  const disabledResolved = disabled || pending;
  const invalidResolved = invalid || hasErrorText(errorText);

  return (
    <span className={fieldMessage.field}>
      <label
        className={clsx(styles.root, disabledResolved && styles.disabled)}
        htmlFor={inputId}
        onClickCapture={pending ? ignoreClick : undefined}
      >
        <span className={styles.control}>
          <input
            {...rest}
            {...(checked === undefined ? { defaultChecked } : { checked })}
            aria-describedby={describedByWith(describedby, message)}
            aria-disabled={pending || undefined}
            aria-invalid={invalidResolved}
            aria-required={required}
            className={clsx(srOnly.srOnly, styles.input)}
            disabled={disabled}
            id={inputId}
            onChange={(event) => {
              onChange?.(event.target.checked, event);
            }}
            ref={ref}
            required={required}
            // eslint-disable-next-line jsx-a11y/role-has-required-aria-props -- checkbox の input はネイティブの checked がそのまま switch の状態になる。aria-checked を別に持つと form の reset でずれる
            role="switch"
            type="checkbox"
          />
          <span
            aria-hidden
            className={clsx(
              styles.track,
              disabledResolved ? styles.trackDisabled : styles.trackEnabled,
              invalidResolved && styles.invalid,
              highContrast.edge,
            )}
          >
            <span
              className={clsx(
                styles.thumb,
                highContrast.edge,
                disabledResolved && styles.thumbDisabled,
              )}
            />
          </span>
        </span>
        {label ? <span>{label}</span> : null}
      </label>
      <FieldMessage {...message} />
    </span>
  );
};
