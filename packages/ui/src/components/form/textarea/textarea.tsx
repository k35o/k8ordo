'use client';

import { clsx } from 'clsx';
import type { FC, Ref, TextareaHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

import styles from './textarea.module.css';

type Props = {
  invalid?: boolean;
  fullHeight?: boolean;
  autoResize?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
  // <textarea> に type は無い。@k8ordo/form の formFields は z.string() に
  // type="text" を導くので、広げても属性として描かないように受けて捨てる
  type?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'style'>;

export const Textarea: FC<Props> = ({
  invalid = false,
  fullHeight = false,
  autoResize = false,
  readOnly,
  ref,
  type: _type,
  value,
  onInput,
  onKeyDown,
  ...rest
}) => {
  const { pending } = useFormStatus();

  return (
    <textarea
      aria-invalid={invalid}
      className={clsx(
        styles.root,
        fullHeight && styles.fullHeight,
        autoResize && styles.autoResize,
      )}
      onInput={onInput}
      onKeyDown={(e) => {
        e.stopPropagation();
        onKeyDown?.(e);
      }}
      readOnly={pending || readOnly}
      ref={ref}
      value={value}
      {...rest}
    />
  );
};
