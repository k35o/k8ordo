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

// 1 行テキスト入力に絞る。number は NumberField、password は PasswordInput、
// file は FileField が別途あり、checkbox / radio / color 等は見た目が別物になる
type TextInputType = Extract<
  HTMLInputTypeAttribute,
  'text' | 'email' | 'tel' | 'url' | 'search'
>;

type Props = {
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
  type?: TextInputType;
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
