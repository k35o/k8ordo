import { formFields, parseForm } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect, fireEvent, waitFor } from 'storybook/test';
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
import { Select } from './select';

import styles from './select.stories.module.css';

const meta: Meta<typeof Select> = {
  title: 'components/form/select',
  component: Select,
  args: {
    id: 'select',
    'aria-label': '基数',
    'aria-describedby': 'select-feedback',
    options: [
      { value: '2', label: '2進数' },
      { value: '8', label: '8進数' },
      { value: '10', label: '10進数' },
      { value: '16', label: '16進数' },
    ],
    defaultValue: '10',
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    disabled: false,
    invalid: false,
    required: false,
  },
};

export const Invalid: Story = {
  args: {
    disabled: false,
    invalid: true,
    required: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    invalid: false,
    required: false,
  },
};

// 送信中もフォーカスを持ち続け、一覧を開かず値も変えない。Enter で送ると、
// 欄にフォーカスがあるまま送信中になる
export const PendingKeepsFocus: Story = {
  render: (props) => (
    <PendingForm>
      <Select {...props} name="radix" />
    </PendingForm>
  ),
  play: async ({ canvas }) => {
    const select = canvas.getByRole<HTMLSelectElement>('combobox', {
      name: '基数',
    });

    try {
      select.focus();
      select.form?.requestSubmit();
      await canvas.findByText('送信中');
      await afterRenderingUpdate();

      await expect(select).toHaveFocus();
      await expect(select).toHaveAttribute('aria-disabled', 'true');
      // userEvent は select のキー操作を再現しないので、一覧を開いたり値を
      // 動かしたりするブラウザの既定の動作を止めたかを見る
      await expect(fireEvent.keyDown(select, { key: 'ArrowDown' })).toBe(false);
      await expect(fireEvent.keyDown(select, { key: ' ' })).toBe(false);
      await expect(fireEvent.keyDown(select, { key: '8' })).toBe(false);
      await expect(fireEvent.keyDown(select, { key: 'Tab' })).toBe(true);
    } finally {
      finishPending();
    }
    await waitFor(async () => {
      await expect(select).not.toHaveAttribute('aria-disabled');
    });
    await expect(fireEvent.keyDown(select, { key: 'ArrowDown' })).toBe(true);
  },
};

const RefRender = () => {
  const ref = useRef<HTMLSelectElement>(null);

  return (
    <div className={styles.column}>
      <Select
        aria-label="基数"
        id="select-ref"
        options={[
          { value: '2', label: '2進数' },
          { value: '10', label: '10進数' },
        ]}
        ref={ref}
      />
      <button
        onClick={() => {
          ref.current?.focus();
        }}
        type="button"
      >
        focus
      </button>
    </div>
  );
};

export const ForwardsRef: Story = {
  render: () => <RefRender />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'focus' }));

    await expect(canvas.getByRole('combobox')).toHaveFocus();
  },
};

const planChoice = z.object({
  plan: z.enum(['free', 'pro'], 'プランを選んでください'),
  memo,
});
const planChoiceFields = formFields(planChoice);
const PLANS = [
  { value: '', label: '選んでください' },
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
            renderInput={(props) => (
              <Select {...props} {...plan.input} options={PLANS} />
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
    const plan = () => canvas.getByLabelText('プラン', { exact: false });

    // 選ばずに離れると、プレースホルダーのままとして zod の文言を出す
    await userEvent.click(plan());
    await userEvent.tab();
    await expect(
      await canvas.findByText('プランを選んでください'),
    ).toBeVisible();

    // reset で描画時の値に戻り、isDirty も下りる
    await userEvent.selectOptions(plan(), 'free');
    await expect(await canvas.findByText('変更あり')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'リセット' }));
    await expect(plan()).toHaveValue('');
    await expect(await canvas.findByText('変更なし')).toBeVisible();

    // 送信に失敗しても、選んだ値を描き直す
    await userEvent.selectOptions(plan(), 'pro');
    await fill(
      userEvent,
      canvas.getByLabelText('メモ', { exact: false }),
      '却下',
    );
    await userEvent.click(canvas.getByRole('button', { name: '送信' }));
    await expect(await canvas.findByText('却下されました')).toBeVisible();
    await expect(plan()).toHaveValue('pro');
  },
};
