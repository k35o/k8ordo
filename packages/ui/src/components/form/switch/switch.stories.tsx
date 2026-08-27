import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { expect } from 'storybook/test';

import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  title: 'components/form/switch',
  component: Switch,
  args: {
    disabled: false,
    invalid: false,
    required: false,
    label: 'Enable notifications',
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

const DefaultRender = (props: ComponentProps<typeof Switch>) => {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      checked={checked}
      disabled={props.disabled}
      id={props.id}
      invalid={props.invalid}
      label={props.label}
      name={props.name}
      onChange={(next) => {
        setChecked(next);
      }}
      required={props.required}
    />
  );
};

export const Default: Story = {
  render: (props) => <DefaultRender {...props} />,
  play: async ({ canvas, userEvent }) => {
    const switchElement = canvas.getByRole('switch');

    await expect(switchElement).not.toBeChecked();

    await userEvent.click(switchElement);

    await expect(switchElement).toBeChecked();
    await expect(switchElement).toHaveAttribute('aria-checked', 'true');
  },
};

export const DefaultChecked: Story = {
  args: {
    defaultChecked: true,
    disabled: false,
    invalid: false,
    required: false,
    label: 'Automatic updates',
  },
};

export const Disabled: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
    invalid: false,
    required: false,
    label: 'Location services',
  },
};

const RefRender = () => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-start gap-2">
      <Switch label="switch with ref" ref={ref} />
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

    await expect(canvas.getByRole('switch')).toHaveFocus();
  },
};
