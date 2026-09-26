import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fireEvent, fn } from 'storybook/test';

import { ColorPicker } from './color-picker';

const SWATCHES = [
  { value: '#0d9488', label: 'ティール' },
  { value: '#2563eb', label: '青' },
  { value: '#f97316', label: 'オレンジ' },
  { value: '#e11d48', label: 'ローズ' },
  { value: '#171717', label: '黒' },
];

const meta: Meta<typeof ColorPicker> = {
  title: 'components/form/color-picker',
  component: ColorPicker,
  decorators: [
    (Story) => (
      <div className="w-80 p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    'aria-label': 'テーマの色',
    defaultValue: '#0d9488',
    swatches: SWATCHES,
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

// range の矢印キーは testing-library の userEvent が扱わないので、値を置いて
// input を出す（ブラウザがつまみを動かしたときと同じ道）
const slide = (input: HTMLElement, value: number) => {
  fireEvent.input(input, { target: { value: String(value) } });
};

export const Default: Story = {
  args: { onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'テーマの色' });
    await expect(input).toHaveValue('#0d9488');
    await expect(canvas.getByRole('slider', { name: '色相' })).toHaveValue(
      '175',
    );
    await expect(canvas.getByRole('slider', { name: '彩度' })).toHaveValue(
      '84',
    );
    await expect(canvas.getByRole('slider', { name: '明度' })).toHaveValue(
      '32',
    );
    await expect(
      canvas.getByRole('button', { name: 'ティール' }),
    ).toHaveAttribute('aria-pressed', 'true');

    const orange = canvas.getByRole('button', { name: 'オレンジ' });
    await userEvent.click(orange);

    await expect(input).toHaveValue('#f97316');
    await expect(orange).toHaveAttribute('aria-pressed', 'true');
    await expect(
      canvas.getByRole('button', { name: 'ティール' }),
    ).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onChange).toHaveBeenCalledWith('#f97316');
  },
};

export const Sliders: Story = {
  args: { onChange: fn(), swatches: [] },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'テーマの色' });
    const hue = canvas.getByRole('slider', { name: '色相' });
    const saturation = canvas.getByRole('slider', { name: '彩度' });

    slide(hue, 0);
    await expect(input).toHaveValue('#960d0d');
    await expect(hue).toHaveAttribute('aria-valuetext', '0°');
    await expect(args.onChange).toHaveBeenLastCalledWith('#960d0d');

    // 灰色まで下げても色相は残り、彩度を戻すと元の色相に戻る
    slide(saturation, 0);
    await expect(input).toHaveValue('#525252');
    await expect(hue).toHaveValue('0');
    slide(hue, 240);
    await expect(input).toHaveValue('#525252');
    slide(saturation, 84);
    await expect(input).toHaveValue('#0d0d96');
  },
};

export const Typing: Story = {
  args: { onChange: fn(), swatches: [] },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'テーマの色' });
    const hue = canvas.getByRole('slider', { name: '色相' });

    await userEvent.clear(input);
    // 空にしたことは知らせる
    await expect(args.onChange).toHaveBeenLastCalledWith('');

    // 打ちかけのあいだは知らせず、つまみも動かない。途中の 3 桁（`256`）も色と取らない
    await userEvent.type(input, '2563');
    await expect(args.onChange).toHaveBeenCalledOnce();
    await expect(hue).toHaveValue('175');
    await userEvent.type(input, 'EB');
    await expect(args.onChange).toHaveBeenLastCalledWith('#2563eb');
    await expect(hue).toHaveValue('221');

    // 離れると #rrggbb にそろえる
    await userEvent.tab();
    await expect(input).toHaveValue('#2563eb');

    // 3 桁の省略形は離れるときに広げる
    await userEvent.clear(input);
    await userEvent.type(input, 'f80');
    await userEvent.tab();
    await expect(input).toHaveValue('#ff8800');
    await expect(args.onChange).toHaveBeenLastCalledWith('#ff8800');
  },
};

const ControlledPicker = () => {
  const [color, setColor] = useState('#e11d48');
  return (
    <div className="flex flex-col gap-3">
      <ColorPicker
        aria-label="テーマの色"
        onChange={setColor}
        swatches={SWATCHES}
        value={color}
      />
      <p className="text-sm">選んだ色: {color || '（なし）'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPicker />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'テーマの色' });
    await userEvent.click(canvas.getByRole('button', { name: '青' }));
    await expect(canvas.getByText('選んだ色: #2563eb')).toBeInTheDocument();
    await expect(input).toHaveValue('#2563eb');

    await userEvent.clear(input);
    await expect(canvas.getByText('選んだ色: （なし）')).toBeInTheDocument();
    await userEvent.type(input, 'F97316');
    await expect(canvas.getByText('選んだ色: #f97316')).toBeInTheDocument();
    // 打った文字は離れるまでそのまま
    await expect(input).toHaveValue('F97316');
    await userEvent.tab();
    await expect(input).toHaveValue('#f97316');
  },
};

export const Empty: Story = {
  args: { defaultValue: undefined },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'テーマの色' }),
    ).toHaveValue('');
    await expect(
      canvas
        .getAllByRole('button')
        .filter((swatch) => swatch.getAttribute('aria-pressed') !== 'false'),
    ).toHaveLength(0);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'テーマの色' }),
    ).toBeDisabled();
    const enabled = [
      ...canvas.getAllByRole('slider'),
      ...canvas.getAllByRole('button'),
    ].filter((control) => !control.matches(':disabled'));
    await expect(enabled).toHaveLength(0);
  },
};

export const Invalid: Story = {
  args: { invalid: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'テーマの色' }),
    ).toHaveAttribute('aria-invalid', 'true');
  },
};
