import { describe, expect, it, vi } from 'vite-plus/test';
import { z } from 'zod';

import { formFields } from '../derive/form-fields';
import { parseForm } from '../parse/parse-form';
import { defineForm } from './define-form';
import { breachOf, requiredWhen, sameAs } from './rules';

const signup = defineForm(
  z.object({
    password: z.string().min(8, '8文字以上で入力してください'),
    confirm: z.string(),
  }),
  [sameAs('confirm', 'password', 'パスワードが一致しません')],
);

const formDataOf = (entries: Array<[string, string]>): FormData => {
  const formData = new FormData();
  for (const [key, value] of entries) {
    formData.append(key, value);
  }
  return formData;
};

const valuesOf =
  (formData: FormData) =>
  (name: string): string[] =>
    formData.getAll(name).filter((value) => typeof value === 'string');

describe('cross-field rules', () => {
  it('crosses to the client as plain data', () => {
    const { rules } = formFields(signup);

    expect(rules).toStrictEqual([
      {
        kind: 'sameAs',
        field: 'confirm',
        other: 'password',
        message: 'パスワードが一致しません',
      },
    ]);
    expect(structuredClone(rules)).toStrictEqual(rules);
  });

  it('reaches the same verdict on both sides, from the same evaluator', () => {
    const mismatched = formDataOf([
      ['password', 'hunter2hunter2'],
      ['confirm', 'something-else'],
    ]);

    // What the browser would compute from the live form...
    const client = breachOf(signup.rules[0]!, valuesOf(mismatched));
    // ...and what the server computes from the submission.
    const server = parseForm(signup, mismatched);

    expect(client).toBe('パスワードが一致しません');
    expect(server.success).toBe(false);
    expect(server.state.errors?.confirm).toBe(client);
  });

  it('lets a submission through once the rule holds', () => {
    const result = parseForm(
      signup,
      formDataOf([
        ['password', 'hunter2hunter2'],
        ['confirm', 'hunter2hunter2'],
      ]),
    );

    expect(result.success).toBe(true);
    expect(result.data?.password).toBe('hunter2hunter2');
  });

  it('reports a schema error and a rule breach together', () => {
    const result = parseForm(
      signup,
      formDataOf([
        ['password', 'short'],
        ['confirm', 'different'],
      ]),
    );

    expect(result.state.errors).toStrictEqual({
      password: '8文字以上で入力してください',
      confirm: 'パスワードが一致しません',
    });
  });

  it('keeps the first broken rule for a field on the server, as the browser does', () => {
    const layered = defineForm(
      z.object({ a: z.string(), b: z.string(), c: z.string() }),
      [sameAs('a', 'b', 'first'), requiredWhen('a', 'c', 'x', 'second')],
    );

    const result = parseForm(
      layered,
      formDataOf([
        ['a', ''],
        ['b', 'y'],
        ['c', 'x'],
      ]),
    );

    expect(result.state.errors).toStrictEqual({ a: 'first' });
  });

  it('runs the count a checkbox group schema allows, in its own wording', () => {
    const schema = z.object({
      tags: z
        .array(z.enum(['a', 'b', 'c']))
        .min(2, '2つ以上選んでください')
        .max(2, '2つまでです'),
    });
    const { rules, dropped } = formFields(schema);
    const one = formDataOf([['tags', 'a']]);
    const two = formDataOf([
      ['tags', 'a'],
      ['tags', 'b'],
    ]);
    const three = formDataOf([
      ['tags', 'a'],
      ['tags', 'b'],
      ['tags', 'c'],
    ]);

    expect(rules).toStrictEqual([
      {
        kind: 'minChecked',
        field: 'tags',
        min: 2,
        message: '2つ以上選んでください',
      },
      { kind: 'maxChecked', field: 'tags', max: 2, message: '2つまでです' },
    ]);
    expect(dropped).toStrictEqual([]);
    expect(rules.map((rule) => breachOf(rule, valuesOf(one)))).toStrictEqual([
      '2つ以上選んでください',
      undefined,
    ]);
    expect(rules.map((rule) => breachOf(rule, valuesOf(two)))).toStrictEqual([
      undefined,
      undefined,
    ]);
    expect(rules.map((rule) => breachOf(rule, valuesOf(three)))).toStrictEqual([
      undefined,
      '2つまでです',
    ]);
    expect(parseForm(schema, one).state.errors?.tags).toBe(
      '2つ以上選んでください',
    );
  });

  it('words the count of a checkbox group in the locale of each formFields call', () => {
    const texts = { ja: '1つ以上選んでください', en: 'Pick at least one' };
    let locale: keyof typeof texts = 'ja';
    const schema = z.object({
      tags: z.array(z.enum(['a', 'b'])).min(1, { error: () => texts[locale] }),
    });

    const ja = formFields(schema).rules[0]?.message;
    locale = 'en';
    const en = formFields(schema).rules[0]?.message;

    expect([ja, en]).toStrictEqual([
      '1つ以上選んでください',
      'Pick at least one',
    ]);
  });

  it('derives no upper count for a group that cannot hold more boxes than it allows', () => {
    const { rules, dropped } = formFields(
      z.object({
        exact: z.array(z.enum(['a', 'b'])).max(2),
        above: z.array(z.enum(['a', 'b'])).max(3),
      }),
    );

    expect(rules).toStrictEqual([]);
    expect(dropped).toStrictEqual([]);
  });

  it('reports a group count zod gives no message for, instead of losing it', () => {
    const { rules, dropped } = formFields(
      z.object({
        tags: z
          .array(z.enum(['a', 'b', 'c']))
          .refine((tags) => tags.length === 2, { abort: true })
          .min(2)
          .max(2),
      }),
    );

    expect(rules).toStrictEqual([]);
    expect(dropped).toStrictEqual([
      {
        field: 'tags',
        reason:
          'zod gives no message for .min(2) when 1 box is checked, so the browser does not check the lower bound',
      },
      {
        field: 'tags',
        reason:
          'zod gives no message for .max(2) when 3 boxes are checked, so the browser does not check the upper bound',
      },
    ]);
  });

  it('reports the count of a group inside repeated rows, which no rule can target', () => {
    const { rules, dropped } = formFields(
      z.object({
        people: z.array(z.object({ tags: z.array(z.enum(['a', 'b'])).min(1) })),
      }),
    );

    expect(rules).toStrictEqual([]);
    expect(dropped.map((entry) => entry.field)).toStrictEqual(['people.tags']);
  });

  it('only requires a field while the other field holds the value', () => {
    const rule = requiredWhen('reason', 'status', 'rejected', '理由が必要です');

    expect(
      breachOf(
        rule,
        valuesOf(
          formDataOf([
            ['status', 'rejected'],
            ['reason', ''],
          ]),
        ),
      ),
    ).toBe('理由が必要です');
    expect(
      breachOf(
        rule,
        valuesOf(
          formDataOf([
            ['status', 'approved'],
            ['reason', ''],
          ]),
        ),
      ),
    ).toBeUndefined();
  });

  it('calls a function message when the rule is reported, not where it is declared', () => {
    // i18n の文言のように、呼んだ時点のロケールで文を返す関数。定義は
    // モジュールの先頭で 1 回だけ作り、ロケールはリクエストごとに変わる
    const texts = {
      ja: 'パスワードが一致しません',
      en: 'Passwords do not match',
    };
    let locale: keyof typeof texts = 'ja';
    const mismatch = (): string => texts[locale];
    const localized = defineForm(
      z.object({ password: z.string(), confirm: z.string() }),
      [sameAs('confirm', 'password', mismatch)],
    );
    const mismatched = formDataOf([
      ['password', 'hunter2hunter2'],
      ['confirm', 'something-else'],
    ]);

    locale = 'en';

    expect(formFields(localized).rules[0]?.message).toBe(
      'Passwords do not match',
    );
    expect(parseForm(localized, mismatched).state.errors?.confirm).toBe(
      'Passwords do not match',
    );
  });

  it('hands the client a function message already called, as plain data', () => {
    const { rules } = formFields(
      defineForm(z.object({ status: z.string(), reason: z.string() }), [
        requiredWhen('reason', 'status', 'rejected', () => '理由が必要です'),
      ]),
    );

    expect(rules).toStrictEqual([
      {
        kind: 'requiredWhen',
        field: 'reason',
        when: 'status',
        equals: 'rejected',
        message: '理由が必要です',
      },
    ]);
    expect(structuredClone(rules)).toStrictEqual(rules);
  });

  it('calls a function message only for a rule the server finds broken', () => {
    const message = vi.fn<() => string>(() => '理由が必要です');
    const review = defineForm(
      z.object({ status: z.string(), reason: z.string() }),
      [requiredWhen('reason', 'status', 'rejected', message)],
    );

    parseForm(
      review,
      formDataOf([
        ['status', 'approved'],
        ['reason', ''],
      ]),
    );

    expect(message).not.toHaveBeenCalled();
  });

  it('still accepts a bare schema, with no rules', () => {
    const { rules } = formFields(z.object({ title: z.string() }));

    expect(rules).toStrictEqual([]);
  });
});
