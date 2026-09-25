import { createRowCodec } from './row/codec';
import type { RowCodec, Versioning } from './row/codec';
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
   * is corrupt, the value is not an object, storage cannot be read, or (for a
   * versioned local state) the row was written by another version. Neither
   * the schema nor `migrate` runs there: treat the result as untrusted and
   * read only the fields you need, each with its own fallback.
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
// scalar where the schema promised an object would be read as fields. A
// versioned row is `[version, values]`, and only this version's values are
// handed out — migrate cannot run before any module has loaded.
const isObjectExpression = (value: string): string =>
  `${value}!==null&&typeof ${value}==="object"&&!Array.isArray(${value})`;

const inlineReadOf = (
  area: StorageArea,
  storageKey: string,
  version: number | undefined,
): string => {
  const row = `JSON.parse(${area}.getItem(${literalOf(storageKey)}))`;
  return version === undefined
    ? `(()=>{try{const v=${row};return ${isObjectExpression('v')}?v:null}catch{return null}})()`
    : `(()=>{try{const r=${row};const v=Array.isArray(r)&&r.length===2&&r[0]===${String(version)}?r[1]:null;return ${isObjectExpression('v')}?v:null}catch{return null}})()`;
};

const codecs = new WeakMap<
  StorageState<'local' | 'session', StateSchema>,
  RowCodec
>();

export const storageCodecOf = (def: LocalState | SessionState): RowCodec => {
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
  versioning: Versioning<Schema> | undefined,
): StorageState<Kind, Schema> => {
  const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
  const codec = createRowCodec(schema, kind, key, versioning);
  const def: StorageState<Kind, Schema> = {
    kind,
    key,
    schema,
    storageKey,
    inlineRead: () => inlineReadOf(area, storageKey, codec.version),
  };
  codecs.set(def, codec);
  return def;
};

export const defineLocalState = <Schema extends StateSchema>(
  key: string,
  schema: Schema,
  versioning?: Versioning<Schema>,
): LocalState<Schema> =>
  defineStorageState('local', 'localStorage', key, schema, versioning);

export const defineSessionState = <Schema extends StateSchema>(
  key: string,
  schema: Schema,
): SessionState<Schema> =>
  defineStorageState('session', 'sessionStorage', key, schema, undefined);
