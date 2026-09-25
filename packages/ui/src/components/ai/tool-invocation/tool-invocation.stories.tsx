import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { ToolInvocation } from './tool-invocation';

const meta: Meta<typeof ToolInvocation> = {
  title: 'components/ai/tool-invocation',
  component: ToolInvocation,
  args: {
    name: 'search_web',
  },
};

export default meta;
type Story = StoryObj<typeof ToolInvocation>;

export const Running: Story = {
  args: {
    state: 'input-available',
    input: { query: 'k8ordo UI とは' },
  },
};

export const Success: Story = {
  args: {
    state: 'output-available',
    input: { query: 'k8ordo UI とは' },
    output: 'k8o の React UI ライブラリです。',
    defaultOpen: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('出力')).toBeVisible();
  },
};

export const Failed: Story = {
  args: {
    state: 'output-error',
    input: { query: 'k8ordo UI とは' },
    errorText: 'ネットワークエラー',
    defaultOpen: true,
  },
};

export const Denied: Story = {
  args: {
    state: 'output-denied',
    input: { query: 'k8ordo UI とは' },
    approval: { id: 'approval-1', approved: false },
    defaultOpen: true,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('ツールの実行は許可されませんでした。'),
    ).toBeVisible();
  },
};

export const DeniedWithReason: Story = {
  args: {
    state: 'output-denied',
    input: { query: 'k8ordo UI とは' },
    approval: {
      id: 'approval-1',
      approved: false,
      reason: '外部検索は無効になっています',
    },
    defaultOpen: true,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('外部検索は無効になっています'),
    ).toBeVisible();
  },
};

export const ApprovalRequested: Story = {
  args: {
    name: 'delete_file',
    state: 'approval-requested',
    input: { path: 'notes/2026-09.md' },
    approval: { id: 'approval-1' },
    onApprovalResponse: fn(),
  },
  play: async ({ canvas, userEvent, args }) => {
    // 折りたたんだままでも判断できるよう、問いとボタンはパネルの外に出る
    const decision = canvas.getByRole('group', { name: 'delete_file' });
    await expect(
      canvas.getByRole('button', { name: /delete_file/u }),
    ).toHaveAttribute('aria-expanded', 'false');
    await expect(decision).toHaveTextContent(
      'このツールの実行を許可しますか？',
    );

    await userEvent.click(canvas.getByRole('button', { name: '許可' }));

    await expect(args.onApprovalResponse).toHaveBeenCalledWith({
      id: 'approval-1',
      approved: true,
    });
  },
};

export const ApprovalDeny: Story = {
  args: {
    ...ApprovalRequested.args,
    onApprovalResponse: fn(),
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: '拒否' }));

    await expect(args.onApprovalResponse).toHaveBeenCalledWith({
      id: 'approval-1',
      approved: false,
    });
  },
};

export const ApprovalWithRequestReason: Story = {
  args: {
    ...ApprovalRequested.args,
    approval: {
      id: 'approval-1',
      requestReason: 'notes/2026-09.md を完全に削除します。',
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('notes/2026-09.md を完全に削除します。'),
    ).toBeVisible();
  },
};

export const ApprovalWhileAnswering: Story = {
  args: {
    ...ApprovalRequested.args,
    // 答えを送り終わるまで返らない。その間に二度答えられないことを見る
    onApprovalResponse: () =>
      new Promise<void>(() => {
        /* never settles */
      }),
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '許可' }));

    await expect(canvas.getByRole('button', { name: '許可' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: '拒否' })).toBeDisabled();
  },
};

export const AutomaticApproval: Story = {
  args: {
    ...ApprovalRequested.args,
    approval: { id: 'approval-1', isAutomatic: true },
  },
  play: async ({ canvas }) => {
    // 自動で判断されるので、利用者が答えるボタンは出さない
    await expect(
      canvas.queryByRole('button', { name: '許可' }),
    ).not.toBeInTheDocument();
    await expect(canvas.queryByRole('group')).not.toBeInTheDocument();
  },
};

export const ApprovalWithoutHandler: Story = {
  args: {
    ...ApprovalRequested.args,
    onApprovalResponse: undefined,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('このツールの実行を許可しますか？'),
    ).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: '許可' }),
    ).not.toBeInTheDocument();
  },
};

export const Collapsed: Story = {
  args: {
    state: 'output-available',
    input: { query: 'k8ordo UI とは' },
    output: '結果',
  },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /search_web/u });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
};
