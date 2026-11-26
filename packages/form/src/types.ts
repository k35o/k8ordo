import type { ArrayPathsOf, FieldInputsOf } from './paths';
import type { FormDefinition } from './rules/define-form';
import type { DerivedRule } from './rules/rules';
import type { ObjectSchema } from './schema/object-schema';

/** ValidityState flags a derived field can report a message for. */
export type ValidityFlag =
  | 'badInput'
  | 'patternMismatch'
  | 'rangeOverflow'
  | 'rangeUnderflow'
  | 'stepMismatch'
  | 'tooLong'
  | 'tooShort'
  | 'typeMismatch'
  | 'valueMissing';

/**
 * Attributes spread onto the input element itself, for a field whose control
 * the schema's type does not settle: a string (`type` is `email`, `date`,
 * `password` and the like, and absent for plain text), an enum, and anything
 * read through a union, a pipe or a literal.
 */
export type FieldInput = {
  name: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  /** Comma-separated mime types for a file control, from `.mime()`. */
  accept?: string;
  min?: number;
  max?: number;
  step?: number | 'any';
  defaultValue?: string;
  defaultChecked?: boolean;
};

/** The input of a `z.coerce.number()` field. */
export type NumberInput = {
  name: string;
  type: 'number';
  required?: boolean;
  min?: number;
  max?: number;
  /** From `.multipleOf()`; `1` after `.int()`, `'any'` otherwise. */
  step: number | 'any';
  /** The submitted text, echoed after a failed submission. */
  defaultValue?: string;
};

/** The input of a checkbox read as checked or not (`z.boolean()`). */
export type CheckboxInput = {
  name: string;
  type: 'checkbox';
  required?: boolean;
  defaultChecked?: boolean;
};

/**
 * The input of a checkbox whose schema reads the submitted string
 * (`z.stringbool()`): it also carries what a checked box submits.
 */
export type StringCheckboxInput = CheckboxInput & {
  /** The schema's own spelling of `true`. */
  value: string;
};

/**
 * The input of a `z.file()` field. It has no `defaultValue`: no browser lets
 * a value be put back into a file control.
 */
export type FileInput = {
  name: string;
  type: 'file';
  required?: boolean;
  /** Comma-separated mime types, from `.mime()`. */
  accept?: string;
};

export type AnyFieldInput = FieldInput & { value?: string };

/**
 * One field as derived from the schema. Serializable on purpose: it crosses the
 * RSC boundary as props, which is what keeps zod out of the client bundle.
 */
export type DerivedField<Input = FieldInput> = {
  input: Input;
  /** Message per ValidityState flag, taken from zod itself. */
  messages: Partial<Record<ValidityFlag, string>>;
  /** True when the input must not be echoed back after a failed submit. */
  secret: boolean;
};

/**
 * A repeatable group. The item is described once; the row index is filled into
 * the name when a row renders, because rows do not exist until then.
 */
export type DerivedArray = {
  path: string;
  minItems?: number;
  maxItems?: number;
  /** Keyed by the path within one item; '' when the array holds scalars. */
  item: Record<string, DerivedField>;
};

/** What a constraint-carrying check lost on its way to HTML. */
export type DroppedCheck = {
  field: string;
  reason: string;
};

export type SchemaOf<Source extends ObjectSchema | FormDefinition> =
  Source extends FormDefinition<infer Schema> ? Schema : Source;

/**
 * What `formFields` derives from a schema or a `defineForm` definition, typed
 * from that schema: `FormFields<typeof talkSchema>` is what `formFields`
 * returns for it. The import is type-only, so zod stays out of the bundle.
 */
export type FormFields<Source extends ObjectSchema | FormDefinition> = FieldsBy<
  FieldInputsOf<SchemaOf<Source>>,
  ArrayPathsOf<SchemaOf<Source>>
>;

/**
 * `FormFields` spelled out by what it holds rather than by the schema, so
 * `useForm` can infer it from the structure of any value of that shape.
 */
export type FieldsBy<Inputs, ArrayPath extends string> = {
  fields: { [Path in keyof Inputs]: DerivedField<Inputs[Path]> };
  arrays: Record<ArrayPath, DerivedArray>;
  /**
   * Checks HTML has no attribute for, each run by the same evaluator on both
   * sides. A function message has already been called.
   */
  rules: DerivedRule[];
  /**
   * Checks that HTML cannot express, returned instead of silently discarded.
   * Not every such check is listed yet; the guide names the gaps.
   */
  dropped: DroppedCheck[];
};

/**
 * What a Server Action hands back to the form. Keys are dotted paths, so an
 * error on a row reads as `items[1].name`.
 */
export type FormState = {
  errors?: Record<string, string>;
  /**
   * Submitted values for re-render. Secret fields and files are never
   * included; a checkbox group echoes as an array however many boxes were
   * checked, and any other name submitted more than once as an array too.
   */
  values?: Record<string, string | string[]>;
  /** How many rows each array had, so a no-JS retry rebuilds them. */
  rows?: Record<string, number>;
  /** An error about the submission as a whole rather than one field. */
  formError?: string;
  /**
   * Identity of one parse. Two identical failed submissions must still read
   * as two on the client — content alone cannot tell them apart.
   */
  token?: string;
};
