'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useAppState } from '@k8ordo/state';
import { Button, Code, FormControl, TextField } from '@k8ordo/ui';

import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { demoState } from './demo-state';

type Props = {
  /** `formFields(demoState.url)` の結果。Server Component で導かれ、props で渡る。 */
  fields: FormFields<'q' | 'min', never>;
};

// TextField と同じ見た目。number は TextField の受け付ける type に無いので
// 素の <input> に、制約属性をそのまま広げる。
const NUMBER_INPUT_CLASS =
  'border-border-base bg-bg-base aria-invalid:border-border-error focus-visible:ring-border-info inline-full rounded-xl border px-3 py-2 focus-visible:border-transparent focus-visible:ring-2 focus-visible:outline-hidden';

export function FormDemo({ fields }: Props) {
  // Server Action の無いサイトなので、送信結果の state は無い
  const form = useForm(fields);
  const q = form.field('q');
  const min = form.field('min');
  // フォームが GET で書いた URL を、同じスキーマの state が読み返す
  const [{ q: currentQ, min: currentMin }] = useAppState(demoState);
  const search = demoState.search({ q: currentQ, min: currentMin });

  // `type` は TextField 側が決める（search）。それ以外の制約属性は
  // スキーマ由来のものをそのまま広げる。
  const { type: _qType, ...qInput } = q.input;

  return (
    <div className="border-border-mute flex flex-col gap-6 rounded-lg border p-6">
      <form
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
        method="get"
        {...form.props}
      >
        <div className="flex-1">
          <FormControl
            errorText={q.error}
            invalid={q.invalid}
            label={m.form.demoLabelQ()}
            renderInput={(props) => (
              <TextField
                {...props}
                {...qInput}
                defaultValue={currentQ}
                type="search"
              />
            )}
            required={q.required}
          />
        </div>
        <div className="sm:w-40">
          <FormControl
            errorText={min.error}
            invalid={min.invalid}
            label={m.form.demoLabelMin()}
            renderInput={(props) => (
              <input
                {...props}
                {...min.input}
                aria-invalid={props.invalid}
                className={NUMBER_INPUT_CLASS}
                defaultValue={currentMin}
              />
            )}
            required={min.required}
          />
        </div>
        <Button type="submit" variant="solid">
          {m.form.demoSubmit()}
        </Button>
      </form>
      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex gap-3">
          <dt className="text-fg-mute">URL</dt>
          <dd className="break-all">
            <Code>{search === '' ? m.form.demoUrlEmpty() : `?${search}`}</Code>
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-fg-mute">state</dt>
          <dd className="break-all">
            <Code>{JSON.stringify({ q: currentQ, min: currentMin })}</Code>
          </dd>
        </div>
      </dl>
      <p className="text-fg-mute text-sm leading-relaxed">
        <Rich>{m.form.demoHint()}</Rich>
      </p>
    </div>
  );
}
