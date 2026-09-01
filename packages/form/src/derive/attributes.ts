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
 * Turn one leaf JSON Schema into input attributes, collecting whatever HTML
 * cannot express. Anything not representable is returned rather than dropped,
 * so the caller can report it instead of leaving the author to discover at
 * runtime that a check never ran on the client.
 */
export const attributesFor = (
  name: string,
  schema: LeafSchema,
  required: boolean,
): { input: FieldInput; dropped: DroppedCheck[] } => {
  const input: FieldInput = { name };
  const dropped: DroppedCheck[] = [];

  if (required) {
    input.required = true;
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
    input.step = schema.type === 'integer' ? 1 : (schema.multipleOf ?? 'any');

    if (isFiniteNumber(schema.minimum)) {
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

  if (schema.pattern !== undefined) {
    if (TYPES_WITHOUT_PATTERN.has(input.type)) {
      // type="date" already constrains the value far more tightly than the
      // regex would, so losing it costs nothing.
      if (input.type !== 'date' && input.type !== 'datetime-local') {
        dropped.push({
          field: name,
          reason: `pattern は type="${input.type}" では無視されます`,
        });
      }
    } else {
      // Kept even alongside type="email": the browser's own email rule accepts
      // values zod rejects, and emitting the pattern is what makes the client
      // agree with the server.
      input.pattern = schema.pattern;
    }
  }

  return { input, dropped };
};
