import {
  defineForm,
  formFields,
  minChecked,
  parseForm,
} from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import { z } from 'zod';

import { CheckboxGroup } from '.';
import {
  ActionForm,
  fill,
  listOf,
  memo,
  MemoField,
} from '../../../../.storybook/action-form';
import { Checkbox } from '../checkbox';
import { FormControl } from '../form-control';

import styles from './checkbox-group.stories.module.css';

const meta: Meta<typeof CheckboxGroup.Root> = {
  title: 'components/form/checkbox-group',
  component: CheckboxGroup.Root,
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup.Root>;

const DefaultRender = () => {
  const [value, setValue] = useState(['react']);

  return (
    <div>
      <p className={styles.groupLabel} id="frameworks-label">
        フレームワーク
      </p>
      <CheckboxGroup.Root
        aria-labelledby="frameworks-label"
        name="frameworks"
        onChange={setValue}
        value={value}
      >
        <Checkbox itemValue="react" label="React" />
        <Checkbox itemValue="vue" label="Vue" />
        <Checkbox itemValue="svelte" label="Svelte" />
      </CheckboxGroup.Root>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultRender />,
  play: async ({ canvas, userEvent }) => {
    await expect(
      canvas.getByRole('group', { name: 'フレームワーク' }),
    ).toBeVisible();

    const react = canvas.getByRole('checkbox', { name: 'React' });
    const vue = canvas.getByRole('checkbox', { name: 'Vue' });

    await expect(react).toBeChecked();
    await expect(vue).not.toBeChecked();

    await userEvent.click(vue);

    await expect(vue).toBeChecked();
    await expect(react).toBeChecked();
  },
};

export const Required: Story = {
  render: () => (
    <div>
      <p className={styles.requiredGroupLabel} id="frameworks-required-label">
        フレームワーク
        <span className={styles.requiredMark}>必須</span>
      </p>
      <CheckboxGroup.Root
        aria-labelledby="frameworks-required-label"
        defaultValue={[]}
        name="frameworks-required"
      >
        <CheckboxGroup.Item itemValue="react" label="React" />
        <CheckboxGroup.Item itemValue="vue" label="Vue" />
      </CheckboxGroup.Root>
    </div>
  ),
  play: async ({ canvas }) => {
    // role="group" は aria-required を許可していない（axe: aria-allowed-attr）ので、
    // 必須であることはグループのアクセシブルネームで伝える
    const group = canvas.getByRole('group', { name: 'フレームワーク 必須' });

    await expect(group).not.toHaveAttribute('aria-required');
  },
};

export const Disabled: Story = {
  render: () => (
    <div>
      <p className={styles.groupLabel} id="frameworks-disabled-label">
        フレームワーク
      </p>
      <CheckboxGroup.Root
        aria-labelledby="frameworks-disabled-label"
        defaultValue={['vue']}
        disabled
        name="frameworks-disabled"
      >
        <Checkbox itemValue="react" label="React" />
        <Checkbox itemValue="vue" label="Vue" />
        <Checkbox itemValue="svelte" label="Svelte" />
      </CheckboxGroup.Root>
    </div>
  ),
};

const RefRender = () => {
  const ref = useRef<HTMLFieldSetElement>(null);

  return (
    <div className={styles.column}>
      <p className={styles.label} id="frameworks-ref-label">
        フレームワーク
      </p>
      <CheckboxGroup.Root
        aria-labelledby="frameworks-ref-label"
        defaultValue={[]}
        name="frameworks-ref"
        ref={ref}
      >
        <CheckboxGroup.Item itemValue="react" label="React" />
        <CheckboxGroup.Item itemValue="vue" label="Vue" />
      </CheckboxGroup.Root>
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

    await expect(canvas.getByRole('checkbox', { name: 'React' })).toHaveFocus();
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
              <CheckboxGroup.Root
                {...props}
                {...tags.input}
                defaultValue={listOf(state.values?.tags)}
              >
                {TAGS.map((tag) => (
                  <CheckboxGroup.Item
                    itemValue={tag.value}
                    key={tag.value}
                    label={tag.label}
                  />
                ))}
              </CheckboxGroup.Root>
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
    const memoField = () => canvas.getByLabelText('メモ', { exact: false });
    const submit = () =>
      userEvent.click(canvas.getByRole('button', { name: '送信' }));

    // 1 つもチェックせずに離れると minChecked の文言を出す
    await userEvent.click(canvas.getByText('React'));
    await userEvent.click(canvas.getByText('React'));
    await userEvent.tab();
    await expect(
      await canvas.findByText('1つ以上選んでください'),
    ).toBeVisible();

    // reset のあとも、次の操作は既定値から数える
    await userEvent.click(canvas.getByText('React'));
    await userEvent.click(canvas.getByRole('button', { name: 'リセット' }));
    await expect(await canvas.findByText('変更なし')).toBeVisible();
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
    await expect(canvas.getByRole('checkbox', { name: 'Vue' })).toBeChecked();
  },
};
