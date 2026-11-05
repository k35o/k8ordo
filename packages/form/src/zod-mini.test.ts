import { describe, expect, it } from 'vite-plus/test';
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

  it('derives an array of enums as a checkbox group here too', () => {
    const grouped = zm.object({ tags: zm.array(zm.enum(['a', 'b'])) });

    const { fields, arrays } = formFields(grouped);
    expect(arrays).toStrictEqual({});
    expect(fields.tags.input).toStrictEqual({ name: 'tags' });

    const formData = new FormData();
    formData.append('tags', 'a');
    formData.append('tags', 'b');
    const result = parseForm(grouped, formData);
    expect(result.success).toBe(true);
    expect(result.data?.tags).toStrictEqual(['a', 'b']);
  });

  it('pairs a wrapped object and a wrapped array with their JSON nodes', () => {
    const { fields, arrays } = formFields(
      zm.object({
        profile: zm.optional(zm.object({ bio: zm.string() })),
        links: zm._default(zm.array(zm.object({ url: zm.string() })), []),
      }),
    );

    expect(fields['profile.bio'].input.name).toBe('profile.bio');
    expect(arrays.links.item.url?.input.name).toBe('links[{index}].url');
  });

  it('reads the format and the regex flags behind a wrapper', () => {
    const { fields, dropped } = formFields(
      zm.object({
        at: zm.optional(zm.iso.time()),
        email: zm.email().check(zm.regex(/^[a-z@.]+$/u)),
        flagged: zm.optional(zm.string().check(zm.regex(/^foo$/iu))),
      }),
    );

    expect(fields.at.input.type).toBe('time');
    expect(fields.email.input.type).toBe('email');
    expect(
      dropped.find((entry) => entry.field === 'flagged')?.reason,
    ).toContain("'iu'");
  });

  it('reports an object-level check here too', () => {
    const { dropped } = formFields(
      zm
        .object({ password: zm.string(), confirm: zm.string() })
        .check(zm.refine((v) => v.password === v.confirm)),
    );

    expect(dropped.map((entry) => entry.field)).toStrictEqual(['(schema)']);
  });

  it('requires a bigint field whose schema rejects a blank here too', () => {
    const { fields } = formFields(zm.object({ id: zm.coerce.bigint() }));

    expect(fields.id.input.required).toBe(true);
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
