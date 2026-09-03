import { createStoredCodec } from './entry/codec';
import type { StoredCodec } from './entry/codec';
import type { StateSchema } from './schema/object';

/**
 * App-scope state that lives in localStorage: device-persistent, shared
 * across tabs, never page-bound — which is why it is its own definition kind
 * instead of a slot on a page state.
 */
export type LocalState<Schema extends StateSchema = StateSchema> = {
  kind: 'local';
  /** Identity of this state: the storage key and the store registry slot. */
  key: string;
  /** The schema as passed. */
  schema: Schema;
};

const codecs = new WeakMap<LocalState, StoredCodec>();

export const localCodecOf = (def: LocalState): StoredCodec => {
  const codec = codecs.get(def);
  if (codec === undefined) {
    throw new TypeError(
      `"${def.key}" was not created by defineLocalState of this module instance`,
    );
  }
  return codec;
};

export const defineLocalState = <Schema extends StateSchema>(
  key: string,
  schema: Schema,
): LocalState<Schema> => {
  const def: LocalState<Schema> = { kind: 'local', key, schema };
  codecs.set(def, createStoredCodec(schema, 'local'));
  return def;
};
