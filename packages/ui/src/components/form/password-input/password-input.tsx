'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import type { FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { getMessages } from '../../../i18n/current';
import { ViewIcon, ViewOffIcon } from '../../icons';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './password-input.module.css';

type Props = {
  invalid?: boolean;
  showLabel?: string;
  hideLabel?: string;
  ref?: Ref<HTMLInputElement>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'style'>;

export const PasswordInput: FC<Props> = ({
  invalid = false,
  autoComplete = 'current-password',
  showLabel,
  hideLabel,
  disabled = false,
  readOnly,
  ref,
  ...rest
}) => {
  const messages = getMessages();
  const [isVisible, setIsVisible] = useState(false);
  const { pending } = useFormStatus();

  return (
    <div
      className={clsx(
        styles.root,
        invalid && styles.invalid,
        (disabled || pending) && styles.disabled,
        focusRing.ringWithin,
      )}
    >
      <input
        aria-invalid={invalid}
        autoComplete={autoComplete}
        className={styles.input}
        disabled={disabled}
        readOnly={pending || readOnly}
        ref={ref}
        {...rest}
        // rest より後に置く。@k8ordo/form が導く type="password" のように、
        // 広げた type に表示の切り替えを上書きさせない
        type={isVisible ? 'text' : 'password'}
      />
      <button
        aria-label={
          isVisible
            ? (hideLabel ?? messages.passwordHide)
            : (showLabel ?? messages.passwordShow)
        }
        className={clsx(
          styles.toggle,
          focusRing.ringNoBorder,
          (disabled || pending) && styles.toggleDisabled,
        )}
        disabled={disabled || pending}
        onClick={() => {
          setIsVisible((current) => !current);
        }}
        type="button"
      >
        {isVisible ? <ViewOffIcon size="sm" /> : <ViewIcon size="sm" />}
      </button>
    </div>
  );
};
