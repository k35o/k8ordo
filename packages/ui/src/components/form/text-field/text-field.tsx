'use client';

import type {
  FC,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  Ref,
} from 'react';
import { useFormStatus } from 'react-dom';

import { FOCUS_RING } from '../../_internal/focus-ring';
import { cn } from './../../../helpers/cn';

// 1 行の入力欄として描けるものを並べる。number は NumberField、password は
// PasswordInput、file は FileField が別途あり、checkbox / radio / color 等は
// 見た目が別物になる
type TextInputType = Extract<
  HTMLInputTypeAttribute,
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
>;

type Props = {
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
  // @k8ordo/form の formFields が導く type は string なので、上の候補に絞ると
  // 導かれた属性をそのまま広げられない。候補は補完のために残す
  type?: TextInputType | (string & Record<never, never>);
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'type'>;

export const TextField: FC<Props> = ({
  invalid = false,
  readOnly,
  ref,
  type = 'text',
  ...rest
}) => {
  const { pending } = useFormStatus();
  return (
    <input
      aria-invalid={invalid}
      className={cn(
        'rounded-xl border border-border-base bg-bg-base px-3 py-2 inline-full',
        'aria-invalid:border-border-error',
        'disabled:cursor-not-allowed disabled:border-border-mute disabled:bg-bg-mute hover:disabled:bg-bg-mute',
        'read-only:cursor-not-allowed read-only:bg-bg-subtle',
        FOCUS_RING,
      )}
      readOnly={pending || readOnly}
      ref={ref}
      type={type}
      {...rest}
    />
  );
};
