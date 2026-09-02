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

  it('still accepts a bare schema, with no rules', () => {
    const { rules } = formFields(z.object({ title: z.string() }));

    expect(rules).toStrictEqual([]);
  });
});
