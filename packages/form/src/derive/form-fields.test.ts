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

  it("keeps zod's pattern next to type=email, whose native rule is looser", () => {
    const { fields } = formFields(z.object({ email: z.email() }));

    expect(fields.email.input.type).toBe('email');
    expect(fields.email.input.pattern).toBeDefined();
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

  it('marks a password field secret and types it', () => {
    const { fields } = formFields(
      z.object({ password: z.string().min(8).meta({ input: 'password' }) }),
    );

    expect(fields.password.input.type).toBe('password');
    expect(fields.password.secret).toBe(true);
  });
});
