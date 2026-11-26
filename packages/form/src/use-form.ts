'use client';

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { FocusEvent, Ref, SubmitEvent, SyntheticEvent } from 'react';

import type { ArrayInputsOf, FieldInputsOf } from './paths';
import type { FormDefinition } from './rules/define-form';
import { breachOf } from './rules/rules';
import type { DerivedRule } from './rules/rules';
import type { ObjectSchema } from './schema/object-schema';
import type {
  AnyDerivedArray,
  AnyFieldInput,
  ArrayPathOf,
  DerivedField,
  FieldInput,
  FieldsBy,
  FormState,
  ItemInputsOf,
  SchemaOf,
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

type Fields = {
  fields: Record<string, DerivedField<AnyFieldInput>>;
  arrays: Record<string, AnyDerivedArray>;
  rules: DerivedRule[];
};

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
  field: DerivedField<AnyFieldInput>,
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

export type FieldView<Input = FieldInput> = {
  input: Input;
  error: string | undefined;
  invalid: boolean;
  required: boolean;
};

/**
 * One repeated row, named by the schema (or `defineForm` definition) and the
 * array's path, for a component that takes a whole row:
 * `{ row: RowView<typeof orderSchema, 'items'> }`.
 */
export type RowView<
  Source extends ObjectSchema | FormDefinition,
  Path extends ArrayPathOf<Source>,
> = RowViewBy<ItemInputsOf<Source, Path>>;

type RowViewBy<ItemInputs> = {
  key: string;
  index: number;
  /**
   * One field of the row, by its path within the item. A row of an array of
   * scalars is a single field, under `''`, so its key can be left out.
   */
  field: [keyof ItemInputs] extends ['']
    ? (itemKey?: '') => FieldView<ItemInputs[keyof ItemInputs]>
    : <Key extends keyof ItemInputs & string>(
        itemKey: Key,
      ) => FieldView<ItemInputs[Key]>;
  remove: () => void;
};

/**
 * What `form.array()` returns, named by the schema (or `defineForm`
 * definition) and the array's path: `ArrayView<typeof orderSchema, 'items'>`.
 */
export type ArrayView<
  Source extends ObjectSchema | FormDefinition,
  Path extends ArrayPathOf<Source>,
> = ArrayViewBy<ItemInputsOf<Source, Path>>;

type ArrayViewBy<ItemInputs> = {
  rows: Array<RowViewBy<ItemInputs>>;
  add: () => void;
  canAdd: boolean;
  canRemove: boolean;
  error: string | undefined;
  /** Spread onto the element that shows `error`, so focus can land on it. */
  errorProps: { id: string; tabIndex: -1 };
};

// ArrayViewBy<Record<string, AnyFieldInput>> では row.field の条件型と比べられず、
// 返すときの型の付け替え（as）が通らない。キーを文字列で受ける形を別に置く
type UntypedArrayView = Omit<
  ArrayViewBy<Record<string, AnyFieldInput>>,
  'rows'
> & {
  rows: Array<
    Omit<RowViewBy<Record<string, AnyFieldInput>>, 'field'> & {
      field: (itemKey?: string) => FieldView<AnyFieldInput>;
    }
  >;
};

export type FormErrorView = {
  /** `state.formError`: the failure no field owns. */
  message: string | undefined;
  /** Spread onto the element that shows `message`, so focus can land on it. */
  props: { id: string; tabIndex: -1 };
};

/**
 * What `useForm` returns for the fields `formFields` derived from a schema or
 * a `defineForm` definition: `UseFormReturn<typeof talkSchema>`.
 */
export type UseFormReturn<Source extends ObjectSchema | FormDefinition> =
  UseFormReturnBy<
    FieldInputsOf<SchemaOf<Source>>,
    ArrayInputsOf<SchemaOf<Source>>
  >;

type UseFormReturnBy<Inputs, Arrays> = {
  props: {
    onBlur: (event: FocusEvent<HTMLFormElement>) => void;
    onInput: (event: SyntheticEvent<HTMLFormElement>) => void;
    onReset: () => void;
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
    ref: Ref<HTMLFormElement>;
  };
  field: <Path extends keyof Inputs & string>(
    path: Path,
  ) => FieldView<Inputs[Path]>;
  array: <Path extends keyof Arrays & string>(
    path: Path,
  ) => ArrayViewBy<Arrays[Path]>;
  formError: FormErrorView;
  /** True once any field differs from the value it was rendered with. */
  isDirty: boolean;
  /**
   * Reads a control's validity again and shows what it says, as leaving the
   * control does — for a verdict that lands after the blur, such as
   * `useAsyncCheck`'s answer.
   */
  revalidate: (control: Control) => void;
};

const rowCountsFor = (
  fields: Fields,
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
 * What the hook worked out on the client since one server result: which
 * message to show for a field the browser judged invalid, which server errors
 * the person has edited past, whether the DOM differs from what was rendered,
 * and the rows. A new result supersedes all of it, and so does a reset.
 */
type Notes = {
  /** The result these notes belong to — its content plus its token. */
  readonly result: string;
  /** Whether that result arrived after the form was rendered. */
  readonly arrived: boolean;
  readonly clientErrors: Record<string, string>;
  readonly edited: ReadonlySet<string>;
  readonly domDirty: boolean;
  /**
   * The row counts the result rendered with; more or fewer rows than this is
   * a structural edit even while every control is pristine.
   */
  readonly baselineRows: Record<string, number>;
  readonly rowKeys: Record<string, string[]>;
};

const blankNotes = (
  result: string,
  arrived: boolean,
  fields: Fields,
  state: FormState,
  rowKeys?: Record<string, string[]>,
): Notes => {
  const baselineRows = rowCountsFor(fields, state);
  return {
    result,
    arrived,
    clientErrors: {},
    edited: new Set(),
    domDirty: false,
    baselineRows,
    rowKeys: rowKeysFor(baselineRows, rowKeys),
  };
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
export const useForm = <Inputs, Arrays>(
  fields: FieldsBy<Inputs, Arrays>,
  state: FormState = {},
): UseFormReturnBy<Inputs, Arrays> => {
  const lookup = fields as Fields;
  const formRef = useRef<HTMLFormElement>(null);
  const nextKey = useRef(0);
  // Messages applyRules wrote, so it never erases one it does not own — an
  // async check shares the same customValidity slot.
  const ownedRuleMessages = useRef(new Map<string, string>());
  // The messages no control owns — the form's, each array's — are found by id,
  // not by a ref: they are usually drawn by an alert component that passes
  // HTML attributes through but not a ref.
  const formErrorId = useId();
  const arrayErrorIdBase = useId();

  // A result is told apart by content plus the parse token, not identity: a
  // caller writing `useForm(fields, {})` hands over a new object on every
  // render, and the token keeps two identical failed submissions apart.
  const result = JSON.stringify(state);
  const [notes, setNotes] = useState(() =>
    blankNotes(result, false, lookup, state),
  );
  // A fresh result from the server supersedes everything the client worked out
  // before the submit, including which fields the person had already fixed and
  // how many rows there are — in the render that brings it, so no commit shows
  // the old notes beside the new result.
  if (notes.result !== result) {
    setNotes(blankNotes(result, true, lookup, state, notes.rowKeys));
  }
  const { clientErrors, edited, domDirty, baselineRows, rowKeys } = notes;

  // Moving focus to the first failure is the only way someone using a screen
  // reader learns the submit failed and where.
  const focusFirstFailure = useEffectEvent(() => {
    const messageIds = [
      ...(state.formError === undefined ? [] : [formErrorId]),
      ...Object.keys(lookup.arrays)
        .filter((path) => state.errors?.[path] !== undefined)
        .map((path) => arrayErrorId(arrayErrorIdBase, path)),
    ];
    firstFailure(formRef.current, state.errors ?? {}, messageIds)?.focus();
  });
  const { arrived } = notes;
  useEffect(() => {
    if (arrived) {
      focusFirstFailure();
    }
  }, [result, arrived]);

  // React は select の defaultValue をマウント時にしか反映しないので、あとから
  // 返ったエコーは option の defaultSelected へ直接書く。action の後の自動リセット
  // は同じコミットでこれより先に走るが、option の dirtiness を消すので、選択は
  // 書いた既定値に追従する。layout effect なのは、描画と、reset の 1 タスク後に
  // isDirty を DOM から読み直すのより先に済ませるため
  useLayoutEffect(() => {
    writeEchoToSelects(formRef.current, lookup, state.values);
  }, [lookup, state.values]);

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

      setNotes((previous) => {
        let next = previous.clientErrors;
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
        return next === previous.clientErrors
          ? previous
          : { ...previous, clientErrors: next };
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

  const revalidate = useCallback(
    (control: Control) => {
      evaluate(control, false);
    },
    [evaluate],
  );

  const onInput = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      const { target } = event;
      if (isControl(target)) {
        // Read back from the DOM rather than tracking values: one boolean that
        // flips at most twice, so this cannot become a per-keystroke re-render.
        const dirty = isFormDirty(formRef.current);
        setNotes((previous) =>
          previous.edited.has(target.name) && previous.domDirty === dirty
            ? previous
            : {
                ...previous,
                edited: previous.edited.has(target.name)
                  ? previous.edited
                  : new Set(previous.edited).add(target.name),
                domDirty: dirty,
              },
        );
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
      const messages = messagesIn(form, lookup);
      setNotes((previous) => ({ ...previous, clientErrors: messages }));
      failed.focus();
      // 文言を出せない欄（スキーマにない欄など）は、止めたうえに何も見せない
      // ことになる。noValidate が外すのは送信時の検査だけで、要素の
      // reportValidity() はブラウザ自身の吹き出しを出す
      if (!Object.hasOwn(messages, failed.name)) {
        failed.reportValidity();
      }
    },
    [lookup],
  );

  // The values go back to what the form was rendered with — a reset button,
  // `form.reset()`, or React itself after every form action — so what the
  // hook remembered about the old values goes with them.
  const onReset = useCallback(() => {
    setNotes((previous) =>
      blankNotes(
        previous.result,
        previous.arrived,
        lookup,
        state,
        previous.rowKeys,
      ),
    );
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
      const dirty = isFormDirty(formRef.current);
      setNotes((previous) =>
        previous.domDirty === dirty
          ? previous
          : { ...previous, domDirty: dirty },
      );
    }, 0);
  }, [lookup, state]);

  const viewOf = useCallback(
    (
      field: DerivedField<AnyFieldInput>,
      name: string,
    ): FieldView<AnyFieldInput> => {
      const serverError = edited.has(name) ? undefined : state.errors?.[name];
      const error = clientErrors[name] ?? serverError;
      const value = state.values?.[name];
      const input: AnyFieldInput = { ...field.input, name };

      if (field.group !== undefined) {
        if (value !== undefined) {
          input.defaultValue = [value].flat();
        }
      } else if (field.input.type === 'checkbox') {
        // An unchecked box is simply absent from the echo, so presence is the
        // whole answer — defaultValue would only set the value attribute.
        if (state.values !== undefined) {
          input.defaultChecked = value !== undefined;
        }
      } else if (typeof value === 'string') {
        input.defaultValue = value;
      }

      return {
        input,
        error,
        invalid: error !== undefined,
        required:
          field.group === undefined
            ? (field.input.required ?? false)
            : (field.group.minItems ?? 0) >= 1,
      };
    },
    [clientErrors, edited, state],
  );

  const field = useCallback(
    (path: string): FieldView<AnyFieldInput> => {
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
    (path: string): UntypedArrayView => {
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
        // Client bookkeeping is keyed by concrete indexed names, which have
        // just shifted under it.
        setNotes((previous) => ({
          ...previous,
          rowKeys: {
            ...previous.rowKeys,
            [path]: (previous.rowKeys[path] ?? []).filter(
              (candidate) => candidate !== key,
            ),
          },
          clientErrors: shiftRecord(previous.clientErrors, path, index),
          edited: shiftSet(previous.edited, path, index),
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
          setNotes((previous) => ({
            ...previous,
            rowKeys: {
              ...previous.rowKeys,
              [path]: [...(previous.rowKeys[path] ?? []), key],
            },
          }));
        },
        canAdd:
          derived.maxItems === undefined || keys.length < derived.maxItems,
        canRemove: keys.length > (derived.minItems ?? 0),
        error: state.errors?.[path],
        errorProps: { id: arrayErrorId(arrayErrorIdBase, path), tabIndex: -1 },
      };
    },
    [lookup, rowKeys, state, viewOf, arrayErrorIdBase],
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
    // 欄ごとの input の型はスキーマの型から決まり、実行時の表からは導けない。
    // formFields が同じスキーマから両方を作っているので、ここで型を付け替える
    field: field as UseFormReturnBy<Inputs, Arrays>['field'],
    array: array as UseFormReturnBy<Inputs, Arrays>['array'],
    formError,
    isDirty: domDirty || structuralDirty,
    revalidate,
  };
};

/**
 * An object key may hold whitespace, which an id must not — it would also
 * split an `aria-describedby` list — so the path is encoded, not appended.
 */
const arrayErrorId = (base: string, path: string): string =>
  `${base}-${encodeURIComponent(path)}`;

/**
 * The first failure in document order: a failed control, or the element
 * showing a failure no control owns — the form-level message or an array's
 * own. `state.errors` cannot say which comes first — its keys follow the
 * order zod reported the issues in, which is the schema's, not the page's.
 */
const firstFailure = (
  form: HTMLFormElement | null,
  errors: Record<string, string>,
  messageIds: readonly string[],
): HTMLElement | undefined => {
  if (form === null) {
    return undefined;
  }
  const candidates: HTMLElement[] = messageIds
    .map((id) =>
      form.ownerDocument.querySelector<HTMLElement>(`#${CSS.escape(id)}`),
    )
    .filter((message) => message !== null);
  const field = firstFailed(
    form,
    (control) => errors[control.name] !== undefined,
  );
  if (field !== undefined) {
    candidates.push(field);
  }
  return candidates.toSorted((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  )[0];
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
  fields: Fields,
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
  fields: Fields,
  name: string,
): DerivedField<AnyFieldInput> | undefined => {
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
  rules: Fields['rules'],
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

const writeEchoToSelects = (
  form: HTMLFormElement | null,
  fields: Fields,
  values: FormState['values'],
): void => {
  if (form === null || values === undefined) {
    return;
  }
  for (const element of form.elements) {
    // スキーマの外の select には、input に defaultValue を付けないのと同じく
    // 触らない
    if (
      !(element instanceof HTMLSelectElement) ||
      fieldFor(fields, element.name) === undefined
    ) {
      continue;
    }
    // disabled の select（fieldset ごと disabled なものも）は何も送っていないが、
    // チェックボックス群の欄は送らなくても [] で返り、エコーからは見分けられない。
    // 未選択と読むと既定値を消してしまう
    if (element.matches(':disabled')) {
      continue;
    }
    // エコーに無いのは送信時に無かった select で、これも何も送っていない
    const echoed = values[element.name];
    if (echoed === undefined) {
      continue;
    }
    const chosen = new Set([echoed].flat());
    for (const option of element.options) {
      option.defaultSelected = chosen.has(option.value);
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
