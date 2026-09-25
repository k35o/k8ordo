'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import type { FC, Ref, SelectHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

import type { Option } from '../../../types/variables';
import { FOCUS_RING_WITHIN } from '../../_internal/focus-ring';
import { ChevronIcon } from '../../icons';
import { cn } from './../../../helpers/cn';
import { mergeRefs } from './../../../helpers/merge-refs';

type Props = {
  invalid?: boolean;
  options: readonly Option[];
  ref?: Ref<HTMLSelectElement>;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'style'>;

export const Select: FC<Props> = ({
  invalid = false,
  options,
  disabled = false,
  defaultValue,
  ref,
  ...rest
}) => {
  const { pending } = useFormStatus();
  const selectRef = useRef<HTMLSelectElement>(null);
  const mergedRef = useMemo(() => mergeRefs(selectRef, ref), [ref]);
  const defaultKey =
    defaultValue === undefined ? undefined : JSON.stringify(defaultValue);

  // React は select の defaultValue をマウント時にしか反映しないので、あとから
  // 変わった既定値（送信に失敗した値のエコー）はここで defaultSelected に書く。
  // 送信後の自動リセットはこれより先に走るが、各 option の dirtiness を消すので、
  // 選択は新しい既定値に追従する。選び直したあとの選択は動かさない
  useLayoutEffect(() => {
    const select = selectRef.current;
    if (select === null || defaultKey === undefined) {
      return;
    }
    const defaults = new Set(
      [JSON.parse(defaultKey) as unknown].flat().map(String),
    );
    for (const option of select.options) {
      option.defaultSelected = defaults.has(option.value);
    }
  }, [defaultKey]);

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
        defaultValue={defaultValue}
        disabled={disabled || pending}
        ref={mergedRef}
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
