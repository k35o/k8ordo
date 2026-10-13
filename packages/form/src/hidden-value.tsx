'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { FC } from 'react';

/**
 * A hidden input that carries a value the visible component never submits.
 *
 * A component that renders no `<input name>` of its own — a rich text editor, a
 * canvas picker, a third-party combobox — is invisible to FormData. Rather than
 * pulling its value into React state and fighting it back out at submit, park
 * the value in a hidden input and let the form collect it like any other.
 *
 * A component rather than a props helper for two reasons the form cannot see
 * from outside: React updates a controlled value without any DOM event, so a
 * change here has to be announced with one for rules and `isDirty` to notice;
 * and a controlled input's defaultValue tracks its value, so the value it
 * mounted with is burned into `data-initial` as the dirtiness baseline.
 */
export const HiddenValue: FC<{ name: string; value: string }> = ({
  name,
  value,
}) => {
  const node = useRef<HTMLInputElement>(null);
  const last = useRef(value);

  // The baseline is written from the attached node rather than snapshotted
  // during render: refs are not readable there, and by the time a ref callback
  // runs React has already put the first value on the element.
  const attach = useCallback((element: HTMLInputElement | null) => {
    node.current = element;
    if (element !== null) {
      element.dataset.initial = element.value;
    }
  }, []);

  useEffect(() => {
    if (last.current === value) {
      return;
    }
    last.current = value;
    node.current?.dispatchEvent(new Event('input', { bubbles: true }));
  }, [value]);

  return (
    <input name={name} readOnly ref={attach} type="hidden" value={value} />
  );
};
