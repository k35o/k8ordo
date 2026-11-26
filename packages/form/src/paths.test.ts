import { describe, expect, it } from 'vite-plus/test';
import { z } from 'zod';

import { formFields } from './derive/form-fields';
import { defineForm } from './rules/define-form';
import type { FormDefinition } from './rules/define-form';
import { sameAs } from './rules/rules';
import type { ObjectSchema } from './schema/object-schema';
import type {
  CheckboxGroupInput,
  CheckboxInput,
  DerivedArray,
  FileInput,
  FormFields,
  NumberInput,
  StringCheckboxInput,
} from './types';
import { useForm } from './use-form';
import type { ArrayView, FieldView, RowView, UseFormReturn } from './use-form';

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

      const inStock: string = form.field('inStock').input.value;
      const gift: string = form.field('address.gift').input.value;
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

  it('types each input by the control its schema derives', () => {
    const kinds = formFields(
      z.object({
        title: z.string(),
        plan: z.enum(['free', 'pro']),
        quantity: z.coerce.number().int().min(1).optional(),
        notify: z.boolean().default(false),
        inStock: z.stringbool().optional(),
        avatar: z.file(),
        nullableNumber: z.coerce.number().nullable(),
        topics: z.array(z.enum(['a', 'b'])),
      }),
    );

    const useCompileTimeOnly = (): void => {
      const form = useForm(kinds);

      const types: [
        Equal<FieldView, ReturnType<typeof form.field<'title'>>>,
        Equal<FieldView, ReturnType<typeof form.field<'plan'>>>,
        Equal<
          FieldView<NumberInput>,
          ReturnType<typeof form.field<'quantity'>>
        >,
        Equal<
          FieldView<CheckboxInput>,
          ReturnType<typeof form.field<'notify'>>
        >,
        Equal<
          FieldView<StringCheckboxInput>,
          ReturnType<typeof form.field<'inStock'>>
        >,
        Equal<FieldView<FileInput>, ReturnType<typeof form.field<'avatar'>>>,
        Equal<FieldView, ReturnType<typeof form.field<'nullableNumber'>>>,
        Equal<
          FieldView<CheckboxGroupInput>,
          ReturnType<typeof form.field<'topics'>>
        >,
      ] = [true, true, true, true, true, true, true, true];

      // @ts-expect-error a file control cannot take a value back
      const avatar: unknown = form.field('avatar').input.defaultValue;

      expect([types, avatar]).toBeDefined();
    };

    expect(useCompileTimeOnly).toBeTypeOf('function');
  });

  it('types each field of a row by its key, as field() types a path', () => {
    const rows = formFields(
      z.object({
        talks: z.array(
          z.object({
            title: z.string(),
            minutes: z.coerce.number(),
            topics: z.array(z.enum(['a', 'b'])),
            slides: z.object({ public: z.stringbool().optional() }),
          }),
        ),
        scores: z.array(z.coerce.number()),
        picks: z.array(z.array(z.enum(['a', 'b']))),
      }),
    );

    const useCompileTimeOnly = (): void => {
      const form = useForm(rows);

      for (const row of form.array('talks').rows) {
        const types: [
          Equal<FieldView, ReturnType<typeof row.field<'title'>>>,
          Equal<
            FieldView<NumberInput>,
            ReturnType<typeof row.field<'minutes'>>
          >,
          Equal<
            FieldView<CheckboxGroupInput>,
            ReturnType<typeof row.field<'topics'>>
          >,
          Equal<
            FieldView<StringCheckboxInput>,
            ReturnType<typeof row.field<'slides.public'>>
          >,
        ] = [true, true, true, true];
        // @ts-expect-error 'titel' is not a field of the row
        row.field('titel');
        // @ts-expect-error a row of an object names the field it wants
        row.field();
        expect(types).toBeDefined();
      }

      for (const row of form.array('scores').rows) {
        const score: FieldView<NumberInput> = row.field();
        const same: FieldView<NumberInput> = row.field('');
        expect([score, same]).toBeDefined();
      }

      for (const row of form.array('picks').rows) {
        const picked: FieldView<CheckboxGroupInput> = row.field();
        const checked: string[] | undefined = picked.input.defaultValue;
        expect(checked).toBeDefined();
      }
    };

    expect(useCompileTimeOnly).toBeTypeOf('function');
  });

  it('passes each field of a row to a child that takes its FieldView', () => {
    const rows = formFields(
      z.object({
        talks: z.array(
          z.object({
            title: z.string(),
            minutes: z.coerce.number(),
            topics: z.array(z.enum(['a', 'b'])),
          }),
        ),
      }),
    );
    const TextInput = ({ field }: { field: FieldView }): string =>
      field.input.name;
    const NumberInputField = ({
      field,
    }: {
      field: FieldView<NumberInput>;
    }): string => field.input.name;
    const Group = ({
      field,
    }: {
      field: FieldView<CheckboxGroupInput>;
    }): string => field.input.name;

    const useCompileTimeOnly = (): string[] => {
      const form = useForm(rows);
      return form
        .array('talks')
        .rows.flatMap((row) => [
          TextInput({ field: row.field('title') }),
          TextInput({ field: row.field('minutes') }),
          NumberInputField({ field: row.field('minutes') }),
          Group({ field: row.field('topics') }),
        ]);
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

  it('passes a whole row to a child that takes its RowView', () => {
    const ItemRow = ({
      row,
    }: {
      row: RowView<typeof schema, 'items'>;
    }): string => row.field('name').input.name;

    const useCompileTimeOnly = (): string[] => {
      const form = useForm(derived);
      return form.array('items').rows.map((row) => ItemRow({ row }));
    };

    expect(useCompileTimeOnly).toBeTypeOf('function');
  });

  it('names the array types by the schema and the array path alike', () => {
    const useCompileTimeOnly = (): void => {
      const form = useForm(derived);
      const types: [
        Equal<
          ArrayView<typeof schema, 'items'>,
          ReturnType<typeof form.array<'items'>>
        >,
        Equal<
          RowView<typeof definition, 'items'>,
          RowView<typeof schema, 'items'>
        >,
        Equal<
          DerivedArray<typeof schema, 'items'>,
          FormFields<typeof schema>['arrays']['items']
        >,
      ] = [true, true, true];
      expect(types).toBeDefined();
    };

    expect(useCompileTimeOnly).toBeTypeOf('function');
  });

  it('refuses a row type that does not name its schema and array path', () => {
    // @ts-expect-error a RowView is named by the schema and the array path
    type BareRow = (props: { row: RowView }) => string;
    // @ts-expect-error 'title' is a field, not an array of rows
    type FieldRow = (props: { row: RowView<typeof schema, 'title'> }) => string;
    const children: Array<BareRow | FieldRow> = [];

    expect(children).toHaveLength(0);
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
