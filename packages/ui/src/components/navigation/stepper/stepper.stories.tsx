import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
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

// 押したボタンはいまの段になって消えるので、フォーカスはその段へ移す
export const InteractiveKeepsFocus: Story = {
  args: {
    defaultValue: 2,
    interactive: true,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /プラン/u })).toHaveFocus();

    await userEvent.keyboard('{Enter}');

    const [plan] = canvas.getAllByRole('listitem');
    await expect(plan).toContainElement(document.activeElement as HTMLElement);
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

// 段の間の線と段の印。どちらも読み上げない飾りで、線だけが中身を持たない
const connectorsOf = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLElement>(
    'li span[aria-hidden="true"]:empty',
  ),
];
const markersOf = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLElement>(
    'li span[aria-hidden="true"]:not(:empty)',
  ),
];

// 狭い幅に長い文言を並べても、線は文言に幅を取られず、どの段の間でも同じ長さを保つ
// 押せる段は印と文言の周りに余白を取り、段の間の線は押せる範囲に含めない
export const InteractiveTarget: Story = {
  args: {
    defaultValue: 2,
    interactive: true,
  },
  play: async ({ canvas, canvasElement }) => {
    const button = canvas.getByRole('button', { name: /プラン/u });
    const target = button.getBoundingClientRect();
    const marker = markersOf(canvasElement)[0]?.getBoundingClientRect();

    await expect((marker?.left ?? 0) - target.left).toBeGreaterThanOrEqual(8);
    await expect((marker?.top ?? 0) - target.top).toBeGreaterThanOrEqual(8);
    for (const connector of connectorsOf(canvasElement)) {
      // eslint-disable-next-line no-await-in-loop -- 線を順に確かめるだけ
      await expect(button).not.toContainElement(connector);
    }
  },
};

export const NarrowWithLongLabels: Story = {
  args: {
    defaultValue: 1,
    steps: [
      { label: 'プラン', description: '使い方に合わせて選ぶ' },
      {
        label: '支払いの方法と請求先',
        description: 'カードか請求書。請求書なら宛名と送り先も書く',
      },
      { label: '確認', description: '内容を見直して送る' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  play: async ({ args, canvas, canvasElement }) => {
    const [first, second] = connectorsOf(canvasElement).map(
      (connector) => connector.getBoundingClientRect().width,
    );
    await expect(first).toBeGreaterThanOrEqual(32);
    await expect(second).toBeCloseTo(first ?? 0, 0);

    // 文言は段の印の下に置き、1 行目は印と線だけにする
    const markers = markersOf(canvasElement);
    await expect(markers).toHaveLength(args.steps.length);
    for (const [index, step] of args.steps.entries()) {
      const { top } = canvas.getByText(step.label).getBoundingClientRect();
      const { bottom } = markers[index]?.getBoundingClientRect() ?? {};
      // eslint-disable-next-line no-await-in-loop -- 3 つの段を順に確かめるだけ
      await expect(top).toBeGreaterThanOrEqual(bottom ?? Infinity);
    }
  },
};

// flex の行の中に置かれても、横並びは置かれた先の幅いっぱいに広がる
export const InFlexRow: Story = {
  args: {
    defaultValue: 1,
    steps: [
      { label: 'Plan', description: 'Pick what fits' },
      { label: 'Payment', description: 'Card or invoice' },
      { label: 'Review', description: 'Check and send' },
    ],
  },
  decorators: [
    (Story) => (
      <div
        className="flex w-160 flex-wrap items-center gap-4"
        data-testid="row"
      >
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const row = canvas.getByTestId('row').getBoundingClientRect();
    const list = canvas.getByRole('list').getBoundingClientRect();
    await expect(list.width).toBeCloseTo(row.width, 0);
  },
};

// 横書きの例（max-w-2xl）と同じだけの長さを、縦書きの行の向きに取る
const writingVertical: Decorator = (Story) => (
  <div className="writing-v h-168">
    <Story />
  </div>
);

// 縦書きの中では段が上から下へ並ぶので、段の間の線は縦に引く
export const VerticalWritingMode: Story = {
  args: {
    defaultValue: 1,
  },
  decorators: [writingVertical],
  play: async ({ canvasElement }) => {
    const connectors = connectorsOf(canvasElement);
    await expect(connectors).toHaveLength(2);
    for (const connector of connectors) {
      const { width, height } = connector.getBoundingClientRect();
      // eslint-disable-next-line no-await-in-loop -- 2 本の線を順に確かめるだけ
      await expect(width).toBeGreaterThanOrEqual(1);
      // eslint-disable-next-line no-await-in-loop -- 同上
      await expect(height).toBeGreaterThan(width);
    }
  },
};

// 縦書きで段を縦（ブロック方向）に積むと、段は右から左へ並ぶので、線は横に引く
export const VerticalOrientationInVerticalWritingMode: Story = {
  args: {
    defaultValue: 1,
    orientation: 'vertical',
  },
  decorators: [writingVertical],
  play: async ({ canvasElement }) => {
    const connectors = connectorsOf(canvasElement);
    await expect(connectors).toHaveLength(2);
    for (const connector of connectors) {
      const { width, height } = connector.getBoundingClientRect();
      // eslint-disable-next-line no-await-in-loop -- 2 本の線を順に確かめるだけ
      await expect(height).toBeGreaterThanOrEqual(1);
      // eslint-disable-next-line no-await-in-loop -- 同上
      await expect(width).toBeGreaterThan(height);
    }
  },
};
