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

export const isRecord = (value: unknown): value is StateValues =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isPlainRecord = (value: unknown): value is StateValues => {
  if (typeof value !== 'object' || value === null) return false;
  const proto: unknown = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/**
 * Structural equality over what schemas produce: scalars via `Object.is`,
 * arrays and plain objects recursively. Anything else (Date, Map, class
 * instances) compares by reference only — conservatively "changed" — because
 * two structurally silent objects can still differ (a Date's time lives in
 * an internal slot, not in enumerable keys).
 */
export const sameValue = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      a.every((value, index) => sameValue(value, b[index]))
    );
  }
  if (isPlainRecord(a) && isPlainRecord(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    return (
      aKeys.length === bKeys.length &&
      aKeys.every((key) => key in b && sameValue(a[key], b[key]))
    );
  }
  return false;
};

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
      failing.length > 0
        ? `${slot} fields must tolerate absence — add .default() or .optional() to: ${failing.join(', ')}`
        : `${slot} schema rejects its own defaults — an object-level refine must accept the all-defaults value`,
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
  // Per-field salvage cannot see object-level refines: a combination the
  // schema forbids falls back to the defaults, which analyzeSchema already
  // proved valid as a whole. The recheck's own output is discarded so a
  // non-idempotent pipe is not applied twice.
  const recheck = safeParse(info.schema, salvaged);
  return recheck.success ? salvaged : { ...info.defaults };
};
