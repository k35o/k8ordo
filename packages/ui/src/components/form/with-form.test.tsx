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

const picture = () => new File(['avatar'], 'me.png', { type: 'image/png' });

beforeEach(() => {
  received = undefined;
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
