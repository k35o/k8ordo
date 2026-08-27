'use client';

import type { FC, Ref, SelectHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

import type { Option } from '../../../types/variables';
import { FOCUS_RING_WITHIN } from '../../_internal/focus-ring';
import { ChevronIcon } from '../../icons';
import { cn } from './../../../helpers/cn';

type Props = {
  invalid?: boolean;
  options: readonly Option[];
  ref?: Ref<HTMLSelectElement>;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'style'>;

export const Select: FC<Props> = ({
  invalid = false,
  options,
  disabled = false,
  ref,
  ...rest
}) => {
  const { pending } = useFormStatus();
  return (
    <div
      className={cn(
        'relative flex h-fit w-full items-center rounded-xl border border-border-base bg-bg-base vertical:h-full vertical:w-fit',
        invalid && 'border-border-error',
        (disabled || pending) &&
          'cursor-not-allowed border-border-mute bg-bg-mute',
        FOCUS_RING_WITHIN,
      )}
    >
      <select
        aria-invalid={invalid}
        className={cn(
          'w-full grow appearance-none bg-transparent px-3 py-2 text-fg-base focus-visible:outline-hidden vertical:h-full vertical:w-auto',
          'disabled:cursor-not-allowed',
        )}
        disabled={disabled || pending}
        ref={ref}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="vertical:-rotate-90 pointer-events-none me-3 shrink-0"
      >
        <ChevronIcon direction="down" size="sm" />
      </span>
    </div>
  );
};
