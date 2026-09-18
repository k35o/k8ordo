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
    // Forgetting to spread the field props would otherwise submit nothing,
    // silently. It has to be loud.
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

  it('reads a choice left on nothing as undefined, so an optional one can stay empty', () => {
    // A radio group with nothing selected submits no entry, and a select left
    // on its placeholder submits ''. Neither is a choice, and handing '' to an
    // optional enum would reject the one blank the browser was told to allow.
    const plans = z.object({
      optional: z.enum(['free', 'team']).optional(),
      defaulted: z.enum(['free', 'team']).default('free'),
    });

    const unselected = parseForm(plans, formDataOf([]));
    expect(unselected.success).toBe(true);
    expect(unselected.data).toStrictEqual({
      optional: undefined,
      defaulted: 'free',
    });

    const placeholder = parseForm(
      plans,
      formDataOf([
        ['optional', ''],
        ['defaulted', ''],
      ]),
    );
    expect(placeholder.success).toBe(true);
    expect(placeholder.data).toStrictEqual({
      optional: undefined,
      defaulted: 'free',
    });
  });

  it('rejects a required choice left on its placeholder with the same message as an unselected one', () => {
    const plans = z.object({
      plan: z.enum(['free', 'team'], 'プランを選んでください'),
    });

    expect(
      parseForm(plans, formDataOf([['plan', '']])).state.errors,
    ).toStrictEqual({
      plan: 'プランを選んでください',
    });
    expect(parseForm(plans, formDataOf([])).state.errors).toStrictEqual({
      plan: 'プランを選んでください',
    });
  });

  it('caps reconstructed rows instead of allocating what a forged key claims', () => {
    const listed = z.object({
      items: z.array(z.object({ name: z.string() })).max(3),
    });
    // One forged key must not make the parse allocate 100000001 rows.
    const forged = formDataOf([['items[100000000].name', 'x']]);

    expect(() => parseForm(listed, forged)).toThrow(/items\[0\]\.name/u);
  });

  it('stamps each parse with its own token so identical results stay distinct', () => {
    const first = parseForm(
      schema,
      formDataOf([
        ['title', ''],
        ['blogId', '0'],
      ]),
    );
    const second = parseForm(
      schema,
      formDataOf([
        ['title', ''],
        ['blogId', '0'],
      ]),
    );

    expect(first.state.token).toBeDefined();
    expect(first.state.token).not.toBe(second.state.token);
  });

  it('echoes a shared name as an array so a group can be restored', () => {
    const grouped = z.object({ tags: z.array(z.enum(['a', 'b', 'c'])).min(3) });

    const result = parseForm(
      grouped,
      formDataOf([
        ['tags', 'a'],
        ['tags', 'b'],
      ]),
    );

    expect(result.success).toBe(false);
    expect(result.state.values?.tags).toStrictEqual(['a', 'b']);
  });

  it('echoes a checkbox group as an array however many boxes were checked', () => {
    // One checked box is still a group: a plain string would read as a single
    // value and be restored onto every box.
    const grouped = z.object({ tags: z.array(z.enum(['a', 'b', 'c'])) });

    expect(
      parseForm(grouped, formDataOf([['tags', 'a']])).state.values,
    ).toStrictEqual({
      tags: ['a'],
    });
    expect(parseForm(grouped, formDataOf([])).state.values).toStrictEqual({
      tags: [],
    });
  });

  it('reads an empty numeric control as nothing entered, never as 0', () => {
    // z.coerce.number() turns '' into 0. Handing it '' would store a number
    // nobody typed, and the same probe told the derivation the field is not
    // required — the two sides have to mean the same thing.
    const counted = z.object({ n: z.coerce.number('数値を入力してください') });

    const blank = parseForm(counted, formDataOf([['n', '']]));
    expect(blank.success).toBe(false);
    expect(blank.state.errors).toStrictEqual({ n: '数値を入力してください' });
    // The blank is still echoed, so a retry without JavaScript looks the same.
    expect(blank.state.values).toStrictEqual({ n: '' });

    const typed = parseForm(counted, formDataOf([['n', '5']]));
    expect(typed.success).toBe(true);
    expect(typed.data).toStrictEqual({ n: 5 });
  });

  it('lets an empty numeric control reach optional and default untouched', () => {
    const loose = z.object({
      optional: z.coerce.number().optional(),
      defaulted: z.coerce.number().default(5),
    });

    const result = parseForm(
      loose,
      formDataOf([
        ['optional', ''],
        ['defaulted', ''],
      ]),
    );

    expect(result.success).toBe(true);
    expect(result.data).toStrictEqual({ optional: undefined, defaulted: 5 });
  });

  it('reads an empty bigint control as nothing entered, never as 0n', () => {
    // BigInt('') is 0n, so the blank would become a value nobody typed.
    const counted = z.object({
      id: z.coerce.bigint('整数を入力してください'),
      optional: z.coerce.bigint().optional(),
    });

    const blank = parseForm(
      counted,
      formDataOf([
        ['id', ''],
        ['optional', ''],
      ]),
    );
    expect(blank.success).toBe(false);
    expect(blank.state.errors).toStrictEqual({ id: '整数を入力してください' });

    const typed = parseForm(
      counted,
      formDataOf([
        ['id', '5'],
        ['optional', ''],
      ]),
    );
    expect(typed.data).toStrictEqual({ id: 5n, optional: undefined });
  });

  it('refuses a number no submission could satisfy instead of always failing', () => {
    expect(() =>
      parseForm(z.object({ n: z.number() }), formDataOf([['n', '5']])),
    ).toThrow(/z\.coerce\.number\(\)/u);
  });

  it('reads an unfilled file input as nothing entered, not as an empty file', () => {
    // A file control always submits: an unnamed zero-byte File when nobody
    // chose anything, which z.file() would otherwise accept as an upload.
    const upload = z.object({ avatar: z.file('ファイルを選んでください') });

    const empty = new FormData();
    empty.append('avatar', new File([], ''));
    const blank = parseForm(upload, empty);
    expect(blank.success).toBe(false);
    expect(blank.state.errors).toStrictEqual({
      avatar: 'ファイルを選んでください',
    });

    const chosen = new FormData();
    chosen.append(
      'avatar',
      new File(['k8o'], 'avatar.png', { type: 'image/png' }),
    );
    const picked = parseForm(upload, chosen);
    const avatar = picked.data?.avatar;
    expect(picked.success).toBe(true);
    expect(avatar).toBeInstanceOf(File);
    expect((avatar as File).name).toBe('avatar.png');
    // A file is not a value a no-JS retry can restore, so it is never echoed.
    expect(picked.state.values).toStrictEqual({});
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
