import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';

import { Tree } from '.';
import type { TreeItem } from '.';

const meta: Meta<typeof Tree> = {
  title: 'components/data-display/tree',
  component: Tree,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

const FILES: TreeItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'button.tsx' },
          { id: 'card', label: 'card.tsx' },
        ],
      },
      { id: 'index', label: 'index.ts' },
    ],
  },
  { id: 'package', label: 'package.json' },
  { id: 'readme', label: 'README.md' },
];

const item =
  (canvas: { getByRole: (...args: never[]) => HTMLElement }) =>
  (name: string) =>
    (canvas.getByRole as (role: string, options: object) => HTMLElement)(
      'treeitem',
      { name },
    );

export const Keyboard: Story = {
  args: {
    items: FILES,
    label: 'ファイル',
  },
  play: async ({ canvas, userEvent }) => {
    const byName = item(canvas);
    await expect(
      canvas.getByRole('tree', { name: 'ファイル' }),
    ).toBeInTheDocument();

    // Tab で最初の項目に入る（roving tabindex）
    await userEvent.tab();
    await expect(byName('src')).toHaveFocus();
    await expect(byName('src')).toHaveAttribute('aria-expanded', 'false');

    // 右: 閉じた枝を開く → もう一度で最初の子へ
    await userEvent.keyboard('{ArrowRight}');
    await expect(byName('src')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowRight}');
    await expect(byName('components')).toHaveFocus();

    // 下: 見えている次の項目へ（閉じた枝の中は飛ばす）
    await userEvent.keyboard('{ArrowDown}');
    await expect(byName('index.ts')).toHaveFocus();

    // 左: 子から親へ → 開いた親を閉じる
    await userEvent.keyboard('{ArrowLeft}');
    await expect(byName('src')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(byName('src')).toHaveAttribute('aria-expanded', 'false');

    // End と Home
    await userEvent.keyboard('{End}');
    await expect(byName('README.md')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(byName('src')).toHaveFocus();

    // 先頭の文字で、次にその文字で始まる項目へ
    await userEvent.keyboard('p');
    await expect(byName('package.json')).toHaveFocus();

    // Enter で選ぶ
    await userEvent.keyboard('{Enter}');
    await expect(byName('package.json')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(byName('src')).toHaveAttribute('aria-selected', 'false');
  },
};

const change = fn();

export const ClickToSelectAndToggle: Story = {
  args: {
    items: FILES,
    label: 'ファイル',
    onChange: change,
  },
  play: async ({ canvas, userEvent }) => {
    const byName = item(canvas);

    await userEvent.click(canvas.getByText('src'));
    await expect(byName('src')).toHaveAttribute('aria-expanded', 'true');
    await expect(change).toHaveBeenLastCalledWith('src');

    await userEvent.click(canvas.getByText('index.ts'));
    await expect(change).toHaveBeenLastCalledWith('index');
    // 子のクリックは親まで泡立たないので、親は閉じない
    await expect(byName('src')).toHaveAttribute('aria-expanded', 'true');
    await expect(byName('index.ts')).toHaveFocus();
  },
};

const ControlledTree = () => {
  const [expandedIds, setExpandedIds] = useState<readonly string[]>([
    'src',
    'components',
  ]);
  const [selectedId, setSelectedId] = useState<string | null>('card');
  return (
    <div className="flex flex-col gap-4">
      <Tree
        expandedIds={expandedIds}
        items={FILES}
        label="ファイル"
        onChange={setSelectedId}
        onExpandedChange={setExpandedIds}
        selectedId={selectedId}
      />
      <p>選択中: {selectedId}</p>
    </div>
  );
};

// 開いている枝と選択は外から渡せる。Tab で入るのは選ばれている項目
export const Controlled: Story = {
  render: () => <ControlledTree />,
  play: async ({ canvas, userEvent }) => {
    const byName = item(canvas);

    await expect(byName('card.tsx')).toHaveAttribute('aria-selected', 'true');
    await userEvent.tab();
    await expect(byName('card.tsx')).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}{Enter}');
    await expect(canvas.getByText('選択中: button')).toBeInTheDocument();
  },
};

// 縦書きでは項目が右から左へ並ぶので、左が次、下が開く
export const Vertical: Story = {
  parameters: {
    writingMode: 'vertical',
  },
  args: {
    items: FILES,
    label: 'ファイル',
  },
  play: async ({ canvas, userEvent }) => {
    const byName = item(canvas);

    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    await expect(byName('src')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowLeft}');
    await expect(byName('components')).toHaveFocus();
  },
};
