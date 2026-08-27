'use client';

import { useId } from 'react';
import type { FC, HTMLAttributes, ReactElement, Ref } from 'react';

import { useMessages } from '../../../i18n/context';

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

const LABEL_CLASS = 'text-fg-base text-md mb-1 flex gap-2 pl-0.5 font-bold';

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
  const messages = useMessages();
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
      {required && (
        <span className="text-fg-error font-medium">{messages.required}</span>
      )}
    </>
  );
  const content = (
    <>
      {labelAs === 'label' ? (
        <label className={LABEL_CLASS} htmlFor={id} id={labelId}>
          {labelContent}
        </label>
      ) : (
        <legend className={LABEL_CLASS} id={labelId}>
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
          className="text-fg-error mt-1 pl-0.5 text-sm"
          id={`${id}-feedback`}
        >
          {errorText}
        </p>
      ) : hasHelpText ? (
        <p className="text-fg-mute mt-1 pl-0.5 text-sm" id={`${id}-helptext`}>
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
      className="flex w-full min-w-0 flex-col"
      ref={ref as Ref<HTMLFieldSetElement>}
    >
      {content}
    </fieldset>
  ) : (
    <div
      {...rest}
      className="flex w-full min-w-0 flex-col"
      ref={ref as Ref<HTMLDivElement>}
    >
      {content}
    </div>
  );
};
