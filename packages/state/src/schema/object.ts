import { safeParse } from 'zod/v4/core';
import type { $ZodObject, $ZodShape, $ZodType } from 'zod/v4/core';

/**
 * The common ground between `zod` and `zod/mini`: both build on the shared
 * core object and both expose `shape`. Accepting this keeps the smaller entry
 * usable without losing the types.
 */
export type StateSchema<Shape extends $ZodShape = $ZodShape> =
  $ZodObject<Shape> & { shape: Shape };

export type StateValues = Record<string, unknown>;

export type SchemaInfo = {
  schema: StateSchema;
  shape: Readonly<Record<string, $ZodType>>;
  keys: readonly string[];
  defaults: Readonly<StateValues>;
};

/** Scalars compare with `Object.is`; arrays of scalars element-wise. */
export const sameValue = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true;
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((value, index) => Object.is(value, b[index]))
  );
};

export const isRecord = (value: unknown): value is StateValues =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const analyzeSchema = (
  schema: StateSchema,
  slot: string,
): SchemaInfo => {
  const shape: Readonly<Record<string, $ZodType>> = schema.shape;
  const keys = Object.keys(shape);

  // A slot's value can always be absent — a URL param missing, a fresh history
  // entry, restored state written by an older schema — so every field must
  // already parse from nothing. Failing at define time turns a guaranteed
  // runtime surprise into a module-load error with the fix in the message.
  const empty = safeParse(schema, {});
  if (!empty.success) {
    const failing = keys.filter(
      (key) => !safeParse(shape[key] as $ZodType, undefined).success,
    );
    throw new TypeError(
      `${slot} fields must tolerate absence — add .default() or .optional() to: ${failing.join(', ')}`,
    );
  }
  const defaults: StateValues = {};
  for (const key of keys) defaults[key] = (empty.data as StateValues)[key];

  return { schema, shape, keys, defaults };
};

/**
 * Whole-parse first; when that fails, the values are user-editable or stale
 * input, so one broken field falls back to its own default instead of taking
 * the rest down with it.
 */
export const parseWithSalvage = (
  info: SchemaInfo,
  raw: StateValues,
): StateValues => {
  const whole = safeParse(info.schema, raw);
  if (whole.success) {
    const values: StateValues = {};
    for (const key of info.keys) {
      values[key] = (whole.data as StateValues)[key];
    }
    return values;
  }
  const salvaged: StateValues = {};
  for (const key of info.keys) {
    if (key in raw) {
      const field = safeParse(info.shape[key] as $ZodType, raw[key]);
      salvaged[key] = field.success ? field.data : info.defaults[key];
    } else {
      salvaged[key] = info.defaults[key];
    }
  }
  return salvaged;
};
