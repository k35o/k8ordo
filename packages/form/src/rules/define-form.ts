import type { ZodObject } from 'zod';

import type { Rule } from './rules';

/**
 * A schema plus the checks HTML cannot express. Declaring them together is
 * what keeps the client and the server working from one source: `formFields`
 * serializes the rules for the browser, `parseForm` runs them on submit.
 */
export type FormDefinition<Schema extends ZodObject = ZodObject> = {
  schema: Schema;
  rules: Rule[];
};

export const defineForm = <Schema extends ZodObject>(
  schema: Schema,
  rules: Rule[] = [],
): FormDefinition<Schema> => ({ schema, rules });

/** Accept either a bare schema or a definition, so rules stay optional. */
export const asDefinition = <Schema extends ZodObject>(
  input: FormDefinition<Schema> | Schema,
): FormDefinition<Schema> =>
  'schema' in input ? input : { schema: input, rules: [] };
