import { useForm } from '@k8ordo/form';
import type { FormFields, FormState, UseFormReturn } from '@k8ordo/form';
import {
  defineForm,
  formFields,
  minChecked,
  parseForm,
} from '@k8ordo/form/server';
import type { ParseResult } from '@k8ordo/form/server';
import { useActionState } from 'react';
import type { ReactNode } from 'react';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { z } from 'zod';

import { Button } from '../buttons/button';
import { Autocomplete } from './autocomplete';
import { Checkbox } from './checkbox';
import { CheckboxCard } from './checkbox-card';
import { CheckboxGroup } from './checkbox-group';
import { FileField } from './file-field';
import { FormControl } from './form-control';
import { NumberField } from './number-field';
import { PasswordInput } from './password-input';
import { Radio } from './radio';
import { RadioCard } from './radio-card';
import { Select } from './select';
import { Slider } from './slider';
import { Switch } from './switch';
import { TextField } from './text-field';
import { Textarea } from './textarea';

// サーバーが最後に受け取った値。成功したときだけ入る
let received: unknown;

// Server Action の代役。parseForm をそのまま呼ぶので、失敗の文言・エコー・
// フォーカスの移動まで本物と同じ道を通る
function Harness<F extends string, A extends string>({
  fields,
  serve,
  children,
}: {
  fields: FormFields<F, A>;
  serve: (formData: FormData) => ParseResult<unknown>;
  children: (form: UseFormReturn<F, A>, state: FormState) => ReactNode;
}) {
  // Server Action と同じく Promise を返す。React の送信後の自動リセットも
  // 本物と同じ順序で起きる
  const [state, action] = useActionState(
    (_previous: FormState, formData: FormData): Promise<FormState> => {
      const parsed = serve(formData);
      received = parsed.success ? parsed.data : undefined;
      return Promise.resolve(parsed.state);
    },
    {},
  );
  const form = useForm(fields, state);

  return (
    <form {...form.props} action={action}>
      {children(form, state)}
      <p data-testid="dirty">{String(form.isDirty)}</p>
      <button type="submit">送信</button>
      <button type="reset">リセット</button>
    </form>
  );
}

// FormControl のラベルは必須のバッジまで名前に含むので、前方で引く
const labelled = (label: string) =>
  page.getByLabelText(label, { exact: false });

// ボタンをクリックすると、blur で現れたエラーの分だけボタンがずれてクリックが
// 外れることがある。送信そのものを主張したいので、DOM から送る
const submit = () => {
  document.querySelector('form')?.requestSubmit();
};

// リセットも同じ理由で DOM から戻す
const reset = () => {
  document.querySelector('form')?.reset();
};

const isDirty = () =>
  document.querySelector('[data-testid="dirty"]')?.textContent;

const errorShown = (message: string) =>
  [...document.querySelectorAll('p')].some(
    (paragraph) => paragraph.textContent === message,
  );

// 送信に失敗した echo を配列で受ける部品に渡す。チェックボックスの組は、
// 何個チェックしても配列で返ってくる
const listOf = (value: string | string[] | undefined): string[] =>
  Array.isArray(value) ? value : [];

// 送信を落とすためだけの欄。空のまま送れば必ずサーバーで失敗する
const failing = z.string().min(1, 'メモを入力してください');

const Memo = ({ form }: { form: UseFormReturn<'memo', never> }) => {
  const memo = form.field('memo');
  return (
    <FormControl
      errorText={memo.error}
      invalid={memo.invalid}
      label="メモ"
      renderInput={(props) => <TextField {...props} {...memo.input} />}
      required={memo.required}
    />
  );
};

// Autocomplete の選択肢を開いて 1 つ選ぶ
const choose = async (label: string) => {
  await userEvent.click(document.querySelector('[role="combobox"]')!);
  await userEvent.click(
    [...document.querySelectorAll('[role="option"]')].find(
      (option) => option.textContent === label,
    )!,
  );
};

const countInput = () =>
  document.querySelector('input[name="count"]') as HTMLInputElement;

const picture = () => new File(['avatar'], 'me.png', { type: 'image/png' });

beforeEach(() => {
  received = undefined;
});

describe('TextField', () => {
  const schema = z.object({
    title: z.string().min(1, 'タイトルを入力してください'),
    email: z.email('メールアドレスの形式で入力してください'),
    birthday: z.iso.date('日付を入力してください'),
  });
  const fields = formFields(schema);

  const Profile = () => (
    <Harness fields={fields} serve={(data) => parseForm(schema, data)}>
      {(form) => {
        const title = form.field('title');
        const email = form.field('email');
        const birthday = form.field('birthday');
        return (
          <>
            <FormControl
              errorText={title.error}
              invalid={title.invalid}
              label="タイトル"
              renderInput={(props) => <TextField {...props} {...title.input} />}
              required={title.required}
            />
            <FormControl
              errorText={email.error}
              invalid={email.invalid}
              label="メール"
              renderInput={(props) => <TextField {...props} {...email.input} />}
              required={email.required}
            />
            <FormControl
              errorText={birthday.error}
              invalid={birthday.invalid}
              label="誕生日"
              renderInput={(props) => (
                <TextField {...props} {...birthday.input} />
              )}
              required={birthday.required}
            />
          </>
        );
      }}
    </Harness>
  );

  it('導かれた type をそのまま描き、z.iso.date() は日付の入力になる', async () => {
    await render(<Profile />);

    await expect.element(labelled('メール')).toHaveAttribute('type', 'email');
    await expect.element(labelled('誕生日')).toHaveAttribute('type', 'date');
  });

  it('空のまま離れると zod の文言を出し、入力すると消える', async () => {
    await render(<Profile />);

    await labelled('タイトル').click();
    await userEvent.tab();
    await expect
      .poll(() => errorShown('タイトルを入力してください'))
      .toBe(true);

    await userEvent.type(labelled('タイトル'), 'a');
    await expect
      .poll(() => errorShown('タイトルを入力してください'))
      .toBe(false);
  });

  it('送信に失敗したら入力を描き直し、最初に失敗した欄へフォーカスを移す', async () => {
    await render(<Profile />);

    await userEvent.fill(labelled('タイトル'), '秋の予定');
    await userEvent.fill(labelled('メール'), 'me@example.com');
    submit();

    await expect.poll(() => errorShown('日付を入力してください')).toBe(true);
    await expect.element(labelled('誕生日')).toHaveFocus();
    await expect.element(labelled('タイトル')).toHaveValue('秋の予定');
  });

  it('すべて満たして送ると値が届く', async () => {
    await render(<Profile />);

    await userEvent.fill(labelled('タイトル'), '秋の予定');
    await userEvent.fill(labelled('メール'), 'me@example.com');
    await userEvent.fill(labelled('誕生日'), '2026-09-25');
    submit();

    await expect
      .poll(() => received)
      .toStrictEqual({
        title: '秋の予定',
        email: 'me@example.com',
        birthday: '2026-09-25',
      });
  });

  it('reset で描画時の値に戻り、isDirty も下りる', async () => {
    await render(<Profile />);

    await userEvent.fill(labelled('タイトル'), '秋の予定');
    await expect.poll(isDirty).toBe('true');
    reset();

    await expect.element(labelled('タイトル')).toHaveValue('');
    await expect.poll(isDirty).toBe('false');
  });
});

describe('PasswordInput', () => {
  const schema = z.object({
    password: z
      .string()
      .min(8, '8文字以上で入力してください')
      .meta({ input: 'password' }),
  });
  const fields = formFields(schema);

  const Login = () => (
    <Harness fields={fields} serve={(data) => parseForm(schema, data)}>
      {(form) => {
        const password = form.field('password');
        return (
          <FormControl
            errorText={password.error}
            invalid={password.invalid}
            label="パスワード"
            renderInput={(props) => (
              <PasswordInput {...props} {...password.input} />
            )}
            required={password.required}
          />
        );
      }}
    </Harness>
  );

  it('導かれた type="password" を広げても、表示の切り替えが効く', async () => {
    const screen = await render(<Login />);
    const input = labelled('パスワード必須');

    await expect.element(input).toHaveAttribute('type', 'password');
    await screen.getByRole('button', { name: 'パスワードを表示' }).click();
    await expect.element(input).toHaveAttribute('type', 'text');
  });

  it('短いまま離れると zod の文言を出す', async () => {
    await render(<Login />);

    await userEvent.fill(labelled('パスワード必須'), 'abc');
    await userEvent.tab();

    await expect
      .poll(() => errorShown('8文字以上で入力してください'))
      .toBe(true);
  });

  it('送信に失敗しても、入力したパスワードは描き直さない', async () => {
    await render(<Login />);

    await userEvent.fill(labelled('パスワード必須'), 'abc');
    submit();

    await expect
      .poll(() => errorShown('8文字以上で入力してください'))
      .toBe(true);
    await expect.element(labelled('パスワード必須')).toHaveValue('');
  });
});

describe('Textarea', () => {
  const schema = z.object({
    bio: z
      .string()
      .min(1, '自己紹介を入力してください')
      .regex(/^[^<>]*$/u, '山括弧は使えません'),
  });
  const fields = formFields(schema);

  const Bio = () => (
    <Harness fields={fields} serve={(data) => parseForm(schema, data)}>
      {(form) => {
        const bio = form.field('bio');
        return (
          <FormControl
            errorText={bio.error}
            invalid={bio.invalid}
            label="自己紹介"
            renderInput={(props) => <Textarea {...props} {...bio.input} />}
            required={bio.required}
          />
        );
      }}
    </Harness>
  );

  it('<textarea> に無い type 属性を描かない', async () => {
    await render(<Bio />);

    await expect.element(labelled('自己紹介')).not.toHaveAttribute('type');
  });

  it('空のまま離れると zod の文言を出す', async () => {
    await render(<Bio />);

    await labelled('自己紹介').click();
    await userEvent.tab();

    await expect
      .poll(() => errorShown('自己紹介を入力してください'))
      .toBe(true);
  });

  it('正規表現はサーバーで検査され、失敗しても入力を描き直す', async () => {
    await render(<Bio />);

    await userEvent.fill(labelled('自己紹介'), '<b>やあ</b>');
    submit();

    await expect.poll(() => errorShown('山括弧は使えません')).toBe(true);
    await expect.element(labelled('自己紹介')).toHaveValue('<b>やあ</b>');
  });
});

describe('Select', () => {
  const schema = z.object({
    plan: z.enum(['free', 'pro'], 'プランを選んでください'),
    memo: failing,
  });
  const fields = formFields(schema);
  const plans = [
    { value: '', label: '選んでください' },
    { value: 'free', label: '無料' },
    { value: 'pro', label: 'プロ' },
  ];

  const Plan = () => (
    <Harness fields={fields} serve={(data) => parseForm(schema, data)}>
      {(form) => {
        const plan = form.field('plan');
        return (
          <>
            <FormControl
              errorText={plan.error}
              invalid={plan.invalid}
              label="プラン"
              renderInput={(props) => (
                <Select {...props} {...plan.input} options={plans} />
              )}
              required={plan.required}
            />
            <Memo form={form} />
          </>
        );
      }}
    </Harness>
  );

  it('選ばずに離れると、プレースホルダーのままとして zod の文言を出す', async () => {
    await render(<Plan />);

    await labelled('プラン').click();
    await userEvent.tab();

    await expect.poll(() => errorShown('プランを選んでください')).toBe(true);
  });

  it('送信に失敗しても、選んだ値を描き直す', async () => {
    await render(<Plan />);

    await labelled('プラン').selectOptions('pro');
    submit();

    await expect.poll(() => errorShown('メモを入力してください')).toBe(true);
    await expect.element(labelled('プラン')).toHaveValue('pro');
  });

  it('reset で描画時の値に戻り、isDirty も下りる', async () => {
    await render(<Plan />);

    await labelled('プラン').selectOptions('free');
    await expect.poll(isDirty).toBe('true');
    reset();

    await expect.element(labelled('プラン')).toHaveValue('');
    await expect.poll(isDirty).toBe('false');
  });
});

describe('Radio', () => {
  const schema = z.object({
    plan: z.enum(['free', 'pro'], 'プランを選んでください'),
    memo: failing,
  });
  const fields = formFields(schema);
  const plans = [
    { value: 'free', label: '無料' },
    { value: 'pro', label: 'プロ' },
  ];

  const Plan = () => (
    <Harness fields={fields} serve={(data) => parseForm(schema, data)}>
      {(form) => {
        const plan = form.field('plan');
        return (
          <>
            <FormControl
              errorText={plan.error}
              invalid={plan.invalid}
              label="プラン"
              labelAs="legend"
              renderInput={(props) => (
                <Radio {...props} {...plan.input} options={plans} />
              )}
              required={plan.required}
            />
            <Memo form={form} />
          </>
        );
      }}
    </Harness>
  );

  it('選ばずに送ると zod の文言を出し、最初のラジオへフォーカスを移す', async () => {
    const screen = await render(<Plan />);

    await userEvent.fill(labelled('メモ'), 'よろしく');
    submit();

    await expect.poll(() => errorShown('プランを選んでください')).toBe(true);
    await expect
      .element(screen.getByRole('radio', { name: '無料' }))
      .toHaveFocus();
  });

  it('送信に失敗しても、選んだ値を描き直す', async () => {
    const screen = await render(<Plan />);

    await screen.getByRole('radio', { name: 'プロ' }).click();
    submit();

    await expect.poll(() => errorShown('メモを入力してください')).toBe(true);
    await expect
      .element(screen.getByRole('radio', { name: 'プロ' }))
      .toBeChecked();
  });

  it('reset で選択を外し、isDirty も下りる', async () => {
    const screen = await render(<Plan />);

    await screen.getByRole('radio', { name: 'プロ' }).click();
    await expect.poll(isDirty).toBe('true');
    reset();

    await expect
      .element(screen.getByRole('radio', { name: 'プロ' }))
      .not.toBeChecked();
    await expect.poll(isDirty).toBe('false');
  });
});

describe('RadioCard', () => {
  const schema = z.object({
    plan: z.enum(['free', 'pro'], 'プランを選んでください'),
    memo: failing,
  });
  const fields = formFields(schema);
  const plans = [
    { value: 'free', label: '無料', description: 'ひとりで使う' },
    { value: 'pro', label: 'プロ', description: 'チームで使う' },
  ];

  const Plan = () => (
    <Harness fields={fields} serve={(data) => parseForm(schema, data)}>
      {(form) => {
        const plan = form.field('plan');
        return (
          <>
            <FormControl
              errorText={plan.error}
              invalid={plan.invalid}
              label="プラン"
              labelAs="legend"
              renderInput={(props) => (
                <RadioCard {...props} {...plan.input} options={plans} />
              )}
              required={plan.required}
            />
            <Memo form={form} />
          </>
        );
      }}
    </Harness>
  );

  it('導かれた required を各ラジオが持ち、選ばないとブラウザの検証に通らない', async () => {
    const screen = await render(<Plan />);

    const free = screen.getByRole('radio', { name: '無料' });
    await expect.element(free).toBeRequired();
    expect((free.element() as HTMLInputElement).validity.valueMissing).toBe(
      true,
    );
  });

  it('送信に失敗しても、選んだ値を描き直す', async () => {
    const screen = await render(<Plan />);

    await screen.getByRole('radio', { name: 'プロ' }).click();
    submit();

    await expect.poll(() => errorShown('メモを入力してください')).toBe(true);
    await expect
      .element(screen.getByRole('radio', { name: 'プロ' }))
      .toBeChecked();
  });

  it('reset で選択を外し、次に選んだ値だけを送る', async () => {
    const screen = await render(<Plan />);

    await screen.getByRole('radio', { name: 'プロ' }).click();
    await expect.poll(isDirty).toBe('true');
    reset();

    await expect
      .element(screen.getByRole('radio', { name: 'プロ' }))
      .not.toBeChecked();
    await expect.poll(isDirty).toBe('false');
  });
});

describe('Checkbox', () => {
  const schema = z.object({ agree: z.literal(true, '同意してください') });
  const fields = formFields(schema);

  const Consent = () => (
    <Harness fields={fields} serve={(data) => parseForm(schema, data)}>
      {(form) => {
        const agree = form.field('agree');
        return (
          <>
            <Checkbox
              {...agree.input}
              invalid={agree.invalid}
              label="規約に同意する"
            />
            <p>{agree.error}</p>
          </>
        );
      }}
    </Harness>
  );

  it('チェックせずに送ると zod の文言を出し、チェックボックスへフォーカスを移す', async () => {
    const screen = await render(<Consent />);

    submit();

    await expect.poll(() => errorShown('同意してください')).toBe(true);
    await expect.element(screen.getByRole('checkbox')).toHaveFocus();
  });

  it('チェックして送ると true が届く', async () => {
    const screen = await render(<Consent />);

    await screen.getByRole('checkbox').click();
    submit();

    await expect.poll(() => received).toStrictEqual({ agree: true });
  });

  it('reset でチェックが外れ、isDirty も下りる', async () => {
    const screen = await render(<Consent />);

    await screen.getByRole('checkbox').click();
    await expect.poll(isDirty).toBe('true');
    reset();

    await expect.element(screen.getByRole('checkbox')).not.toBeChecked();
    await expect.poll(isDirty).toBe('false');
  });
});

describe('Switch', () => {
  const schema = z.object({ notify: z.boolean(), memo: failing });
  const fields = formFields(schema);

  const Settings = () => (
    <Harness fields={fields} serve={(data) => parseForm(schema, data)}>
      {(form) => {
        const notify = form.field('notify');
        return (
          <>
            <Switch
              {...notify.input}
              invalid={notify.invalid}
              label="通知を受け取る"
            />
            <Memo form={form} />
          </>
        );
      }}
    </Harness>
  );

  it('送信に失敗しても、オンにした状態を描き直す', async () => {
    const screen = await render(<Settings />);

    await screen.getByRole('switch').click();
    submit();

    await expect.poll(() => errorShown('メモを入力してください')).toBe(true);
    await expect.element(screen.getByRole('switch')).toBeChecked();
  });

  it('オンにして送ると true が届く', async () => {
    const screen = await render(<Settings />);

    await screen.getByRole('switch').click();
    await userEvent.fill(labelled('メモ'), 'よろしく');
    submit();

    await expect
      .poll(() => received)
      .toStrictEqual({ notify: true, memo: 'よろしく' });
  });

  it('reset でオフに戻り、isDirty も下りる', async () => {
    const screen = await render(<Settings />);

    await screen.getByRole('switch').click();
    await expect.poll(isDirty).toBe('true');
    reset();

    await expect.element(screen.getByRole('switch')).not.toBeChecked();
    await expect.poll(isDirty).toBe('false');
  });
});

const tagsDefinition = defineForm(
  z.object({
    tags: z.array(z.enum(['react', 'vue', 'svelte'])).min(1),
    memo: failing,
  }),
  [minChecked('tags', 1, '1つ以上選んでください')],
);
const tagsFields = formFields(tagsDefinition);
const tagOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

describe('CheckboxGroup', () => {
  const Tags = () => (
    <Harness
      fields={tagsFields}
      serve={(data) => parseForm(tagsDefinition, data)}
    >
      {(form, state) => {
        const tags = form.field('tags');
        return (
          <>
            <FormControl
              errorText={tags.error}
              invalid={tags.invalid}
              label="好きなもの"
              labelAs="legend"
              renderInput={(props) => (
                <CheckboxGroup.Root
                  {...props}
                  {...tags.input}
                  defaultValue={listOf(state.values?.['tags'])}
                >
                  {tagOptions.map((option) => (
                    <CheckboxGroup.Item
                      itemValue={option.value}
                      key={option.value}
                      label={option.label}
                    />
                  ))}
                </CheckboxGroup.Root>
              )}
              required={tags.required}
            />
            <Memo form={form} />
          </>
        );
      }}
    </Harness>
  );

  it('1 つもチェックせずに離れると minChecked の文言を出す', async () => {
    const screen = await render(<Tags />);

    await screen.getByRole('checkbox', { name: 'React' }).click();
    await screen.getByRole('checkbox', { name: 'React' }).click();
    await userEvent.tab();

    await expect.poll(() => errorShown('1つ以上選んでください')).toBe(true);
  });

  it('送信に失敗しても、チェックした値を描き直す', async () => {
    const screen = await render(<Tags />);

    await screen.getByRole('checkbox', { name: 'Vue' }).click();
    submit();

    await expect.poll(() => errorShown('メモを入力してください')).toBe(true);
    await expect
      .element(screen.getByRole('checkbox', { name: 'Vue' }))
      .toBeChecked();
  });

  it('reset のあとも、次の操作は既定値から数える', async () => {
    const screen = await render(<Tags />);

    await screen.getByRole('checkbox', { name: 'React' }).click();
    reset();
    await expect.poll(isDirty).toBe('false');
    await screen.getByRole('checkbox', { name: 'Svelte' }).click();
    await userEvent.fill(labelled('メモ'), 'よろしく');
    submit();

    await expect
      .poll(() => received)
      .toStrictEqual({ tags: ['svelte'], memo: 'よろしく' });
  });
});

describe('CheckboxCard', () => {
  const Tags = () => (
    <Harness
      fields={tagsFields}
      serve={(data) => parseForm(tagsDefinition, data)}
    >
      {(form, state) => {
        const tags = form.field('tags');
        return (
          <>
            <FormControl
              errorText={tags.error}
              invalid={tags.invalid}
              label="好きなもの"
              labelAs="legend"
              renderInput={(props) => (
                <CheckboxCard
                  {...props}
                  {...tags.input}
                  defaultValue={listOf(state.values?.['tags'])}
                  options={tagOptions}
                />
              )}
              required={tags.required}
            />
            <Memo form={form} />
          </>
        );
      }}
    </Harness>
  );

  it('1 つもチェックせずに送ると minChecked の文言を出し、最初のカードへフォーカスを移す', async () => {
    const screen = await render(<Tags />);

    await userEvent.fill(labelled('メモ'), 'よろしく');
    submit();

    await expect.poll(() => errorShown('1つ以上選んでください')).toBe(true);
    await expect
      .element(screen.getByRole('checkbox', { name: 'React' }))
      .toHaveFocus();
  });

  it('送信に失敗しても、チェックした値を描き直す', async () => {
    const screen = await render(<Tags />);

    await screen.getByRole('checkbox', { name: 'Vue' }).click();
    submit();

    await expect.poll(() => errorShown('メモを入力してください')).toBe(true);
    await expect
      .element(screen.getByRole('checkbox', { name: 'Vue' }))
      .toBeChecked();
  });

  it('reset のあとも、次の操作は既定値から数える', async () => {
    const screen = await render(<Tags />);

    await screen.getByRole('checkbox', { name: 'React' }).click();
    reset();
    await expect
      .element(screen.getByRole('checkbox', { name: 'React' }))
      .not.toBeChecked();
    await screen.getByRole('checkbox', { name: 'Svelte' }).click();
    await userEvent.fill(labelled('メモ'), 'よろしく');
    submit();

    await expect
      .poll(() => received)
      .toStrictEqual({ tags: ['svelte'], memo: 'よろしく' });
  });
});

describe('Autocomplete', () => {
  const Tags = () => (
    <Harness
      fields={tagsFields}
      serve={(data) => parseForm(tagsDefinition, data)}
    >
      {(form, state) => {
        const tags = form.field('tags');
        return (
          <>
            <FormControl
              errorText={tags.error}
              invalid={tags.invalid}
              label="好きなもの"
              renderInput={(props) => (
                <Autocomplete
                  {...props}
                  {...tags.input}
                  defaultValue={listOf(state.values?.['tags'])}
                  options={tagOptions}
                />
              )}
              required={tags.required}
            />
            <Memo form={form} />
          </>
        );
      }}
    </Harness>
  );

  it('選んだ値を配列で送る', async () => {
    await render(<Tags />);

    await choose('Vue');
    await choose('React');
    await userEvent.fill(labelled('メモ'), 'よろしく');
    submit();

    await expect
      .poll(() => received)
      .toStrictEqual({ tags: ['vue', 'react'], memo: 'よろしく' });
  });

  it('何も選ばずに送ると minChecked の文言を出し、入力欄へフォーカスを移す', async () => {
    const screen = await render(<Tags />);

    await userEvent.fill(labelled('メモ'), 'よろしく');
    submit();

    await expect.poll(() => errorShown('1つ以上選んでください')).toBe(true);
    await expect.element(screen.getByRole('combobox')).toHaveFocus();
  });

  it('選択の変化を form が知り、エラーの解除と isDirty に届く', async () => {
    await render(<Tags />);

    submit();
    await expect.poll(() => errorShown('1つ以上選んでください')).toBe(true);

    await choose('Svelte');
    await expect.poll(() => errorShown('1つ以上選んでください')).toBe(false);
    await expect.poll(isDirty).toBe('true');
  });

  it('送信に失敗しても選択を描き直し、reset で既定値に戻る', async () => {
    const screen = await render(<Tags />);

    await choose('Vue');
    submit();
    await expect.poll(() => errorShown('メモを入力してください')).toBe(true);
    await expect
      .element(screen.getByRole('button', { name: 'タグを削除' }))
      .toBeInTheDocument();

    await choose('React');
    reset();
    await expect.poll(isDirty).toBe('false');
    await userEvent.fill(labelled('メモ'), 'よろしく');
    submit();

    await expect
      .poll(() => received)
      .toStrictEqual({ tags: ['vue'], memo: 'よろしく' });
  });

  it('reset で、選ばずに打ちかけた文字を消し、候補の一覧も閉じる', async () => {
    const screen = await render(<Tags />);

    await userEvent.type(screen.getByRole('combobox'), 'Re');
    await expect
      .element(screen.getByRole('combobox'))
      .toHaveAttribute('aria-expanded', 'true');
    reset();

    await expect.element(screen.getByRole('combobox')).toHaveValue('');
    await expect
      .element(screen.getByRole('combobox'))
      .toHaveAttribute('aria-expanded', 'false');
  });
});

describe('NumberField', () => {
  const schema = z.object({
    count: z.coerce
      .number('数値を入力してください')
      .int('整数で入力してください')
      .min(1, '1以上で入力してください')
      .max(10, '10以下で入力してください'),
    ratio: z.coerce.number('数値を入力してください'),
    memo: failing,
  });
  const fields = formFields(schema);

  const Order = () => (
    <Harness fields={fields} serve={(data) => parseForm(schema, data)}>
      {(form) => {
        const count = form.field('count');
        const ratio = form.field('ratio');
        return (
          <>
            <FormControl
              errorText={count.error}
              invalid={count.invalid}
              label="個数"
              renderInput={(props) => (
                <NumberField {...props} {...count.input} />
              )}
              required={count.required}
            />
            <FormControl
              errorText={ratio.error}
              invalid={ratio.invalid}
              label="比率"
              renderInput={(props) => (
                <NumberField {...props} {...ratio.input} />
              )}
              required={ratio.required}
            />
            <Memo form={form} />
          </>
        );
      }}
    </Harness>
  );

  it('範囲外の値をブラウザの検証に載せる', async () => {
    await render(<Order />);

    await userEvent.fill(labelled('個数'), '15');

    expect(countInput().validity.valid).toBe(false);
    expect(countInput().validationMessage).toBe('10 以下で入力してください');
    expect(countInput().form?.checkValidity()).toBe(false);
  });

  it('範囲外の値は、エラーが出ているあいだ入力のたびにその文言へ変わる', async () => {
    await render(<Order />);

    await labelled('個数').click();
    await userEvent.tab();
    await expect.poll(() => errorShown('数値を入力してください')).toBe(true);

    await userEvent.type(labelled('個数'), '0');
    await expect.poll(() => errorShown('1 以上で入力してください')).toBe(true);
  });

  it('矢印キーで変えた値を form が知る', async () => {
    await render(<Order />);

    await labelled('個数').click();
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(labelled('個数')).toHaveValue('1');
    await expect.poll(isDirty).toBe('true');
  });

  it('送信に失敗したら、文字列で返る値を描き直す', async () => {
    await render(<Order />);

    await userEvent.fill(labelled('個数'), '3');
    await userEvent.fill(labelled('比率'), '0.25');
    submit();

    await expect.poll(() => errorShown('メモを入力してください')).toBe(true);
    await expect.element(labelled('個数')).toHaveValue('3');
    await expect.element(labelled('比率')).toHaveValue('0.25');
  });

  it('step="any" の欄は小数を丸めずに送る', async () => {
    await render(<Order />);

    await userEvent.fill(labelled('個数'), '2');
    await userEvent.fill(labelled('比率'), '1.5');
    await userEvent.fill(labelled('メモ'), 'よろしく');
    submit();

    await expect
      .poll(() => received)
      .toStrictEqual({ count: 2, ratio: 1.5, memo: 'よろしく' });
  });

  it('reset で描画時の値に戻り、isDirty も下りる', async () => {
    await render(<Order />);

    await userEvent.fill(labelled('個数'), '4');
    await userEvent.tab();
    await expect.poll(isDirty).toBe('true');
    reset();

    await expect.element(labelled('個数')).toHaveValue('');
    await expect.poll(isDirty).toBe('false');
  });
});

describe('Slider', () => {
  const schema = z.object({
    volume: z.coerce.number().min(0).max(100),
    memo: failing,
  });
  const fields = formFields(schema);

  const Volume = () => (
    <Harness fields={fields} serve={(data) => parseForm(schema, data)}>
      {(form) => {
        const volume = form.field('volume');
        return (
          <>
            <FormControl
              errorText={volume.error}
              invalid={volume.invalid}
              label="音量"
              renderInput={(props) => <Slider {...props} {...volume.input} />}
              required={volume.required}
            />
            <Memo form={form} />
          </>
        );
      }}
    </Harness>
  );

  it('動かした値が届く', async () => {
    await render(<Volume />);

    await userEvent.fill(labelled('音量'), '30');
    await userEvent.fill(labelled('メモ'), 'よろしく');
    submit();

    await expect
      .poll(() => received)
      .toStrictEqual({ volume: 30, memo: 'よろしく' });
  });

  it('送信に失敗しても、動かした値を描き直す', async () => {
    await render(<Volume />);

    await userEvent.fill(labelled('音量'), '30');
    submit();

    await expect.poll(() => errorShown('メモを入力してください')).toBe(true);
    await expect.element(labelled('音量')).toHaveValue('30');
  });

  it('reset で描画時の値に戻り、isDirty も下りる', async () => {
    await render(<Volume />);

    await userEvent.fill(labelled('音量'), '30');
    await expect.poll(isDirty).toBe('true');
    reset();

    await expect.element(labelled('音量')).toHaveValue('0');
    await expect.poll(isDirty).toBe('false');
  });
});

describe('FileField', () => {
  const schema = z.object({ avatar: z.file('ファイルを選んでください') });
  const fields = formFields(schema);

  const Avatar = () => (
    <Harness fields={fields} serve={(data) => parseForm(schema, data)}>
      {(form) => {
        const avatar = form.field('avatar');
        return (
          <>
            <FileField.Root
              {...avatar.input}
              aria-label="アバター"
              invalid={avatar.invalid}
            >
              <FileField.Trigger
                renderItem={({ onClick, disabled }) => (
                  <Button disabled={disabled} onClick={onClick}>
                    ファイルを選ぶ
                  </Button>
                )}
              />
              <FileField.ItemList clearable />
            </FileField.Root>
            <p>{avatar.error}</p>
          </>
        );
      }}
    </Harness>
  );

  it('選んだファイルを送る', async () => {
    await render(<Avatar />);

    await userEvent.upload(labelled('アバター'), picture());
    submit();

    await expect
      .poll(() => (received as { avatar?: File } | undefined)?.avatar?.name)
      .toBe('me.png');
  });

  it('一覧から外したファイルは送らない', async () => {
    const screen = await render(<Avatar />);

    await userEvent.upload(labelled('アバター'), picture());
    await expect.poll(isDirty).toBe('true');
    await screen.getByRole('button', { name: 'ファイルを削除' }).click();
    await expect.poll(isDirty).toBe('false');
    submit();

    await expect.poll(() => errorShown('ファイルを選んでください')).toBe(true);
  });

  it('reset で一覧も空になる', async () => {
    const screen = await render(<Avatar />);

    await userEvent.upload(labelled('アバター'), picture());
    await expect.element(screen.getByText('me.png')).toBeInTheDocument();
    reset();

    await expect.element(screen.getByText('me.png')).not.toBeInTheDocument();
    await expect.poll(isDirty).toBe('false');
  });
});
