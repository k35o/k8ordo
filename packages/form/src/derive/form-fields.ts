import type { $ZodType } from 'zod/v4/core';

import type { ArrayPathsOf, FieldPathsOf } from '../paths';
import { asDefinition } from '../rules/define-form';
import type { FormDefinition } from '../rules/define-form';
import type { ObjectSchema } from '../schema/object-schema';
import { schemaMap } from '../schema/walk';
import type {
  DerivedArray,
  DerivedField,
  DroppedCheck,
  FormFields,
} from '../types';
import { attributesFor } from './attributes';
import { messagesFor } from './messages';

/**
 * Object-level checks — `.refine()` and friends — vanish from the JSON Schema
 * without a trace, so the public conversion cannot tell us they existed. Only
 * the internal check list can, and knowing is the whole point: a check the
 * client never runs has to be reported, not silently skipped.
 */
/* oxlint-disable no-underscore-dangle -- zod exposes no public route to its
   check list, and reporting what the client will not verify is worth the
   coupling. If zod moves it the count is wrong; the attributes are not. */
type ZodInternals = { _zod?: { def?: { checks?: unknown[] } } };

const objectLevelCheckCount = (schema: $ZodType): number =>
  (schema as unknown as ZodInternals)._zod?.def?.checks?.length ?? 0;
/* oxlint-enable no-underscore-dangle */

/**
 * Derive input attributes and messages from one zod object schema.
 *
 * Call this on the server — in a Server Component or at module scope. The
 * result is plain data, so it crosses to the client as props and zod never
 * enters the bundle.
 */
export const formFields = <Schema extends ObjectSchema>(
  input: FormDefinition<Schema> | Schema,
): FormFields<FieldPathsOf<Schema>, ArrayPathsOf<Schema>> => {
  const { schema, rules } = asDefinition(input);
  const map = schemaMap(schema);
  const fields: Record<string, DerivedField> = {};
  const arrays: Record<string, DerivedArray> = {};
  const dropped: DroppedCheck[] = [];

  for (const array of map.arrays) {
    arrays[array.path] = {
      path: array.path,
      minItems: array.minItems,
      maxItems: array.maxItems,
      item: {},
    };
  }

  for (const leaf of map.leaves) {
    const attributes = attributesFor(leaf.name, leaf.json, leaf.required);
    const secret = leaf.json.input === 'password';
    if (secret) {
      attributes.input.type = 'password';
    }

    const derived: DerivedField = {
      input: attributes.input,
      messages: messagesFor(leaf.zod, attributes.input, leaf.required),
      secret,
    };

    const array = leaf.arrayPath === null ? undefined : arrays[leaf.arrayPath];
    if (array === undefined) {
      fields[leaf.path] = derived;
    } else {
      array.item[leaf.itemKey ?? ''] = derived;
    }

    for (const entry of attributes.dropped) {
      dropped.push({ ...entry, field: leaf.path });
    }
  }

  const objectChecks = objectLevelCheckCount(schema);
  if (objectChecks > 0) {
    dropped.push({
      field: '(schema)',
      reason: `${String(objectChecks)}件のオブジェクト階層のチェック（refine など）は HTML の制約属性に落ちないため、クライアントでは検査されません`,
    });
  }

  return { fields, arrays, rules, dropped };
};
