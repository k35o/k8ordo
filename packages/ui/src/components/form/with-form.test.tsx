import { useForm } from '@k8ordo/form';
import type { FormFields, FormState, UseFormReturn } from '@k8ordo/form';
import { formFields, parseForm } from '@k8ordo/form/server';
import type { ParseResult } from '@k8ordo/form/server';
import { useActionState } from 'react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { z } from 'zod';

import { Button } from '../buttons/button';
import { FileField } from './file-field';
import { FormControl } from './form-control';
import { Slider } from './slider';
import { TextField } from './text-field';

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

// FormControl のラベルは必須のバッジまで名前に含むので、前方で引く。
// このプロジェクトはロケール集合を定義しないので、バッジを含む組み込みの
// 文言は英語になる
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

// 送信をサーバーで落とすためだけの欄。ブラウザの検査は通るので、送信は
// action まで届き、失敗が state で返ってくる
const failing = z.string().refine((memo) => memo !== '却下', '却下されました');

const refuseOnServer = () => userEvent.fill(labelled('メモ'), '却下');

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

const picture = () => new File(['avatar'], 'me.png', { type: 'image/png' });

beforeEach(() => {
  received = undefined;
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

  // このプロジェクトは styles.css を読まず、トークンの無い溝は高さを持たないので、
  // つまみの input も見えない。値を入れることだけを確かめたいので、見えるまで待たない
  const slide = () => userEvent.fill(labelled('音量'), '30', { force: true });

  it('動かした値が届く', async () => {
    await render(<Volume />);

    await slide();
    await userEvent.fill(labelled('メモ'), 'よろしく');
    submit();

    await expect
      .poll(() => received)
      .toStrictEqual({ volume: 30, memo: 'よろしく' });
  });

  it('送信に失敗しても、動かした値を描き直す', async () => {
    await render(<Volume />);

    await slide();
    await refuseOnServer();
    submit();

    await expect.poll(() => errorShown('却下されました')).toBe(true);
    await expect.element(labelled('音量')).toHaveValue('30');
  });

  it('reset で描画時の値に戻り、isDirty も下りる', async () => {
    await render(<Volume />);

    await slide();
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
    await screen.getByRole('button', { name: 'Remove file' }).click();
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
