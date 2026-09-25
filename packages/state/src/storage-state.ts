import { createStoredCodec } from './entry/codec';
import type { StoredCodec } from './entry/codec';
import type { StateSchema } from './schema/object';

type StorageArea = 'localStorage' | 'sessionStorage';

type StorageState<
  Kind extends 'local' | 'session',
  Schema extends StateSchema,
> = {
  kind: Kind;
  /** Identity of this state: the storage key and the store registry slot. */
  key: string;
  /** The schema as passed. */
  schema: Schema;
  /** The Web Storage key the values are written under: `k8ordo-state:<key>`. */
  storageKey: string;
  /**
   * A JavaScript expression, for an inline `<script>`, that evaluates in the
   * browser to the stored object — or `null` when nothing is stored, the JSON
   * is corrupt, the value is not an object, or storage cannot be read. The
   * schema does not run there: treat the result as untrusted and read only
   * the fields you need, each with its own fallback.
   */
  inlineRead: () => string;
};

/**
 * App-scope state that lives in localStorage: device-persistent, shared
 * across tabs, never page-bound — which is why it is its own definition kind
 * instead of a slot on a page state.
 */
export type LocalState<Schema extends StateSchema = StateSchema> = StorageState<
  'local',
  Schema
>;

/**
 * App-scope state that lives in sessionStorage: kept through reloads of the
 * tab and gone when the tab closes, shared with no other tab — built the way
 * local state is, over the other Web Storage area.
 */
export type SessionState<Schema extends StateSchema = StateSchema> =
  StorageState<'session', Schema>;

// Namespaced so an app's own Web Storage use can never collide with a state
// key; also what makes the rows recognizable in devtools.
const STORAGE_KEY_PREFIX = 'k8ordo-state:';

/**
 * The key as a JavaScript string literal. `JSON.stringify` escapes it for
 * JavaScript; `<` is escaped on top so the literal can never close the inline
 * `<script>` it is written into, whatever the key contains.
 */
const literalOf = (text: string): string =>
  JSON.stringify(text).replaceAll('<', String.raw`\u003c`);

// A self-invoking function, so the expression stays usable in any position
// (`const s = …;`, an argument, a ternary) without leaking a binding. Only
// an object survives: `JSON.parse` happily returns `5` or `null`, and a
// scalar where the schema promised an object would be read as fields.
const inlineReadOf = (area: StorageArea, storageKey: string): string =>
  `(()=>{try{const v=JSON.parse(${area}.getItem(${literalOf(storageKey)}));return v!==null&&typeof v==="object"&&!Array.isArray(v)?v:null}catch{return null}})()`;

const codecs = new WeakMap<
  StorageState<'local' | 'session', StateSchema>,
  StoredCodec
>();

export const storageCodecOf = (def: LocalState | SessionState): StoredCodec => {
  const codec = codecs.get(def);
  if (codec === undefined) {
    throw new TypeError(
      `"${def.key}" was not created by ${def.kind === 'local' ? 'defineLocalState' : 'defineSessionState'} of this module instance`,
    );
  }
  return codec;
};

const defineStorageState = <
  Kind extends 'local' | 'session',
  Schema extends StateSchema,
>(
  kind: Kind,
  area: StorageArea,
  key: string,
  schema: Schema,
): StorageState<Kind, Schema> => {
  const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
  const def: StorageState<Kind, Schema> = {
    kind,
    key,
    schema,
    storageKey,
    inlineRead: () => inlineReadOf(area, storageKey),
  };
  codecs.set(def, createStoredCodec(schema, kind));
  return def;
};

export const defineLocalState = <Schema extends StateSchema>(
  key: string,
  schema: Schema,
): LocalState<Schema> =>
  defineStorageState('local', 'localStorage', key, schema);

export const defineSessionState = <Schema extends StateSchema>(
  key: string,
  schema: Schema,
): SessionState<Schema> =>
  defineStorageState('session', 'sessionStorage', key, schema);
