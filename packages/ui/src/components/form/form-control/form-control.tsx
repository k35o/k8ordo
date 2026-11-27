'use client';

import { clsx } from 'clsx';
import { useId } from 'react';
import type { FC, HTMLAttributes, ReactElement, Ref } from 'react';

import { getMessages } from '../../../i18n/current';

import fieldMessage from '../../_internal/field-message.module.css';
import styles from './form-control.module.css';

type FormControlProps = {
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  label: string;
  labelAs?: 'label' | 'group';
  helpText?: string;
  errorText?: string | undefined;
  renderInput: (props: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-labelledby': string;
    disabled: boolean;
    invalid: boolean;
    required: boolean;
  }) => ReactElement;
  ref?: Ref<HTMLDivElement>;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>;

export const FormControl: FC<FormControlProps> = ({
  disabled = false,
  invalid = false,
  required = false,
  label,
  labelAs = 'label',
  helpText,
  errorText,
  renderInput,
  ref,
  ...rest
}) => {
  const messages = getMessages();
  const id = useId();
  const hasErrorText = errorText !== undefined && errorText !== '';
  const hasHelpText = helpText !== undefined && helpText !== '';
  const describedbyId =
    invalid && hasErrorText
      ? `${id}-feedback`
      : hasHelpText
        ? `${id}-helptext`
        : undefined;
  const labelId = `${id}-label`;
  const labelContent = (
    <>
      {label}
      {required && <span className={styles.required}>{messages.required}</span>}
    </>
  );

  return (
    <div {...rest} className={styles.root} ref={ref}>
      {labelAs === 'label' ? (
        <label className={styles.label} htmlFor={id} id={labelId}>
          {labelContent}
        </label>
      ) : (
        // label の for はグループを指せず、fieldset と legend で包むとグループの
        // 中にもう 1 つグループができる。名前は中の部品が aria-labelledby で読む
        <span className={styles.label} id={labelId}>
          {labelContent}
        </span>
      )}
      {renderInput({
        id,
        'aria-describedby': describedbyId,
        'aria-labelledby': labelId,
        disabled,
        invalid,
        required,
      })}
      {invalid && hasErrorText ? (
        <p
          aria-live="polite"
          className={clsx(fieldMessage.message, fieldMessage.error)}
          id={`${id}-feedback`}
        >
          {errorText}
        </p>
      ) : hasHelpText ? (
        <p
          className={clsx(fieldMessage.message, fieldMessage.help)}
          id={`${id}-helptext`}
        >
          {helpText}
        </p>
      ) : null}
    </div>
  );
};
