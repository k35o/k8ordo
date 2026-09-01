'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FocusEvent, Ref, SyntheticEvent } from 'react';

import type {
  DerivedField,
  FieldInput,
  FormFields,
  FormState,
  ValidityFlag,
} from './types';

const INDEX = '{index}';

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

export type RowView = {
  key: string;
  index: number;
  field: (itemKey?: string) => FieldView;
  remove: () => void;
};

export type ArrayView = {
  rows: RowView[];
  add: () => void;
  canAdd: boolean;
  canRemove: boolean;
  error: string | undefined;
};

export type UseFormReturn<
  FieldPath extends string = string,
  ArrayPath extends string = string,
> = {
  props: {
    noValidate: true;
    onBlur: (event: FocusEvent<HTMLFormElement>) => void;
    onInput: (event: SyntheticEvent<HTMLFormElement>) => void;
    ref: Ref<HTMLFormElement>;
  };
  field: (path: FieldPath) => FieldView;
  array: (path: ArrayPath) => ArrayView;
  /** True once any field differs from the value it was rendered with. */
  isDirty: boolean;
};

const initialRows = (
  fields: FormFields,
  state: FormState,
): Record<string, string[]> => {
  const rows: Record<string, string[]> = {};
  for (const [path, array] of Object.entries(fields.arrays)) {
    const count = state.rows?.[path] ?? array.minItems ?? 0;
    rows[path] = Array.from(
      { length: count },
      (_, index) => `${path}-${String(index)}`,
    );
  }
  return rows;
};

/**
 * Wire derived fields to a form.
 *
 * Values are never copied into React state — the DOM holds them. What lives
 * here is only what the DOM cannot express: which message to show for a field
 * the browser has judged invalid, which server errors are still current, and
 * the identity of each repeated row.
 */
export const useForm = <FieldPath extends string, ArrayPath extends string>(
  fields: FormFields<FieldPath, ArrayPath>,
  state: FormState,
): UseFormReturn<FieldPath, ArrayPath> => {
  const lookup = fields as FormFields;
  const formRef = useRef<HTMLFormElement>(null);
  const nextKey = useRef(0);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [edited, setEdited] = useState<ReadonlySet<string>>(new Set());
  const [isDirty, setIsDirty] = useState(false);
  const [rowKeys, setRowKeys] = useState(() => initialRows(lookup, state));
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
      const field = fieldFor(lookup, target.name);
      if (field === undefined) {
        return;
      }
      const { name } = target;
      setClientErrors((previous) => {
        // While typing, an error is only refreshed once it is already on
        // screen. Raising a new one mid-word is what `:user-invalid` avoids.
        if (onlyIfShown && previous[name] === undefined) {
          return previous;
        }
        const message = messageFor(target, field);
        if (previous[name] === message) {
          return previous;
        }
        if (message === undefined) {
          const { [name]: _cleared, ...rest } = previous;
          return rest;
        }
        return { ...previous, [name]: message };
      });
    },
    [lookup],
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
        // Read back from the DOM rather than tracking values: one boolean that
        // flips at most twice, so this cannot become a per-keystroke re-render.
        setIsDirty(isFormDirty(formRef.current));
      }
      evaluate(target, true);
    },
    [evaluate],
  );

  const viewOf = useCallback(
    (field: DerivedField, name: string): FieldView => {
      const serverError = edited.has(name) ? undefined : state.errors?.[name];
      const error = clientErrors[name] ?? serverError;
      const value = state.values?.[name];
      const input = { ...field.input, name };

      return {
        input: value === undefined ? input : { ...input, defaultValue: value },
        error,
        invalid: error !== undefined,
        required: field.input.required ?? false,
      };
    },
    [clientErrors, edited, state],
  );

  const field = useCallback(
    (path: FieldPath): FieldView => {
      const derived = lookup.fields[path];
      if (derived === undefined) {
        throw new Error(
          `[@k8ordo/form] スキーマに '${path}' がありません。繰り返しの中の欄なら array('...') を使ってください。`,
        );
      }
      return viewOf(derived, derived.input.name);
    },
    [lookup, viewOf],
  );

  const array = useCallback(
    (path: ArrayPath): ArrayView => {
      const derived = lookup.arrays[path];
      if (derived === undefined) {
        throw new Error(
          `[@k8ordo/form] スキーマに配列 '${path}' がありません。`,
        );
      }
      const keys = rowKeys[path] ?? [];

      const remove = (key: string): void => {
        setRowKeys((previous) => ({
          ...previous,
          [path]: (previous[path] ?? []).filter(
            (candidate) => candidate !== key,
          ),
        }));
      };

      return {
        rows: keys.map((key, index) => ({
          key,
          index,
          field: (itemKey = '') => {
            const item = derived.item[itemKey];
            if (item === undefined) {
              throw new Error(
                `[@k8ordo/form] 配列 '${path}' に '${itemKey}' がありません。`,
              );
            }
            return viewOf(item, item.input.name.replace(INDEX, String(index)));
          },
          remove: () => {
            remove(key);
          },
        })),
        add: () => {
          nextKey.current += 1;
          const key = `${path}-new-${String(nextKey.current)}`;
          setRowKeys((previous) => ({
            ...previous,
            [path]: [...(previous[path] ?? []), key],
          }));
        },
        canAdd:
          derived.maxItems === undefined || keys.length < derived.maxItems,
        canRemove: keys.length > (derived.minItems ?? 0),
        error: state.errors?.[path],
      };
    },
    [lookup, rowKeys, state, viewOf],
  );

  const props = useMemo(
    () => ({ noValidate: true as const, onBlur, onInput, ref: formRef }),
    [onBlur, onInput],
  );

  return { props, field, array, isDirty };
};

/** Look up the derived field for a submitted name, row index included. */
const fieldFor = (
  fields: FormFields,
  name: string,
): DerivedField | undefined => {
  const direct = fields.fields[name];
  if (direct !== undefined) {
    return direct;
  }
  const template = name.replaceAll(/\[\d+\]/gu, `[${INDEX}]`);
  for (const array of Object.values(fields.arrays)) {
    for (const item of Object.values(array.item)) {
      if (item.input.name === template) {
        return item;
      }
    }
  }
  return undefined;
};

const isFormDirty = (form: HTMLFormElement | null): boolean => {
  if (form === null) {
    return false;
  }
  for (const element of form.elements) {
    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox' || element.type === 'radio') {
        if (element.checked !== element.defaultChecked) {
          return true;
        }
      } else if (element.value !== element.defaultValue) {
        return true;
      }
    } else if (
      element instanceof HTMLTextAreaElement &&
      element.value !== element.defaultValue
    ) {
      return true;
    }
  }
  return false;
};
