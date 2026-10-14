'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { useAppState } from '@k8ordo/state';
import { Button, Code, FormControl, TextField } from '@k8ordo/ui';

import { jsLiteral } from '../../components/js-literal';
import * as m from '../../messages';
import { demoState } from './demo-state';

import styles from './form-demo.module.css';

type Props = {
  /** `formFields(demoState.url)` の結果。Server Component で導かれ、props で渡る。 */
  fields: FormFields<'q' | 'min' | 'inStock', never>;
};

export function FormDemo({ fields }: Props) {
  // Server Action の無いサイトなので、送信結果の state は無い
  const form = useForm(fields);
  const q = form.field('q');
  const min = form.field('min');
  const inStock = form.field('inStock');
  // フォームが GET で書いた URL を、同じスキーマの state が読み返す
  const [current] = useAppState(demoState);
  const search = demoState.search(current);

  return (
    <div className={styles.root}>
      <form className={styles.form} method="get" {...form.props}>
        <FormControl
          errorText={q.error}
          invalid={q.invalid}
          label={m.form.demoLabelQ()}
          renderInput={(props) => (
            <TextField
              {...props}
              {...q.input}
              defaultValue={current.q}
              type="search"
            />
          )}
          required={q.required}
        />
        <div className={styles.row}>
          <div className={styles.min}>
            <FormControl
              errorText={min.error}
              invalid={min.invalid}
              label={m.form.demoLabelMin()}
              renderInput={(props) => (
                // NumberField は type="text" で描くので、JavaScript が無いと
                // ブラウザが min を検査しない。このデモはその検査も見せる
                <TextField
                  {...props}
                  {...min.input}
                  defaultValue={current.min}
                />
              )}
              required={min.required}
            />
          </div>
          {/* @k8ordo/ui の Checkbox はグループの外では value 属性を出さず、
            ブラウザ既定の on を送る。state が書く "true" と同じ文字列を
            送るため、value まで広げられる素の <input> にする */}
          <label className={styles.inStock}>
            <input
              {...inStock.input}
              className={styles.checkbox}
              defaultChecked={current.inStock}
            />
            {m.form.demoLabelInStock()}
          </label>
          <Button type="submit" variant="solid">
            {m.form.demoSubmit()}
          </Button>
        </div>
      </form>
      <dl className={styles.values}>
        <dt className={styles.term}>URL</dt>
        <dd className={styles.value}>
          <Code>{search === '' ? m.form.demoUrlEmpty() : `?${search}`}</Code>
        </dd>
        <dt className={styles.term}>state</dt>
        <dd className={styles.value}>
          <Code>{jsLiteral(current)}</Code>
        </dd>
      </dl>
    </div>
  );
}
