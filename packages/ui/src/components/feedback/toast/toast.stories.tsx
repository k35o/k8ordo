import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '../../buttons/button';
import { Anchor } from '../../navigation/anchor';
import type { Status } from './../../../types/variables';
import { useToast } from './context';
import type { ToastOptions } from './context';
import { ToastProvider } from './provider';

const ToastTrigger = ({
  label = 'トーストを呼ぶ',
  message = 'トーストを呼びました',
  options,
  tone = 'success',
}: {
  label?: string;
  message?: string;
  options?: ToastOptions;
  tone?: Status;
}) => {
  const { open } = useToast();
  return (
    <Button
      onClick={() => {
        open(tone, message, options);
      }}
    >
      {label}
    </Button>
  );
};

const closestToastItem = (element: HTMLElement) => {
  const item = element.closest('[data-toast-id]');
  if (!(item instanceof HTMLElement)) {
    throw new Error('トーストの外側の要素が渡されました');
  }
  return item;
};

const meta: Meta<typeof ToastProvider> = {
  title: 'components/feedback/toast',
  component: ToastProvider,
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  render: () => <ToastTrigger />,
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const Primary: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'トーストを呼ぶ' }),
    );
    const body = within(canvasElement.ownerDocument.body);
    const toast = await body.findByRole('status');
    await expect(toast).toHaveTextContent('トーストを呼びました');
    // 手動で閉じられる（閉じるボタンが必ず付く）。出現アニメーション完了を待つ
    await waitFor(() => {
      expect(
        within(toast).getByRole('button', { name: '閉じる' }),
      ).toBeVisible();
    });
  },
};

export const Tones: Story = {
  render: () => (
    <div className="flex gap-2">
      <ToastTrigger label="success" message="成功しました" tone="success" />
      <ToastTrigger label="info" message="情報です" tone="info" />
      <ToastTrigger label="warning" message="警告です" tone="warning" />
      <ToastTrigger label="error" message="失敗しました" tone="error" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'success' }));
    await expect(await body.findByRole('status')).toHaveTextContent(
      '成功しました',
    );
    // error / warning は割り込み読み上げの alert ロールになる
    await userEvent.click(canvas.getByRole('button', { name: 'error' }));
    await expect(await body.findByRole('alert')).toHaveTextContent(
      '失敗しました',
    );
  },
};

export const CloseButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'トーストを呼ぶ' }),
    );
    const body = within(canvasElement.ownerDocument.body);
    const toast = await body.findByRole('status');
    await userEvent.click(
      within(toast).getByRole('button', { name: '閉じる' }),
    );
    await waitFor(() => {
      expect(body.queryByRole('status')).not.toBeInTheDocument();
    });
  },
};

export const AutoDismiss: Story = {
  render: () => (
    <ToastTrigger message="500ms で消えます" options={{ duration: 500 }} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'トーストを呼ぶ' }),
    );
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('status')).toBeInTheDocument();
    await waitFor(
      () => {
        expect(body.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  },
};

export const Persistent: Story = {
  render: () => (
    <ToastTrigger
      message="自動では消えません"
      options={{ duration: Number.POSITIVE_INFINITY }}
      tone="error"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'トーストを呼ぶ' }),
    );
    const body = within(canvasElement.ownerDocument.body);
    const toast = await body.findByRole('alert');
    // AutoDismiss(500ms) より十分長く待っても残っていることを確認する
    await new Promise((resolve) => {
      setTimeout(resolve, 1200);
    });
    await expect(toast).toBeVisible();
    // 閉じるボタンでだけ閉じられる
    await userEvent.click(
      within(toast).getByRole('button', { name: '閉じる' }),
    );
    await waitFor(() => {
      expect(body.queryByRole('alert')).not.toBeInTheDocument();
    });
  },
};

export const PauseOnHover: Story = {
  render: () => (
    <ToastTrigger message="ホバー中は消えません" options={{ duration: 1000 }} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'トーストを呼ぶ' }),
    );
    const body = within(canvasElement.ownerDocument.body);
    const toast = await body.findByRole('status');
    // すぐにホバーしてタイマーを止める
    await userEvent.hover(toast);
    await new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
    await expect(body.getByRole('status')).toBeVisible();
    // ホバーを外すと残り時間で自動クローズが再開する
    await userEvent.unhover(toast);
    await waitFor(
      () => {
        expect(body.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  },
};

export const PauseOnFocus: Story = {
  render: () => (
    <ToastTrigger
      message="フォーカス中は消えません"
      options={{ duration: 1000 }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'トーストを呼ぶ' }),
    );
    const body = within(canvasElement.ownerDocument.body);
    const toast = await body.findByRole('status');
    // Tab で閉じるボタンにフォーカスを移すとタイマーが止まる (WCAG 2.2.1)
    await userEvent.tab();
    await expect(
      within(toast).getByRole('button', { name: '閉じる' }),
    ).toHaveFocus();
    await new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
    await expect(body.getByRole('status')).toBeVisible();
    // フォーカスが外れると残り時間で自動クローズが再開する
    await userEvent.tab();
    await waitFor(
      () => {
        expect(body.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  },
};

export const WithAction: Story = {
  render: () => (
    <ToastTrigger
      message="下書きを削除しました"
      options={{
        action: {
          label: '元に戻す',
          renderItem: ({ children }) => (
            <Anchor href="#undo">{children}</Anchor>
          ),
        },
        duration: Number.POSITIVE_INFINITY,
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'トーストを呼ぶ' }),
    );
    const body = within(canvasElement.ownerDocument.body);
    const toast = await body.findByRole('status');
    await waitFor(() => {
      expect(
        within(toast).getByRole('link', { name: '元に戻す' }),
      ).toBeVisible();
    });
  },
};

export const MaxCount: Story = {
  render: () => (
    <ToastTrigger
      message="上限テスト"
      options={{ duration: Number.POSITIVE_INFINITY }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'トーストを呼ぶ' });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    // 6 個目以降を開くと最古が閉じ演出に入り、表示は常に最大 5 個
    await waitFor(() => {
      expect(body.getAllByRole('status')).toHaveLength(5);
    });
  },
};

export const FocusReturnToOpener: Story = {
  render: () => (
    <ToastTrigger
      message="閉じたら起動元に戻ります"
      options={{ duration: Number.POSITIVE_INFINITY }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'トーストを呼ぶ' });
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    const toast = await body.findByRole('status');
    await userEvent.tab();
    await expect(
      within(toast).getByRole('button', { name: '閉じる' }),
    ).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    // 閉じ演出の inert でフォーカスが body に落ちず、起動元に返る (WCAG 2.4.3)
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
    await waitFor(() => {
      expect(body.queryByRole('status')).not.toBeInTheDocument();
    });
  },
};

export const FocusMovesToNextToast: Story = {
  render: () => (
    <div className="flex gap-2">
      <ToastTrigger
        label="先に開く"
        message="先に開いたトースト"
        options={{ duration: Number.POSITIVE_INFINITY }}
        tone="error"
      />
      <ToastTrigger
        label="後に開く"
        message="後に開いたトースト"
        options={{ duration: Number.POSITIVE_INFINITY }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: '先に開く' }));
    await userEvent.click(canvas.getByRole('button', { name: '後に開く' }));
    const firstToast = await body.findByRole('alert');
    const secondToast = await body.findByRole('status');
    await userEvent.tab();
    await expect(
      within(firstToast).getByRole('button', { name: '閉じる' }),
    ).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    // 残っているトーストがあれば起動元より優先してそちらへ返す
    await waitFor(() => {
      expect(
        within(secondToast).getByRole('button', { name: '閉じる' }),
      ).toHaveFocus();
    });
  },
};

const OverflowRender = () => {
  const { open } = useToast();
  const openToast = (message: string) => {
    open('success', message, { duration: Number.POSITIVE_INFINITY });
  };
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          for (const index of [1, 2, 3, 4, 5]) {
            openToast(`トースト${index}`);
          }
        }}
      >
        5件開く
      </Button>
      <Button
        onClick={() => {
          // フォーカスをトースト内に置いたまま 6 件目を開くため遅延させる
          window.setTimeout(() => {
            openToast('トースト6');
          }, 400);
        }}
      >
        遅れて6件目
      </Button>
    </div>
  );
};

export const OverflowHeldWhileFocused: Story = {
  render: () => <OverflowRender />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: '5件開く' }));
    await waitFor(() => {
      expect(body.getAllByRole('status')).toHaveLength(5);
    });
    const oldest = closestToastItem(await body.findByText('トースト1'));
    await userEvent.click(canvas.getByRole('button', { name: '遅れて6件目' }));
    await userEvent.tab();
    const oldestClose = within(oldest).getByRole('button', { name: '閉じる' });
    await expect(oldestClose).toHaveFocus();
    // フォーカス中は上限を超えても追い出さない（操作中の要素が黙って消えない）
    await waitFor(
      () => {
        expect(body.getAllByRole('status')).toHaveLength(6);
      },
      { timeout: 3000 },
    );
    await expect(oldestClose).toHaveFocus();
    // フォーカスが外れた時点で保留していた追い出しが走る
    await userEvent.tab({ shift: true });
    await waitFor(() => {
      expect(body.getAllByRole('status')).toHaveLength(5);
    });
    await expect(body.queryByText('トースト1')).not.toBeInTheDocument();
  },
};

export const LiveRegionStructure: Story = {
  render: () => (
    <div className="flex gap-2">
      <ToastTrigger label="success" message="成功しました" tone="success" />
      <ToastTrigger label="error" message="失敗しました" tone="error" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'success' }));
    const status = await body.findByRole('status');
    // viewport は名前付きのコンテナに徹し、読み上げは各トーストの role が担う。
    // ライブリージョンを入れ子にしない
    const viewport = body.getByRole('region', { name: '通知' });
    await expect(viewport).not.toHaveAttribute('aria-live');
    await expect(viewport.querySelectorAll('[aria-live]')).toHaveLength(0);
    await expect(status.closest('[aria-live]')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'error' }));
    const alert = await body.findByRole('alert');
    await expect(alert.closest('[aria-live]')).toBeNull();
    await expect(closestToastItem(alert).parentElement).toBe(viewport);
  },
};
