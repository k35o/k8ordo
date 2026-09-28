'use client';

import type { FC, Ref, TextareaHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

import { FOCUS_RING } from '../../_internal/focus-ring';
import { cn } from './../../../helpers/cn';

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
      className={cn(
        'resize-none rounded-xl border border-border-base bg-bg-base px-3 py-2 inline-full',
        'aria-invalid:border-border-error',
        'disabled:cursor-not-allowed disabled:border-border-mute disabled:bg-bg-mute hover:disabled:bg-bg-mute',
        'read-only:cursor-not-allowed read-only:bg-bg-subtle',
        FOCUS_RING,
        fullHeight && 'h-full',
        // 中身に合わせた高さはブラウザが持っている。scrollHeight を測って
        // style.height を書く JS は、この CSS が無かった頃の代用だった
        autoResize && 'field-sizing-content',
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
