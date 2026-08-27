import type { Meta, StoryObj } from '@storybook/react-vite';

import { Anchor } from '../../navigation/anchor';
import { Alert } from './alert';

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
    action: {
      label: '詳しくはこちら',
      renderItem: ({ children }) => (
        <a className="text-fg-info underline" href="https://example.com">
          {children}
        </a>
      ),
    },
  },
};

export const ActionAnchor: Story = {
  args: {
    tone: 'info',
    message: '新しいバージョンが利用可能です。',
    action: {
      label: '詳しくはこちら',
      renderItem: ({ children }) => (
        <Anchor href="https://example.com" openInNewTab>
          {children}
        </Anchor>
      ),
    },
  },
};

export const ActionButton: Story = {
  args: {
    tone: 'info',
    message: 'プロフィールの設定が完了していません。',
    action: {
      label: '詳しく',
      renderItem: ({ children }) => (
        <button
          className="text-fg-info underline"
          onClick={() => {}}
          type="button"
        >
          {children}
        </button>
      ),
    },
  },
};

export const ArrayMessageWithAction: Story = {
  args: {
    tone: 'warning',
    message: [
      'パスワードは8文字以上で入力してください',
      '記号を1文字以上含めてください',
    ],
    action: {
      label: 'パスワードのルールを見る',
      renderItem: ({ children }) => (
        <Anchor href="https://example.com" openInNewTab>
          {children}
        </Anchor>
      ),
    },
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
    action: {
      label: '詳しくはこちら',
      renderItem: ({ children }) => (
        <button
          className="text-primary-fg cursor-pointer underline underline-offset-2"
          onClick={() => {}}
          type="button"
        >
          {children}
        </button>
      ),
    },
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
