import { analyzeSchema, isRecord, parseWithSalvage } from '../schema/object';
import type { StateSchema, StateValues } from '../schema/object';

export type StoredCodec = {
  keys: readonly string[];
  defaults: Readonly<StateValues>;
  parse: (stored: unknown) => StateValues;
};

/**
 * The read side shared by every slot that stores typed values (history entry
 * state, localStorage JSON): no string serialization to derive — only care
 * that what comes back may have been written by an older schema, or by
 * nobody.
 */
export const createStoredCodec = (
  schema: StateSchema,
  slot: string,
): StoredCodec => {
  const info = analyzeSchema(schema, slot);

  const parse = (stored: unknown): StateValues => {
    const raw: StateValues = {};
    if (isRecord(stored)) {
      for (const key of info.keys) {
        if (key in stored) raw[key] = stored[key];
      }
    }
    return parseWithSalvage(info, raw);
  };

  return { keys: info.keys, defaults: info.defaults, parse };
};
