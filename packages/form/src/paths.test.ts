import { describe, expect, it } from 'vite-plus/test';
import { z } from 'zod';

import { formFields } from './derive/form-fields';
import { defineForm } from './rules/define-form';
import type { FormDefinition } from './rules/define-form';
import { sameAs } from './rules/rules';
import type { ObjectSchema } from './schema/object-schema';
import type { FormFields } from './types';
import { useForm } from './use-form';
import type { FieldView, UseFormReturn } from './use-form';

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
    // Keyed by the schema's own paths rather than by string, so this is not
    // `possibly undefined` and a typo here fails the build too.
    expect(fields.title.input.name).toBe('title');
    expect(fields['user.email'].input.type).toBe('email');
  });

  it('types value only on a checkbox that submits the string its schema reads', () => {
    const settings = formFields(
      z.object({
        title: z.string(),
        notify: z.boolean(),
        inStock: z.stringbool().default(false),
        address: z.object({ gift: z.stringbool().optional() }),
      }),
    );
    // A spread of the other fields has to reach a component that takes
    // `value` only when it is controlled, the way @k8ordo/ui's fields do.
    type Uncontrolled = { name: string; value?: never };

    const useCompileTimeOnly = (): void => {
      const form = useForm(settings);

      const inStock: string | undefined = form.field('inStock').input.value;
      const gift: string | undefined = form.field('address.gift').input.value;
      // @ts-expect-error a text field submits what is typed, not a value of its own
      const titleValue: unknown = form.field('title').input.value;
      // @ts-expect-error a z.boolean() box is read as checked or not, whatever it submits
      const notifyValue: unknown = form.field('notify').input.value;

      const title: Uncontrolled = form.field('title').input;
      const notify: Uncontrolled = form.field('notify').input;
      // @ts-expect-error the stringbool box does carry a value
      const box: Uncontrolled = form.field('inStock').input;

      expect([
        inStock,
        gift,
        titleValue,
        notifyValue,
        title,
        notify,
        box,
      ]).toBeDefined();
    };

    expect(useCompileTimeOnly).toBeTypeOf('function');
  });
});

type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

describe('FormFields and UseFormReturn are named by the schema', () => {
  const definition = defineForm(schema, [
    sameAs('title', 'user.email', '一致しません'),
  ]);

  it('types what formFields returns, for a schema and for a definition alike', () => {
    const fromSchema: Equal<
      ReturnType<typeof formFields<typeof schema>>,
      FormFields<typeof schema>
    > = true;
    const fromDefinition: Equal<
      ReturnType<typeof formFields<typeof definition>>,
      FormFields<typeof definition>
    > = true;
    const sameEitherWay: Equal<
      FormFields<typeof definition>,
      FormFields<typeof schema>
    > = true;

    expect([fromSchema, fromDefinition, sameEitherWay]).toBeDefined();
  });

  it('lets a Client Component take the fields as props and keep every path typed', () => {
    const useClientComponent = ({
      fields: props,
    }: {
      fields: FormFields<typeof definition>;
    }): UseFormReturn<typeof definition> => {
      const form = useForm(props);
      form.field('title');
      // @ts-expect-error 'titel' is not a field in the schema
      form.field('titel');
      form.array('items');
      // @ts-expect-error a checkbox group is a field, not repeated rows
      form.array('tags');
      return form;
    };

    expect(useClientComponent).toBeTypeOf('function');
  });

  it('passes one field to a child component as its FieldView', () => {
    const TitleInput = ({ field }: { field: FieldView }): string =>
      field.input.name;

    const useCompileTimeOnly = (): string => {
      const form = useForm(derived);
      return TitleInput({ field: form.field('title') });
    };

    expect(useCompileTimeOnly).toBeTypeOf('function');
  });

  it('carries the schema through a component generic over it', () => {
    const useGeneric = <Source extends ObjectSchema | FormDefinition>(
      props: FormFields<Source>,
    ): UseFormReturn<Source> => useForm(props);

    const useCompileTimeOnly = (): void => {
      const form = useGeneric(derived);
      form.field('user.email');
      // @ts-expect-error 'titel' is not a field in the schema
      form.field('titel');
    };

    expect(useCompileTimeOnly).toBeTypeOf('function');
  });
});
