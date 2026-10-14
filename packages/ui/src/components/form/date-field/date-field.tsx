'use client';

import { clsx } from 'clsx';
import type { FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './date-field.module.css';

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
      className={clsx(styles.root, focusRing.ring)}

      readOnly={pending || readOnly}
      ref={ref}
      {...rest}
      // formFields の input は type を文字列で持つので、spread で上書きされない
      // よう最後に置く
      type="date"
    />
  );
};
