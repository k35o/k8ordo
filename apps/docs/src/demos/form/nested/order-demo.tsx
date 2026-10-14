'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { Button, Code, FormControl, TextField } from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../../messages';

import styles from './order-demo.module.css';

type Props = {
  /** ページの Server Component が `formFields(orderSchema)` で導いたもの。 */
  fields: FormFields<never, 'items'>;
};

// 静的なサイトで送信先が無いので、送れる値になったところで止め、送られる
// はずだった名前と値を並べる。添字の付いた name を見せるのがこのデモの役目
export function OrderDemo({ fields }: Props) {
  const form = useForm(fields);
  const items = form.array('items');
  const [sent, setSent] = useState<Array<[string, string]> | null>(null);

  return (
    <form
      {...form.props}
      className={styles.form}
      onSubmit={(event) => {
        form.props.onSubmit(event);
        if (event.defaultPrevented) {
          setSent(null);
          return;
        }
        event.preventDefault();
        setSent(
          [...new FormData(event.currentTarget)].map(([name, value]) => [
            name,
            typeof value === 'string' ? value : value.name,
          ]),
        );
      }}
    >
      {items.rows.map((row) => {
        const name = row.field('name');
        const quantity = row.field('quantity');
        return (
          <fieldset className={styles.row} key={row.key}>
            <legend className={styles.legend}>
              {m.formNested.demoRow(row.index + 1)}
            </legend>
            <div className={styles.name}>
              <FormControl
                errorText={name.error}
                invalid={name.invalid}
                label={m.formNested.demoLabelName()}
                renderInput={(props) => (
                  <TextField {...props} {...name.input} autoComplete="off" />
                )}
                required={name.required}
              />
            </div>
            <div className={styles.quantity}>
              <FormControl
                errorText={quantity.error}
                invalid={quantity.invalid}
                label={m.formNested.demoLabelQuantity()}
                renderInput={(props) => (
                  <TextField {...props} {...quantity.input} />
                )}
                required={quantity.required}
              />
            </div>
            {items.canRemove && (
              <Button color="base" onAction={row.remove} variant="outline">
                {m.formNested.demoRemove()}
              </Button>
            )}
          </fieldset>
        );
      })}
      <div className={styles.actions}>
        {items.canAdd && (
          <Button color="base" onAction={items.add} variant="outline">
            {m.formNested.demoAdd()}
          </Button>
        )}
        <Button type="submit" variant="solid">
          {m.formNested.demoSubmit()}
        </Button>
      </div>
      {sent !== null && (
        <dl className={styles.values}>
          {sent.map(([name, value]) => (
            <div className={styles.entry} key={name}>
              <dt>
                <Code>{name}</Code>
              </dt>
              <dd className={styles.value}>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </form>
  );
}
