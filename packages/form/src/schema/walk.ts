import type { ZodObject, ZodType } from 'zod';
// From core rather than the classic entry, so a schema written with `zod/mini`
// works too — same conversion, and the caller is not forced to pull in an API
// seven times the size of the one they chose.
import { toJSONSchema } from 'zod/v4/core';

import type { LeafSchema } from '../derive/attributes';

/** Placeholder an array item's name carries until a row index is known. */
export const INDEX = '{index}';

export type LeafNode = {
  /** Dotted path within the parsed object, e.g. `user.email`. */
  path: string;
  /** The `name` attribute, with {@link INDEX} still in it for array items. */
  name: string;
  json: LeafSchema & { input?: string };
  zod: ZodType;
  required: boolean;
  /** The array this leaf repeats inside, or null. */
  arrayPath: string | null;
  /** Key within the array item; '' when the array holds scalars. */
  itemKey: string | null;
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
} & LeafSchema & { input?: string };

const shapeOf = (schema: ZodType): Record<string, ZodType> | undefined =>
  (schema as unknown as { shape?: Record<string, ZodType> }).shape;

/* oxlint-disable no-underscore-dangle -- `zod/mini` array schemas expose no
   public `element`; the shared core definition is the only route that works
   for both entries, and it is the same internal surface the check list already
   requires. */
const elementOf = (schema: ZodType): ZodType | undefined => {
  const candidate = schema as unknown as {
    element?: ZodType;
    _zod?: { def?: { element?: ZodType } };
  };
  return candidate.element ?? candidate._zod?.def?.element;
};
/* oxlint-enable no-underscore-dangle */

/**
 * `required` in JSON Schema means "the key is present", but a form always sends
 * every field, empty ones as ''. Asking the schema what it does with '' is what
 * makes the attribute mean the same on both sides.
 */
const rejectsEmptyString = (schema: ZodType): boolean =>
  !schema.safeParse('').success;

const walkNode = (
  json: Node,
  zod: ZodType,
  path: string,
  name: string,
  context: { arrayPath: string | null; itemKey: string | null },
  out: SchemaMap,
): void => {
  if (json.type === 'object' && json.properties !== undefined) {
    const shape = shapeOf(zod);
    for (const [key, child] of Object.entries(json.properties)) {
      const childZod = shape?.[key];
      if (childZod === undefined) {
        continue;
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

  if (json.type === 'array' && json.items !== undefined) {
    const element = elementOf(zod);
    if (element === undefined) {
      return;
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

  out.leaves.push({
    path,
    name,
    json,
    zod,
    required: rejectsEmptyString(zod),
    arrayPath: context.arrayPath,
    itemKey: context.itemKey,
  });
};

const cache = new WeakMap<ZodObject, SchemaMap>();

/**
 * Describe a schema once: every leaf that becomes an input, and every array
 * that becomes a repeatable group. Both the derivation and the parse read this,
 * so the two can never disagree about what the form contains.
 */
export const schemaMap = (schema: ZodObject): SchemaMap => {
  const cached = cache.get(schema);
  if (cached !== undefined) {
    return cached;
  }

  const json = toJSONSchema(schema, {
    io: 'output',
    unrepresentable: 'any',
  }) as Node;

  const out: SchemaMap = { leaves: [], arrays: [] };
  walkNode(json, schema, '', '', { arrayPath: null, itemKey: null }, out);
  cache.set(schema, out);
  return out;
};
