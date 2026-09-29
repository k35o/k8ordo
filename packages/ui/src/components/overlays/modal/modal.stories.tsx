import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { Button } from '../../buttons/button';
import { Dialog } from '../dialog';
import { Modal } from './modal';

const meta: Meta<typeof Modal> = {
  title: 'components/overlays/modal',
  component: Modal,
  parameters: {
    a11y: {
      options: {
        rules: {
          'color-contrast': { enabled: false },
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Dialog.Header の見出しが <dialog> のアクセシブル名になり、
// role="dialog" は外側の <dialog> ひとつだけになる。
export const Default: Story = {
  args: {
    defaultOpen: true,
    children: (
      <Dialog.Root>
        <Dialog.Header onClose={fn()} title="確認" />
        <Dialog.Content>
          <p>この操作を実行してもよろしいですか？</p>
        </Dialog.Content>
      </Dialog.Root>
    ),
  },
  play: async ({ canvas }) => {
    const dialog = await waitFor(() =>
      canvas.getByRole('dialog', { name: '確認' }),
    );
    await expect(dialog).toBeInstanceOf(HTMLDialogElement);
    await expect(canvas.getAllByRole('dialog')).toHaveLength(1);
  },
};

// 中身が Dialog でない場合は aria-label で名前を付けられる。
export const Labelled: Story = {
  args: {
    defaultOpen: true,
    'aria-label': 'お知らせ',
    children: <p className="p-4">Modal 自身に付けた名前が使われます</p>,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('dialog', { name: 'お知らせ' }),
    ).toBeInTheDocument();
  },
};

// 中にフォーカスできるものが無いと、<dialog> 自身がフォーカスを受ける。
// そのリングは UA のままで、高コントラスト用の縁取りの色や位置が混ざらない
export const FocusRingOnDialog: Story = {
  args: {
    defaultOpen: true,
    'aria-label': 'お知らせ',
    children: <p className="p-4">フォーカスできるものが無いモーダル</p>,
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
    'aria-label': 'ボトムシート',
    children: <p className="p-4">下から出るモーダル</p>,
  },
  play: async ({ canvas }) => {
    const dialog = canvas.getByRole('dialog', { name: 'ボトムシート' });
    await expect(dialog).toHaveClass('ao-modal-bottom');
  },
};

export const LeftSide: Story = {
  args: {
    defaultOpen: true,
    side: 'left',
    'aria-label': '左サイドシート',
    children: <p className="p-4">左から出るモーダル</p>,
  },
  play: async ({ canvas }) => {
    const dialog = canvas.getByRole('dialog', { name: '左サイドシート' });
    await expect(dialog).toHaveClass('ao-modal-left');
  },
};

const ExternalRefControlRender = () => {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Button
        onClick={() => {
          ref.current?.showModal();
        }}
        size="md"
        type="button"
      >
        開く
      </Button>
      <Modal ref={ref} side="center">
        <Dialog.Root>
          <Dialog.Header
            onClose={() => {
              ref.current?.close();
            }}
            title="外部ref制御"
          />
          <Dialog.Content>
            <p>ref.current.showModal() から開かれました</p>
          </Dialog.Content>
        </Dialog.Root>
      </Modal>
    </>
  );
};

export const ExternalRefControl: Story = {
  render: () => <ExternalRefControlRender />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: '開く' });
    await userEvent.click(trigger);
    await waitFor(() => {
      const dialog = canvas.getByRole('dialog', { name: '外部ref制御' });
      expect(dialog).toBeInstanceOf(HTMLDialogElement);
      expect(dialog.hasAttribute('open')).toBe(true);
      if (getComputedStyle(dialog).opacity !== '1') {
        throw new Error('waiting for animation');
      }
    });
  },
};

// 閉じるのは <dialog> 自身で、Modal はその close を onClose で知らせる。
// Storybook の userEvent のキーは合成で Escape の既定の動作が起きないので、
// 枠外（<dialog> 自身）を押して閉じる
export const UncontrolledCloses: Story = {
  args: {
    defaultOpen: true,
    'aria-label': 'お知らせ',
    children: <p className="p-4">枠外を押すと閉じるモーダル</p>,
    onClose: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const dialog = canvas.getByRole('dialog', { name: 'お知らせ' });

    await userEvent.click(dialog);

    await expect(dialog).not.toHaveAttribute('open');
    // close イベントは閉じたあとのタスクで届く
    await waitFor(() => {
      expect(args.onClose).toHaveBeenCalledOnce();
    });
  },
};

const ControlledRender = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        size="md"
        type="button"
      >
        開く
      </Button>
      <p>{isOpen ? '開いています' : '閉じています'}</p>
      <Modal
        aria-label="制御されたモーダル"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <p className="p-4">isOpen で開け閉めするモーダル</p>
      </Modal>
    </>
  );
};

// isOpen を渡すと、開け閉めは呼び出し側の state に従う。閉じる操作は onClose で
// 知らせ、呼び出し側が isOpen を戻すと開き直す
export const Controlled: Story = {
  render: () => <ControlledRender />,
  play: async ({ canvas, userEvent }) => {
    const dialog = canvas.getByRole('dialog', { name: '制御されたモーダル' });

    await userEvent.click(dialog);

    await canvas.findByText('閉じています');
    await expect(dialog).not.toHaveAttribute('open');

    await userEvent.click(canvas.getByRole('button', { name: '開く' }));

    await canvas.findByText('開いています');
    await waitFor(() => {
      expect(dialog).toHaveAttribute('open');
    });
  },
};
