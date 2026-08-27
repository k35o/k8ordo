import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect } from 'storybook/test';

import { Slider } from './slider';

const meta: Meta<typeof Slider> = {
  title: 'components/form/slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    a11y: {
      options: {
        rules: {
          'label-title-only': { enabled: false },
          label: { enabled: false },
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: {
    min: 0,
    max: 100,
    step: 1,
    invalid: false,
    disabled: false,
    required: false,
    defaultValue: 50,
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 30,
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: 90,
  },
};

// スパンが 1 未満（例: OKLCH の C は 0〜0.4）でも、塗りの進捗が
// ネイティブのつまみ位置と一致することを保証する回帰テスト。
// 0.2 / 0.4 = 50% になる（旧実装では range が 1 に丸められ 20% にズレていた）。
export const FractionalRange: Story = {
  args: {
    min: 0,
    max: 0.4,
    step: 0.001,
    defaultValue: 0.2,
  },
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider');
    const wrapper = slider.parentElement;
    await expect(wrapper?.style.getPropertyValue('--slider-progress')).toBe(
      '50%',
    );
  },
};

const RefRender = () => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-start gap-2">
      <Slider defaultValue={50} ref={ref} />
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

    await expect(canvas.getByRole('slider')).toHaveFocus();
  },
};
