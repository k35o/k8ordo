'use client';

import type { FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { FOCUS_RING } from '../../_internal/focus-ring';

type Props = {
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'style' | 'type' | 'children'
>;

export const DateField: FC<Props> = ({
  invalid = false,
  readOnly,
  ref,
  ...rest
}) => {
  const { pending } = useFormStatus();
  return (
    <input
      aria-invalid={invalid}
      className={cn(
        'rounded-xl border border-border-base bg-bg-base px-3 py-2 tabular-nums inline-full',
        'aria-invalid:border-border-error',
        'disabled:cursor-not-allowed disabled:border-border-mute disabled:bg-bg-mute hover:disabled:bg-bg-mute',
        'read-only:cursor-not-allowed read-only:bg-bg-subtle',
        FOCUS_RING,
      )}
      readOnly={pending || readOnly}
      ref={ref}
      {...rest}
      // formFields の input は type を文字列で持つので、spread で上書きされない
      // よう最後に置く
      type="date"
    />
  );
};
