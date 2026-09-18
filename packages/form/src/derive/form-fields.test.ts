import { z } from 'zod';

import { formFields } from './form-fields';

// Several cases below derive a schema with a non-empty `dropped` list on
// purpose; keep their development warning out of the test output.
const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

beforeEach(() => {
  warn.mockClear();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

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

  it('requires a choice only when the schema rejects nothing chosen', () => {
    // A radio group left unselected and a select on its placeholder both reach
    // the schema as undefined, so `.optional()` really does allow a blank.
    const { fields } = formFields(
      z.object({
        plan: z.enum(['free', 'team'], 'プランを選んでください'),
        optional: z.enum(['free', 'team']).optional(),
        defaulted: z.enum(['free', 'team']).default('free'),
      }),
    );

    expect(fields.plan.input.required).toBe(true);
    expect(fields.plan.messages.valueMissing).toBe('プランを選んでください');
    expect(fields.optional.input.required).toBeUndefined();
    expect(fields.defaulted.input.required).toBeUndefined();
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

  it('reports stacked regexes instead of dropping them in silence', () => {
    // The pattern attribute holds one expression. Emitting one of several
    // would pass values the server rejects.
    const { fields, dropped } = formFields(
      z.object({
        stacked: z
          .string()
          .regex(/^[a-z]+$/u)
          .regex(/^.{2,}$/u),
      }),
    );

    expect(fields.stacked.input.pattern).toBeUndefined();
    expect(dropped.map((entry) => entry.field)).toStrictEqual(['stacked']);
  });

  it('keeps the control a format asks for when a check is stacked on it', () => {
    // A later check overwrites or erases the JSON Schema `format`, so the
    // control is read from the format itself; the stacked check is reported.
    const { fields, dropped } = formFields(
      z.object({
        email: z.email().regex(/^[a-z@.]+$/u),
        prefixed: z.email().startsWith('a'),
        url: z.url().lowercase(),
        on: z.iso.date().regex(/^2/u),
      }),
    );

    expect(fields.email.input.type).toBe('email');
    expect(fields.prefixed.input.type).toBe('email');
    expect(fields.url.input.type).toBe('url');
    expect(fields.on.input.type).toBe('date');
    expect([...new Set(dropped.map((entry) => entry.field))]).toStrictEqual([
      'email',
      'prefixed',
      'on',
    ]);
  });

  it('carries a single stacked regex onto a format control that honours pattern', () => {
    const { fields, dropped } = formFields(
      z.object({ url: z.url().lowercase() }),
    );

    expect(fields.url.input.pattern).toBe('^[^A-Z]*$');
    expect(dropped).toStrictEqual([]);
  });

  it('blames a regex, not the timezone, when one is stacked on a local datetime', () => {
    const { fields, dropped } = formFields(
      z.object({ at: z.iso.datetime({ local: true }).regex(/^1/u) }),
    );

    expect(fields.at.input.type).toBe('datetime-local');
    expect(dropped).toHaveLength(1);
    expect(dropped[0]?.reason).toContain('pattern');
    expect(dropped[0]?.reason).not.toContain('タイムゾーン');
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

  it('picks the control for an ISO format the JSON Schema does not name', () => {
    // zod emits `format` only when a standard one matches the values it
    // accepts, so these two arrive as a bare pattern. Losing the picker that
    // submits exactly their shape is the degradation this pins down.
    const { fields } = formFields(
      z.object({ at: z.iso.time(), on: z.iso.datetime({ local: true }) }),
    );

    expect(fields.at.input.type).toBe('time');
    expect(fields.on.input.type).toBe('datetime-local');
  });

  it('reads the format and the regex flags behind .optional()', () => {
    // The wrapper hides both from a lookup on the schema itself: the control
    // fell back to text, and the `i` flag went unseen, so a case-sensitive
    // pattern reached the browser while the server ignored case.
    const { fields, dropped } = formFields(
      z.object({
        at: z.iso.time().optional(),
        flagged: z.string().regex(/^foo$/iu).optional(),
      }),
    );

    expect(fields.at.input.type).toBe('time');
    expect(fields.flagged.input.pattern).toBeUndefined();
    expect(
      dropped.find((entry) => entry.field === 'flagged')?.reason,
    ).toContain("'iu'");
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

  it('refuses a number no control can submit rather than deriving a dead form', () => {
    // Every value arrives as a string, so z.number() fails on every possible
    // submission — a form that can never succeed, not a check the client skips.
    expect(() => formFields(z.object({ n: z.number() }))).toThrow(
      /z\.coerce\.number\(\)/u,
    );
    // The type check aborts before the bound, so the refusal must not depend on
    // the probe happening to satisfy the constraints.
    expect(() => formFields(z.object({ n: z.number().min(100) }))).toThrow(
      /z\.coerce\.number\(\)/u,
    );
    // A literal reports invalid_value, not invalid_type, and is just as dead.
    expect(() => formFields(z.object({ n: z.literal(1) }))).toThrow(
      /z\.coerce\.number\(\)/u,
    );
    // A bound the submission fails is the schema working, not a dead form.
    expect(() =>
      formFields(z.object({ n: z.coerce.number().min(100) })),
    ).not.toThrow();
  });

  it('requires a numeric field whose schema rejects an untouched control', () => {
    // z.coerce.number() reads '' as 0, so probing with '' would call a blank
    // field acceptable and let 0 through as a value nobody typed.
    const { fields } = formFields(
      z.object({
        count: z.coerce.number(),
        optional: z.coerce.number().optional(),
        defaulted: z.coerce.number().default(5),
      }),
    );

    expect(fields.count.input.required).toBe(true);
    expect(fields.optional.input.required).toBeUndefined();
    expect(fields.defaulted.input.required).toBeUndefined();
  });

  it("takes a required number's wording from the schema's own type error", () => {
    const { fields } = formFields(
      z.object({ count: z.coerce.number('数値を入力してください') }),
    );

    expect(fields.count.messages.valueMissing).toBe('数値を入力してください');
  });

  it('reports a leaf whose constraints it could not read instead of calling it text', () => {
    const { fields, dropped } = formFields(
      z.object({
        transformed: z
          .string()
          .min(3)
          .transform((value) => value),
        opaque: z.custom<string>((value) => typeof value === 'string'),
      }),
    );

    // A text input still submits something the schema accepts, so the form
    // works — but nothing about it was derived, and saying so is the point.
    expect(fields.transformed.input.type).toBe('text');
    expect(fields.transformed.input.minLength).toBeUndefined();
    expect(dropped.map((entry) => entry.field)).toStrictEqual([
      'transformed',
      'opaque',
    ]);
    expect(dropped[0]?.reason).toContain('検査されません');
  });

  it('refuses a checkbox whose schema turns away the boolean it submits', () => {
    // parseForm reads a checkbox as true or false; z.stringbool() wants the
    // string, so the box could never be satisfied either way.
    expect(() => formFields(z.object({ agree: z.stringbool() }))).toThrow(
      /z\.boolean\(\)/u,
    );
    expect(() =>
      formFields(z.object({ agree: z.stringbool().optional() })),
    ).toThrow(/z\.boolean\(\)/u);
  });

  it('requires a bigint field whose schema rejects a blank', () => {
    // BigInt('') is 0n; probing with '' would call a blank acceptable.
    const { fields } = formFields(
      z.object({
        id: z.coerce.bigint('整数を入力してください'),
        optional: z.coerce.bigint().optional(),
      }),
    );

    expect(fields.id.input.required).toBe(true);
    expect(fields.id.messages.valueMissing).toBe('整数を入力してください');
    expect(fields.optional.input.required).toBeUndefined();
  });

  it('refuses a leaf no text control can satisfy', () => {
    expect(() => formFields(z.object({ when: z.date() }))).toThrow(
      /文字列を受け付けない/u,
    );
    expect(() => formFields(z.object({ big: z.bigint() }))).toThrow(
      /文字列を受け付けない/u,
    );
    // A nullable number is as unsatisfiable as a bare one, and reaches the
    // refusal as an anyOf node rather than through the numeric branch.
    expect(() => formFields(z.object({ n: z.number().nullable() }))).toThrow(
      /文字列を受け付けない/u,
    );
  });

  it('keeps a leaf that reads some strings and not others', () => {
    // A schema that coerces turns away nonsense and accepts a real value, so
    // one rejected probe cannot stand for "no string will ever do".
    const { fields } = formFields(
      z.object({
        nullableNumber: z.coerce.number().nullable(),
        when: z.coerce.date(),
        big: z.coerce.bigint(),
      }),
    );

    expect(fields.nullableNumber.input.type).toBe('text');
    expect(fields.when.input.type).toBe('text');
    expect(fields.big.input.type).toBe('text');
  });

  it('derives a file control, its accepted types, and what HTML cannot carry', () => {
    const { fields, dropped } = formFields(
      z.object({
        avatar: z.file().mime(['image/png', 'image/jpeg']),
        attachment: z.file().max(1024),
        optional: z.file().optional(),
      }),
    );

    expect(fields.avatar.input).toMatchObject({
      type: 'file',
      required: true,
      accept: 'image/png,image/jpeg',
    });
    // An unfilled file input submits an empty File, which z.file() accepts;
    // required has to come from the same "nothing was entered" the parse sends.
    expect(fields.optional.input.required).toBeUndefined();
    // A byte bound is not minlength, and no attribute carries it.
    expect(fields.attachment.input.minLength).toBeUndefined();
    expect(fields.attachment.input.maxLength).toBeUndefined();
    expect(
      dropped.find((entry) => entry.field === 'attachment')?.reason,
    ).toContain('ファイルサイズ');
  });

  it('reports that accept only suggests the types the server enforces', () => {
    // The picker can still be switched to any file, and constraint validation
    // never reads a file's type.
    const { fields, dropped } = formFields(
      z.object({ avatar: z.file().mime(['image/png']) }),
    );

    expect(fields.avatar.input.accept).toBe('image/png');
    expect(dropped.map((entry) => entry.field)).toStrictEqual(['avatar']);
    expect(dropped[0]?.reason).toContain('accept');
  });

  it('marks a password field secret and types it', () => {
    const { fields } = formFields(
      z.object({ password: z.string().min(8).meta({ input: 'password' }) }),
    );

    expect(fields.password.input.type).toBe('password');
    expect(fields.password.secret).toBe(true);
  });
});

describe('the dropped report outside production', () => {
  it('warns once per schema, naming every dropped field and its reason', () => {
    const schema = z
      .object({ email: z.email(), password: z.string(), confirm: z.string() })
      .refine((v) => v.password === v.confirm, { path: ['confirm'] });

    const first = formFields(schema);
    formFields(schema);

    expect(warn).toHaveBeenCalledTimes(1);
    const message = String(warn.mock.calls[0]?.[0]);
    expect(message).toContain('@k8ordo/form');
    for (const entry of first.dropped) {
      expect(message).toContain(entry.field);
      expect(message).toContain(entry.reason);
    }
    // 「サーバーでは検査される」ことを読む人に伝える
    expect(message).toContain('サーバー');
  });

  it('stays silent when nothing was dropped', () => {
    formFields(z.object({ title: z.string().min(1).max(10) }));
    expect(warn).not.toHaveBeenCalled();
  });

  it('stays silent in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { dropped } = formFields(z.object({ email: z.email() }));
    expect(dropped).not.toHaveLength(0);
    expect(warn).not.toHaveBeenCalled();
  });
});
