import { formFields, parseForm } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, waitFor } from 'storybook/test';
import { z } from 'zod';

import {
  ActionForm,
  fill,
  memo,
  MemoField,
} from '../../../../.storybook/action-form';
import { FormControl } from '../form-control';
import { RadioCard } from './radio-card';

import styles from './radio-card.stories.module.css';

const OPTIONS = [
  {
    value: 'starter',
    label: 'Starter',
    description: 'For simple personal projects and early drafts.',
  },
  {
    value: 'pro',
    label: 'Pro',
    description: 'For active products that need richer editing workflows.',
  },
  {
    value: 'team',
    label: 'Team',
    description: 'For shared libraries, review flows, and collaboration.',
  },
] as const;

const meta: Meta<typeof RadioCard> = {
  title: 'components/form/radio-card',
  component: RadioCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className={styles.frame}>
        <Story />
      </div>
    ),
  ],
  args: {
    'aria-labelledby': 'radio-card-label',
    disabled: false,
    invalid: false,
    options: OPTIONS,
  },
};

export default meta;
type Story = StoryObj<typeof RadioCard>;
type StoryArgs = ComponentProps<typeof RadioCard>;

const DefaultRender = (props: StoryArgs) => {
  const [value, setValue] = useState('pro');

  return (
    <div>
      <p className={styles.groupLabel} id="radio-card-label">
        Choose a plan
      </p>
      <RadioCard
        aria-labelledby={props['aria-labelledby']}
        disabled={props.disabled}
        invalid={props.invalid}
        onChange={setValue}
        options={props.options}
        value={value}
      />
    </div>
  );
};

export const Default: Story = {
  render: (props) => <DefaultRender {...props} />,
  play: async ({ canvas, userEvent }) => {
    const group = canvas.getByRole('radiogroup');
    await expect(group).toHaveAccessibleName('Choose a plan');
    await expect(canvas.getAllByRole('radio')).toHaveLength(3);

    const starter = canvas.getByRole('radio', { name: 'Starter' });
    const pro = canvas.getByRole('radio', { name: 'Pro' });
    const team = canvas.getByRole('radio', { name: 'Team' });

    await expect(pro).toBeChecked();
    await expect(pro).toHaveAccessibleDescription(
      'For active products that need richer editing workflows.',
    );

    await userEvent.click(starter);

    await expect(starter).toBeChecked();
    await expect(pro).not.toBeChecked();

    await userEvent.keyboard('{ArrowDown}');

    await expect(pro).toBeChecked();
    await expect(pro).toHaveFocus();
    await expect(starter).not.toBeChecked();

    await userEvent.keyboard('{ArrowUp}');

    await expect(starter).toBeChecked();
    await expect(team).not.toBeChecked();
  },
};

const UnmatchedValueRender = (props: StoryArgs) => {
  const [value, setValue] = useState('');

  return (
    <div>
      <p className={styles.groupLabel} id="radio-card-unmatched-label">
        Choose a plan
      </p>
      <RadioCard
        aria-labelledby="radio-card-unmatched-label"
        disabled={props.disabled}
        invalid={props.invalid}
        onChange={setValue}
        options={props.options}
        value={value}
      />
    </div>
  );
};

export const UnmatchedValue: Story = {
  render: (props) => <UnmatchedValueRender {...props} />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const active = canvasElement.ownerDocument.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }

    const radios = canvas.getAllByRole('radio');
    await expect(
      canvas.queryAllByRole('radio', { checked: true }),
    ).toHaveLength(0);

    await userEvent.tab();

    await expect(radios[0]).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');

    await expect(radios[1]).toBeChecked();
    await expect(radios[1]).toHaveFocus();
  },
};

export const DefaultValue: Story = {
  args: {
    defaultValue: 'starter',
  },
  render: (props) => (
    <div>
      <p className={styles.groupLabel} id="radio-card-label">
        Choose a plan
      </p>
      <RadioCard
        aria-labelledby={props['aria-labelledby']}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        invalid={props.invalid}
        options={props.options}
      />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const starter = canvas.getByRole('radio', { name: 'Starter' });
    const team = canvas.getByRole('radio', { name: 'Team' });

    await expect(starter).toBeChecked();

    await userEvent.click(team);

    await expect(team).toBeChecked();
    await expect(starter).not.toBeChecked();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'team',
  },
  render: DefaultValue.render,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Starter' })).toBeDisabled();
    await expect(canvas.getByRole('radio', { name: 'Pro' })).toBeDisabled();

    const team = canvas.getByRole('radio', { name: 'Team' });

    await expect(team).toBeDisabled();
    await expect(team).toBeChecked();
  },
};

const selectionDotOf = (radio: HTMLElement) =>
  radio.closest('label')?.querySelector('[aria-hidden] > span');

// 非制御の選択は input の :checked から描くので、change を飛ばさない reset にも追従する。
// 点は opacity でフェードするので、切り替わり切るのを待つ
export const SelectionFollowsReset: Story = {
  render: (props) => (
    <form className={styles.column}>
      <p className={styles.label} id="radio-card-reset-label">
        Choose a plan
      </p>
      <RadioCard
        aria-labelledby="radio-card-reset-label"
        defaultValue="starter"
        options={props.options}
      />
      <button type="reset">reset</button>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    const starter = canvas.getByRole('radio', { name: 'Starter' });
    const team = canvas.getByRole('radio', { name: 'Team' });

    await userEvent.click(team);
    await waitFor(async () => {
      await expect(selectionDotOf(team)).toBeVisible();
    });

    await userEvent.click(canvas.getByRole('button', { name: 'reset' }));

    await expect(starter).toBeChecked();
    await waitFor(async () => {
      await expect(selectionDotOf(team)).not.toBeVisible();
    });
    await waitFor(async () => {
      await expect(selectionDotOf(starter)).toBeVisible();
    });
  },
};

const planChoice = z.object({
  plan: z.enum(['free', 'pro'], 'プランを選んでください'),
  memo,
});
const planChoiceFields = formFields(planChoice);
const PLANS = [
  { value: 'free', label: '無料', description: 'ひとりで使う' },
  { value: 'pro', label: 'プロ', description: 'チームで使う' },
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
              <RadioCard {...props} {...plan.input} options={PLANS} />
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
    const radio = (name: string) =>
      canvas.getByRole<HTMLInputElement>('radio', { name });

    // 導かれた required を各ラジオが持ち、選ばないとブラウザの検証に通らない
    await expect(radio('無料')).toBeRequired();
    await expect(radio('無料').validity.valueMissing).toBe(true);

    // reset で選択を外し、isDirty も下りる
    await userEvent.click(canvas.getByText('プロ'));
    await expect(await canvas.findByText('変更あり')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'リセット' }));
    await expect(radio('プロ')).not.toBeChecked();
    await expect(await canvas.findByText('変更なし')).toBeVisible();

    // 送信に失敗しても、選んだ値を描き直す
    await userEvent.click(canvas.getByText('プロ'));
    await fill(
      userEvent,
      canvas.getByLabelText('メモ', { exact: false }),
      '却下',
    );
    await userEvent.click(canvas.getByRole('button', { name: '送信' }));
    await expect(await canvas.findByText('却下されました')).toBeVisible();
    await expect(radio('プロ')).toBeChecked();
  },
};
