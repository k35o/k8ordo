'use client';

import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { FC, RefObject } from 'react';

type Props = {
  name: string | undefined;
  /** What the visible control holds now. */
  values: readonly string[];
  /**
   * What a reset goes back to, and what the form measures dirtiness against.
   * `undefined` for a controlled caller: the values it mounted with.
   */
  defaultValues: readonly string[] | undefined;
  multiple: boolean;
  required: boolean;
  disabled: boolean;
  /**
   * Put the visible control's own state back to `defaultValues`. The browser
   * restores this element itself.
   */
  onReset: () => void;
  /** Where focus goes when the form focuses this element after a failure. */
  focusTarget: RefObject<HTMLElement | null>;
};

const parse = (key: string): string[] => JSON.parse(key) as string[];

const write = (select: HTMLSelectElement, values: readonly string[]) => {
  for (const option of select.options) {
    option.selected = values.includes(option.value);
  }
};

/**
 * The named control a composite component submits through. `type="hidden"`
 * would not do: it is barred from constraint validation, it cannot take focus
 * when the form moves to a failure, and with nothing selected there would be
 * no element carrying the name at all — so neither `required` nor a rule could
 * reach it. A `<select>` is always present, validates natively (`required`
 * means "at least one"), restores itself on reset, and keeps the baseline in
 * each option's `defaultSelected`, where dirtiness is read from.
 */
export const FormValue: FC<Props> = ({
  name,
  values,
  defaultValues,
  multiple,
  required,
  disabled,
  onReset,
  focusTarget,
}) => {
  const ref = useRef<HTMLSelectElement>(null);
  // The reset event fires before the browser restores the controls, and a
  // reset button runs microtasks — React's render included — in between, so
  // the state catching up with the defaults must not read as an edit.
  const resetting = useRef(false);
  // Effects are keyed by content — callers pass a fresh array on every
  // render — and read the arrays back from the key.
  const valuesKey = JSON.stringify(values);
  const defaultsKey =
    defaultValues === undefined ? undefined : JSON.stringify(defaultValues);
  // Compared with what was last announced rather than with the DOM, which
  // only says what is selected now, not what the form last heard.
  const announced = useRef(valuesKey);
  // Every value ever held keeps its option. Unmounting the option of a value
  // the control mounted with would lose its `defaultSelected`, and dropping
  // that value would no longer read as a change.
  const [known, setKnown] = useState(values);
  if (values.some((value) => !known.includes(value))) {
    setKnown([...known, ...values.filter((value) => !known.includes(value))]);
  }

  // React applies a select's defaultValue only when it mounts. A later one —
  // the echo of a failed submission — is written here. The reset after a form
  // action runs before this, but it clears each option's dirtiness, so the
  // selection still follows the new baseline.
  useLayoutEffect(() => {
    const select = ref.current;
    if (select === null || defaultsKey === undefined) {
      return;
    }
    const defaults = parse(defaultsKey);
    for (const option of select.options) {
      option.defaultSelected = defaults.includes(option.value);
    }
  }, [defaultsKey]);

  useLayoutEffect(() => {
    const select = ref.current;
    if (select === null) {
      return;
    }
    write(select, parse(valuesKey));
    if (announced.current === valuesKey) {
      return;
    }
    announced.current = valuesKey;
    if (!resetting.current) {
      select.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, [valuesKey]);

  const handleReset = useEffectEvent(() => {
    onReset();
  });
  // A controlled caller does not go back to its defaults, so once the browser
  // is through, what is submitted is put back in line with what is shown.
  const handleRestored = useEffectEvent(() => {
    const select = ref.current;
    if (select !== null) {
      write(select, values);
    }
  });

  useEffect(() => {
    const form = ref.current?.form;
    if (!form) {
      return undefined;
    }
    const listener = () => {
      resetting.current = true;
      handleReset();
      setTimeout(() => {
        resetting.current = false;
        handleRestored();
      }, 0);
    };
    form.addEventListener('reset', listener);
    return () => {
      form.removeEventListener('reset', listener);
    };
  }, []);

  // The selection first, so the submission keeps its order.
  const options = [
    ...new Set([...values, ...(defaultValues ?? []), ...known]),
  ].filter((value) => value !== '');

  return (
    <select
      aria-hidden
      autoComplete="off"
      className="sr-only"
      defaultValue={
        multiple ? (defaultValues ?? values) : (defaultValues ?? values)[0]
      }
      disabled={disabled}
      multiple={multiple}
      name={name}
      onFocus={() => {
        focusTarget.current?.focus();
      }}
      ref={ref}
      required={required}
      // A list box rather than a drop-down: a drop-down always selects its
      // first option, so an empty single value would need a placeholder.
      size={2}
      tabIndex={-1}
    >
      {options.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
};
