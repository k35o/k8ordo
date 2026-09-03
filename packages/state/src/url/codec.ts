import { safeParse } from 'zod/v4/core';
import type { $ZodObject, $ZodShape, $ZodType } from 'zod/v4/core';

/**
 * The common ground between `zod` and `zod/mini`: both build on the shared
 * core object and both expose `shape`. Accepting this keeps the smaller entry
 * usable without losing the types.
 */
export type UrlSchema<Shape extends $ZodShape = $ZodShape> =
  $ZodObject<Shape> & { shape: Shape };

/** `URLSearchParams`, or the object shape frameworks hand to a page. */
export type UrlInput =
  | URLSearchParams
  | Readonly<Record<string, string | readonly string[] | undefined>>;

export type UrlValues = Record<string, unknown>;

export type UrlCodec = {
  keys: readonly string[];
  defaults: Readonly<UrlValues>;
  parse: (input: UrlInput) => UrlValues;
  search: (values: Readonly<Partial<UrlValues>>) => string;
};

type Def = {
  type: string;
  innerType?: $ZodType;
  in?: $ZodType;
};

/* oxlint-disable no-underscore-dangle -- `_zod` is where the shared core
   keeps the def; there is no public spelling of it */
const defOf = (schema: $ZodType): Def =>
  (schema as unknown as { _zod: { def: Def } })._zod.def;
/* oxlint-enable no-underscore-dangle */

/**
 * Peels wrappers (`default`, `optional`, `catch`, …) and pipes down to the
 * type that decides how many values a param carries. Only the input side of a
 * pipe matters here — that is the side the URL string enters through.
 */
const baseDef = (schema: $ZodType): Def => {
  let def = defOf(schema);
  while (
    def.innerType !== undefined ||
    (def.type === 'pipe' && def.in !== undefined)
  ) {
    def = defOf(def.innerType ?? (def.in as $ZodType));
  }
  return def;
};

const readAll = (input: UrlInput, key: string): readonly string[] => {
  if (input instanceof URLSearchParams) return input.getAll(key);
  const value = input[key];
  if (value === undefined) return [];
  return typeof value === 'string' ? [value] : value;
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

const serializeValue = (key: string, value: unknown): string => {
  if (typeof value === 'string') return value;
  if (
    typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }
  throw new TypeError(
    `url field "${key}" holds a ${typeof value}, which has no URL serialization`,
  );
};

export const createCodec = (schema: UrlSchema): UrlCodec => {
  const shape: Readonly<Record<string, $ZodType>> = schema.shape;
  const keys = Object.keys(shape);
  const multi = new Set(
    keys.filter((key) => baseDef(shape[key] as $ZodType).type === 'array'),
  );

  // A URL param can always be absent, so every field must already parse from
  // nothing. Failing at define time turns a guaranteed runtime surprise into
  // a module-load error with the fix in the message.
  const empty = safeParse(schema, {});
  if (!empty.success) {
    const failing = keys.filter(
      (key) => !safeParse(shape[key] as $ZodType, undefined).success,
    );
    throw new TypeError(
      `url fields must tolerate absence — add .default() or .optional() to: ${failing.join(', ')}`,
    );
  }
  const defaults: UrlValues = {};
  for (const key of keys) defaults[key] = (empty.data as UrlValues)[key];

  const complete = (parsed: UrlValues): UrlValues => {
    const values: UrlValues = {};
    for (const key of keys) values[key] = parsed[key];
    return values;
  };

  const parse = (input: UrlInput): UrlValues => {
    const raw: UrlValues = {};
    for (const key of keys) {
      const got = readAll(input, key);
      if (got.length === 0) continue;
      raw[key] = multi.has(key) ? got : got[0];
    }
    const whole = safeParse(schema, raw);
    if (whole.success) return complete(whole.data);
    // The URL is user-editable input: one broken param falls back to its own
    // default instead of taking the whole page state down with it.
    const salvaged: UrlValues = {};
    for (const key of keys) {
      if (key in raw) {
        const field = safeParse(shape[key] as $ZodType, raw[key]);
        salvaged[key] = field.success ? field.data : defaults[key];
      } else {
        salvaged[key] = defaults[key];
      }
    }
    return salvaged;
  };

  const search = (values: Readonly<Partial<UrlValues>>): string => {
    const params = new URLSearchParams();
    for (const key of keys) {
      const value = key in values ? values[key] : defaults[key];
      if (value === undefined || sameValue(defaults[key], value)) continue;
      if (Array.isArray(value)) {
        for (const item of value) params.append(key, serializeValue(key, item));
      } else {
        params.append(key, serializeValue(key, value));
      }
    }
    return params.toString();
  };

  return { keys, defaults, parse, search };
};
