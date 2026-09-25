'use client';

import { useMemo, useRef, useState } from 'react';
import type { FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { mergeRefs } from '../../../helpers/merge-refs';
import { getMessages } from '../../../i18n/current';
import { commitInputValue } from '../../../internal/commit-input-value';
import {
  FOCUS_RING_NO_BORDER,
  FOCUS_RING_WITHIN,
} from '../../_internal/focus-ring';
import { PublishDateIcon } from '../../icons';
import { Popover } from '../../overlays/popover';
import { Calendar } from '../calendar';

type Props = {
  invalid?: boolean;
  /** `YYYY-MM-DD`。未入力は `''`。 */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  ref?: Ref<HTMLInputElement>;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'className'
  | 'style'
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'children'
>;

const asDate = (bound: number | string | undefined): string | undefined =>
  bound === undefined ? undefined : String(bound);

export const DatePicker: FC<Props> = ({
  invalid = false,
  value,
  defaultValue,
  onChange,
  disabled = false,
  readOnly = false,
  min,
  max,
  ref,
  ...rest
}) => {
  const messages = getMessages();
  const { pending } = useFormStatus();
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const [isOpen, setIsOpen] = useState(false);
  // 開いた時点の入力値。カレンダーは開くたびに作り直し、その値の月から始める
  const [openedWith, setOpenedWith] = useState('');
  const locked = disabled || readOnly || pending;

  return (
    <div
      className={cn(
        'relative flex w-full items-center rounded-xl border border-border-base bg-bg-base',
        invalid && 'border-border-error',
        (disabled || pending) &&
          'cursor-not-allowed border-border-mute bg-bg-mute',
        readOnly && 'bg-bg-subtle',
        FOCUS_RING_WITHIN,
      )}
    >
      <input
        aria-invalid={invalid}
        className={cn(
          'w-full grow bg-transparent px-3 py-2 tabular-nums focus-visible:outline-hidden',
          'disabled:cursor-not-allowed read-only:cursor-not-allowed',
          // 日付はこの部品のカレンダーから選ぶので、ブラウザ自身のピッカーの
          // ボタンは出さない
          '[&::-webkit-calendar-picker-indicator]:hidden',
        )}
        defaultValue={defaultValue}
        disabled={disabled}
        max={max}
        min={min}
        onChange={(event) => {
          onChange?.(event.target.value);
        }}
        readOnly={pending || readOnly}
        ref={mergedRef}
        value={value}
        {...rest}
        type="date"
      />
      <Popover.Root
        isOpen={isOpen}
        onChange={(next) => {
          if (next) {
            setOpenedWith(inputRef.current?.value ?? '');
          }
          setIsOpen(next);
        }}
        placement="bottom-end"
        role="dialog"
      >
        <Popover.Trigger
          renderItem={(props) => (
            <button
              {...props}
              aria-label={messages.datePickerOpen}
              className={cn(
                'me-2 inline-flex shrink-0 items-center justify-center rounded-md p-1 text-fg-mute transition-colors',
                FOCUS_RING_NO_BORDER,
                !locked && 'hover:bg-bg-mute hover:text-fg-base',
                locked && 'cursor-not-allowed',
              )}
              disabled={locked}
              type="button"
            >
              <PublishDateIcon size="sm" />
            </button>
          )}
        />
        <Popover.Content
          renderItem={({ ref: contentRef, ...props }) => (
            <div
              {...props}
              aria-label={messages.datePickerDialog}
              className="bg-bg-raised border-border-subtle rounded-xl border p-3 shadow-md"
              ref={contentRef}
            >
              {isOpen ? (
                <Calendar
                  defaultValue={openedWith}
                  max={asDate(max)}
                  min={asDate(min)}
                  onChange={(next) => {
                    const input = inputRef.current;
                    if (input !== null) {
                      commitInputValue(input, next);
                    }
                    onChange?.(next);
                    setIsOpen(false);
                  }}
                />
              ) : null}
            </div>
          )}
        />
      </Popover.Root>
    </div>
  );
};
