import type { Rule } from './rules/rules';

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

/** Attributes spread onto the input element itself. */
export type FieldInput = {
  name: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number | string;
  max?: number | string;
  step?: number | 'any';
  defaultValue?: string;
  defaultChecked?: boolean;
};

/**
 * One field as derived from the schema. Serializable on purpose: it crosses the
 * RSC boundary as props, which is what keeps zod out of the client bundle.
 */
export type DerivedField = {
  input: FieldInput;
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

export type FormFields<
  FieldPath extends string = string,
  ArrayPath extends string = string,
> = {
  fields: Record<FieldPath, DerivedField>;
  arrays: Record<ArrayPath, DerivedArray>;
  /** Checks HTML has no attribute for, evaluated identically on both sides. */
  rules: Rule[];
  /** Checks that HTML cannot express. Reported once, never silently discarded. */
  dropped: DroppedCheck[];
};

/**
 * What a Server Action hands back to the form. Keys are dotted paths, so an
 * error on a row reads as `items[1].name`.
 */
export type FormState = {
  errors?: Record<string, string>;
  /**
   * Submitted values for re-render. Secret fields are never included; a name
   * several controls share — a checkbox group — echoes as an array.
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
