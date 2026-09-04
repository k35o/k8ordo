import type { $ZodType } from 'zod/v4/core';

import { analyzeSchema, parseWithSalvage, sameValue } from '../schema/object';
import type { StateSchema, StateValues } from '../schema/object';

/** `URLSearchParams`, or the object shape frameworks hand to a page. */
export type UrlInput =
  | URLSearchParams
  | Readonly<Record<string, string | readonly string[] | undefined>>;

export type UrlCodec = {
  keys: readonly string[];
  defaults: Readonly<StateValues>;
  parse: (input: UrlInput) => StateValues;
  search: (values: Readonly<Partial<StateValues>>) => string;
  /** Runs already-typed values through the schema, salvage included. */
  salvage: (values: Readonly<StateValues>) => StateValues;
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

export const createUrlCodec = (schema: StateSchema): UrlCodec => {
  const info = analyzeSchema(schema, 'url');
  const { keys, defaults } = info;
  const multi = new Set<string>();
  for (const key of keys) {
    const base = baseDef(info.shape[key] as $ZodType).type;
    // A URL can only say "absent": an empty list and a missing param are the
    // same string, so a non-empty default would silently take the place of
    // every [] the app writes. A boolean has the mirror problem — every
    // string is truthy to coerce, and "false" comes back as true — so the
    // string-shaped `z.stringbool()` is the only spelling that round-trips.
    // Both are guaranteed surprises, so both fail at define time.
    if (base === 'array') {
      if (!sameValue(defaults[key], [])) {
        throw new TypeError(
          `url array fields must default to [] — an absent param and an empty list are the same URL: ${key}`,
        );
      }
      multi.add(key);
    } else if (base === 'boolean') {
      throw new TypeError(
        `url boolean fields must use z.stringbool() — a URL carries strings, and "false" is not false to z.boolean() or z.coerce.boolean(): ${key}`,
      );
    }
  }

  const parse = (input: UrlInput): StateValues => {
    const raw: StateValues = {};
    for (const key of keys) {
      const got = readAll(input, key);
      if (got.length === 0) continue;
      raw[key] = multi.has(key) ? got : got[0];
    }
    return parseWithSalvage(info, raw);
  };

  const search = (values: Readonly<Partial<StateValues>>): string => {
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

  /**
   * The values as they will come back: written to a query string and read
   * again. Going through the URL rather than handing the typed values
   * straight to the schema is what makes a one-way spelling work — the
   * `string → boolean` of `z.stringbool()` never sees a boolean, exactly as
   * on arrival — and it is the only reading under which `update()` and a
   * visitor's URL are the same path. A value with no URL spelling throws
   * here, which is the earliest anyone can be told.
   */
  const salvage = (values: Readonly<StateValues>): StateValues =>
    parse(new URLSearchParams(search(values)));

  return { keys, defaults, parse, search, salvage };
};
