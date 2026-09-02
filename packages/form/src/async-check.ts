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
  // The value the newest answer was about. Applying an answer dispatches a
  // focusout that re-enters run() on this very input; without this note it
  // would ask the server about the same value forever.
  const answered = useRef<string | null>(null);
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
    if (node === null) {
      return;
    }
    if (node.value === answered.current) {
      // Same value, same verdict — and this is also what stops the dispatched
      // focusout below from asking the server in an endless circle.
      return;
    }
    // Whatever was in flight is about an older value now.
    latest.current += 1;
    if (node.value === '') {
      // An emptied field no longer holds the value a previous answer was
      // about; without this, "taken" would outlive the value it described.
      // The real blur is still bubbling, so the form's own pass reads the
      // cleared validity — no synthetic event needed here.
      answered.current = null;
      node.setCustomValidity('');
      return;
    }
    const ticket = latest.current;
    const issuedFor = node.value;
    setIsChecking(true);

    void (async () => {
      try {
        const message = await check(issuedFor);
        // Answers can arrive out of order; only the newest one counts — and
        // only while the field still holds the value it was issued for.
        if (ticket !== latest.current) {
          return;
        }
        const { current } = control;
        if (current === null || current.value !== issuedFor) {
          return;
        }
        answered.current = issuedFor;
        current.setCustomValidity(message ?? '');
        // React's onBlur listens for focusout, so this is what re-runs the
        // form's own pass and puts the message on screen.
        current.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      } catch {
        // A failed probe must not fake a verdict either way; the server
        // re-checks the real submission.
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
