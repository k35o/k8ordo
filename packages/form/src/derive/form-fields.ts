import { $ZodCheckStringFormat } from 'zod/v4/core';
import type { $ZodCheckStringFormatDef, $ZodType } from 'zod/v4/core';

import { asDefinition } from '../rules/define-form';
import type { FormDefinition } from '../rules/define-form';
import { deriveRule } from '../rules/rules';
import type { DerivedRule } from '../rules/rules';
import { asProbe } from '../schema/object-schema';
import type { ObjectSchema } from '../schema/object-schema';
import { schemaMap, unwrap } from '../schema/walk';
import type {
  AnyDerivedArray,
  AnyFieldInput,
  DerivedField,
  DroppedCheck,
  FormFields,
} from '../types';
import { attributesFor, emptySubmissionOf, namesAControl } from './attributes';
import { messagesFor } from './messages';

/**
 * Object-level checks — `.refine()` and friends — vanish from the JSON Schema
 * without a trace, so the conversion cannot tell us they existed. Only the
 * schema's check list can, and knowing is the whole point: a check the client
 * never runs has to be reported, not silently skipped.
 */
const objectLevelCheckCount = (schema: $ZodType): number =>
  schema._zod.def.checks?.length ?? 0;

/**
 * The string formats a leaf declares — its own (`z.email()`) first, then the
 * ones its checks add (`.regex()`, `.lowercase()`) — each with the RegExp
 * behind it. The JSON Schema cannot stand in: its `pattern` strings have lost
 * their flags (an `i` has no HTML equivalent), and a later check overwrites
 * the `format` keyword (`z.url().lowercase()` says `lowercase`) or erases it
 * (`.regex()`).
 */
const stringFormatsOf = (schema: $ZodType): $ZodCheckStringFormatDef[] => {
  const leaf = unwrap(schema);
  return [leaf, ...(leaf._zod.def.checks ?? [])]
    .filter((entry) => entry instanceof $ZodCheckStringFormat)
    .map((entry) => entry._zod.def);
};

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
 * zod's own wording for a checkbox group with `count` boxes checked, as the
 * issue with `code` on the array itself. The boxes are the group's own
 * options, so the count is the only thing that can fail.
 */
const countMessage = (
  array: $ZodType,
  options: readonly unknown[],
  count: number,
  code: 'too_small' | 'too_big',
): string | undefined =>
  asProbe(array)
    .safeParse(
      Array.from(
        { length: count },
        (_, index) => options[index % options.length],
      ),
    )
    .error?.issues.find(
      (issue) => issue.code === code && issue.path.length === 0,
    )?.message;

/**
 * A checkbox group's `.min()` / `.max()` has no attribute — `required` on a
 * box would require that box — so it crosses as rules the browser runs, the
 * same way a declared rule does.
 */
const countRulesOf = (
  name: string,
  bounds: { minItems?: number; maxItems?: number; array: $ZodType },
  options: readonly unknown[],
): { rules: DerivedRule[]; dropped: string[] } => {
  const rules: DerivedRule[] = [];
  const dropped: string[] = [];
  if (bounds.minItems !== undefined && bounds.minItems > 0) {
    const checked = bounds.minItems - 1;
    const message = countMessage(bounds.array, options, checked, 'too_small');
    if (message === undefined) {
      dropped.push(
        `${String(checked)}個チェックしたときに zod が .min(${String(bounds.minItems)}) の文言を返さないため、下限をブラウザでは検査しません`,
      );
    } else {
      rules.push({
        kind: 'minChecked',
        field: name,
        min: bounds.minItems,
        message,
      });
    }
  }
  if (bounds.maxItems !== undefined && bounds.maxItems < options.length) {
    const checked = bounds.maxItems + 1;
    const message = countMessage(bounds.array, options, checked, 'too_big');
    if (message === undefined) {
      dropped.push(
        `${String(checked)}個チェックしたときに zod が .max(${String(bounds.maxItems)}) の文言を返さないため、上限をブラウザでは検査しません`,
      );
    } else {
      rules.push({
        kind: 'maxChecked',
        field: name,
        max: bounds.maxItems,
        message,
      });
    }
  }
  return { rules, dropped };
};

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
export const formFields = <Source extends ObjectSchema | FormDefinition>(
  input: Source,
): FormFields<Source> => {
  const { schema, rules } = asDefinition<ObjectSchema>(input);
  const map = schemaMap(schema);
  const fields: Record<string, DerivedField<AnyFieldInput>> = {};
  const arrays: Record<string, AnyDerivedArray> = {};
  const dropped: DroppedCheck[] = [];
  const countRules: DerivedRule[] = [];

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
    const fieldInput: AnyFieldInput =
      leaf.checkedValue === undefined
        ? attributes.input
        : { ...attributes.input, value: leaf.checkedValue };

    if (leaf.group !== undefined) {
      if (leaf.arrayPath === null) {
        const count = countRulesOf(leaf.name, leaf.group, leaf.json.enum ?? []);
        countRules.push(...count.rules);
        for (const reason of count.dropped) {
          dropped.push({ field: leaf.path, reason });
        }
      } else if (
        leaf.group.minItems !== undefined ||
        leaf.group.maxItems !== undefined
      ) {
        dropped.push({
          field: leaf.path,
          reason:
            '繰り返し行の中のチェックボックス群は、行ごとの name を指すルールが無いため、個数の制限をブラウザでは検査しません',
        });
      }
    }

    const derived: DerivedField<AnyFieldInput> = {
      input: fieldInput,
      messages: messagesFor(
        leaf.zod,
        fieldInput,
        leaf.required,
        emptySubmissionOf(leaf.kind),
      ),
      secret,
      ...(leaf.group !== undefined && {
        group: { minItems: leaf.group.minItems, maxItems: leaf.group.maxItems },
      }),
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
  // 欄ごとの input の型はスキーマの型から決まり、実行時に組み立てた表からは
  // 導けない。表は同じスキーマを歩いて作っているので、ここで型を付け替える
  return {
    fields,
    arrays,
    rules: [...rules.map((rule) => deriveRule(rule)), ...countRules],
    dropped,
  } as FormFields<Source>;
};
