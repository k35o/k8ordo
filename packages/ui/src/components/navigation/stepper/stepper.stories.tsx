import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';

import { Stepper } from '.';

const STEPS = [
  { label: 'プラン', description: '使い方に合わせて選ぶ' },
  { label: '支払い', description: 'カードか請求書' },
  { label: '確認', description: '内容を見直して送る' },
];

const meta: Meta<typeof Stepper> = {
  title: 'components/navigation/stepper',
  component: Stepper,
  args: {
    'aria-label': '申し込みの手順',
    steps: STEPS,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  args: {
    defaultValue: 1,
  },
  play: async ({ canvas }) => {
    const [plan, payment, confirm] = canvas.getAllByRole('listitem');

    // 済んだ段は読み上げで「完了」と添え、いまの段は aria-current で伝える
    await expect(plan).toHaveTextContent('完了');
    await expect(payment).toHaveAttribute('aria-current', 'step');
    await expect(confirm).not.toHaveAttribute('aria-current');
    // 押して戻れるのは interactive のときだけ
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const Interactive: Story = {
  args: {
    defaultValue: 2,
    interactive: true,
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    // 済んだ段だけがボタンになる。先の段へは飛べない
    await expect(canvas.getAllByRole('button')).toHaveLength(2);

    await userEvent.click(canvas.getByRole('button', { name: /プラン/u }));

    await expect(args.onChange).toHaveBeenCalledWith(0);
    const [plan] = canvas.getAllByRole('listitem');
    await expect(plan).toHaveAttribute('aria-current', 'step');
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const Vertical: Story = {
  args: {
    defaultValue: 1,
    orientation: 'vertical',
  },
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: '申し込みの手順' });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  },
};

export const AllDone: Story = {
  args: {
    defaultValue: 3,
  },
  play: async ({ canvas }) => {
    for (const item of canvas.getAllByRole('listitem')) {
      // eslint-disable-next-line no-await-in-loop -- 3 つの段を順に確かめるだけ
      await expect(item).toHaveTextContent('完了');
    }
  },
};
