import { formFields, parseForm } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import { z } from 'zod';

import {
  ActionForm,
  fill,
  memo,
  MemoField,
} from '../../../../.storybook/action-form';
import {
  finishPending,
  PendingForm,
} from '../../../../.storybook/pending-form';
import { afterRenderingUpdate } from '../../../../.storybook/rendering';
import { FormControl } from '../form-control';
import { Radio } from './radio';

import styles from './radio.stories.module.css';

const options = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
] as const;

const meta: Meta<typeof Radio> = {
  title: 'components/form/radio',
  component: Radio,
  args: {
    disabled: false,
    'aria-labelledby': 'radio-story-label',
    options,
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

const DefaultRender = (props: ComponentProps<typeof Radio>) => {
  const [value, setValue] = useState('react');
  const { defaultValue: _defaultValue, ...radioProps } = props;

  return (
    <div className={styles.frame}>
      <p className={styles.groupLabel} id={props['aria-labelledby']}>
        Framework
      </p>
      <Radio
        {...radioProps}
        onChange={(nextValue) => {
          setValue(nextValue);
        }}
        value={value}
      />
    </div>
  );
};

export const Default: Story = {
  render: (props) => <DefaultRender {...props} />,
};

export const Disabled: Story = {
  args: {
    defaultValue: 'vue',
    disabled: true,
  },
};

// 送信中もフォーカスを持ち続け、押しても矢印キーでも選び直さない。Enter で
// 送ると、選んでいるラジオにフォーカスがあるまま送信中になる
export const PendingKeepsFocus: Story = {
  args: { onChange: fn() },
  render: (props) => (
    <PendingForm>
      <p id={props['aria-labelledby']}>Framework</p>
      <Radio
        aria-labelledby={props['aria-labelledby']}
        defaultValue="react"
        name="framework"
        onChange={props.onChange}
        options={props.options}
      />
    </PendingForm>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const react = canvas.getByRole<HTMLInputElement>('radio', {
      name: 'React',
    });

    try {
      react.focus();
      react.form?.requestSubmit();
      await canvas.findByText('送信中');
      await afterRenderingUpdate();

      await expect(react).toHaveFocus();
      await Promise.all(
        canvas.getAllByRole('radio').map(async (radio) => {
          await expect(radio).toHaveAttribute('aria-disabled', 'true');
        }),
      );

      await userEvent.keyboard('{ArrowDown}');
      await userEvent.click(canvas.getByText('Svelte'));
      await expect(react).toBeChecked();
    } finally {
      finishPending();
    }
    await waitFor(async () => {
      await expect(react).not.toHaveAttribute('aria-disabled');
    });
    await expect(args.onChange).not.toHaveBeenCalled();

    // 送信中に選びかけたぶんを覚えていると、次に本当に選んでも知らせない
    await userEvent.click(canvas.getByText('Vue'));
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenCalledWith('vue', expect.anything());
  },
};

export const RequiredUntilSelected: Story = {
  args: {
    required: true,
  },
  play: async ({ canvas, userEvent }) => {
    const react = canvas.getByRole('radio', { name: 'React' });

    await expect(react).toBeInvalid();

    await userEvent.click(canvas.getByRole('radio', { name: 'Vue' }));

    await expect(react).toBeValid();
  },
};

const selectionDotOf = (radio: HTMLElement) =>
  radio.closest('label')?.querySelector('[aria-hidden] > span');

// 点は opacity でフェードするので、切り替わり切るのを待つ
export const SelectionFollowsReset: Story = {
  render: () => (
    <form className={styles.column}>
      <Radio
        aria-labelledby="radio-story-label"
        defaultValue="react"
        options={options}
      />
      <button type="reset">reset</button>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    const react = canvas.getByRole('radio', { name: 'React' });
    const vue = canvas.getByRole('radio', { name: 'Vue' });

    await userEvent.click(vue);

    await waitFor(async () => {
      await expect(selectionDotOf(vue)).toBeVisible();
    });

    await userEvent.click(canvas.getByRole('button', { name: 'reset' }));

    await expect(react).toBeChecked();
    await waitFor(async () => {
      await expect(selectionDotOf(vue)).not.toBeVisible();
    });
    await waitFor(async () => {
      await expect(selectionDotOf(react)).toBeVisible();
    });
  },
};

// FormControl の renderInput から受け取る invalid を radiogroup の aria-invalid として伝える
export const Invalid: Story = {
  args: {
    defaultValue: 'vue',
    invalid: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radiogroup')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
};

const planChoice = z.object({
  plan: z.enum(['free', 'pro'], 'プランを選んでください'),
  memo,
});
const planChoiceFields = formFields(planChoice);
const PLANS = [
  { value: 'free', label: '無料' },
  { value: 'pro', label: 'プロ' },
];

const PlanForm = () => (
  <ActionForm
    fields={planChoiceFields}
    serve={(data) => parseForm(planChoice, data)}
  >
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
              <Radio {...props} {...plan.input} options={PLANS} />
            )}
            required={plan.required}
          />
          <MemoField field={form.field('memo')} />
        </>
      );
    }}
  </ActionForm>
);

// @k8ordo/form の formFields を広げるだけでつながる
export const WithForm: Story = {
  render: () => <PlanForm />,
  play: async ({ canvas, userEvent }) => {
    const radio = (name: string) => canvas.getByRole('radio', { name });
    const memoField = () => canvas.getByLabelText('メモ', { exact: false });
    const submit = () =>
      userEvent.click(canvas.getByRole('button', { name: '送信' }));

    // reset で選択を外し、isDirty も下りる
    await userEvent.click(canvas.getByText('プロ'));
    await expect(await canvas.findByText('変更あり')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'リセット' }));
    await expect(radio('プロ')).not.toBeChecked();
    await expect(await canvas.findByText('変更なし')).toBeVisible();

    // 選ばずに送ると zod の文言を出し、最初のラジオへフォーカスを移す
    await fill(userEvent, memoField(), 'よろしく');
    await submit();
    await expect(
      await canvas.findByText('プランを選んでください'),
    ).toBeVisible();
    await waitFor(() => expect(radio('無料')).toHaveFocus());

    // 送信に失敗しても、選んだ値を描き直す
    await userEvent.click(canvas.getByText('プロ'));
    await fill(userEvent, memoField(), '却下');
    await submit();
    await expect(await canvas.findByText('却下されました')).toBeVisible();
    await expect(radio('プロ')).toBeChecked();
  },
};
