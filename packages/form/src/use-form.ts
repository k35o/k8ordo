'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { FocusEvent, Ref, SubmitEvent, SyntheticEvent } from 'react';

import { breachOf } from './rules/rules';
import type {
  DerivedField,
  FieldInput,
  FormFields,
  FormState,
  StringCheckboxInput,
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

const isControl = (target: unknown): target is Control =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLSelectElement ||
  target instanceof HTMLTextAreaElement;

/**
 * A name shared by several controls — a checkbox group — comes back as a
 * RadioNodeList. Validity belongs to an element, so the group reports through
 * its first member.
 */
const controlNamed = (
  form: HTMLFormElement | null,
  name: string,
): Control | undefined => {
  if (form === null) {
    return undefined;
  }
  const found = form.elements.namedItem(name);
  if (isControl(found)) {
    return found;
  }
  if (found instanceof RadioNodeList) {
    const first = found.item(0);
    return isControl(first) ? first : undefined;
  }
  return undefined;
};

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

export type FieldView<Input extends FieldInput = FieldInput> = {
  input: Input;
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

export type FormErrorView = {
  /** `state.formError`: the failure no field owns. */
  message: string | undefined;
  /** Spread onto the element that shows `message`, so focus can land on it. */
  props: { id: string; tabIndex: -1 };
};

export type UseFormReturn<
  FieldPath extends string = string,
  ArrayPath extends string = string,
  StringCheckboxPath extends string = never,
> = {
  props: {
    onBlur: (event: FocusEvent<HTMLFormElement>) => void;
    onInput: (event: SyntheticEvent<HTMLFormElement>) => void;
    onReset: () => void;
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
    ref: Ref<HTMLFormElement>;
  };
  field: {
    (path: StringCheckboxPath): FieldView<StringCheckboxInput>;
    (path: FieldPath): FieldView;
  };
  array: (path: ArrayPath) => ArrayView;
  formError: FormErrorView;
  /** True once any field differs from the value it was rendered with. */
  isDirty: boolean;
};

const rowCountsFor = (
  fields: FormFields,
  state: FormState,
): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const [path, array] of Object.entries(fields.arrays)) {
    counts[path] = state.rows?.[path] ?? array.minItems ?? 0;
  }
  return counts;
};

const rowKeysFor = (
  counts: Record<string, number>,
  current: Record<string, string[]> = {},
): Record<string, string[]> => {
  const rows: Record<string, string[]> = {};
  for (const [path, count] of Object.entries(counts)) {
    const kept = current[path];
    // 行数が同じなら、サーバーは送られた順に番号を振っただけで、同じ行を指している。
    // key を振り直すと行が作り直され、送信失敗で移したフォーカスや、エコーのない
    // 値まで消える
    rows[path] =
      kept?.length === count
        ? kept
        : Array.from(
            { length: count },
            (_, index) => `${path}-${String(index)}`,
          );
  }
  return rows;
};

/**
 * Rename one concrete indexed name after the row at `removed` is gone: entries
 * on that row are dropped, entries on later rows slide down one index. Without
 * this, a message raised on `items[1].name` would reattach to whichever row
 * renders as index 1 next.
 */
const shiftName = (
  name: string,
  path: string,
  removed: number,
): string | null => {
  const prefix = `${path}[`;
  if (!name.startsWith(prefix)) {
    return name;
  }
  const close = name.indexOf(']', prefix.length);
  const index = Number(name.slice(prefix.length, close));
  if (!Number.isInteger(index)) {
    return name;
  }
  if (index === removed) {
    return null;
  }
  if (index > removed) {
    return `${prefix}${String(index - 1)}${name.slice(close)}`;
  }
  return name;
};

const shiftRecord = (
  record: Record<string, string>,
  path: string,
  removed: number,
): Record<string, string> => {
  const next: Record<string, string> = {};
  for (const [name, value] of Object.entries(record)) {
    const renamed = shiftName(name, path, removed);
    if (renamed !== null) {
      next[renamed] = value;
    }
  }
  return next;
};

const shiftSet = (
  set: ReadonlySet<string>,
  path: string,
  removed: number,
): ReadonlySet<string> => {
  const next = new Set<string>();
  for (const name of set) {
    const renamed = shiftName(name, path, removed);
    if (renamed !== null) {
      next.add(renamed);
    }
  }
  return next;
};

/**
 * Wire derived fields to a form.
 *
 * Values are never copied into React state — the DOM holds them. What lives
 * here is only what the DOM cannot express: which message to show for a field
 * the browser has judged invalid, which server errors are still current, the
 * identity of each repeated row, one dirty flag, and the row counts adding or
 * removing a row is measured against.
 */
export const useForm = <
  FieldPath extends string,
  ArrayPath extends string,
  StringCheckboxPath extends string = never,
>(
  fields: FormFields<FieldPath, ArrayPath, StringCheckboxPath>,
  state: FormState = {},
): UseFormReturn<FieldPath, ArrayPath, StringCheckboxPath> => {
  const lookup = fields as FormFields<string, string, string>;
  const formRef = useRef<HTMLFormElement>(null);
  const nextKey = useRef(0);
  // Messages applyRules wrote, so it never erases one it does not own — an
  // async check shares the same customValidity slot.
  const ownedRuleMessages = useRef(new Map<string, string>());
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [edited, setEdited] = useState<ReadonlySet<string>>(new Set());
  const [domDirty, setDomDirty] = useState(false);
  // The row counts the current server state rendered with; more or fewer rows
  // than this is a structural edit even while every control is pristine. It is
  // state rather than a ref because `isDirty` is read during render.
  const [baselineRows, setBaselineRows] = useState(() =>
    rowCountsFor(lookup, state),
  );
  const [rowKeys, setRowKeys] = useState(() => rowKeysFor(baselineRows));
  // The form-level message is found by id, not by a ref: it is usually drawn
  // by an alert component that passes HTML attributes through but not a ref.
  const formErrorId = useId();

  // Compared by content plus the parse token, not identity. A caller writing
  // `useForm(fields, {})` hands over a new object on every render, and
  // resetting on identity would wipe the message the blur just produced. The
  // token is what keeps two identical failed submissions distinguishable.
  const stateKey = JSON.stringify(state);
  const lastKey = useRef(stateKey);

  // A fresh result from the server supersedes everything the client worked out
  // before the submit, including which fields the person had already fixed and
  // how many rows there are.
  useEffect(() => {
    if (lastKey.current === stateKey) {
      return;
    }
    lastKey.current = stateKey;
    setClientErrors({});
    setEdited(new Set());
    setDomDirty(false);
    const counts = rowCountsFor(lookup, state);
    setBaselineRows(counts);
    setRowKeys((previous) => rowKeysFor(counts, previous));

    // Moving focus to the first failure is the only way someone using a
    // screen reader learns the submit failed and where.
    firstFailure(formRef.current, state, formErrorId)?.focus();
  }, [stateKey, state, lookup, formErrorId]);

  const evaluate = useCallback(
    (target: EventTarget | null, onlyIfShown: boolean) => {
      if (!isControl(target)) {
        return;
      }
      const form = formRef.current;
      // Rules run before the messages are read, so a field made invalid by
      // another field's value reports it on the very same pass.
      applyRules(form, lookup.rules, ownedRuleMessages.current);

      // The edit may have raised or cleared a breach on a control the event
      // never touched, so every rule field is re-read alongside the target.
      const names = new Set<string>([target.name]);
      for (const rule of lookup.rules) {
        names.add(rule.field);
      }

      setClientErrors((previous) => {
        let next = previous;
        for (const name of names) {
          const field = fieldFor(lookup, name);
          if (field === undefined) {
            continue;
          }
          // Read the same representative applyRules writes to — for a group,
          // the first member — falling back to the event target itself.
          const control =
            controlNamed(form, name) ??
            (name === target.name ? target : undefined);
          if (control === undefined) {
            continue;
          }
          // While typing, an error is only refreshed once it is already on
          // screen — raising a new one mid-word is what `:user-invalid`
          // avoids. A field the person is not even editing never gains one.
          const gate = name === target.name ? onlyIfShown : true;
          if (gate && next[name] === undefined) {
            continue;
          }
          const message = messageFor(control, field);
          if (next[name] === message) {
            continue;
          }
          if (message === undefined) {
            const { [name]: _cleared, ...rest } = next;
            next = rest;
          } else {
            next = { ...next, [name]: message };
          }
        }
        return next;
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
        setDomDirty(isFormDirty(formRef.current));
      }
      evaluate(target, true);
    },
    [evaluate],
  );

  // noValidate でブラウザの検証を外した代わりに、送信のたびにここで同じ検証を
  // する。触っていない欄も含めて全欄を読み、1 つでも失敗すれば送信を止めて、
  // 画面の順で最初に失敗した欄へフォーカスを移す。決めるのは今までどおり
  // サーバーで、ここはサーバーに届く前にブラウザが止めていた分を取り戻すだけ
  const onSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      const { submitter } = event;
      if (
        (submitter instanceof HTMLButtonElement ||
          submitter instanceof HTMLInputElement) &&
        submitter.formNoValidate
      ) {
        return;
      }
      const form = event.currentTarget;
      // ルールはどの欄のイベントでも走るが、誰も触っていなければまだ一度も
      // 走っていない
      applyRules(form, lookup.rules, ownedRuleMessages.current);
      const failed = firstFailed(
        form,
        (control) => control.willValidate && !control.validity.valid,
      );
      if (failed === undefined) {
        return;
      }
      event.preventDefault();
      setClientErrors(messagesIn(form, lookup));
      failed.focus();
    },
    [lookup],
  );

  // The values go back to what the form was rendered with — a reset button,
  // `form.reset()`, or React itself after every form action — so what the
  // hook remembered about the old values goes with them.
  const onReset = useCallback(() => {
    setClientErrors({});
    setEdited(new Set());
    const counts = rowCountsFor(lookup, state);
    setBaselineRows(counts);
    setRowKeys((previous) => rowKeysFor(counts, previous));
    // A rule's message is not a value, so a reset leaves it on the control.
    const form = formRef.current;
    for (const [name, message] of ownedRuleMessages.current) {
      const control = controlNamed(form, name);
      if (control?.validationMessage === message) {
        control.setCustomValidity('');
      }
    }
    ownedRuleMessages.current.clear();
    // Not assumed clean: the event fires before the browser restores the
    // controls, and a `HiddenValue` is never restored at all — it is the
    // caller's state, which React writes straight back. A task later the
    // reset is through, and the DOM says what is still different.
    setTimeout(() => {
      setDomDirty(isFormDirty(formRef.current));
    }, 0);
  }, [lookup, state]);

  const viewOf = useCallback(
    (
      field: DerivedField<StringCheckboxInput>,
      name: string,
    ): FieldView<StringCheckboxInput> => {
      const serverError = edited.has(name) ? undefined : state.errors?.[name];
      const error = clientErrors[name] ?? serverError;
      const value = state.values?.[name];
      const input: StringCheckboxInput = { ...field.input, name };

      if (field.input.type === 'checkbox') {
        // An unchecked box is simply absent from the echo, so presence is the
        // whole answer — defaultValue would only set the value attribute.
        if (state.values !== undefined) {
          input.defaultChecked = value !== undefined;
        }
      } else if (typeof value === 'string') {
        input.defaultValue = value;
      }
      // An array echo (a checkbox group) has no single defaultValue; the
      // caller restores it per option from state.values.

      return {
        input,
        error,
        invalid: error !== undefined,
        required: field.input.required ?? false,
      };
    },
    [clientErrors, edited, state],
  );

  const field = useCallback(
    (path: string): FieldView<StringCheckboxInput> => {
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
        const index = keys.indexOf(key);
        if (index === -1) {
          return;
        }
        setRowKeys((previous) => ({
          ...previous,
          [path]: (previous[path] ?? []).filter(
            (candidate) => candidate !== key,
          ),
        }));
        // Client bookkeeping is keyed by concrete indexed names, which have
        // just shifted under it.
        setClientErrors((previous) => shiftRecord(previous, path, index));
        setEdited((previous) => shiftSet(previous, path, index));
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

  // `noValidate` is set from JavaScript, never rendered: in the HTML the
  // server sends, native validation stays on, so a person without JavaScript
  // keeps the browser's own checks instead of losing both layers.
  const ref = useCallback((node: HTMLFormElement | null) => {
    formRef.current = node;
    if (node !== null) {
      node.noValidate = true;
    }
  }, []);

  const props = useMemo(
    () => ({ onBlur, onInput, onReset, onSubmit, ref }),
    [onBlur, onInput, onReset, onSubmit, ref],
  );

  const formError = useMemo(
    (): FormErrorView => ({
      message: state.formError,
      props: { id: formErrorId, tabIndex: -1 },
    }),
    [state.formError, formErrorId],
  );

  const structuralDirty = Object.entries(rowKeys).some(
    ([path, keys]) => keys.length !== (baselineRows[path] ?? 0),
  );

  return {
    props,
    field,
    array,
    formError,
    isDirty: domDirty || structuralDirty,
  };
};

/**
 * The first failure in document order: a failed control, or the form-level
 * message. `state.errors` cannot say which comes first — its keys follow the
 * order zod reported the issues in, which is the schema's, not the page's.
 */
const firstFailure = (
  form: HTMLFormElement | null,
  state: FormState,
  formErrorId: string,
): HTMLElement | undefined => {
  if (form === null) {
    return undefined;
  }
  const errors = state.errors ?? {};
  const field = firstFailed(
    form,
    (control) => errors[control.name] !== undefined,
  );
  const message =
    state.formError === undefined
      ? null
      : form.ownerDocument.querySelector<HTMLElement>(
          `#${CSS.escape(formErrorId)}`,
        );
  if (message === null) {
    return field;
  }
  if (field === undefined) {
    return message;
  }
  return message.compareDocumentPosition(field) &
    Node.DOCUMENT_POSITION_FOLLOWING
    ? message
    : field;
};

/** The first control in document order that `failed` picks out. */
const firstFailed = (
  form: HTMLFormElement,
  failed: (control: Control) => boolean,
): Control | undefined =>
  [...form.elements].find(
    (element): element is Control => isControl(element) && failed(element),
  );

/**
 * The message every field of the form shows right now, read from the DOM —
 * the untouched fields included, which is what a submit has to report.
 */
const messagesIn = (
  form: HTMLFormElement,
  fields: FormFields,
): Record<string, string> => {
  const messages: Record<string, string> = {};
  for (const element of form.elements) {
    if (!isControl(element) || Object.hasOwn(messages, element.name)) {
      continue;
    }
    const field = fieldFor(fields, element.name);
    // A group reports through its first member, as `evaluate` reads it.
    const control = controlNamed(form, element.name);
    if (field === undefined || control === undefined) {
      continue;
    }
    const message = messageFor(control, field);
    if (message !== undefined) {
      messages[element.name] = message;
    }
  }
  return messages;
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

/**
 * Apply the cross-field rules to the live form. `setCustomValidity` is what
 * makes the result indistinguishable from a built-in check: `:user-invalid`
 * lights up, `validity.customError` is set, and the message flows through the
 * same path as every other one.
 *
 * `owned` records what this function wrote, so a clean pass only clears its
 * own message — never an async check's answer sharing the same slot.
 */
const applyRules = (
  form: HTMLFormElement | null,
  rules: FormFields['rules'],
  owned: Map<string, string>,
): void => {
  if (form === null) {
    return;
  }
  const data = new FormData(form);
  const values = (name: string): string[] =>
    data.getAll(name).filter((value) => typeof value === 'string');

  const breaches = new Map<string, string>();
  const involved = new Set<string>();
  for (const rule of rules) {
    involved.add(rule.field);
    if (!breaches.has(rule.field)) {
      const breach = breachOf(rule, values);
      if (breach !== undefined) {
        breaches.set(rule.field, breach);
      }
    }
  }

  for (const name of involved) {
    const control = controlNamed(form, name);
    if (control === undefined) {
      continue;
    }
    const breach = breaches.get(name);
    if (breach !== undefined) {
      control.setCustomValidity(breach);
      owned.set(name, breach);
    } else if (owned.has(name)) {
      if (control.validationMessage === owned.get(name)) {
        control.setCustomValidity('');
      }
      owned.delete(name);
    }
  }
};

const isFormDirty = (form: HTMLFormElement | null): boolean => {
  if (form === null) {
    return false;
  }
  for (const element of form.elements) {
    if (element instanceof HTMLInputElement) {
      // A `HiddenValue` input is controlled, so React keeps defaultValue in
      // step with value; its snapshot of the first render is the baseline.
      const { initial } = element.dataset;
      if (initial !== undefined) {
        if (element.value !== initial) {
          return true;
        }
      } else if (element.type === 'checkbox' || element.type === 'radio') {
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
    } else if (element instanceof HTMLSelectElement && isSelectDirty(element)) {
      return true;
    }
  }
  return false;
};

/**
 * A drop-down with no option marked as the default still shows one — its
 * first option — and a reset goes back to that one too, so the baseline is
 * the option a reset would select, not each option's `defaultSelected`.
 */
const isSelectDirty = (select: HTMLSelectElement): boolean => {
  const options = [...select.options];
  if (select.multiple) {
    return options.some((option) => option.selected !== option.defaultSelected);
  }
  const defaults = options.filter((option) => option.defaultSelected);
  const baseline =
    defaults.at(-1) ??
    (select.size > 1 ? undefined : options.find((option) => !option.disabled));
  return select.selectedIndex !== (baseline?.index ?? -1);
};
