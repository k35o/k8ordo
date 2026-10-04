'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { Button, Code, FormControl, TextField } from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../../../../messages';

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
      className="flex flex-col gap-4"
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
          <fieldset
            className="border-border-mute flex flex-wrap items-end gap-3 rounded-lg border p-4"
            key={row.key}
          >
            <legend className="px-1 text-sm">
              {m.formNested.demoRow(row.index + 1)}
            </legend>
            <div className="min-w-40 flex-1">
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
            <div className="w-28">
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
              <Button
                color="base"
                onAction={row.remove}
                variant="outline"
              >
                {m.formNested.demoRemove()}
              </Button>
            )}
          </fieldset>
        );
      })}
      <div className="flex flex-wrap items-center gap-3">
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
        <dl className="bg-bg-surface grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-lg px-4 py-3 text-sm">
          {sent.map(([name, value]) => (
            <div className="contents" key={name}>
              <dt>
                <Code>{name}</Code>
              </dt>
              <dd className="break-all">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </form>
  );
}
