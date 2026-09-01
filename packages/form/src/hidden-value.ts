/**
 * Attributes for a hidden input that carries a value the visible control never
 * submits.
 *
 * A component that renders no `<input name>` of its own — a rich text editor, a
 * canvas picker, a third-party combobox — is invisible to FormData. Rather than
 * pulling its value into React state and fighting it back out at submit, park
 * the value in a hidden input and let the form collect it like any other.
 *
 * This is the whole of what `Controller` exists to do in react-hook-form, and
 * it is the one place that binding silently breaks there.
 */
export const hiddenValue = (
  name: string,
  value: string,
): {
  type: 'hidden';
  name: string;
  value: string;
  readOnly: true;
} => ({ type: 'hidden', name, value, readOnly: true });
