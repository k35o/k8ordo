import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Anchor } from '../../navigation/anchor';
import { Alert } from './alert';

import styles from './alert.stories.module.css';

const meta: Meta<typeof Alert> = {
  title: 'components/feedback/alert',
  component: Alert,
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Success: Story = {
  args: {
    tone: 'success',
    message: 'Success',
  },
};

export const Info: Story = {
  args: {
    tone: 'info',
    message: 'Info',
  },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    message: 'Warning',
  },
};

export const Error: Story = {
  args: {
    tone: 'error',
    message: 'Error',
  },
};

export const ArrayMessage: Story = {
  args: {
    tone: 'error',
    message: [
      'メールアドレスの形式が正しくありません',
      'パスワードは8文字以上で入力してください',
      '利用規約に同意してください',
    ],
  },
};

export const DuplicateArrayMessage: Story = {
  args: {
    tone: 'error',
    message: [
      'メールアドレスの形式が正しくありません',
      'メールアドレスの形式が正しくありません',
    ],
  },
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole('listitem');
    await expect(items).toHaveLength(2);
    for (const item of items) {
      await expect(item).toHaveTextContent(
        'メールアドレスの形式が正しくありません',
      );
    }
  },
};

export const SingleArrayMessage: Story = {
  args: {
    tone: 'success',
    message: ['Success'],
  },
};

export const ActionLink: Story = {
  args: {
    tone: 'warning',
    message:
      'お使いのブラウザでは一部の機能が正しく動作しない可能性があります。最新版への更新をおすすめします。',
    action: (
      <a className={styles.action} href="https://example.com">
        ブラウザの更新方法を見る
      </a>
    ),
  },
};

export const ActionAnchor: Story = {
  args: {
    tone: 'info',
    message: '新しいバージョンが利用可能です。',
    action: (
      <Anchor href="https://example.com" openInNewTab>
        詳しくはこちら
      </Anchor>
    ),
  },
};

export const ActionButton: Story = {
  args: {
    tone: 'info',
    message: 'プロフィールの設定が完了していません。',
    action: (
      <button className={styles.action} onClick={() => {}} type="button">
        詳しく
      </button>
    ),
  },
};

export const ArrayMessageWithAction: Story = {
  args: {
    tone: 'warning',
    message: [
      'パスワードは8文字以上で入力してください',
      '記号を1文字以上含めてください',
    ],
    action: (
      <Anchor href="https://example.com" openInNewTab>
        パスワードのルールを見る
      </Anchor>
    ),
  },
};

export const Closable: Story = {
  args: {
    tone: 'warning',
    message:
      'お使いのブラウザでは一部の機能が正しく動作しない可能性があります。最新版への更新をおすすめします。',
    onClose: () => {},
  },
};

export const WithActionAndClose: Story = {
  args: {
    tone: 'warning',
    message:
      'お使いのブラウザでは一部の機能が正しく動作しない可能性があります。最新版への更新をおすすめします。',
    action: (
      <button className={styles.primaryAction} onClick={() => {}} type="button">
        詳しくはこちら
      </button>
    ),
    onClose: () => {},
  },
};

export const ArrayMessageWithClose: Story = {
  args: {
    tone: 'error',
    message: [
      'メールアドレスの形式が正しくありません',
      'パスワードは8文字以上で入力してください',
      '利用規約に同意してください',
    ],
    onClose: () => {},
  },
};
