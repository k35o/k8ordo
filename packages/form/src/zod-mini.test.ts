import * as zm from 'zod/mini';
import { globalRegistry } from 'zod/v4/core';

import { formFields } from './derive/form-fields';
import { parseForm } from './parse/parse-form';

/**
 * `zod/mini` is the same core with a seven-times-smaller surface. Nothing here
 * should notice which entry the caller reached for.
 */
describe('a schema written with zod/mini', () => {
  const schema = zm.object({
    title: zm.string().check(zm.minLength(1, 'タイトルを入力してください')),
    blogId: zm.coerce.number().check(zm.int(), zm.positive()),
    items: zm.array(zm.object({ name: zm.string().check(zm.minLength(1)) })),
  });

  it('derives the same attributes and messages', () => {
    const { fields, arrays } = formFields(schema);

    expect(fields.title.input).toMatchObject({
      name: 'title',
      required: true,
      minLength: 1,
    });
    expect(fields.title.messages.valueMissing).toBe(
      'タイトルを入力してください',
    );
    expect(arrays.items.item.name?.input.name).toBe('items[{index}].name');
  });

  it('marks a secret through the registry, which mini has instead of .meta()', () => {
    const password = zm.string().check(zm.minLength(8));
    globalRegistry.add(password, { input: 'password' });

    const { fields } = formFields(zm.object({ password }));

    expect(fields.password.secret).toBe(true);
    expect(fields.password.input.type).toBe('password');
  });

  it('parses a submission the same way', () => {
    const formData = new FormData();
    formData.append('title', 'k8ordo');
    formData.append('blogId', '3');
    formData.append('items[0].name', 'ねじ');

    const result = parseForm(schema, formData);

    expect(result.success).toBe(true);
    expect(result.data).toStrictEqual({
      title: 'k8ordo',
      blogId: 3,
      items: [{ name: 'ねじ' }],
    });
  });
});
