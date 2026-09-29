import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { afterRenderingUpdate } from '../../../../.storybook/focus';
import {
  finishPending,
  PendingForm,
} from '../../../../.storybook/pending-form';
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

// 送信中もフォーカスを持ち続け、押しても値は変えない。Enter で送ると
// スイッチにフォーカスがあるまま送信中になる
export const PendingKeepsFocus: Story = {
  args: { onChange: fn() },
  render: ({ label, onChange }) => (
    <PendingForm>
      <Switch label={label} name="notifications" onChange={onChange} />
    </PendingForm>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const switchElement = canvas.getByRole<HTMLInputElement>('switch', {
      name: 'Enable notifications',
    });

    try {
      switchElement.focus();
      switchElement.form?.requestSubmit();
      await canvas.findByText('送信中');
      await afterRenderingUpdate();

      await expect(switchElement).toHaveFocus();
      await expect(switchElement).toHaveAttribute('aria-disabled', 'true');

      await userEvent.keyboard(' ');
      await userEvent.click(canvas.getByText('Enable notifications'));
      await expect(switchElement).not.toBeChecked();
    } finally {
      finishPending();
    }
    await waitFor(async () => {
      await expect(switchElement).not.toHaveAttribute('aria-disabled');
    });
    await expect(args.onChange).not.toHaveBeenCalled();

    // 送信中に押したぶんを覚えていると、次に本当に切り替えても知らせない
    await userEvent.click(switchElement);
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenCalledWith(true, expect.anything());
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
