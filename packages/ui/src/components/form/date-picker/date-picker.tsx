'use client';

import { clsx } from 'clsx';
import { useMemo, useRef, useState } from 'react';
import type { FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { mergeRefs } from '../../../helpers/merge-refs';
import { getMessages } from '../../../i18n/current';
import { commitInputValue } from '../../../internal/commit-input-value';
import { PublishDateIcon } from '../../icons';
import { Popover } from '../../overlays/popover';
import { Calendar } from '../calendar';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './date-picker.module.css';

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
      className={clsx(
        styles.root,
        invalid && styles.invalid,
        (disabled || pending) && styles.disabled,
        readOnly && styles.readOnly,
        focusRing.ringWithin,
      )}
    >
      <input
        aria-invalid={invalid}
        className={styles.input}
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
              className={clsx(
                styles.trigger,
                focusRing.ringNoBorder,
                locked && styles.locked,
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
              className={styles.dialog}

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
