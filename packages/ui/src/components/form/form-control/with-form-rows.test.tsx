import { useForm } from '@k8ordo/form';
import type { FormState } from '@k8ordo/form';
import { formFields } from '@k8ordo/form/server';
import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { z } from 'zod';

import { CheckboxCard } from '../checkbox-card';
import { NumberField } from '../number-field';
import { TextField } from '../text-field';
import { FormControl } from './form-control';

const fields = formFields(
  z.object({
    talks: z
      .array(
        z.object({
          title: z.string(),
          minutes: z.coerce.number().int(),
          topics: z.array(z.enum(['react', 'css'])),
        }),
      )
      .min(1),
  }),
);

const TOPICS = [
  { value: 'react', label: 'React' },
  { value: 'css', label: 'CSS' },
];

const TalkRows = ({ state }: { state: FormState }) => {
  const form = useForm(fields, state);

  return (
    <form {...form.props}>
      {form.array('talks').rows.map((row) => {
        const title = row.field('title');
        const minutes = row.field('minutes');
        const topics = row.field('topics');
        return (
          <div key={row.key}>
            <FormControl
              errorText={title.error}
              invalid={title.invalid}
              label="タイトル"
              renderInput={(props) => <TextField {...props} {...title.input} />}
              required={title.required}
            />
            <FormControl
              errorText={minutes.error}
              invalid={minutes.invalid}
              label="時間"
              renderInput={(props) => (
                <NumberField {...props} {...minutes.input} />
              )}
              required={minutes.required}
            />
            <FormControl
              errorText={topics.error}
              invalid={topics.invalid}
              label="トピック"
              labelAs="legend"
              renderInput={(props) => (
                <CheckboxCard {...props} {...topics.input} options={TOPICS} />
              )}
              required={topics.required}
            />
          </div>
        );
      })}
    </form>
  );
};

describe('繰り返し行の欄と formFields', () => {
  it('行の欄ごとの input を部品に広げると、送信に失敗した値が戻る', async () => {
    await render(
      <TalkRows
        state={{
          values: {
            'talks[0].title': 'RSC',
            'talks[0].minutes': '30',
            'talks[0].topics': ['css'],
          },
          rows: { talks: 1 },
          token: '1',
        }}
      />,
    );

    await expect
      .element(page.getByLabelText('タイトル', { exact: false }))
      .toHaveValue('RSC');
    await expect
      .element(page.getByLabelText('時間', { exact: false }))
      .toHaveValue('30');
    await expect
      .element(page.getByRole('checkbox', { name: 'CSS' }))
      .toBeChecked();
    await expect
      .element(page.getByRole('checkbox', { name: 'React' }))
      .not.toBeChecked();
  });
});
