import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
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
