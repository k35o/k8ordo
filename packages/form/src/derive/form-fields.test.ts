import { z } from 'zod';

import { formFields } from './form-fields';

describe('formFields', () => {
  it('derives the constraint attributes the browser can enforce', () => {
    const { fields } = formFields(
      z.object({
        title: z.string().min(1).max(120),
        eventUrl: z.url(),
        eventDate: z.iso.date(),
        blogId: z.coerce.number().int().positive(),
      }),
    );

    expect(fields.title.input).toMatchObject({
      name: 'title',
      type: 'text',
      required: true,
      minLength: 1,
      maxLength: 120,
    });
    expect(fields.eventUrl.input.type).toBe('url');
    expect(fields.eventDate.input.type).toBe('date');
    expect(fields.blogId.input).toMatchObject({ type: 'number', step: 1 });
  });

  it('marks a field required only when the schema rejects an empty string', () => {
    const { fields } = formFields(
      z.object({
        name: z.string().min(1),
        // Accepts '', so the browser must not block an empty submission that
        // the server would have allowed through.
        nickname: z.string(),
        note: z.string().max(50).optional(),
      }),
    );

    expect(fields.name.input.required).toBe(true);
    expect(fields.nickname.input.required).toBeUndefined();
    expect(fields.note.input.required).toBeUndefined();
  });

  it('takes the wording from zod so the client cannot disagree with the server', () => {
    const schema = z.object({
      title: z
        .string()
        .min(1, 'タイトルを入力してください')
        .max(5, '5文字まで'),
    });
    const { fields } = formFields(schema);

    expect(fields.title.messages.valueMissing).toBe(
      'タイトルを入力してください',
    );
    expect(fields.title.messages.tooLong).toBe('5文字まで');
    expect(schema.safeParse({ title: '' }).error?.issues[0]?.message).toBe(
      fields.title.messages.valueMissing,
    );
  });

  it('reports rather than emits a pattern the browser would silently ignore', () => {
    // zod's default email regex does not compile under the `v` flag browsers
    // use for the pattern attribute — emitted, it would be dead markup.
    const { fields, dropped } = formFields(z.object({ email: z.email() }));

    expect(fields.email.input.type).toBe('email');
    expect(fields.email.input.pattern).toBeUndefined();
    expect(dropped.some((entry) => entry.field === 'email')).toBe(true);
  });

  it('emits a pattern only when the browser reads it the way zod does', () => {
    const { fields, dropped } = formFields(
      z.object({
        anchored: z.string().regex(/^[a-z]+$/u),
        unanchored: z.string().regex(/foo/u),
        flagged: z.string().regex(/^foo$/iu),
      }),
    );

    // Anchored, flag-free, v-compilable: the one shape both sides agree on.
    expect(fields.anchored.input.pattern).toBe('^[a-z]+$');
    // zod matches a substring, the pattern attribute matches the whole value.
    expect(fields.unanchored.input.pattern).toBeUndefined();
    // HTML pattern has no case-insensitive mode.
    expect(fields.flagged.input.pattern).toBeUndefined();
    expect(dropped.map((entry) => entry.field)).toStrictEqual([
      'unanchored',
      'flagged',
    ]);
  });

  it('drops a pattern the browser would ignore rather than emitting it', () => {
    const { fields, dropped } = formFields(z.object({ when: z.iso.date() }));

    expect(fields.when.input.pattern).toBeUndefined();
    expect(dropped).toStrictEqual([]);
  });

  it('does not emit the safe-integer bound that .int() carries', () => {
    const { fields } = formFields(z.object({ n: z.coerce.number().int() }));

    expect(fields.n.input.max).toBeUndefined();
  });

  it('reports object-level checks instead of silently skipping them', () => {
    const { dropped } = formFields(
      z
        .object({ password: z.string().min(8), confirm: z.string() })
        .refine((v) => v.password === v.confirm, { path: ['confirm'] }),
    );

    expect(dropped).toHaveLength(1);
    expect(dropped[0]?.field).toBe('(schema)');
    expect(dropped[0]?.reason).toContain('クライアントでは検査されません');
  });

  it('leaves a checkbox the server would accept unchecked without required', () => {
    // parseForm reads an unchecked box as false, and z.boolean() accepts
    // false — required here would make the browser block a submission the
    // server allows.
    const { fields } = formFields(z.object({ subscribed: z.boolean() }));

    expect(fields.subscribed.input.type).toBe('checkbox');
    expect(fields.subscribed.input.required).toBeUndefined();
  });

  it('requires a checkbox only when the schema rejects false, with its own wording', () => {
    const { fields } = formFields(
      z.object({ agree: z.literal(true, '規約への同意が必要です') }),
    );

    expect(fields.agree.input.required).toBe(true);
    expect(fields.agree.messages.valueMissing).toBe('規約への同意が必要です');
  });

  it('refuses datetime-local for a schema no such control can satisfy', () => {
    // z.iso.datetime() demands a timezone; datetime-local cannot submit one.
    const { fields, dropped } = formFields(
      z.object({
        strict: z.iso.datetime(),
        local: z.iso.datetime({ local: true }),
      }),
    );

    expect(fields.strict.input.type).toBe('text');
    expect(dropped.some((entry) => entry.field === 'strict')).toBe(true);
    expect(fields.local.input.type).toBe('datetime-local');
  });

  it('carries multipleOf into step for integers instead of overwriting it', () => {
    const { fields } = formFields(
      z.object({
        n: z.coerce.number().int().multipleOf(5, '5の倍数で入力してください'),
      }),
    );

    expect(fields.n.input.step).toBe(5);
    expect(fields.n.messages.stepMismatch).toBe('5の倍数で入力してください');
  });

  it('reports the constraints a nullable field cannot carry to the client', () => {
    const { fields, dropped } = formFields(
      z.object({ note: z.string().min(3).nullable() }),
    );

    expect(fields.note.input.type).toBe('text');
    expect(fields.note.input.minLength).toBeUndefined();
    expect(dropped.some((entry) => entry.field === 'note')).toBe(true);
  });

  it('derives an array of enums as one shared-name checkbox group', () => {
    const { fields, arrays, dropped } = formFields(
      z.object({ tags: z.array(z.enum(['a', 'b', 'c'])).min(2) }),
    );

    // One leaf, no rows: every box submits under the same name.
    expect(arrays).toStrictEqual({});
    expect(fields.tags.input).toStrictEqual({ name: 'tags' });
    // "At least two" has no HTML attribute; the report points at minChecked.
    const report = dropped.find((entry) => entry.field === 'tags');
    expect(report?.reason).toContain('minChecked');
  });

  it('marks a password field secret and types it', () => {
    const { fields } = formFields(
      z.object({ password: z.string().min(8).meta({ input: 'password' }) }),
    );

    expect(fields.password.input.type).toBe('password');
    expect(fields.password.secret).toBe(true);
  });
});
