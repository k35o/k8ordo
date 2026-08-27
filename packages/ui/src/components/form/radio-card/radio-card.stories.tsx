import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { expect } from 'storybook/test';

import { RadioCard } from './radio-card';

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
      <div className="w-lg max-w-full">
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
      <p className="text-fg-base mb-3 font-medium" id="radio-card-label">
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
      <p
        className="text-fg-base mb-3 font-medium"
        id="radio-card-unmatched-label"
      >
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
      <p className="text-fg-base mb-3 font-medium" id="radio-card-label">
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
