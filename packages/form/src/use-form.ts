'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FocusEvent, Ref, SyntheticEvent } from 'react';

import type {
  DerivedField,
  DerivedFields,
  FieldInput,
  FormState,
  ValidityFlag,
} from './types';

const FLAGS: ValidityFlag[] = [
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'tooShort',
  'tooLong',
  'rangeUnderflow',
  'rangeOverflow',
  'stepMismatch',
  'badInput',
];

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const isControl = (target: EventTarget | null): target is Control =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLSelectElement ||
  target instanceof HTMLTextAreaElement;

/**
 * Pick the message for whichever check the browser says failed. `customError`
 * is honoured first: it is set deliberately by the caller, so it outranks any
 * built-in flag.
 */
const messageFor = (
  control: Control,
  field: DerivedField,
): string | undefined => {
  const { validity } = control;
  if (validity.valid) {
    return undefined;
  }
  if (validity.customError) {
    return control.validationMessage;
  }
  for (const flag of FLAGS) {
    if (validity[flag]) {
      return field.messages[flag];
    }
  }
  return undefined;
};

export type FieldView = {
  input: FieldInput;
  error: string | undefined;
  invalid: boolean;
  required: boolean;
};

export type UseFormReturn<Keys extends string> = {
  props: {
    noValidate: true;
    onBlur: (event: FocusEvent<HTMLFormElement>) => void;
    onInput: (event: SyntheticEvent<HTMLFormElement>) => void;
    ref: Ref<HTMLFormElement>;
  };
  field: (name: Keys) => FieldView;
};

/**
 * Wire derived fields to a form.
 *
 * Values are never copied into React state — the DOM holds them. What lives
 * here is only what the DOM cannot express: which message to show for a field
 * the browser has judged invalid, and which server errors are still current.
 */
export const useForm = <Keys extends string>(
  fields: DerivedFields<Keys>,
  state: FormState<Keys>,
): UseFormReturn<Keys> => {
  const formRef = useRef<HTMLFormElement>(null);
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<Keys, string>>
  >({});
  const [edited, setEdited] = useState<ReadonlySet<string>>(new Set());
  const lastState = useRef(state);

  // A fresh result from the server supersedes everything the client worked out
  // before the submit, including which fields the person had already fixed.
  useEffect(() => {
    if (lastState.current === state) {
      return;
    }
    lastState.current = state;
    setClientErrors({});
    setEdited(new Set());

    // Moving focus to the first rejected field is the only way someone using a
    // screen reader learns the submit failed and where.
    const firstErrored = Object.keys(state.errors ?? {})[0];
    if (firstErrored !== undefined) {
      const control = formRef.current?.elements.namedItem(firstErrored);
      if (control instanceof HTMLElement) {
        control.focus();
      }
    }
  }, [state]);

  const evaluate = useCallback(
    (target: EventTarget | null, onlyIfShown: boolean) => {
      if (!isControl(target)) {
        return;
      }
      const name = target.name as Keys;
      const field = fields[name] as DerivedField | undefined;
      if (field === undefined) {
        return;
      }
      setClientErrors((previous) => {
        // While typing, an error is only refreshed once it is already on screen.
        // Raising a new one mid-word is what `:user-invalid` exists to avoid.
        if (onlyIfShown && previous[name] === undefined) {
          return previous;
        }
        const message = messageFor(target, field);
        if (previous[name] === message) {
          return previous;
        }
        if (message === undefined) {
          const { [name]: _cleared, ...rest } = previous;
          return rest as Partial<Record<Keys, string>>;
        }
        return { ...previous, [name]: message };
      });
    },
    [fields],
  );

  const onBlur = useCallback(
    (event: FocusEvent<HTMLFormElement>) => {
      evaluate(event.target, false);
    },
    [evaluate],
  );

  const onInput = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      const { target } = event;
      if (isControl(target)) {
        setEdited((previous) =>
          previous.has(target.name)
            ? previous
            : new Set(previous).add(target.name),
        );
      }
      evaluate(target, true);
    },
    [evaluate],
  );

  const field = useCallback(
    (name: Keys): FieldView => {
      const derived = fields[name];
      const serverError = edited.has(name) ? undefined : state.errors?.[name];
      const error = clientErrors[name] ?? serverError;
      const value = state.values?.[name];

      return {
        input:
          value === undefined
            ? derived.input
            : { ...derived.input, defaultValue: value },
        error,
        invalid: error !== undefined,
        required: derived.input.required ?? false,
      };
    },
    [fields, clientErrors, edited, state],
  );

  return {
    props: { noValidate: true, onBlur, onInput, ref: formRef },
    field,
  };
};
