import type { Meta, StoryObj } from '@storybook/react-vite';
import { Activity, useRef, useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { Button } from '../../buttons/button';
import { Dialog } from './dialog';

const meta: Meta<typeof Dialog> = {
  title: 'components/overlays/dialog',
  component: Dialog,
  parameters: {
    a11y: {
      options: {
        rules: {
          // モーダルのフェードイン中は axe が低コントラストとして検出するため無効化
          'color-contrast': { enabled: false },
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

const waitForOpened = async (dialog: HTMLElement) => {
  await waitFor(() => {
    expect(dialog).toHaveAttribute('open');
    if (getComputedStyle(dialog).opacity !== '1') {
      throw new Error('waiting for animation');
    }
  });
};

export const Default: Story = {
  args: {
    defaultOpen: true,
    title: '確認',
    children: <p>この操作を実行してもよろしいですか？</p>,
  },
  play: async ({ canvas }) => {
    const dialog = await waitFor(() =>
      canvas.getByRole('dialog', { name: '確認' }),
    );
    await expect(dialog).toBeInstanceOf(HTMLDialogElement);
    await expect(canvas.getAllByRole('dialog')).toHaveLength(1);
    await expect(
      canvas.getByRole('heading', { level: 2, name: '確認' }),
    ).toBeInTheDocument();
    await expect(dialog).toHaveAccessibleDescription('');
  },
};

export const Description: Story = {
  args: {
    defaultOpen: true,
    title: 'ファイルを削除',
    description: '削除したファイルは元に戻せません。',
    children: <Button>削除する</Button>,
  },
  play: async ({ canvas }) => {
    const dialog = canvas.getByRole('dialog', { name: 'ファイルを削除' });
    await expect(dialog).toHaveAccessibleDescription(
      '削除したファイルは元に戻せません。',
    );
  },
};

export const Labelled: Story = {
  args: {
    defaultOpen: true,
    label: 'お知らせ',
    children: <p>Dialog 自身に付けた名前が使われます</p>,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('dialog', { name: 'お知らせ' }),
    ).toBeInTheDocument();
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
  },
};

export const AlertDialog: Story = {
  args: {
    defaultOpen: true,
    role: 'alertdialog',
    title: '削除の確認',
    description: 'この項目を削除します。元に戻せません。',
    children: <Button>削除する</Button>,
  },
  play: async ({ canvas }) => {
    const dialog = canvas.getByRole('alertdialog', { name: '削除の確認' });
    await expect(dialog).toBeInstanceOf(HTMLDialogElement);
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const FocusRingOnDialog: Story = {
  args: {
    defaultOpen: true,
    label: 'お知らせ',
    children: <p>フォーカスできるものが無いダイアログ</p>,
  },
  play: async ({ canvas }) => {
    const dialog = canvas.getByRole('dialog', { name: 'お知らせ' });
    await waitFor(() => {
      expect(dialog).toHaveFocus();
    });

    const style = getComputedStyle(dialog);
    await expect(style.outlineStyle).toBe('auto');
    await expect(style.outlineOffset).toBe('0px');
  },
};

export const BottomSide: Story = {
  args: {
    defaultOpen: true,
    side: 'bottom',
    title: 'ボトムシート',
    children: <p>下から出るダイアログ</p>,
  },
  play: async ({ canvas }) => {
    const dialog = canvas.getByRole('dialog', { name: 'ボトムシート' });
    await waitFor(() => {
      const rect = dialog.getBoundingClientRect();
      expect(rect.bottom).toBe(document.documentElement.clientHeight);
      expect(rect.top).toBeGreaterThan(0);
    });
  },
};

export const CloseButton: Story = {
  args: {
    defaultOpen: true,
    title: '確認',
    onClose: fn(),
    children: <p>閉じるボタンで閉じるダイアログ</p>,
  },
  play: async ({ args, canvas, userEvent }) => {
    const dialog = canvas.getByRole('dialog', { name: '確認' });
    await waitForOpened(dialog);

    await userEvent.click(canvas.getByRole('button', { name: '閉じる' }));

    await expect(dialog).not.toHaveAttribute('open');
    // close イベントは閉じたあとのタスクで届く
    await waitFor(() => {
      expect(args.onClose).toHaveBeenCalledOnce();
    });
  },
};

// Storybook の userEvent のキーは合成で Escape の既定の動作が起きないので、
// 枠外（<dialog> 自身）を押して閉じる
export const UncontrolledCloses: Story = {
  args: {
    defaultOpen: true,
    label: 'お知らせ',
    children: <p>枠外を押すと閉じるダイアログ</p>,
    onClose: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const dialog = canvas.getByRole('dialog', { name: 'お知らせ' });

    await userEvent.click(dialog);

    await expect(dialog).not.toHaveAttribute('open');
    await waitFor(() => {
      expect(args.onClose).toHaveBeenCalledOnce();
    });
  },
};

const ExternalRefControlRender = ({ onClose }: { onClose: () => void }) => {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Button
        onClick={() => {
          ref.current?.showModal();
        }}
      >
        開く
      </Button>
      <Dialog onClose={onClose} ref={ref} title="外部ref制御">
        <p>ref.current.showModal() から開かれました</p>
      </Dialog>
    </>
  );
};

export const ExternalRefControl: Story = {
  args: { onClose: fn() },
  render: ({ onClose }) => (
    <ExternalRefControlRender onClose={onClose ?? (() => undefined)} />
  ),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '開く' }));
    const dialog = await canvas.findByRole('dialog', { name: '外部ref制御' });
    await waitForOpened(dialog);

    await userEvent.click(canvas.getByRole('button', { name: '閉じる' }));

    await expect(dialog).not.toHaveAttribute('open');
    await waitFor(() => {
      expect(args.onClose).toHaveBeenCalledOnce();
    });
  },
};

const ControlledRender = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [closeCount, setCloseCount] = useState(0);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        開く
      </Button>
      <p>{isOpen ? '開いています' : '閉じています'}</p>
      <p>{`onClose: ${String(closeCount)}回`}</p>
      <Dialog
        isOpen={isOpen}
        label="制御されたダイアログ"
        onClose={() => {
          setCloseCount((count) => count + 1);
          setIsOpen(false);
        }}
      >
        <Button
          onClick={() => {
            setIsOpen(false);
          }}
        >
          state で閉じる
        </Button>
      </Dialog>
    </>
  );
};

export const Controlled: Story = {
  render: () => <ControlledRender />,
  play: async ({ canvas, userEvent }) => {
    const dialog = canvas.getByRole('dialog', { name: '制御されたダイアログ' });
    await waitForOpened(dialog);

    await userEvent.click(
      canvas.getByRole('button', { name: 'state で閉じる' }),
    );

    await canvas.findByText('閉じています');
    await expect(dialog).not.toHaveAttribute('open');

    await userEvent.click(canvas.getByRole('button', { name: '開く' }));
    await canvas.findByText('開いています');
    await waitForOpened(dialog);

    await userEvent.click(dialog);

    await canvas.findByText('閉じています');
    await expect(dialog).not.toHaveAttribute('open');
    await expect(canvas.getByText('onClose: 1回')).toBeInTheDocument();
  },
};

export const KeepsChildrenWhileClosed: Story = {
  args: {
    defaultOpen: false,
    title: '閉じたダイアログ',
    children: <p>閉じている間も残る本文</p>,
  },
  play: async ({ canvasElement }) => {
    const dialog = canvasElement.querySelector('dialog');
    await expect(dialog).not.toHaveAttribute('open');
    await expect(dialog).toHaveTextContent('閉じている間も残る本文');
  },
};

// StrictMode が effect を付け直したときの並び。後始末の close のイベントは、
// 開き直した後に届く
export const ReopenedBeforeCloseEvent: Story = {
  args: {
    defaultOpen: true,
    title: '開き直したダイアログ',
    onClose: fn(),
    children: <p>本文</p>,
  },
  play: async ({ args, canvas }) => {
    const dialog = canvas.getByRole<HTMLDialogElement>('dialog', {
      name: '開き直したダイアログ',
    });
    await waitForOpened(dialog);

    const closed = new Promise((resolve) => {
      dialog.addEventListener('close', resolve, { once: true });
    });
    dialog.close();
    dialog.showModal();
    await closed;

    await expect(args.onClose).not.toHaveBeenCalled();
    await expect(dialog).toHaveAttribute('open');
  },
};

const HiddenByActivityRender = ({ onClose }: { onClose: () => void }) => {
  const [hidden, setHidden] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setHidden(false);
        }}
      >
        表示する
      </Button>
      <Activity mode={hidden ? 'hidden' : 'visible'}>
        <Dialog defaultOpen onClose={onClose} title="隠れるダイアログ">
          <Button
            onClick={() => {
              setHidden(true);
            }}
          >
            隠す
          </Button>
        </Dialog>
      </Activity>
    </>
  );
};

export const HiddenByActivity: Story = {
  args: { onClose: fn() },
  render: ({ onClose }) => (
    <HiddenByActivityRender onClose={onClose ?? (() => undefined)} />
  ),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const dialog = canvas.getByRole('dialog', { name: '隠れるダイアログ' });
    await waitForOpened(dialog);

    await userEvent.click(canvas.getByRole('button', { name: '隠す' }));

    await waitFor(() => {
      expect(args.onClose).toHaveBeenCalledOnce();
    });
    await expect(dialog).not.toHaveAttribute('open');

    await userEvent.click(canvas.getByRole('button', { name: '表示する' }));

    await expect(canvasElement.querySelector('dialog')).not.toHaveAttribute(
      'open',
    );
  },
};
