import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fireEvent, fn, waitFor } from 'storybook/test';

import { afterRenderingUpdate } from '../../../../.storybook/focus';
import {
  finishPending,
  PendingForm,
} from '../../../../.storybook/pending-form';
import { RangeSlider } from './range-slider';

const meta: Meta<typeof RangeSlider> = {
  title: 'components/form/range-slider',
  component: RangeSlider,
  decorators: [
    (Story) => (
      <div className="w-80 p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

// つまみを動かす。testing-library の userEvent は range のキー操作を再現しない
// ので、ドラッグと同じく値を入れて input イベントを出す（キーでの増減は
// ブラウザの持ち物で、この部品が持つのは「越えない」の判定だけ）
const slide = (thumb: HTMLElement, value: number) => {
  fireEvent.input(thumb, { target: { value: String(value) } });
};

export const Default: Story = {
  args: {
    'aria-label': '価格',
    defaultValue: [20, 80],
    onChange: fn(),
  },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole('group', { name: '価格' })).toBeVisible();
    const start = canvas.getByRole('slider', { name: '価格 最小' });
    const end = canvas.getByRole('slider', { name: '価格 最大' });

    await expect(start).toHaveValue('20');
    await expect(end).toHaveValue('80');
    // 互いのつまみが、もう一方の動ける範囲の端になる
    await expect(start).toHaveAttribute('aria-valuemax', '80');
    await expect(end).toHaveAttribute('aria-valuemin', '20');

    slide(start, 21);

    await expect(start).toHaveValue('21');
    await expect(args.onChange).toHaveBeenLastCalledWith([21, 80]);
  },
};

// つまみはもう一方を越えない。下側を上側より先へ送っても、上側の値で止まる
export const ThumbsDoNotCross: Story = {
  args: {
    'aria-label': '価格',
    defaultValue: [20, 80],
    onChange: fn(),
  },
  play: async ({ args, canvas }) => {
    const start = canvas.getByRole('slider', { name: '価格 最小' });
    const end = canvas.getByRole('slider', { name: '価格 最大' });

    slide(start, 95);
    await expect(start).toHaveValue('80');
    await expect(args.onChange).toHaveBeenLastCalledWith([80, 80]);

    slide(end, 10);
    await expect(end).toHaveValue('80');
  },
};

const ControlledRender = () => {
  const [value, setValue] = useState<readonly [number, number]>([10, 40]);
  return (
    <div className="flex flex-col gap-4">
      <RangeSlider aria-label="気温" onChange={setValue} value={value} />
      <p data-testid="value">{value.join('〜')}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledRender />,
  play: async ({ canvas }) => {
    const end = canvas.getByRole('slider', { name: '気温 最大' });

    slide(end, 38);
    await expect(canvas.getByTestId('value')).toHaveTextContent('10〜38');

    // 制御モードでも下側より下へは行かない
    slide(end, 3);
    await expect(end).toHaveValue('10');
    await expect(canvas.getByTestId('value')).toHaveTextContent('10〜10');
  },
};

export const Disabled: Story = {
  args: {
    'aria-label': '価格',
    defaultValue: [20, 80],
    disabled: true,
  },
  play: async ({ canvas }) => {
    const [start, end] = canvas.getAllByRole('slider');

    await expect(start).toBeDisabled();
    await expect(end).toBeDisabled();
  },
};

// 送信中もフォーカスを持ち続け、値は動かさない。Enter で送ると、つまみに
// フォーカスがあるまま送信中になる
export const PendingKeepsFocus: Story = {
  render: () => (
    <PendingForm>
      <RangeSlider
        aria-label="価格"
        defaultValue={[20, 80]}
        name={['priceMin', 'priceMax']}
      />
    </PendingForm>
  ),
  play: async ({ canvas }) => {
    const start = canvas.getByRole<HTMLInputElement>('slider', {
      name: '価格 最小',
    });
    const end = canvas.getByRole('slider', { name: '価格 最大' });

    try {
      start.focus();
      start.form?.requestSubmit();
      await canvas.findByText('送信中');
      await afterRenderingUpdate();

      await expect(start).toHaveFocus();
      await expect(start).toHaveAttribute('aria-disabled', 'true');
      await expect(end).toHaveAttribute('aria-disabled', 'true');
      // userEvent は range のキー操作を再現しないので、キーで値を動かす
      // ブラウザの既定の動作を止めたかを見る
      await expect(fireEvent.keyDown(start, { key: 'ArrowRight' })).toBe(false);
      await expect(fireEvent.keyDown(end, { key: 'Home' })).toBe(false);
    } finally {
      finishPending();
    }
    await waitFor(async () => {
      await expect(start).not.toHaveAttribute('aria-disabled');
    });
    await expect(fireEvent.keyDown(start, { key: 'ArrowRight' })).toBe(true);
  },
};

export const Invalid: Story = {
  args: {
    'aria-label': '価格',
    defaultValue: [20, 80],
    invalid: true,
  },
  play: async ({ canvas }) => {
    const [start, end] = canvas.getAllByRole('slider');

    await expect(start).toHaveAttribute('aria-invalid', 'true');
    await expect(end).toHaveAttribute('aria-invalid', 'true');
  },
};
