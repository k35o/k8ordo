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
  multiple?: boolean;
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

export type DerivedFields<Keys extends string = string> = Record<
  Keys,
  DerivedField
>;

/** What a constraint-carrying check lost on its way to HTML. */
export type DroppedCheck = {
  field: string;
  reason: string;
};

export type FormFields<Keys extends string = string> = {
  fields: DerivedFields<Keys>;
  /** Checks that HTML cannot express. Reported once, never silently discarded. */
  dropped: DroppedCheck[];
};

/** What a Server Action hands back to the form. */
export type FormState<Keys extends string = string> = {
  errors?: Partial<Record<Keys, string>>;
  /** Submitted values for re-render. Secret and file fields are never included. */
  values?: Partial<Record<Keys, string>>;
  /** An error about the submission as a whole rather than one field. */
  formError?: string;
};
