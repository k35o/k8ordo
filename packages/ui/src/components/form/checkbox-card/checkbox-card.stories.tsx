import {
  defineForm,
  formFields,
  minChecked,
  parseForm,
} from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import { z } from 'zod';

import {
  ActionForm,
  fill,
  listOf,
  memo,
  MemoField,
} from '../../../../.storybook/action-form';
import { FormControl } from '../form-control';
import { CheckboxCard } from './checkbox-card';

import styles from './checkbox-card.stories.module.css';

const OPTIONS = [
  {
    value: 'history',
    label: 'Version history',
    description: 'Keep a restorable timeline of changes for each document.',
  },
  {
    value: 'comments',
    label: 'Inline comments',
    description: 'Collect contextual feedback directly on each section.',
  },
  {
    value: 'share',
    label: 'Share links',
    description: 'Allow reviewers to open read-only previews instantly.',
  },
] as const;

const meta: Meta<typeof CheckboxCard> = {
  title: 'components/form/checkbox-card',
  component: CheckboxCard,
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
    'aria-labelledby': 'checkbox-card-label',
    disabled: false,
    invalid: false,
    options: OPTIONS,
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxCard>;
type StoryArgs = ComponentProps<typeof CheckboxCard>;

const DefaultRender = (props: StoryArgs) => {
  const [value, setValue] = useState<string[]>(['comments']);

  return (
    <div>
      <p className={styles.groupLabel} id="checkbox-card-label">
        Enable collaboration features
      </p>
      <CheckboxCard
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
};

export const DefaultValue: Story = {
  args: {
    defaultValue: ['history', 'share'],
  },
  render: (props) => (
    <div>
      <p className={styles.groupLabel} id="checkbox-card-label">
        Enable collaboration features
      </p>
      <CheckboxCard
        aria-labelledby={props['aria-labelledby']}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        invalid={props.invalid}
        options={props.options}
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: ['comments'],
  },
  render: DefaultValue.render,
};

const RefRender = () => {
  const ref = useRef<HTMLFieldSetElement>(null);

  return (
    <div className={styles.column}>
      <p className={styles.label} id="checkbox-card-ref-label">
        Enable collaboration features
      </p>
      <CheckboxCard
        aria-labelledby="checkbox-card-ref-label"
        options={OPTIONS}
        ref={ref}
      />
      <button
        onClick={() => {
          ref.current?.querySelector('input')?.focus();
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

    await expect(
      canvas.getByRole('checkbox', { name: 'Version history' }),
    ).toHaveFocus();
  },
};

const checkMarkOf = (checkbox: HTMLElement) =>
  checkbox.closest('label')?.querySelector('svg');

// 非制御の選択は input の :checked から描くので、change を飛ばさない reset にも追従する
export const CheckMarkFollowsReset: Story = {
  render: (props) => (
    <form className={styles.column}>
      <p className={styles.label} id="checkbox-card-reset-label">
        Enable collaboration features
      </p>
      <CheckboxCard
        aria-labelledby="checkbox-card-reset-label"
        defaultValue={['history']}
        options={props.options}
      />
      <button type="reset">reset</button>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    const history = canvas.getByRole('checkbox', { name: 'Version history' });
    const share = canvas.getByRole('checkbox', { name: 'Share links' });

    await userEvent.click(history);
    await userEvent.click(share);
    await expect(checkMarkOf(share)).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'reset' }));

    await expect(history).toBeChecked();
    await expect(share).not.toBeChecked();
    await expect(checkMarkOf(history)).toBeVisible();
    await expect(checkMarkOf(share)).not.toBeVisible();
  },
};

const favorites = defineForm(
  z.object({
    tags: z.array(z.enum(['react', 'vue', 'svelte'])).min(1),
    memo,
  }),
  [minChecked('tags', 1, '1つ以上選んでください')],
);
const favoritesFields = formFields(favorites);
const received = fn();
const TAGS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

const FavoritesForm = () => (
  <ActionForm
    fields={favoritesFields}
    onReceive={received}
    serve={(data) => parseForm(favorites, data)}
  >
    {(form, state) => {
      const tags = form.field('tags');
      return (
        <>
          <FormControl
            errorText={tags.error}
            invalid={tags.invalid}
            label="好きなもの"
            labelAs="legend"
            renderInput={(props) => (
              <CheckboxCard
                {...props}
                {...tags.input}
                defaultValue={listOf(state.values?.tags)}
                options={TAGS}
              />
            )}
            required={tags.required}
          />
          <MemoField field={form.field('memo')} />
        </>
      );
    }}
  </ActionForm>
);

// @k8ordo/form の formFields を広げるだけでつながる
export const WithForm: Story = {
  render: () => <FavoritesForm />,
  play: async ({ canvas, userEvent }) => {
    const card = (name: string) => canvas.getByRole('checkbox', { name });
    const memoField = () => canvas.getByLabelText('メモ', { exact: false });
    const submit = () =>
      userEvent.click(canvas.getByRole('button', { name: '送信' }));

    // 1 つもチェックせずに送ると minChecked の文言を出し、最初のカードへフォーカスを移す
    await fill(userEvent, memoField(), 'よろしく');
    await submit();
    await expect(
      await canvas.findByText('1つ以上選んでください'),
    ).toBeVisible();
    await waitFor(() => expect(card('React')).toHaveFocus());

    // reset のあとも、次の操作は既定値から数える
    await userEvent.click(canvas.getByText('React'));
    await userEvent.click(canvas.getByRole('button', { name: 'リセット' }));
    await expect(card('React')).not.toBeChecked();
    await userEvent.click(canvas.getByText('Svelte'));
    await fill(userEvent, memoField(), 'よろしく');
    await submit();
    await waitFor(() =>
      expect(received).toHaveBeenLastCalledWith({
        tags: ['svelte'],
        memo: 'よろしく',
      }),
    );

    // 送信に失敗しても、チェックした値を描き直す
    await userEvent.click(canvas.getByText('Vue'));
    await fill(userEvent, memoField(), '却下');
    await submit();
    await expect(await canvas.findByText('却下されました')).toBeVisible();
    await expect(card('Vue')).toBeChecked();
  },
};
