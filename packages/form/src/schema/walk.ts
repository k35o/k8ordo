// From core rather than the classic entry, so a schema written with `zod/mini`
// works too — same conversion, and the caller is not forced to pull in an API
// seven times the size of the one they chose.
import { toJSONSchema } from 'zod/v4/core';
import type { $ZodType } from 'zod/v4/core';

import type { LeafSchema } from '../derive/attributes';
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
  _zod?: { def?: { innerType?: $ZodType; element?: $ZodType } };
};

/**
 * Peel wrapper schemas until the node that owns the structure is reached.
 * `toJSONSchema` flattens `.optional()` / `.default()` into the plain node, so
 * pairing the two trees requires flattening the zod side the same way.
 */
const unwrap = ($schema: $ZodType): $ZodType => {
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
/* oxlint-enable no-underscore-dangle */

/**
 * `required` in JSON Schema means "the key is present", but a form always
 * submits something for every control. What it submits depends on the control:
 * a text field sends `''`, an unchecked checkbox maps to `false` in the parse.
 * Asking the schema what it does with that empty submission is what makes the
 * attribute mean the same on both sides.
 */
const rejectsEmptySubmission = (json: Node, $schema: $ZodType): boolean => {
  const empty = json.type === 'boolean' ? false : '';
  return !asProbe($schema).safeParse(empty).success;
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

  out.leaves.push({
    path,
    name,
    json,
    zod,
    required: rejectsEmptySubmission(json, zod),
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
