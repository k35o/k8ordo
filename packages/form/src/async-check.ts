'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Ask the server about one field while the person is still filling the form.
 *
 * Uniqueness is the case HTML cannot help with at all: only the server knows
 * whether a name is taken. The check runs on blur rather than on every
 * keystroke, and its answer is applied with `setCustomValidity`, so it joins
 * the same message path as every built-in check instead of opening a second
 * one.
 */
export type AsyncCheck = {
  /** Attach to the input this check guards. */
  props: { onBlur: () => void; ref: (node: HTMLInputElement | null) => void };
  /** True while an answer is outstanding, for disabling submit. */
  isChecking: boolean;
};

export const useAsyncCheck = (
  check: (value: string) => Promise<string | undefined>,
): AsyncCheck => {
  const control = useRef<HTMLInputElement | null>(null);
  const latest = useRef(0);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(
    () => () => {
      // A pending answer must not land on an unmounted input.
      latest.current += 1;
    },
    [],
  );

  const run = useCallback(() => {
    const node = control.current;
    if (node === null || node.value === '') {
      return;
    }
    latest.current += 1;
    const ticket = latest.current;
    setIsChecking(true);

    void (async () => {
      try {
        const message = await check(node.value);
        // Answers can arrive out of order; only the newest one counts.
        if (ticket !== latest.current) {
          return;
        }
        control.current?.setCustomValidity(message ?? '');
        // React's onBlur listens for focusout, so this is what re-runs the
        // form's own pass and puts the message on screen.
        control.current?.dispatchEvent(
          new FocusEvent('focusout', { bubbles: true }),
        );
      } finally {
        if (ticket === latest.current) {
          setIsChecking(false);
        }
      }
    })();
  }, [check]);

  const ref = useCallback((node: HTMLInputElement | null) => {
    control.current = node;
  }, []);

  return { props: { onBlur: run, ref }, isChecking };
};
