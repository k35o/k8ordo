import { z } from 'zod';

import { parseForm } from './parse-form';

const formDataOf = (entries: Array<[string, string]>): FormData => {
  const formData = new FormData();
  for (const [key, value] of entries) {
    formData.append(key, value);
  }
  return formData;
};

describe('parseForm', () => {
  const schema = z.object({
    title: z.string().min(1, 'タイトルを入力してください'),
    blogId: z.coerce.number().int().positive('ブログを選んでください'),
    subscribed: z.boolean(),
  });

  it('validates and returns typed data', () => {
    const result = parseForm(
      schema,
      formDataOf([
        ['title', 'k8ordo'],
        ['blogId', '3'],
        ['subscribed', 'on'],
      ]),
    );

    expect(result.success).toBe(true);
    expect(result.data).toStrictEqual({
      title: 'k8ordo',
      blogId: 3,
      subscribed: true,
    });
  });

  it('reads an unchecked checkbox as false rather than missing', () => {
    const result = parseForm(
      schema,
      formDataOf([
        ['title', 'k8ordo'],
        ['blogId', '3'],
      ]),
    );

    expect(result.success).toBe(true);
    expect(result.data?.subscribed).toBe(false);
  });

  it('returns one error per field, keyed by the schema key', () => {
    const result = parseForm(
      schema,
      formDataOf([
        ['title', ''],
        ['blogId', '0'],
      ]),
    );

    expect(result.success).toBe(false);
    expect(result.state.errors).toStrictEqual({
      title: 'タイトルを入力してください',
      blogId: 'ブログを選んでください',
    });
  });

  it('gives back the submitted values so a no-JS retry keeps the input', () => {
    const result = parseForm(
      schema,
      formDataOf([
        ['title', ''],
        ['blogId', '7'],
      ]),
    );

    expect(result.state.values).toMatchObject({ title: '', blogId: '7' });
  });

  it('never echoes a secret field back', () => {
    const withPassword = z.object({
      email: z.email(),
      password: z.string().min(8).meta({ input: 'password' }),
    });

    const result = parseForm(
      withPassword,
      formDataOf([
        ['email', 'not-an-email'],
        ['password', 'hunter2hunter2'],
      ]),
    );

    expect(result.success).toBe(false);
    expect(result.state.values).toStrictEqual({ email: 'not-an-email' });
    expect(result.state.values).not.toHaveProperty('password');
  });

  it('raises a wiring error when an input never carried the name', () => {
    // Forgetting to spread the field props is the failure mode that makes
    // react-hook-form silently submit nothing. It has to be loud.
    expect(() => parseForm(schema, formDataOf([['blogId', '3']]))).toThrow(
      /送信されていません: title/u,
    );
  });

  it('reads a checkbox group through its shared name, empty included', () => {
    const grouped = z.object({ tags: z.array(z.enum(['a', 'b', 'c'])).min(2) });

    const two = parseForm(
      grouped,
      formDataOf([
        ['tags', 'a'],
        ['tags', 'b'],
      ]),
    );
    expect(two.success).toBe(true);
    expect(two.data?.tags).toStrictEqual(['a', 'b']);
    // One box checked still parses as an array of one, and the schema's own
    // bound rejects it — no wiring error for the rest being unchecked.
    const one = parseForm(grouped, formDataOf([['tags', 'a']]));
    expect(one.success).toBe(false);
    expect(one.state.errors?.tags).toBeDefined();
    const none = parseForm(grouped, formDataOf([]));
    expect(none.success).toBe(false);
  });

  it('treats an unselected radio group as a validation error, not a wiring one', () => {
    // A radio group with nothing selected submits no entry at all — a state
    // the person can reach, unlike a text control.
    const withChoice = z.object({ color: z.enum(['red', 'blue']) });

    const result = parseForm(withChoice, formDataOf([]));

    expect(result.success).toBe(false);
    expect(result.state.errors?.color).toBeDefined();
  });

  it('caps reconstructed rows instead of allocating what a forged key claims', () => {
    const listed = z.object({
      items: z.array(z.object({ name: z.string() })).max(3),
    });
    // One forged key must not make the parse allocate 100000001 rows.
    const forged = formDataOf([['items[100000000].name', 'x']]);

    expect(() => parseForm(listed, forged)).toThrow(/items\[0\]\.name/u);
  });

  it('routes an object-level issue to formError, not to a field', () => {
    const paired = z
      .object({
        password: z.string().min(8),
        confirm: z.string().min(8),
      })
      .refine((v) => v.password === v.confirm, { message: '一致しません' });

    const result = parseForm(
      paired,
      formDataOf([
        ['password', 'hunter2hunter2'],
        ['confirm', 'something-else'],
      ]),
    );

    expect(result.success).toBe(false);
    expect(result.state.formError).toBe('一致しません');
    expect(result.state.errors).toStrictEqual({});
  });
});
