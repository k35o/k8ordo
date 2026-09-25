import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, fn } from 'storybook/test';

import { Toolbar } from '.';
import { CopyIcon, LinkIcon, ListIcon, TableIcon } from '../../icons';
import { Button } from '../button';
import { IconButton } from '../icon-button';

const EditorToolbar = ({
  orientation,
  onSave,
}: Pick<ComponentProps<typeof Toolbar.Root>, 'orientation'> & {
  onSave?: () => void;
}) => {
  const [isList, setIsList] = useState(false);
  return (
    <Toolbar.Root aria-label="書式" orientation={orientation}>
      <Toolbar.Item
        renderItem={(props) => (
          <IconButton {...props} label="コピー" tooltipDisabled>
            <CopyIcon size="sm" />
          </IconButton>
        )}
      />
      <Toolbar.Item
        renderItem={(props) => (
          <IconButton {...props} label="リンク" tooltipDisabled>
            <LinkIcon size="sm" />
          </IconButton>
        )}
      />
      <Toolbar.Item
        renderItem={(props) => (
          <IconButton
            {...props}
            aria-pressed={isList}
            label="箇条書き"
            onClick={() => {
              setIsList((current) => !current);
            }}
            tooltipDisabled
          >
            <ListIcon size="sm" />
          </IconButton>
        )}
      />
      <Toolbar.Item
        renderItem={(props) => (
          <IconButton {...props} disabled label="表" tooltipDisabled>
            <TableIcon size="sm" />
          </IconButton>
        )}
      />
      <Toolbar.Separator />
      <Toolbar.Item
        renderItem={(props) => (
          <Button {...props} onClick={onSave} size="sm">
            保存
          </Button>
        )}
      />
    </Toolbar.Root>
  );
};

const meta: Meta<typeof Toolbar.Root> = {
  title: 'components/buttons/toolbar',
  component: Toolbar.Root,
  decorators: [
    (Story) => (
      <div className="flex flex-col items-start gap-4 p-6">
        <button type="button">前のボタン</button>
        <Story />
        <button type="button">次のボタン</button>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toolbar.Root>;

export const Default: Story = {
  render: () => <EditorToolbar />,
  play: async ({ canvas, userEvent }) => {
    const toolbar = canvas.getByRole('toolbar', { name: '書式' });
    await expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');

    // Tab で入れるのは 1 つだけ
    canvas.getByRole('button', { name: '前のボタン' }).focus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'コピー' })).toHaveFocus();
    await userEvent.tab();
    await expect(
      canvas.getByRole('button', { name: '次のボタン' }),
    ).toHaveFocus();

    // 中は矢印キーで移る。無効な項目は飛ばし、端では反対の端へ回る
    await userEvent.tab({ shift: true });
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect(
      canvas.getByRole('button', { name: '箇条書き' }),
    ).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: '保存' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'コピー' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('button', { name: '保存' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('button', { name: 'コピー' })).toHaveFocus();

    // 出て戻ると、最後にいた項目へ戻る
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    await expect(canvas.getByRole('button', { name: '保存' })).toHaveFocus();
  },
};

export const ToggleButton: Story = {
  render: () => <EditorToolbar />,
  play: async ({ canvas, userEvent }) => {
    const list = canvas.getByRole('button', { name: '箇条書き' });
    await expect(list).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(list);

    await expect(list).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Vertical: Story = {
  render: () => <EditorToolbar orientation="vertical" />,
  play: async ({ canvas, userEvent }) => {
    const toolbar = canvas.getByRole('toolbar', { name: '書式' });
    await expect(toolbar).toHaveAttribute('aria-orientation', 'vertical');
    await expect(canvas.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    );

    canvas.getByRole('button', { name: 'コピー' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('button', { name: 'リンク' })).toHaveFocus();
    // 縦に並ぶときは左右の矢印では動かない
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'リンク' })).toHaveFocus();
  },
};

const save = fn();

// 項目はそれぞれ普通のボタンなので、Enter でそのまま押せる
export const ActivatesItems: Story = {
  render: () => <EditorToolbar onSave={save} />,
  play: async ({ canvas, userEvent }) => {
    canvas.getByRole('button', { name: 'コピー' }).focus();
    await userEvent.keyboard('{End}{Enter}');

    await expect(save).toHaveBeenCalledOnce();
  },
};
