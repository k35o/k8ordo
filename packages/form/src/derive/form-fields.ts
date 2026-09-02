import type { $ZodType } from 'zod/v4/core';

import type { ArrayPathsOf, FieldPathsOf } from '../paths';
import { asDefinition } from '../rules/define-form';
import type { FormDefinition } from '../rules/define-form';
import { asProbe } from '../schema/object-schema';
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
   check list or to the source RegExp behind a JSON Schema pattern string, and
   reporting what the client will not verify is worth the coupling. If zod
   moves them the reports degrade; the attributes do not. */
type ZodInternals = {
  _zod?: {
    def?: {
      checks?: Array<{ _zod?: { def?: { pattern?: RegExp } } }>;
      pattern?: RegExp;
    };
  };
};

const objectLevelCheckCount = (schema: $ZodType): number =>
  (schema as unknown as ZodInternals)._zod?.def?.checks?.length ?? 0;

/**
 * Recover the flags of the RegExp behind a JSON Schema `pattern` string. The
 * JSON string has already lost them, and whether the browser may see the
 * pattern depends on them (an `i` flag has no HTML equivalent).
 */
const patternFlags = (schema: $ZodType, source: string): string | undefined => {
  const def = (schema as unknown as ZodInternals)._zod?.def;
  if (def?.pattern?.source === source) {
    return def.pattern.flags;
  }
  for (const check of def?.checks ?? []) {
    const candidate = check._zod?.def?.pattern;
    if (candidate?.source === source) {
      return candidate.flags;
    }
  }
  return undefined;
};
/* oxlint-enable no-underscore-dangle */

/** What a `datetime-local` control actually submits: no seconds, no zone. */
const DATETIME_LOCAL_PROBE = '2000-01-01T00:00';

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
    const attributes = attributesFor(
      leaf.name,
      leaf.json,
      leaf.required,
      leaf.json.pattern === undefined
        ? undefined
        : patternFlags(leaf.zod, leaf.json.pattern),
    );
    const secret = leaf.json.input === 'password';
    if (secret) {
      attributes.input.type = 'password';
    }

    if (
      attributes.input.type === 'datetime-local' &&
      !asProbe(leaf.zod).safeParse(DATETIME_LOCAL_PROBE).success
    ) {
      // The control cannot submit a timezone, so a schema that demands one
      // (zod's default) would reject every value the browser can produce.
      attributes.input.type = 'text';
      attributes.dropped.push({
        field: leaf.name,
        reason:
          'z.iso.datetime() はタイムゾーンを要求しますが、datetime-local はタイムゾーンを送信できません。type="text" に落とします（local: true なら datetime-local が使えます）',
      });
    }

    if (
      leaf.group !== undefined &&
      (leaf.group.minItems !== undefined || leaf.group.maxItems !== undefined)
    ) {
      dropped.push({
        field: leaf.path,
        reason:
          'チェックボックス群の個数制限に対応する HTML 属性はありません。クライアントでも検査するには minChecked を使ってください',
      });
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
