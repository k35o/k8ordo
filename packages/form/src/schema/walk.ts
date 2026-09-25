// From core rather than the classic entry, so a schema written with `zod/mini`
// works too — same conversion, and the caller is not forced to pull in an API
// seven times the size of the one they chose.
import { safeEncode, toJSONSchema } from 'zod/v4/core';
import type { $ZodType } from 'zod/v4/core';

import { controlKindOf, emptySubmissionOf } from '../derive/attributes';
import type { ControlKind, LeafSchema } from '../derive/attributes';
import { asProbe } from './object-schema';
import type { ObjectSchema } from './object-schema';

/** Placeholder an array item's name carries until a row index is known. */
export const INDEX = '{index}';

export type LeafNode = {
  /** Dotted path within the parsed object, e.g. `user.email`. */
  path: string;
  /** The `name` attribute, with {@link INDEX} still in it for array items. */
  name: string;
  json: LeafSchema & { input?: string };
  zod: $ZodType;
  kind: ControlKind;
  /** `string-checkbox` がチェック時に送る文字列（{@link checkedValueOf}）。 */
  checkedValue?: string;
  required: boolean;
  /** The array this leaf repeats inside, or null. */
  arrayPath: string | null;
  /** Key within the array item; '' when the array holds scalars. */
  itemKey: string | null;
  /**
   * Present when several same-named controls submit together — a checkbox
   * group, derived from an array of enums. Carries the bounds the group's
   * array schema declared, which HTML has no attribute for.
   */
  group?: { minItems?: number; maxItems?: number };
};

export type ArrayNode = {
  path: string;
  name: string;
  minItems?: number;
  maxItems?: number;
};

export type SchemaMap = {
  leaves: LeafNode[];
  arrays: ArrayNode[];
};

type Node = {
  type?: string;
  properties?: Record<string, Node>;
  required?: string[];
  items?: Node;
  minItems?: number;
  maxItems?: number;
  anyOf?: Node[];
} & LeafSchema & { input?: string };

/* oxlint-disable no-underscore-dangle -- wrappers (`optional`, `nullable`,
   `default`, …) and `zod/mini` arrays expose neither `shape` nor `element`
   publicly; the shared core definition is the only route that works for both
   entries, and it is the same internal surface the check list already
   requires. */
type Wrapped = {
  _zod?: {
    def?: { type?: string; innerType?: $ZodType; element?: $ZodType };
  };
};

/**
 * Peel wrapper schemas until the node that owns the structure is reached.
 * `toJSONSchema` flattens `.optional()` / `.default()` into the plain node, so
 * pairing the two trees requires flattening the zod side the same way.
 */
export const unwrap = ($schema: $ZodType): $ZodType => {
  let current = $schema;
  let inner = (current as Wrapped)._zod?.def?.innerType;
  while (inner !== undefined) {
    current = inner;
    inner = (current as Wrapped)._zod?.def?.innerType;
  }
  return current;
};

const shapeOf = ($schema: $ZodType): Record<string, $ZodType> | undefined =>
  (unwrap($schema) as unknown as { shape?: Record<string, $ZodType> }).shape;

const elementOf = ($schema: $ZodType): $ZodType | undefined => {
  const candidate = unwrap($schema) as unknown as {
    element?: $ZodType;
    _zod?: { def?: { element?: $ZodType } };
  };
  return candidate.element ?? candidate._zod?.def?.element;
};

/**
 * BigInt has no JSON Schema form, so its node arrives empty and reads as a
 * text control. It does render as one, but a blank one is no more a value than
 * a blank number is — `z.coerce.bigint()` reads `''` as 0n — so its submission
 * is judged the way a number's is.
 */
const kindOf = (json: Node, $schema: $ZodType): ControlKind => {
  const kind = controlKindOf(json);
  return kind === 'text' &&
    (unwrap($schema) as Wrapped)._zod?.def?.type === 'bigint'
    ? 'number'
    : kind;
};
/* oxlint-enable no-underscore-dangle */

/**
 * 文字列を読むスキーマのチェックボックスが、チェック時に送る文字列。スキーマ
 * 自身が `true` を encode した綴りを使う。ブラウザ既定の `on` を拒む
 * `z.stringbool({ truthy: ['yes'] })` にも読める値が届き、`@k8ordo/state` が
 * `true` として URL に書く文字列とも一致する。
 */
const checkedValueOf = ($schema: $ZodType): string | undefined => {
  try {
    const encoded = safeEncode($schema, true);
    return encoded.success && typeof encoded.data === 'string'
      ? encoded.data
      : undefined;
  } catch {
    // 一方向の `.transform()` は逆向きに走らせられず、zod は issue ではなく
    // 例外で知らせる。送るべき文字列を持たないスキーマとして扱う
    return undefined;
  }
};

/**
 * `required` in JSON Schema means "the key is present", but a form always
 * submits something for every control, and what that is depends on the control
 * — `emptySubmissionOf` is the one place that decides. Asking the schema what
 * it does with that exact value, which is also what the parse will hand it, is
 * what makes the attribute mean the same on both sides.
 */
const rejectsEmptySubmission = (
  kind: ControlKind,
  $schema: $ZodType,
): boolean => !asProbe($schema).safeParse(emptySubmissionOf(kind)).success;

/**
 * Strings a text control could plausibly submit. One is never enough: a schema
 * that coerces reads some strings and not others, and rejecting the one probe
 * that happens to be nonsense says nothing about the rest —
 * `z.coerce.date()` refuses a word and accepts a date.
 */
const TEXT_PROBES = ['1', '2000-01-01', 'k8ordo-probe'];

const rejectsAsWrongType = ($schema: $ZodType, value: unknown): boolean => {
  const probed = asProbe($schema).safeParse(value);
  return (
    !probed.success &&
    probed.error.issues.some((issue) => issue.code === 'invalid_type')
  );
};

/**
 * A text or number control can only submit strings, and the parse reads a
 * checkbox as a boolean unless its schema names a string to submit, so a leaf
 * that turns every such value away on type alone can never be satisfied by the
 * control it derives. That is not a check the client skips; it is a form that
 * always fails, so it is refused here rather than shipped, with the reason. (A
 * file is exempt: the parse hands the schema a File, which is what `z.file()`
 * reads.)
 *
 * A constraint is not a refusal: `z.coerce.number().min(100)` rejects the probe
 * with `too_small`, which is the schema doing its job.
 */
const refusalOf = (
  json: Node,
  $schema: $ZodType,
  kind: ControlKind,
): string | undefined => {
  if (kind === 'string-checkbox') {
    // チェックを外したボックスは何も送らない。それを true と読むスキーマ
    // （`.default(true)`）では、外した操作が黙って捨てられる
    return asProbe($schema).safeParse(undefined).data === true
      ? 'チェックを外したボックスは何も送らないため、未送信を true と読むこのスキーマ（.default(true) など）では false を送れません。チェックすると true になる向きの項目にしてください'
      : undefined;
  }
  // 数値と文字列の判定は JSON のノードで分ける。bigint は数値の欄として扱うが、
  // 拒むかどうかは文字列の欄として確かめる
  const control = controlKindOf(json);
  if (control === 'number') {
    const asText = asProbe($schema).safeParse('1');
    if (asText.success) {
      return undefined;
    }
    // `z.literal(1)` reports `invalid_value` rather than `invalid_type`, so
    // the type code alone would miss it: what settles it is that the same
    // value as a number is accepted while its string form is not.
    return asProbe($schema).safeParse(1).success ||
      asText.error.issues.some((issue) => issue.code === 'invalid_type')
      ? 'フォームの値は文字列で届くため、このスキーマはどんな入力でも失敗します。z.coerce.number() を使ってください'
      : undefined;
  }
  if (kind === 'checkbox') {
    return [true, false].every((value) => rejectsAsWrongType($schema, value))
      ? 'チェックボックスは真偽値（z.boolean()）か、送信する文字列（z.stringbool()）として読むため、どちらでもないこのスキーマはどんな入力でも失敗します'
      : undefined;
  }
  if (control === 'text' && json.type !== 'string') {
    return TEXT_PROBES.every((probe) => rejectsAsWrongType($schema, probe))
      ? 'このスキーマは文字列を受け付けないため、フォームが送信できる値がありません（z.date() や z.bigint() などは表現できません）'
      : undefined;
  }
  return undefined;
};

// The explicit annotation is what lets tsc treat a `fail(...)` call as
// unreachable-after and narrow the checks above it; an inferred `never` does
// not participate in control-flow analysis.
const fail: (path: string, reason: string) => never = (path, reason) => {
  throw new Error(
    `[@k8ordo/form] '${path === '' ? '(schema)' : path}': ${reason}`,
  );
};

const walkNode = (
  json: Node,
  zod: $ZodType,
  path: string,
  name: string,
  context: { arrayPath: string | null; itemKey: string | null },
  out: SchemaMap,
): void => {
  if (json.type === 'object') {
    const shape = shapeOf(zod);
    if (json.properties === undefined || shape === undefined) {
      // A record, or a pairing this walk does not understand. Parsing it
      // anyway would silently discard whatever the person typed, which is the
      // one failure mode this package exists to rule out.
      fail(
        path,
        'オブジェクトのキー構成を列挙できないため、フォームに展開できません（z.record などは表現できません）',
      );
    }
    for (const [key, child] of Object.entries(json.properties)) {
      if (/[.[\]]/u.test(key)) {
        fail(
          path === '' ? key : `${path}.${key}`,
          "キーに '.' や '[' ']' を含むスキーマは、入力の name と経路の区切りが衝突するため使えません",
        );
      }
      const childZod = shape[key];
      if (childZod === undefined) {
        fail(
          path === '' ? key : `${path}.${key}`,
          'JSON Schema 側にだけ現れるキーです。zod 側と対応が取れないため、フォームに展開できません',
        );
      }
      walkNode(
        child,
        childZod,
        path === '' ? key : `${path}.${key}`,
        name === '' ? key : `${name}.${key}`,
        {
          arrayPath: context.arrayPath,
          itemKey:
            context.arrayPath === null
              ? null
              : context.itemKey === null || context.itemKey === ''
                ? key
                : `${context.itemKey}.${key}`,
        },
        out,
      );
    }
    return;
  }

  if (json.type === 'array') {
    if (json.items === undefined) {
      fail(
        path,
        'タプルなど要素型が一様でない配列は、繰り返し行として表現できません',
      );
    }

    if (json.items.enum !== undefined) {
      // An array of enums is a fixed option set the person picks several of —
      // a checkbox group: many controls sharing one name, submitted together.
      // Rows would make no sense here, so the whole array is a single leaf.
      const element = elementOf(zod);
      if (element === undefined) {
        fail(path, '配列要素のスキーマを取り出せませんでした');
      }
      out.leaves.push({
        path,
        name,
        json: json.items,
        zod: element,
        kind: controlKindOf(json.items),
        required: false,
        arrayPath: context.arrayPath,
        itemKey: context.itemKey,
        group: { minItems: json.minItems, maxItems: json.maxItems },
      });
      return;
    }

    if (context.arrayPath !== null) {
      fail(
        path,
        '繰り返しの中の繰り返しは name の添字が一意に決まらないため表現できません',
      );
    }

    const element = elementOf(zod);
    if (element === undefined) {
      fail(path, '配列要素のスキーマを取り出せませんでした');
    }
    out.arrays.push({
      path,
      name,
      minItems: json.minItems,
      maxItems: json.maxItems,
    });
    // Rows do not exist until the page renders one, so the item is described
    // once with a placeholder and the index is filled in per row.
    walkNode(
      json.items,
      element,
      path,
      `${name}[${INDEX}]`,
      { arrayPath: path, itemKey: '' },
      out,
    );
    return;
  }

  if (json.anyOf !== undefined) {
    for (const branch of json.anyOf) {
      if (branch.type === 'object' || branch.type === 'array') {
        fail(
          path,
          'nullable / union のオブジェクトや配列は、どちらの枝を描画すべきか決まらないため表現できません',
        );
      }
    }
    // Scalar unions survive as a bare text input; the lost constraints are
    // reported by the derivation, not here.
  }

  const checkedValue =
    controlKindOf(json) === 'checkbox' ? checkedValueOf(zod) : undefined;
  const kind =
    checkedValue === undefined ? kindOf(json, zod) : 'string-checkbox';
  const refusal = refusalOf(json, zod, kind);
  if (refusal !== undefined) {
    fail(path, refusal);
  }

  out.leaves.push({
    path,
    name,
    json,
    zod,
    kind,
    checkedValue,
    required: rejectsEmptySubmission(kind, zod),
    arrayPath: context.arrayPath,
    itemKey: context.itemKey,
  });
};

const cache = new WeakMap<object, SchemaMap>();

/**
 * Describe a schema once: every leaf that becomes an input, and every array
 * that becomes a repeatable group. Both the derivation and the parse read this,
 * so the two can never disagree about what the form contains.
 */
export const schemaMap = (schema: ObjectSchema): SchemaMap => {
  const cached = cache.get(schema);
  if (cached !== undefined) {
    return cached;
  }

  const json = toJSONSchema(schema, {
    io: 'output',
    // A sub-schema referenced twice would otherwise become a `$ref`, which the
    // walk cannot pair with a zod node.
    reused: 'inline',
    unrepresentable: 'any',
  }) as Node;

  const out: SchemaMap = { leaves: [], arrays: [] };
  walkNode(json, schema, '', '', { arrayPath: null, itemKey: null }, out);
  cache.set(schema, out);
  return out;
};
