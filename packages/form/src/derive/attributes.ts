import type { DroppedCheck, FieldInput } from '../types';

/** The subset of JSON Schema that `z.toJSONSchema` emits for a leaf field. */
export type LeafSchema = {
  type?: string;
  format?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
  enum?: unknown[];
  contentMediaType?: string;
  anyOf?: LeafSchema[];
  /** Where zod puts a string's patterns once there is more than one. */
  allOf?: LeafSchema[];
};

/**
 * Which control a leaf becomes, at the resolution the submission cares about.
 * `attributesFor` needs the finer distinctions (`email` vs `url`); the walk and
 * the parse need only this. The walk settles it once per leaf, and both read it
 * from there, which is what keeps the three from disagreeing about what an
 * untouched control submits.
 *
 * チェックボックスは、スキーマが何を読むかで 2 つに分かれる。`checkbox` は
 * チェックの有無を真偽値で（`z.boolean()`）、`string-checkbox` は送られた
 * 文字列か何も無いかを（`z.stringbool()`）読む。JSON Schema ではどちらも
 * boolean なので、分けられるのは walk だけ。
 */
export type ControlKind =
  | 'checkbox'
  | 'choice'
  | 'file'
  | 'number'
  | 'string-checkbox'
  | 'text';

export const controlKindOf = (schema: LeafSchema): ControlKind => {
  if (schema.format === 'binary') {
    return 'file';
  }
  if (schema.enum !== undefined) {
    return 'choice';
  }
  if (schema.type === 'boolean') {
    return 'checkbox';
  }
  if (schema.type === 'integer' || schema.type === 'number') {
    return 'number';
  }
  return 'text';
};

/**
 * What the control hands the schema when nobody fills it in. A text field
 * always submits `''` and an unchecked checkbox parses to `false`, but a
 * number, a file and a choice have no such value: an empty numeric field is not
 * 0, an unfilled file input is not a zero-byte file, and a select left on its
 * placeholder has chosen nothing — just like a radio group with no selection,
 * which submits no entry at all (as does an unchecked `string-checkbox`).
 * Reading them as "nothing was entered" is what keeps `required` honest —
 * `z.coerce.number()` turns `''` into 0, so probing with `''` would say an
 * empty field is acceptable and then let a blank submission through as a
 * number the person never typed.
 */
export const emptySubmissionOf = (kind: ControlKind): unknown => {
  if (kind === 'checkbox') {
    return false;
  }
  return kind === 'text' ? '' : undefined;
};

/**
 * `.int()` carries JavaScript's safe-integer range into the schema. Emitting it
 * as `max` would put 9007199254740991 in the markup, which tells a reader
 * nothing and is never the bound the author meant.
 */
const JS_SAFE_INTEGER_BOUNDS = new Set([
  Number.MAX_SAFE_INTEGER,
  Number.MIN_SAFE_INTEGER,
]);

const FORMAT_TO_INPUT_TYPE: Record<string, string> = {
  date: 'date',
  'date-time': 'datetime-local',
  duration: 'text',
  email: 'email',
  ipv4: 'text',
  ipv6: 'text',
  time: 'time',
  uri: 'url',
  uuid: 'text',
};

/** `pattern` is ignored by the browser on these input types. */
const TYPES_WITHOUT_PATTERN = new Set([
  'checkbox',
  'date',
  'datetime-local',
  'number',
  'time',
]);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/**
 * A regex only reaches the markup when the browser will read it the way zod
 * does. Three things silently change its meaning there: the `pattern`
 * attribute matches the whole value while a zod regex matches a substring, the
 * attribute is always case-sensitive, and browsers compile it with the `v`
 * flag — an expression that fails that compile is not an error but a pattern
 * the browser ignores wholesale (zod's own email regex is one).
 */
const patternVerdict = (
  source: string,
  flags: string | undefined,
): string | undefined => {
  if (flags !== undefined && flags !== '' && flags !== 'u') {
    return `フラグ '${flags}' は HTML の pattern に存在しないため、ブラウザ側だけ判定が変わります`;
  }
  if (!source.startsWith('^') || !source.endsWith('$')) {
    return 'HTML の pattern は全体一致、zod の regex は部分一致のため、^…$ で括られていない正規表現は意味が変わります';
  }
  const compiles = ((): boolean => {
    try {
      return new RegExp(source, 'v').flags === 'v';
    } catch {
      return false;
    }
  })();
  return compiles
    ? undefined
    : 'ブラウザは pattern を v フラグで解釈し、コンパイルできない正規表現は黙って無視します';
};

/** Whether a JSON Schema `format` names what a control submits, not a refinement of it. */
export const namesAControl = (format: string): boolean =>
  Object.hasOwn(FORMAT_TO_INPUT_TYPE, format);

/** What the JSON Schema has already lost, recovered from the zod side when it can be. */
export type PatternHints = {
  /** Flags of the RegExp behind a lone `pattern`. */
  flags?: string;
  /** Source of the regex the format itself carries, as opposed to one stacked on it. */
  ofFormat?: string;
};

/**
 * Turn one leaf JSON Schema into input attributes, collecting whatever HTML
 * cannot express. Anything not representable is returned rather than dropped,
 * so the caller can report it instead of leaving the author to discover at
 * runtime that a check never ran on the client.
 */
export const attributesFor = (
  name: string,
  schema: LeafSchema,
  required: boolean,
  hints: PatternHints = {},
): { input: FieldInput; dropped: DroppedCheck[] } => {
  const input: FieldInput = { name };
  const dropped: DroppedCheck[] = [];

  if (required) {
    input.required = true;
  }

  if (controlKindOf(schema) === 'file') {
    input.type = 'file';
    // A single mime type lands in `contentMediaType`, several in an `anyOf` of
    // them — the same `.mime()` call either way.
    const accept = [
      schema.contentMediaType,
      ...(schema.anyOf ?? []).map((branch) => branch.contentMediaType),
    ].filter((type) => type !== undefined);
    if (accept.length > 0) {
      input.accept = accept.join(',');
      dropped.push({
        field: name,
        reason:
          'accept はファイル選択ダイアログの候補を絞るだけで、ブラウザは選ばれたファイルの MIME タイプを検査しません',
      });
    }
    if (schema.minLength !== undefined || schema.maxLength !== undefined) {
      // On type="file" they are byte counts, and minlength / maxlength do not
      // apply to a file control at all.
      dropped.push({
        field: name,
        reason:
          'ファイルサイズの制限に対応する HTML 属性はありません（minlength / maxlength は type="file" では無視されます）',
      });
    }
    return { input, dropped };
  }

  if (schema.anyOf !== undefined) {
    // A scalar union renders as a plain text input; whatever constraints live
    // inside the branches cannot be lifted out without picking a branch.
    input.type = 'text';
    dropped.push({
      field: name,
      reason:
        'nullable / union の中の制約は、どの枝を検査すべきか決まらないため属性に落ちません',
    });
    return { input, dropped };
  }

  if (schema.enum !== undefined) {
    // Rendered as a select or a radio group, so there is no input type to pick
    // and the browser enforces membership by construction.
    return { input, dropped };
  }

  if (schema.type === 'boolean') {
    input.type = 'checkbox';
    return { input, dropped };
  }

  if (schema.type === 'integer' || schema.type === 'number') {
    input.type = 'number';
    input.step =
      schema.type === 'integer'
        ? (schema.multipleOf ?? 1)
        : (schema.multipleOf ?? 'any');

    if (
      isFiniteNumber(schema.minimum) &&
      !JS_SAFE_INTEGER_BOUNDS.has(schema.minimum)
    ) {
      input.min = schema.minimum;
    } else if (isFiniteNumber(schema.exclusiveMinimum)) {
      if (schema.type === 'integer') {
        input.min = schema.exclusiveMinimum + 1;
      } else {
        dropped.push({
          field: name,
          reason: `exclusiveMinimum ${String(schema.exclusiveMinimum)} — HTML の min は境界を含むため表現できません`,
        });
      }
    }

    if (
      isFiniteNumber(schema.maximum) &&
      !JS_SAFE_INTEGER_BOUNDS.has(schema.maximum)
    ) {
      input.max = schema.maximum;
    } else if (isFiniteNumber(schema.exclusiveMaximum)) {
      if (schema.type === 'integer') {
        input.max = schema.exclusiveMaximum - 1;
      } else {
        dropped.push({
          field: name,
          reason: `exclusiveMaximum ${String(schema.exclusiveMaximum)} — HTML の max は境界を含むため表現できません`,
        });
      }
    }

    return { input, dropped };
  }

  if (schema.type !== 'string') {
    // An empty node — what `.transform()`, `.pipe()` into a non-JSON type,
    // z.custom() and z.unknown() all become — carries nothing to build a
    // control from. A text input is the only thing left, but nothing about it
    // is derived, so it is reported rather than presented as a derivation.
    input.type = 'text';
    dropped.push({
      field: name,
      reason:
        'スキーマから制約を読み取れないため（transform / pipe / custom など）、type="text" 以外は何も導出できません。ブラウザ側では何も検査されません',
    });
    return { input, dropped };
  }

  input.type =
    schema.format === undefined
      ? 'text'
      : (FORMAT_TO_INPUT_TYPE[schema.format] ?? 'text');

  if (isFiniteNumber(schema.minLength) && schema.minLength > 0) {
    input.minLength = schema.minLength;
  }
  if (isFiniteNumber(schema.maxLength)) {
    input.maxLength = schema.maxLength;
  }

  const patterns =
    schema.pattern === undefined
      ? (schema.allOf ?? []).flatMap((branch) =>
          branch.pattern === undefined ? [] : [branch.pattern],
        )
      : [schema.pattern];

  if (TYPES_WITHOUT_PATTERN.has(input.type)) {
    // type="date" already constrains the value far more tightly than the
    // format's own regex would, so losing that one costs nothing. A regex
    // stacked on top is a different check, and it is lost all the same.
    const ignored = patterns.filter(
      (pattern) =>
        !(
          (input.type === 'date' || input.type === 'datetime-local') &&
          pattern === hints.ofFormat
        ),
    );
    if (ignored.length > 0) {
      dropped.push({
        field: name,
        reason: `pattern は type="${input.type}" では無視されます`,
      });
    }
  } else if (patterns.length > 1) {
    // One of them could be emitted, but its message is probed from the whole
    // schema, which cannot say which of the stacked regexes a value failed.
    dropped.push({
      field: name,
      reason: `HTML の pattern は 1 つしか持てないため、重ねた ${String(patterns.length)} 個の正規表現はブラウザでは検査されません`,
    });
  } else if (patterns[0] !== undefined) {
    const verdict = patternVerdict(patterns[0], hints.flags);
    if (verdict === undefined) {
      input.pattern = patterns[0];
    } else {
      dropped.push({ field: name, reason: verdict });
    }
  }

  return { input, dropped };
};
