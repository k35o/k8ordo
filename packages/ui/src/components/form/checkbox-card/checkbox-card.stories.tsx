import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { expect } from 'storybook/test';

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
