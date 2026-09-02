import type { FieldPathsOf } from '../paths';
import type { ObjectSchema } from '../schema/object-schema';
import type { Rule } from './rules';

/**
 * A schema plus the checks HTML cannot express. Declaring them together is
 * what keeps the client and the server working from one source: `formFields`
 * serializes the rules for the browser, `parseForm` runs them on submit.
 *
 * The rules are typed against the schema's own paths, so
 * `sameAs('confrim', …)` is a compile error, not a rule that never fires.
 */
export type FormDefinition<Schema extends ObjectSchema = ObjectSchema> = {
  schema: Schema;
  rules: Array<Rule<FieldPathsOf<Schema>>>;
};

export const defineForm = <Schema extends ObjectSchema>(
  schema: Schema,
  rules: Array<Rule<FieldPathsOf<Schema>>> = [],
): FormDefinition<Schema> => ({ schema, rules });

/** Accept either a bare schema or a definition, so rules stay optional. */
export const asDefinition = <Schema extends ObjectSchema>(
  input: FormDefinition<Schema> | Schema,
): FormDefinition<Schema> =>
  'schema' in input ? input : { schema: input, rules: [] };
