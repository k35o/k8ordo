import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect } from 'storybook/test';

import { CheckboxGroup } from '.';
import { Checkbox } from '../checkbox';

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
      <p className="text-fg-base mb-2 font-medium" id="frameworks-label">
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
      <p
        className="text-fg-base mb-2 flex gap-2 font-medium"
        id="frameworks-required-label"
      >
        フレームワーク
        <span className="text-fg-error">必須</span>
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
      <p
        className="text-fg-base mb-2 font-medium"
        id="frameworks-disabled-label"
      >
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
    <div className="flex flex-col items-start gap-2">
      <p className="text-fg-base font-medium" id="frameworks-ref-label">
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
