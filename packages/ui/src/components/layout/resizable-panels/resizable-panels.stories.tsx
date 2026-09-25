import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, fireEvent, fn, waitFor } from 'storybook/test';

import { ResizablePanels } from '.';

const Workspace = (props: ComponentProps<typeof ResizablePanels.Root>) => (
  <div className="border-border-base overflow-hidden rounded-lg border block-64 inline-full">
    <ResizablePanels.Root {...props}>
      <ResizablePanels.Panel>
        <ul className="flex flex-col gap-2 p-4 text-sm">
          <li>はじめに</li>
          <li>インストール</li>
          <li>使い方</li>
        </ul>
      </ResizablePanels.Panel>
      <ResizablePanels.Handle />
      <ResizablePanels.Panel>
        <p className="p-4 text-sm">
          仕切りをドラッグするか、フォーカスして矢印キーを押すと、2
          枚の大きさが変わります。
        </p>
      </ResizablePanels.Panel>
    </ResizablePanels.Root>
  </div>
);

const meta: Meta<typeof ResizablePanels.Root> = {
  title: 'components/layout/resizable-panels',
  component: ResizablePanels.Root,
  args: { defaultValue: 30 },
  render: (args) => <Workspace {...args} />,
};

export default meta;
type Story = StoryObj<typeof ResizablePanels.Root>;

// 仕切りが aria-controls で指す 1 枚目
const primaryOf = (handle: HTMLElement) => {
  const primary = document.querySelector<HTMLElement>(
    `#${CSS.escape(handle.getAttribute('aria-controls') ?? '')}`,
  );
  if (primary === null) {
    throw new Error('aria-controls does not point at a panel');
  }
  return primary;
};

const primaryWidth = (element: HTMLElement) =>
  element.getBoundingClientRect().width;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const handle = canvas.getByRole('separator', { name: 'パネルの大きさ' });
    const primary = primaryOf(handle);
    await expect(primary).toContainElement(canvas.getByText('はじめに'));
    await expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    await expect(handle).toHaveAttribute('aria-valuenow', '30');
    await expect(handle).toHaveAttribute('aria-valuemin', '10');
    await expect(handle).toHaveAttribute('aria-valuemax', '90');
    await expect(handle.getBoundingClientRect().width).toBe(12);

    const before = primaryWidth(primary);
    await userEvent.tab();
    await expect(handle).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(handle).toHaveAttribute('aria-valuenow', '35');
    await expect(primaryWidth(primary)).toBeGreaterThan(before);

    await userEvent.keyboard('{Home}');
    await expect(handle).toHaveAttribute('aria-valuenow', '10');
    // 下限より先へは動かない
    await userEvent.keyboard('{ArrowLeft}');
    await expect(handle).toHaveAttribute('aria-valuenow', '10');
    await userEvent.keyboard('{End}');
    await expect(handle).toHaveAttribute('aria-valuenow', '90');
  },
};

const dragged = fn();

export const Drag: Story = {
  args: { onChange: dragged },
  play: async ({ canvas }) => {
    const handle = canvas.getByRole('separator');
    const primary = primaryOf(handle);
    const before = primaryWidth(primary);
    const box = handle.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: x, clientY: y });
    fireEvent.pointerMove(handle, {
      pointerId: 1,
      clientX: x + 100,
      clientY: y,
    });
    fireEvent.pointerUp(handle, { pointerId: 1, clientX: x + 100, clientY: y });

    // つかんだ点へ跳ばず、動かした分だけ広がる
    await expect(primaryWidth(primary)).toBeCloseTo(before + 100, 0);
    await expect(dragged).toHaveBeenCalled();

    // 離したあとの動きでは変わらない
    fireEvent.pointerMove(handle, {
      pointerId: 1,
      clientX: x + 200,
      clientY: y,
    });
    await expect(primaryWidth(primary)).toBeCloseTo(before + 100, 0);
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical', defaultValue: 40 },
  play: async ({ canvas, userEvent }) => {
    const handle = canvas.getByRole('separator');
    await expect(handle).toHaveAttribute('aria-orientation', 'horizontal');

    handle.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(handle).toHaveAttribute('aria-valuenow', '45');
    // 上下に並ぶときは左右の矢印では動かない
    await userEvent.keyboard('{ArrowRight}');
    await expect(handle).toHaveAttribute('aria-valuenow', '45');
  },
};

// 右から左の言語では 1 枚目が右に付く。左の矢印は仕切りを左へ動かし、1 枚目を広げる
export const RightToLeft: Story = {
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    const handle = canvas.getByRole('separator');
    handle.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(handle).toHaveAttribute('aria-valuenow', '35');
  },
};

// 縦書きでは行が縦に走るので、`horizontal` の 2 枚は上下に並ぶ
export const VerticalWriting: Story = {
  decorators: [
    (Story) => (
      <div className="writing-v inline-64">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    const handle = canvas.getByRole('separator');
    await waitFor(async () => {
      await expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
    });
    // つかめる厚みは見た目の軸に沿って取る
    await expect(handle.getBoundingClientRect().height).toBe(12);

    handle.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(handle).toHaveAttribute('aria-valuenow', '35');
  },
};

// 1 枚目に見出しがあれば、仕切りの名前はそれを指す
export const LabelledByPrimary: Story = {
  render: () => (
    <div className="border-border-base overflow-hidden rounded-lg border block-64 inline-full">
      <ResizablePanels.Root defaultValue={30}>
        <ResizablePanels.Panel>
          <h2 className="p-4 font-bold" id="files-heading">
            ファイル
          </h2>
        </ResizablePanels.Panel>
        <ResizablePanels.Handle aria-labelledby="files-heading" />
        <ResizablePanels.Panel>
          <p className="p-4 text-sm">プレビュー</p>
        </ResizablePanels.Panel>
      </ResizablePanels.Root>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('separator', { name: 'ファイル' }),
    ).toBeInTheDocument();
  },
};

const ControlledWorkspace = () => {
  const [size, setSize] = useState(25);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">目次の幅: {Math.round(size)}%</p>
      <Workspace onChange={setSize} value={size} />
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledWorkspace />,
  play: async ({ canvas, userEvent }) => {
    canvas.getByRole('separator').focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByText('目次の幅: 30%')).toBeInTheDocument();
  },
};
