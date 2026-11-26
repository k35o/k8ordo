import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { Dialog } from '.';
import { Button } from '../../buttons/button';
import { Modal } from '../modal';

const meta: Meta<typeof Dialog.Root> = {
  title: 'components/overlays/dialog',
  component: Dialog.Root,
};

export default meta;
type Story = StoryObj<typeof Dialog.Root>;

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Header onClose={fn} title="ダイアログ" />
      <Dialog.Content>こんにちは</Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('dialog', { name: 'ダイアログ' }),
    ).toBeInTheDocument();
  },
};

const ModalDialogRender = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        size="md"
        type="button"
      >
        モーダル
      </Button>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        side="center"
      >
        <Dialog.Root>
          <Dialog.Header onClose={fn} title="モーダル" />
          <Dialog.Content>こんにちは</Dialog.Content>
        </Dialog.Root>
      </Modal>
    </>
  );
};

// Modal 配下では内側の Dialog.Root は role を出さず、名前だけを外側の
// <dialog> へ渡す（dialog ロールが二重にならない）。
export const ModalDialog: Story = {
  render: () => <ModalDialogRender />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'モーダル',
    });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const dialog = await waitFor(() =>
      canvas.getByRole('dialog', { name: 'モーダル' }),
    );
    await expect(dialog).toBeInstanceOf(HTMLDialogElement);
    await expect(canvas.getAllByRole('dialog')).toHaveLength(1);
  },
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
