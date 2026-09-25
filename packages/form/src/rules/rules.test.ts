import { z } from 'zod';

import { formFields } from '../derive/form-fields';
import { parseForm } from '../parse/parse-form';
import { defineForm } from './define-form';
import { breachOf, minChecked, requiredWhen, sameAs } from './rules';

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

  it('counts the boxes a checkbox group has checked', () => {
    const rule = minChecked('tags', 2, '2つ以上選んでください');

    expect(breachOf(rule, valuesOf(formDataOf([['tags', 'a']])))).toBe(
      '2つ以上選んでください',
    );
    expect(
      breachOf(
        rule,
        valuesOf(
          formDataOf([
            ['tags', 'a'],
            ['tags', 'b'],
          ]),
        ),
      ),
    ).toBeUndefined();
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
      defineForm(z.object({ tags: z.array(z.enum(['a', 'b'])) }), [
        minChecked('tags', 2, () => '2つ以上選んでください'),
      ]),
    );

    expect(rules).toStrictEqual([
      {
        kind: 'minChecked',
        field: 'tags',
        min: 2,
        message: '2つ以上選んでください',
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
