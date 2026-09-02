'use client';

import { useEffect, useRef } from 'react';
import type { FC } from 'react';

/**
 * A hidden input that carries a value the visible component never submits.
 *
 * A component that renders no `<input name>` of its own — a rich text editor, a
 * canvas picker, a third-party combobox — is invisible to FormData. Rather than
 * pulling its value into React state and fighting it back out at submit, park
 * the value in a hidden input and let the form collect it like any other.
 *
 * This is the whole of what `Controller` exists to do in react-hook-form, and
 * it is the one place that binding silently breaks there.
 *
 * A component rather than a props helper for two reasons the form cannot see
 * from outside: React updates a controlled value without any DOM event, so a
 * change here has to be announced with one for rules and `isDirty` to notice;
 * and a controlled input's defaultValue tracks its value, so the first
 * render's value is snapshotted into `data-initial` as the dirtiness baseline.
 */
export const HiddenValue: FC<{ name: string; value: string }> = ({
  name,
  value,
}) => {
  const node = useRef<HTMLInputElement>(null);
  const initial = useRef(value);
  const last = useRef(value);

  useEffect(() => {
    if (last.current === value) {
      return;
    }
    last.current = value;
    node.current?.dispatchEvent(new Event('input', { bubbles: true }));
  }, [value]);

  return (
    <input
      data-initial={initial.current}
      name={name}
      readOnly
      ref={node}
      type="hidden"
      value={value}
    />
  );
};
