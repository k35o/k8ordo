import { useForm } from '@k8ordo/form';
import type {
  FieldView,
  FormFields,
  FormState,
  UseFormReturn,
} from '@k8ordo/form';
import type { ParseResult } from '@k8ordo/form/server';
import { useActionState } from 'react';
import type { FC, ReactNode } from 'react';
import type { UserEventObject } from 'storybook/test';
import { z } from 'zod';

import { Button } from '../src/components/buttons/button';
import { Form } from '../src/components/form/form';
import { FormControl } from '../src/components/form/form-control';
import { TextField } from '../src/components/form/text-field';
import { Stack } from '../src/components/layout/stack';

/**
 * Server Action の代わりに、action の中で parseForm を呼ぶフォーム。失敗の
 * 文言・エコー・最初に失敗した欄へのフォーカスまで本物と同じ道を通り、React
 * の送信後の自動リセットも本物と同じ順序で起きる。送信・リセットのボタンと、
 * isDirty を「変更あり」「変更なし」で出す行を持つ。
 */
export function ActionForm<
  FieldPath extends string,
  ArrayPath extends string,
  StringCheckboxPath extends string = never,
>({
  fields,
  serve,
  onReceive,
  children,
}: {
  fields: FormFields<FieldPath, ArrayPath, StringCheckboxPath>;
  serve: (formData: FormData) => ParseResult<unknown>;
  /** サーバーが受け取った値。parseForm が通ったときだけ呼ぶ */
  onReceive?: (data: unknown) => void;
  children: (
    form: UseFormReturn<FieldPath, ArrayPath, StringCheckboxPath>,
    state: FormState,
  ) => ReactNode;
}) {
  const [state, action] = useActionState(
    (_previous: FormState, formData: FormData): Promise<FormState> => {
      const parsed = serve(formData);
      if (parsed.success) {
        onReceive?.(parsed.data);
      }
      return Promise.resolve(parsed.state);
    },
    {},
  );
  const form = useForm(fields, state);

  return (
    <Form {...form.props} action={action}>
      {children(form, state)}
      <Stack direction="row" gap="sm">
        <Button type="submit">送信</Button>
        <Button
          onClick={(event) => {
            event.currentTarget.form?.reset();
          }}
          variant="outline"
        >
          リセット
        </Button>
      </Stack>
      <p>{form.isDirty ? '変更あり' : '変更なし'}</p>
    </Form>
  );
}

/**
 * 送信をサーバーで落とすためだけの欄。ブラウザの検査は通るので、「却下」と
 * 入れて送ると action まで届き、失敗が state で返ってくる。
 */
export const memo = z
  .string()
  .refine((value) => value !== '却下', '却下されました');

export const MemoField: FC<{ field: FieldView }> = ({ field }) => (
  <FormControl
    errorText={field.error}
    invalid={field.invalid}
    label="メモ"
    renderInput={(props) => <TextField {...props} {...field.input} />}
    required={field.required}
  />
);

/**
 * 送信に失敗した echo を配列で受ける部品に渡す。チェックボックスの組は、
 * 何個チェックしても配列で返ってくる。
 */
export const listOf = (value: string | string[] | undefined): string[] =>
  Array.isArray(value) ? value : [];

/**
 * 欄の値を打ち直す。storybook/test の userEvent は打った値を要素の側にも覚えて
 * おき、次に打つ文字をその後ろに足す。form の reset（送信後の React の自動
 * リセットを含む）は DOM の値だけを戻すので、そのまま打つと reset 前の値が
 * 頭に残る。消してから打つと、覚えた値も空からやり直す。
 */
export const fill = async (
  userEvent: UserEventObject,
  element: HTMLElement,
  value: string,
): Promise<void> => {
  await userEvent.clear(element);
  await userEvent.type(element, value);
};
