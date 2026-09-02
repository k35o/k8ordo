import { z } from 'zod';

import { formFields } from './derive/form-fields';
import { defineForm } from './rules/define-form';
import { sameAs } from './rules/rules';
import { useForm } from './use-form';

const schema = z.object({
  title: z.string(),
  user: z.object({ email: z.email() }),
  items: z.array(z.object({ name: z.string() })),
  tags: z.array(z.enum(['a', 'b'])),
  note: z.object({ body: z.string() }).optional(),
});

const derived = formFields(schema);
const { fields } = derived;

describe('paths are derived from the schema', () => {
  it('accepts a nested path and rejects a typo at compile time', () => {
    // Never invoked — hooks cannot run outside a render, and every assertion
    // in here is for tsc. A directive that stops erroring fails the build.
    const useCompileTimeOnly = (): void => {
      const form = useForm(derived, {});

      form.field('title');
      form.field('user.email');
      // A wrapped nested object keeps its paths.
      form.field('note.body');
      // An array of enums is a checkbox group: one name, so a field.
      form.field('tags');
      // @ts-expect-error 'titel' is not a field in the schema
      form.field('titel');
      // @ts-expect-error 'items' is an array of objects, reached through array()
      form.field('items');

      form.array('items');
      // @ts-expect-error 'user' is an object, not an array
      form.array('user');
      // @ts-expect-error a checkbox group is a field, not repeated rows
      form.array('tags');
    };

    expect(useCompileTimeOnly).toBeTypeOf('function');
  });

  it('rejects a rule naming a field the schema does not have', () => {
    defineForm(schema, [sameAs('title', 'user.email', '一致しません')]);
    defineForm(schema, [
      // @ts-expect-error 'titel' is not a field in the schema
      sameAs('titel', 'title', '一致しません'),
    ]);

    expect(defineForm).toBeTypeOf('function');
  });

  it('keeps the derived fields addressable without an undefined check', () => {
    // Record<FieldPath, …> rather than Record<string, …>, so this is not
    // `possibly undefined` and a typo here fails the build too.
    expect(fields.title.input.name).toBe('title');
    expect(fields['user.email'].input.type).toBe('email');
  });
});
