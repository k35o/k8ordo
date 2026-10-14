'use client';

import { clsx } from 'clsx';
import { useId } from 'react';
import type { FC, HTMLAttributes, ReactElement, Ref } from 'react';

import { getMessages } from '../../../i18n/current';

import styles from './form-control.module.css';

type FormControlProps = {
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  label: string;
  labelAs?: 'label' | 'legend';
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
  ref?: Ref<HTMLElement>;
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'children'>;

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
  const content = (
    <>
      {labelAs === 'label' ? (
        <label className={styles.label} htmlFor={id} id={labelId}>
          {labelContent}
        </label>
      ) : (
        <legend className={styles.label} id={labelId}>
          {labelContent}
        </legend>
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
          className={clsx(styles.message, styles.error)}
          id={`${id}-feedback`}
        >
          {errorText}
        </p>
      ) : hasHelpText ? (
        <p className={clsx(styles.message, styles.help)} id={`${id}-helptext`}>
          {helpText}
        </p>
      ) : null}
    </>
  );

  // 単一フィールドまで fieldset で包むと、名前の無いグループが全フィールドに増える。
  // legend を置けるのは fieldset の中だけなので、legend のときだけ fieldset にする。
  // ラッパー要素が labelAs で div / fieldset に分かれるため、ref は共通の
  // HTMLElement で受けて要素側でキャストする
  return labelAs === 'legend' ? (
    <fieldset
      {...rest}
      className={styles.root}
      ref={ref as Ref<HTMLFieldSetElement>}
    >
      {content}
    </fieldset>
  ) : (
    <div
      {...rest}
      className={styles.root}

      ref={ref as Ref<HTMLDivElement>}
    >
      {content}
    </div>
  );
};
