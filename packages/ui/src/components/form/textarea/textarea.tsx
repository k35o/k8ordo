'use client';

import { clsx } from 'clsx';
import type { FC, Ref, TextareaHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './textarea.module.css';

type Props = {
  invalid?: boolean;
  fullHeight?: boolean;
  autoResize?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'style'>;

export const Textarea: FC<Props> = ({
  invalid = false,
  fullHeight = false,
  autoResize = false,
  readOnly,
  ref,
  value,
  onInput,
  ...rest
}) => {
  const { pending } = useFormStatus();

  return (
    <textarea
      aria-invalid={invalid}
      className={clsx(
        styles.root,
        focusRing.ring,
        fullHeight && styles.fullHeight,
        autoResize && styles.autoResize,
      )}
      onInput={onInput}
      readOnly={pending || readOnly}
      ref={ref}
      value={value}
      {...rest}
    />
  );
};
