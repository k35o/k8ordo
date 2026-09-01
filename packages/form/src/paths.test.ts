import { z } from 'zod';

import { formFields } from './derive/form-fields';
import { useForm } from './use-form';

const schema = z.object({
  title: z.string(),
  user: z.object({ email: z.email() }),
  items: z.array(z.object({ name: z.string() })),
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
      // @ts-expect-error 'titel' is not a field in the schema
      form.field('titel');
      // @ts-expect-error 'items' is an array, reached through array()
      form.field('items');

      form.array('items');
      // @ts-expect-error 'user' is an object, not an array
      form.array('user');
    };

    expect(useCompileTimeOnly).toBeTypeOf('function');
  });

  it('keeps the derived fields addressable without an undefined check', () => {
    // Record<FieldPath, …> rather than Record<string, …>, so this is not
    // `possibly undefined` and a typo here fails the build too.
    expect(fields.title.input.name).toBe('title');
    expect(fields['user.email'].input.type).toBe('email');
  });
});
