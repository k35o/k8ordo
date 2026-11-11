import { safeParse } from 'zod/v4/core';
import type { $ZodType } from 'zod/v4/core';

import { sameValue } from '../schema/object';
import { refuseBoolean, serializeValue } from '../url/codec';

export type HashCodec = {
  fallback: unknown;
  /** Reads `location.hash`: `''`, or the fragment with its `#`. */
  parse: (hash: string) => unknown;
  /** The fragment a value is written as, without `#`; `''` at the default. */
  fragment: (value: unknown) => string;
  /** The value as it will come back: written to a fragment and read again. */
  salvage: (value: unknown) => unknown;
};

const decodeOrKeep = (text: string): string => {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
};

/**
 * The fragment is one string, so the hash slot is one value under one schema
 * rather than an object of fields. A fragment the schema rejects is not this
 * state's — an anchor, most likely — and reads as the default.
 */
export const createHashCodec = (schema: $ZodType): HashCodec => {
  const absent = safeParse(schema, undefined);
  if (!absent.success) {
    throw new TypeError(
      'hash must tolerate absence — add .default() or .optional()',
    );
  }
  refuseBoolean(schema, 'hash');
  const fallback: unknown = absent.data;

  const parse = (hash: string): unknown => {
    if (hash.length <= 1) return fallback;
    const read = safeParse(schema, decodeOrKeep(hash.slice(1)));
    return read.success ? read.data : fallback;
  };

  const fragment = (value: unknown): string =>
    value === undefined || sameValue(fallback, value)
      ? ''
      : encodeURIComponent(serializeValue(schema, 'hash', value));

  return {
    fallback,
    parse,
    fragment,
    salvage: (value) => parse(`#${fragment(value)}`),
  };
};
