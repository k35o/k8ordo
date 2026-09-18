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
import { attributesFor, emptySubmissionOf } from './attributes';
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
   moves them the report goes quiet, and a regex whose flags can no longer be
   read reaches `pattern` as if it had none. */
type ZodInternals = {
  _zod?: {
    def?: {
      checks?: Array<{ _zod?: { def?: { pattern?: RegExp } } }>;
      pattern?: RegExp;
      format?: string;
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

/**
 * zod's JSON Schema conversion emits `format` only when a standard one matches
 * the values it accepts, so `z.iso.time()` and `z.iso.datetime({ local: true })`
 * arrive as a bare pattern. Both name the control that submits exactly their
 * shape, and dropping to `type="text"` would lose a picker the schema asked
 * for, so the format is read back off the check itself. zod's own name for it
 * is not always the JSON one.
 */
const ZOD_FORMAT_TO_JSON_FORMAT: Record<string, string> = {
  datetime: 'date-time',
  time: 'time',
};

const formatBehindPattern = (schema: $ZodType): string | undefined => {
  const format = (schema as unknown as ZodInternals)._zod?.def?.format;
  return format === undefined ? undefined : ZOD_FORMAT_TO_JSON_FORMAT[format];
};
/* oxlint-enable no-underscore-dangle */

/** What a `datetime-local` control actually submits: no seconds, no zone. */
const DATETIME_LOCAL_PROBE = '2000-01-01T00:00';

/**
 * Schemas whose `dropped` list has already been reported. `formFields` is not
 * memoized, so a schema derived in every request would otherwise warn on
 * every request; keyed by the schema object, an HMR re-evaluation still gets
 * its warning back, because it is a new object.
 */
const warned = new WeakSet<object>();

/**
 * `dropped` is returned, but a return value is only seen by whoever reads
 * it. Outside production the list is also written to the console, once per
 * schema, so the checks the browser will never run are noticed without
 * anyone remembering to look.
 */
const warnDropped = (
  schema: object,
  dropped: readonly DroppedCheck[],
): void => {
  if (process.env.NODE_ENV === 'production') return;
  if (dropped.length === 0 || warned.has(schema)) return;
  warned.add(schema);
  const lines = dropped.map(({ field, reason }) => `  - ${field}: ${reason}`);
  console.warn(
    [
      '[@k8ordo/form] クライアントでは検査されないチェックがあります（サーバーでは検査されます）。',
      ...lines,
      '  ブラウザ側でも検査するには、formFields の戻り値 dropped を確認してください。',
    ].join('\n'),
  );
};

/**
 * Derive input attributes and messages from one zod object schema.
 *
 * Call this on the server — in a Server Component or at module scope. The
 * result is plain data, so it crosses to the client as props and zod never
 * enters the bundle. Messages are read when it runs, so when one follows the
 * request (its locale, say), call it during the render, not at module scope.
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
    const json =
      leaf.json.format === undefined
        ? { ...leaf.json, format: formatBehindPattern(leaf.zod) }
        : leaf.json;
    const attributes = attributesFor(
      leaf.name,
      json,
      leaf.required,
      json.pattern === undefined
        ? undefined
        : patternFlags(leaf.zod, json.pattern),
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
      messages: messagesFor(
        leaf.zod,
        attributes.input,
        leaf.required,
        emptySubmissionOf(leaf.json),
      ),
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

  warnDropped(schema, dropped);
  return { fields, arrays, rules, dropped };
};
