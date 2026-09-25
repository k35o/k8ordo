import type { $ZodType } from 'zod/v4/core';

import type { ArrayPathsOf, FieldPathsOf } from '../paths';
import { asDefinition } from '../rules/define-form';
import type { FormDefinition } from '../rules/define-form';
import { deriveRule } from '../rules/rules';
import { asProbe } from '../schema/object-schema';
import type { ObjectSchema } from '../schema/object-schema';
import { schemaMap, unwrap } from '../schema/walk';
import type {
  DerivedArray,
  DerivedField,
  DroppedCheck,
  FormFields,
} from '../types';
import { attributesFor, emptySubmissionOf, namesAControl } from './attributes';
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
   moves them the report goes quiet, the control falls back to whatever
   `format` the JSON Schema kept, and a regex whose flags can no longer be read
   reaches `pattern` as if it had none. */
type StringFormat = { format: string; pattern?: RegExp };

type ZodInternals = {
  _zod?: {
    def?: Partial<StringFormat> & {
      checks?: Array<{ _zod?: { def?: Partial<StringFormat> } }>;
    };
  };
};

const objectLevelCheckCount = (schema: $ZodType): number =>
  (schema as unknown as ZodInternals)._zod?.def?.checks?.length ?? 0;

/**
 * The string formats a leaf declares — its own (`z.email()`) first, then the
 * ones its checks add (`.regex()`, `.lowercase()`) — each with the RegExp
 * behind it. The JSON Schema cannot stand in: its `pattern` strings have lost
 * their flags (an `i` has no HTML equivalent), and a later check overwrites
 * the `format` keyword (`z.url().lowercase()` says `lowercase`) or erases it
 * (`.regex()`).
 */
const stringFormatsOf = (schema: $ZodType): StringFormat[] => {
  const def = (unwrap(schema) as unknown as ZodInternals)._zod?.def;
  return [def, ...(def?.checks ?? []).map((check) => check._zod?.def)].filter(
    (entry): entry is StringFormat => entry?.format !== undefined,
  );
};
/* oxlint-enable no-underscore-dangle */

/** zod's own name for a format is not always the JSON Schema one. */
const ZOD_FORMAT_TO_JSON_FORMAT: Record<string, string> = {
  datetime: 'date-time',
  guid: 'uuid',
  url: 'uri',
};

const jsonFormatOf = (format: string): string =>
  ZOD_FORMAT_TO_JSON_FORMAT[format] ?? format;

/** What a `datetime-local` control actually submits: no seconds, no zone. */
const DATETIME_LOCAL_PROBE = '2000-01-01T00:00';

/**
 * Whether the date-time format itself turns away what a `datetime-local`
 * control submits. Only the format's own issue counts: a regex stacked on it
 * that fails the probe is a check the control ignores, not a shape the control
 * cannot produce.
 */
const refusesDatetimeLocal = (schema: $ZodType): boolean =>
  asProbe(schema)
    .safeParse(DATETIME_LOCAL_PROBE)
    .error?.issues.some(
      (issue) => issue.code === 'invalid_format' && issue.format === 'datetime',
    ) ?? false;

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
 * enters the bundle. Messages are read when it runs — zod's, and a rule's
 * function message — so when one follows the request (its locale, say), call
 * it during the render, not at module scope.
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
    const formats = stringFormatsOf(leaf.zod);
    // The control follows the format the schema declared, not whatever the
    // JSON Schema kept: zod emits `format` only when a standard one matches
    // the values it accepts, so `z.iso.time()` and a local `z.iso.datetime()`
    // arrive as a bare pattern, and a stacked check replaces or erases it.
    const own =
      leaf.json.type === 'string'
        ? formats.find((entry) => namesAControl(jsonFormatOf(entry.format)))
        : undefined;
    let format =
      own === undefined ? leaf.json.format : jsonFormatOf(own.format);
    const formatDropped: DroppedCheck[] = [];
    if (format === 'date-time' && refusesDatetimeLocal(leaf.zod)) {
      // The control submits neither seconds nor a timezone, so a format that
      // demands either (zod's default demands a zone) would reject every value
      // the browser can produce.
      format = undefined;
      formatDropped.push({
        field: leaf.name,
        reason: `この日時書式は datetime-local が送信する形（${DATETIME_LOCAL_PROBE} のように秒もタイムゾーンも付かない）を受け付けないため、type="text" に落とします（z.iso.datetime({ local: true }) なら datetime-local が使えます）`,
      });
    }

    const { pattern } = leaf.json;
    const attributes = attributesFor(
      leaf.name,
      { ...leaf.json, format },
      leaf.required,
      {
        flags:
          pattern === undefined
            ? undefined
            : formats.find((entry) => entry.pattern?.source === pattern)
                ?.pattern?.flags,
        ofFormat: format === undefined ? undefined : own?.pattern?.source,
      },
    );
    attributes.dropped.unshift(...formatDropped);
    const secret = leaf.json.input === 'password';
    if (secret) {
      attributes.input.type = 'password';
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
        emptySubmissionOf(leaf.kind),
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
  return {
    fields,
    arrays,
    rules: rules.map((rule) => deriveRule(rule)),
    dropped,
  };
};
