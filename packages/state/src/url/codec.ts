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
  const multi = new Set(
    keys.filter((key) => baseDef(info.shape[key] as $ZodType).type === 'array'),
  );

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

  return { keys, defaults, parse, search };
};
