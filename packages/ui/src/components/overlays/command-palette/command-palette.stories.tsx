import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { Button } from '../../buttons/button';
import { CommandPalette } from './command-palette';
import type { CommandPaletteItem } from './command-palette';

const openFile = fn();
const newFile = fn();
const toggleTheme = fn();

const ITEMS: readonly CommandPaletteItem[] = [
  {
    id: 'new-file',
    label: '新しいファイル',
    group: 'ファイル',
    keywords: ['create'],
    shortcut: ['⌘', 'N'],
    onSelect: newFile,
  },
  {
    id: 'open-file',
    label: 'ファイルを開く',
    group: 'ファイル',
    shortcut: ['⌘', 'O'],
    onSelect: openFile,
  },
  {
    id: 'toggle-theme',
    label: 'テーマを切り替える',
    group: '表示',
    keywords: ['dark', 'light'],
    onSelect: toggleTheme,
  },
  {
    id: 'zoom-in',
    label: '拡大する',
    group: '表示',
    shortcut: ['⌘', '+'],
    onSelect: fn(),
  },
];

const meta: Meta<typeof CommandPalette> = {
  title: 'components/overlays/command-palette',
  component: CommandPalette,
  parameters: {
    // Modal と同じく、開くときの透明度の変化を axe がコントラスト不足と読み違える
    a11y: {
      options: {
        rules: {
          'color-contrast': { enabled: false },
        },
      },
    },
  },
  args: { defaultOpen: true, items: ITEMS },
  beforeEach: () => {
    openFile.mockClear();
    newFile.mockClear();
    toggleTheme.mockClear();
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const dialog = await waitFor(() =>
      canvas.getByRole('dialog', { name: 'コマンド' }),
    );
    const input = canvas.getByRole('combobox', { name: 'コマンドを検索' });
    await waitFor(async () => {
      await expect(input).toHaveFocus();
    });
    // まとまりは見出しの名前を持つ group になる
    await expect(
      canvas.getByRole('group', { name: 'ファイル' }),
    ).toBeInTheDocument();
    await expect(canvas.getAllByRole('option')[0]).toHaveAttribute(
      'aria-selected',
      'true',
    );

    // ↑ は先頭から末尾へ回り、↓ で先頭へ戻る
    await userEvent.keyboard('{ArrowUp}');
    await expect(
      canvas.getByRole('option', { name: /拡大する/u }),
    ).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    const open = canvas.getByRole('option', { name: /ファイルを開く/u });
    await expect(input).toHaveAttribute('aria-activedescendant', open.id);

    await userEvent.keyboard('{Enter}');

    await expect(openFile).toHaveBeenCalledOnce();
    await waitFor(async () => {
      await expect(dialog).not.toHaveAttribute('open');
    });
  },
};

export const Filter: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = await waitFor(() =>
      canvas.getByRole('combobox', { name: 'コマンドを検索' }),
    );

    // 表示名のほか、keywords でも当てる
    await userEvent.type(input, 'dark');
    await expect(
      canvas.getAllByRole('option').map((option) => option.textContent),
    ).toStrictEqual(['テーマを切り替える']);
    await expect(canvas.queryByRole('group', { name: 'ファイル' })).toBeNull();

    await userEvent.clear(input);
    await userEvent.type(input, 'xyz');
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '一致するコマンドはありません',
    );
    await expect(canvas.queryAllByRole('option')).toHaveLength(0);
    await expect(input).not.toHaveAttribute('aria-activedescendant');

    await userEvent.keyboard('{Enter}');
    await expect(newFile).not.toHaveBeenCalled();
  },
};

export const Mouse: Story = {
  play: async ({ canvas, userEvent }) => {
    const option = await waitFor(() =>
      canvas.getByRole('option', { name: /テーマを切り替える/u }),
    );
    await userEvent.hover(option);
    await expect(option).toHaveAttribute('aria-selected', 'true');

    await userEvent.click(option);

    await expect(toggleTheme).toHaveBeenCalledOnce();
  },
};

const closed = fn();

// ⌘K / Ctrl+K で開く配線はアプリが持つ。閉じるとフォーカスは開く前の場所へ戻る
const WithShortcut = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        コマンドを開く
      </Button>
      <CommandPalette
        isOpen={isOpen}
        items={ITEMS}
        onClose={() => {
          closed();
          setIsOpen(false);
        }}
      />
    </>
  );
};

export const Shortcut: Story = {
  render: () => <WithShortcut />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'コマンドを開く' });
    trigger.focus();
    await userEvent.keyboard('{Control>}k{/Control}');

    const input = await waitFor(() =>
      canvas.getByRole('combobox', { name: 'コマンドを検索' }),
    );
    await waitFor(async () => {
      await expect(input).toHaveFocus();
    });
    await userEvent.type(input, 'テーマ');
    await userEvent.keyboard('{Enter}');

    await expect(toggleTheme).toHaveBeenCalledOnce();
    await waitFor(async () => {
      await expect(closed).toHaveBeenCalled();
    });
    await waitFor(async () => {
      await expect(trigger).toHaveFocus();
    });

    // 開き直すと、空の検索から始まる
    await userEvent.keyboard('{Control>}k{/Control}');
    await waitFor(async () => {
      await expect(
        canvas.getByRole('combobox', { name: 'コマンドを検索' }),
      ).toHaveValue('');
    });
  },
};
