import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { expect } from 'storybook/test';

import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'components/form/checkbox',
  component: Checkbox,
  args: {
    disabled: false,
    label: 'checkbox',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

const DefaultRender = (props: ComponentProps<typeof Checkbox>) => {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      checked={checked}
      disabled={props.disabled}
      label={props.label}
      onChange={(next) => {
        setChecked(next);
      }}
    />
  );
};

export const Default: Story = {
  render: (props) => <DefaultRender {...props} />,
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'checkbox' });

    await expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);

    await expect(checkbox).toBeChecked();
  },
};

// controlled では checked が唯一の入力。onChange を握り潰したら切り替わらない
const PinnedRender = (props: ComponentProps<typeof Checkbox>) => (
  <Checkbox checked label={props.label} onChange={() => undefined} />
);

export const Checked: Story = {
  args: {
    label: 'always checked',
  },
  render: (props) => <PinnedRender {...props} />,
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'always checked' });

    await expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);

    await expect(checkbox).toBeChecked();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    label: 'disabled checkbox',
  },
};

const RefRender = () => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-start gap-2">
      <Checkbox label="checkbox with ref" ref={ref} />
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

    await expect(
      canvas.getByRole('checkbox', { name: 'checkbox with ref' }),
    ).toHaveFocus();
  },
};

const checkMarkOf = (checkbox: HTMLElement) =>
  checkbox.closest('label')?.querySelector('svg');

export const CheckMarkFollowsReset: Story = {
  render: () => (
    <form className="flex flex-col items-start gap-2">
      <Checkbox label="unchecked by default" />
      <Checkbox defaultChecked label="checked by default" />
      <button type="reset">reset</button>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    const uncheckedByDefault = canvas.getByRole('checkbox', {
      name: 'unchecked by default',
    });
    const checkedByDefault = canvas.getByRole('checkbox', {
      name: 'checked by default',
    });

    await userEvent.click(uncheckedByDefault);
    await userEvent.click(checkedByDefault);

    await expect(checkMarkOf(uncheckedByDefault)).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'reset' }));

    await expect(uncheckedByDefault).not.toBeChecked();
    await expect(checkMarkOf(uncheckedByDefault)).not.toBeVisible();
    await expect(checkedByDefault).toBeChecked();
    await expect(checkMarkOf(checkedByDefault)).toBeVisible();
  },
};

const submittedValue = (checkbox: HTMLInputElement) =>
  new FormData(checkbox.form ?? undefined).get(checkbox.name);

export const SubmitsItemValue: Story = {
  render: () => (
    <form>
      <Checkbox
        defaultChecked
        itemValue="yes"
        label="in stock"
        name="inStock"
      />
    </form>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole<HTMLInputElement>('checkbox', {
      name: 'in stock',
    });

    await expect(submittedValue(checkbox)).toBe('yes');
  },
};

export const SubmitsOnWithoutItemValue: Story = {
  render: () => (
    <form>
      <Checkbox defaultChecked label="agree" name="agree" />
    </form>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole<HTMLInputElement>('checkbox', {
      name: 'agree',
    });

    await expect(submittedValue(checkbox)).toBe('on');
  },
};

// FormControl の renderInput から受け取る invalid を aria-invalid として伝える
export const Invalid: Story = {
  args: {
    invalid: true,
    label: 'invalid checkbox',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('checkbox', { name: 'invalid checkbox' }),
    ).toHaveAttribute('aria-invalid', 'true');
  },
};
