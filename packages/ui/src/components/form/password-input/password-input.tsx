'use client';

import type { FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { useDisclosure } from '../../../hooks/disclosure';
import { useMessages } from '../../../i18n/context';
import {
  FOCUS_RING_NO_BORDER,
  FOCUS_RING_WITHIN,
} from '../../_internal/focus-ring';
import { ViewIcon, ViewOffIcon } from '../../icons';

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
  const messages = useMessages();
  const { isOpen: isVisible, toggle: toggleVisible } = useDisclosure();
  const { pending } = useFormStatus();

  return (
    <div
      className={cn(
        'relative flex w-full items-center rounded-xl border border-border-base bg-bg-base vertical:h-full vertical:w-auto',
        invalid && 'border-border-error',
        (disabled || pending) &&
          'cursor-not-allowed border-border-mute bg-bg-mute',
        FOCUS_RING_WITHIN,
      )}
    >
      <input
        aria-invalid={invalid}
        autoComplete={autoComplete}
        className={cn(
          'w-full grow bg-transparent px-3 py-2 focus-visible:outline-hidden vertical:h-full vertical:w-auto',
          'disabled:cursor-not-allowed',
          'read-only:cursor-not-allowed read-only:bg-bg-subtle',
        )}
        disabled={disabled}
        readOnly={pending || readOnly}
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        {...rest}
      />
      <button
        aria-label={
          isVisible
            ? (hideLabel ?? messages.passwordHide)
            : (showLabel ?? messages.passwordShow)
        }
        className={cn(
          'me-2 inline-flex shrink-0 items-center justify-center rounded-md p-1 text-fg-mute transition-colors',
          FOCUS_RING_NO_BORDER,
          !disabled && !pending && 'hover:bg-bg-mute hover:text-fg-base',
          (disabled || pending) && 'cursor-not-allowed text-fg-mute/70',
        )}
        disabled={disabled || pending}
        onClick={toggleVisible}
        type="button"
      >
        {isVisible ? <ViewOffIcon size="sm" /> : <ViewIcon size="sm" />}
      </button>
    </div>
  );
};
