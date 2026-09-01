import { z } from 'zod';

import { formFields } from '../derive/form-fields';
import { parseForm } from '../parse/parse-form';

const schema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  user: z.object({
    email: z.email('メールアドレスの形式で'),
    age: z.coerce.number().int(),
  }),
  items: z
    .array(
      z.object({
        name: z.string().min(1, '品名は必須です'),
        qty: z.coerce.number(),
      }),
    )
    .min(1)
    .max(3),
  tags: z.array(z.string().min(1)),
});

const formDataOf = (entries: Array<[string, string]>): FormData => {
  const formData = new FormData();
  for (const [key, value] of entries) {
    formData.append(key, value);
  }
  return formData;
};

describe('nested and repeated fields', () => {
  it('gives a nested field the dotted name the browser will submit', () => {
    const { fields } = formFields(schema);

    expect(fields['user.email'].input.name).toBe('user.email');
    expect(fields['user.email'].input.type).toBe('email');
    expect(fields['user.age'].input.type).toBe('number');
  });

  it('describes a repeated item once, with the row index left open', () => {
    const { arrays } = formFields(schema);

    expect(arrays.items.minItems).toBe(1);
    expect(arrays.items.maxItems).toBe(3);
    expect(arrays.items.item.name?.input.name).toBe('items[{index}].name');
    expect(arrays.items.item.qty?.input.type).toBe('number');
  });

  it("keys a scalar array's item under the empty string", () => {
    const { arrays } = formFields(schema);

    expect(arrays.tags.item['']?.input.name).toBe('tags[{index}]');
  });

  it('never emits the safe-integer bounds that .int() carries', () => {
    const { fields } = formFields(schema);

    expect(fields['user.age'].input.min).toBeUndefined();
    expect(fields['user.age'].input.max).toBeUndefined();
  });

  it('rebuilds the nested and repeated shape from the submitted names', () => {
    const result = parseForm(
      schema,
      formDataOf([
        ['title', 'k8ordo'],
        ['user.email', 'k8o@example.com'],
        ['user.age', '30'],
        ['items[0].name', 'ねじ'],
        ['items[0].qty', '2'],
        ['items[1].name', 'ばね'],
        ['items[1].qty', '5'],
        ['tags[0]', 'a'],
      ]),
    );

    expect(result.success).toBe(true);
    expect(result.data).toStrictEqual({
      title: 'k8ordo',
      user: { email: 'k8o@example.com', age: 30 },
      items: [
        { name: 'ねじ', qty: 2 },
        { name: 'ばね', qty: 5 },
      ],
      tags: ['a'],
    });
  });

  it('keys an error by the name of the input that produced it', () => {
    const result = parseForm(
      schema,
      formDataOf([
        ['title', 'k8ordo'],
        ['user.email', 'not-an-email'],
        ['user.age', '30'],
        ['items[0].name', ''],
        ['items[0].qty', '2'],
      ]),
    );

    expect(result.success).toBe(false);
    expect(result.state.errors).toStrictEqual({
      'user.email': 'メールアドレスの形式で',
      'items[0].name': '品名は必須です',
    });
  });

  it('reports how many rows arrived so a no-JS retry rebuilds them', () => {
    const result = parseForm(
      schema,
      formDataOf([
        ['title', ''],
        ['user.email', 'k8o@example.com'],
        ['user.age', '30'],
        ['items[0].name', 'ねじ'],
        ['items[0].qty', '2'],
        ['items[1].name', 'ばね'],
        ['items[1].qty', '5'],
        ['tags[0]', 'a'],
        ['tags[1]', 'b'],
      ]),
    );

    expect(result.state.rows).toStrictEqual({ items: 2, tags: 2 });
  });

  it('accepts an array with no rows without calling it a wiring error', () => {
    const optionalRows = z.object({
      title: z.string(),
      items: z.array(z.object({ name: z.string() })),
    });

    const result = parseForm(optionalRows, formDataOf([['title', 'x']]));

    expect(result.success).toBe(true);
    expect(result.data).toStrictEqual({ title: 'x', items: [] });
  });
});
