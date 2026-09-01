import { toJSONSchema } from 'zod';
import type { ZodObject, ZodType } from 'zod';

import type { DerivedField, DroppedCheck, FormFields } from '../types';
import { attributesFor } from './attributes';
import type { LeafSchema } from './attributes';
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

const objectLevelCheckCount = (schema: ZodObject): number =>
  (schema as unknown as ZodInternals)._zod?.def?.checks?.length ?? 0;
/* oxlint-enable no-underscore-dangle */

/**
 * `required` in JSON Schema means "the key is present", but an HTML form always
 * sends every field, empty ones as ''. Asking the schema what it does with ''
 * is what makes the attribute mean the same thing on both sides: the browser
 * blocks exactly the values the server would have rejected.
 */
const rejectsEmptyString = (schema: ZodType): boolean =>
  !schema.safeParse('').success;

/**
 * Derive input attributes and messages from one zod object schema.
 *
 * Call this on the server — in a Server Component or at module scope. The
 * result is plain data, so it crosses to the client as props and zod never
 * enters the bundle.
 */
export const formFields = <Shape extends ZodObject>(
  schema: Shape,
): FormFields<keyof Shape['shape'] & string> => {
  const json = toJSONSchema(schema, {
    io: 'output',
    unrepresentable: 'any',
  }) as { properties?: Record<string, LeafSchema & { input?: string }> };

  const properties = json.properties ?? {};
  const fields: Record<string, DerivedField> = {};
  const dropped: DroppedCheck[] = [];

  for (const [name, leaf] of Object.entries(properties)) {
    const fieldSchema = schema.shape[name] as ZodType | undefined;
    if (fieldSchema === undefined) {
      continue;
    }

    const required = rejectsEmptyString(fieldSchema);
    const attributes = attributesFor(name, leaf, required);
    const secret = leaf.input === 'password';

    if (secret) {
      attributes.input.type = 'password';
    }

    fields[name] = {
      input: attributes.input,
      messages: messagesFor(fieldSchema, attributes.input, required),
      secret,
    };
    dropped.push(...attributes.dropped);
  }

  const objectChecks = objectLevelCheckCount(schema);
  if (objectChecks > 0) {
    dropped.push({
      field: '(schema)',
      reason: `${String(objectChecks)}件のオブジェクト階層のチェック（refine など）は HTML の制約属性に落ちないため、クライアントでは検査されません`,
    });
  }

  return {
    fields: fields as FormFields<keyof Shape['shape'] & string>['fields'],
    dropped,
  };
};
