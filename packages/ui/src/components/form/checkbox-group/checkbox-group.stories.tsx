import { formFields, parseForm } from '@k8ordo/form/server';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import { z } from 'zod';

import { CheckboxGroup } from '.';
import {
  ActionForm,
  fill,
  memo,
  MemoField,
} from '../../../../.storybook/action-form';
import { FormControl } from '../form-control';

import styles from './checkbox-group.stories.module.css';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'components/form/checkbox-group',
  component: CheckboxGroup,
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
] as const;

const DefaultRender = () => {
  const [value, setValue] = useState(['react']);

  return (
    <div>
      <p className={styles.groupLabel} id="frameworks-label">
        フレームワーク
      </p>
      <CheckboxGroup
        aria-labelledby="frameworks-label"
        name="frameworks"
        onChange={setValue}
        options={FRAMEWORKS}
        value={value}
      />
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

export const UncontrolledNotifiesInOptionOrder: Story = {
  args: { onChange: fn() },
  render: ({ onChange }) => (
    <div>
      <p className={styles.groupLabel} id="frameworks-uncontrolled-label">
        フレームワーク
      </p>
      <CheckboxGroup
        aria-labelledby="frameworks-uncontrolled-label"
        defaultValue={['svelte']}
        onChange={onChange}
        options={FRAMEWORKS}
      />
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('checkbox', { name: 'React' }));

    await expect(args.onChange).toHaveBeenLastCalledWith(['react', 'svelte']);
  },
};

export const Required: Story = {
  render: () => (
    <div>
      <p className={styles.requiredGroupLabel} id="frameworks-required-label">
        フレームワーク
        <span className={styles.requiredMark}>必須</span>
      </p>
      <CheckboxGroup
        aria-labelledby="frameworks-required-label"
        defaultValue={[]}
        name="frameworks-required"
        options={FRAMEWORKS.slice(0, 2)}
      />
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
      <CheckboxGroup
        aria-labelledby="frameworks-disabled-label"
        defaultValue={['vue'] as const}
        disabled
        name="frameworks-disabled"
        options={FRAMEWORKS}
      />
    </div>
  ),
};

export const WithoutNameSubmitsNothing: Story = {
  render: () => (
    <form aria-label="filters">
      <p className={styles.groupLabel} id="frameworks-unnamed-label">
        フレームワーク
      </p>
      <CheckboxGroup
        aria-labelledby="frameworks-unnamed-label"
        defaultValue={['react']}
        options={FRAMEWORKS}
      />
    </form>
  ),
  play: async ({ canvas }) => {
    const form = canvas.getByRole<HTMLFormElement>('form', { name: 'filters' });

    await expect(canvas.getByRole('checkbox', { name: 'React' })).toBeChecked();
    await expect([...new FormData(form).entries()]).toStrictEqual([]);
  },
};

const RefRender = () => {
  const ref = useRef<HTMLFieldSetElement>(null);

  return (
    <div className={styles.column}>
      <p className={styles.label} id="frameworks-ref-label">
        フレームワーク
      </p>
      <CheckboxGroup
        aria-labelledby="frameworks-ref-label"
        defaultValue={[]}
        name="frameworks-ref"
        options={FRAMEWORKS.slice(0, 2)}
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

    await expect(canvas.getByRole('checkbox', { name: 'React' })).toHaveFocus();
  },
};

const favorites = z.object({
  tags: z
    .array(z.enum(['react', 'vue', 'svelte']))
    .min(1, '1つ以上選んでください'),
  memo,
});
const favoritesFields = formFields(favorites);
const received = fn();

const FavoritesForm = () => (
  <ActionForm
    fields={favoritesFields}
    onReceive={received}
    serve={(data) => parseForm(favorites, data)}
  >
    {(form) => {
      const tags = form.field('tags');
      return (
        <>
          <FormControl
            errorText={tags.error}
            label="好きなもの"
            labelAs="group"
            renderInput={(props) => (
              <CheckboxGroup {...props} {...tags.input} options={FRAMEWORKS} />
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

    // 1 つもチェックせずに離れると スキーマの .min(1) の文言を出す
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
