import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, waitFor } from 'storybook/test';

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

const appearanceOf = (switchElement: HTMLElement) => {
  const track = switchElement.nextElementSibling;
  const thumb = track?.firstElementChild;

  if (!track || !thumb) {
    throw new Error('Switch renders its track right after the input');
  }

  return {
    trackColor: getComputedStyle(track).backgroundColor,
    thumbTranslate: getComputedStyle(thumb).translate,
  };
};

// トラックの色もつまみの位置も transition するので、切り替わり切るのを待つ
export const AppearanceFollowsReset: Story = {
  render: () => (
    <form className="flex flex-col items-start gap-2">
      <Switch label="off by default" />
      <Switch defaultChecked label="on by default" />
      <button type="reset">reset</button>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    const offByDefault = canvas.getByRole('switch', { name: 'off by default' });
    const onByDefault = canvas.getByRole('switch', { name: 'on by default' });
    const off = appearanceOf(offByDefault);
    const on = appearanceOf(onByDefault);

    await expect(on.trackColor).not.toBe(off.trackColor);
    await expect(on.thumbTranslate).not.toBe(off.thumbTranslate);

    await userEvent.click(offByDefault);
    await userEvent.click(onByDefault);

    await waitFor(async () => {
      await expect(appearanceOf(offByDefault)).toEqual(on);
    });
    await waitFor(async () => {
      await expect(appearanceOf(onByDefault)).toEqual(off);
    });

    await userEvent.click(canvas.getByRole('button', { name: 'reset' }));

    await expect(offByDefault).not.toBeChecked();
    await expect(onByDefault).toBeChecked();
    await waitFor(async () => {
      await expect(appearanceOf(offByDefault)).toEqual(off);
    });
    await waitFor(async () => {
      await expect(appearanceOf(onByDefault)).toEqual(on);
    });
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
