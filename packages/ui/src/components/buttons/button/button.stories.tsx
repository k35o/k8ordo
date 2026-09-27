import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FC, MouseEvent, MouseEventHandler } from 'react';
import { useRef, useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { CopyIcon } from '../../icons';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'components/buttons/button',
  component: Button,
  args: {
    type: 'button',
    onClick: () => {
      console.warn('clicked');
    },
  },
  render: (props) => <Button {...props}>ボタン</Button>,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    color: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const OutlineSecondary: Story = {
  args: {
    color: 'secondary',
    variant: 'outline',
  },
};

export const Skeleton: Story = {
  args: {
    variant: 'skeleton',
  },
};

export const Base: Story = {
  args: {
    color: 'base',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toHaveClass('bg-bg-subtle');
  },
};

export const OutlineBase: Story = {
  args: {
    color: 'base',
    variant: 'outline',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toHaveClass('border-border-base');
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvas }) => {
    // 利用者が渡した disabled は保留と違い、ネイティブの disabled にする
    await expect(canvas.getByRole('button')).toBeDisabled();
  },
};
export const DisabledOutline: Story = {
  args: {
    variant: 'outline',
    disabled: true,
  },
};

export const DisabledSkeleton: Story = {
  args: {
    variant: 'skeleton',
    disabled: true,
  },
};

export const StartIcon: Story = {
  args: {
    startIcon: <CopyIcon />,
  },
};

export const EndIcon: Story = {
  args: {
    endIcon: <CopyIcon />,
  },
};

export const AsyncAction: Story = {
  args: {
    onAction: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1500);
      });
      console.warn('async action completed');
    },
  },
};

// 返した Promise は play が finishAction を呼ぶまで解決しない。保留のあいだを
// 好きなだけ延ばして、その間の振る舞いを見る
let finishAction = (): void => {};
const actionUntilFinished = (): Promise<void> =>
  new Promise<void>((resolve) => {
    finishAction = resolve;
  });

// Chromium は無効になった要素のフォーカスを描画の更新で外す。2 フレーム待って
// 最初のフレームの更新を越えてからフォーカスを確かめる
const afterRenderingUpdate = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
};

/**
 * `onAction` の保留中も、押したボタンはフォーカスを持ち続ける。押せないことは
 * `aria-disabled` で伝え、もう一度押しても `onAction` は走らない。
 */
export const PendingKeepsFocus: Story = {
  args: {
    onAction: fn(actionUntilFinished),
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'ボタン' });

    await userEvent.tab();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await afterRenderingUpdate();
    await expect(button).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await userEvent.click(button);
    await expect(args.onAction).toHaveBeenCalledOnce();

    // 終わらない transition は後続の transition をすべて待たせるので片付ける
    finishAction();
    await waitFor(() => {
      expect(button).not.toHaveAttribute('aria-busy');
    });
    await expect(button).toHaveFocus();
  },
};

const submitAction = fn(actionUntilFinished);

const SubmitRender: FC = () => (
  <form action={submitAction}>
    <input aria-label="名前" name="name" />
    <Button type="submit">送信</Button>
  </form>
);

/**
 * 送信の保留中も、押した送信ボタンはフォーカスを持ち続ける。ボタンを押し直しても、
 * 入力欄の Enter（暗黙の送信）でも、二重には送らない。
 */
export const SubmitPendingKeepsFocus: Story = {
  render: () => <SubmitRender />,
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: '送信' });

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await afterRenderingUpdate();
    await expect(button).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await userEvent.click(canvas.getByRole('textbox', { name: '名前' }));
    await userEvent.keyboard('{Enter}');
    await expect(submitAction).toHaveBeenCalledOnce();

    finishAction();
    await waitFor(() => {
      expect(button).not.toHaveAttribute('aria-busy');
    });
  },
};

const NativeAttributesRender = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [tagName, setTagName] = useState('');
  return (
    <>
      <Button
        name="action"
        onClick={() => {
          setTagName(ref.current?.tagName ?? '');
        }}
        ref={ref}
        value="save"
      >
        ボタン
      </Button>
      <p>{tagName}</p>
    </>
  );
};

export const NativeAttributes: Story = {
  render: () => <NativeAttributesRender />,
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button');
    await expect(button).toHaveAttribute('name', 'action');
    await expect(button).toHaveAttribute('value', 'save');
    await userEvent.click(button);
    await expect(canvas.getByRole('paragraph')).toHaveTextContent('BUTTON');
  },
};

/**
 * テスト中に実際の遷移でページが閉じないようにするだけのガード。転送された
 * `onClick` は先に呼ぶので、押下の検証には影響しない。
 */
const withoutNavigation =
  (onClick: MouseEventHandler<HTMLElement> | undefined) =>
  (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);
    event.preventDefault();
  };

/**
 * `renderItem` は既定の `<button>` に渡るのと同じ props を受け取る。`<a>` を
 * 描画するときは `<button>` 専用の `disabled` / `type` だけ外して残りを展開
 * すれば、`className` と `children` に加えてクリック処理・`ref`・`aria-*` が
 * そのまま乗る。
 */
export const RenderItemLink: Story = {
  args: {
    id: 'render-item-link',
    onClick: fn(),
    renderItem: ({
      children,
      disabled: _disabled,
      onClick,
      type: _type,
      ...props
    }) => (
      <a href="#render-item" {...props} onClick={withoutNavigation(onClick)}>
        {children}
      </a>
    ),
  },
  play: async ({ args, canvas, userEvent }) => {
    const link = canvas.getByRole('link');

    await expect(link).toHaveAttribute('id', 'render-item-link');
    await expect(link).not.toHaveAttribute('aria-disabled');
    await expect(link).toHaveClass('rounded-full');

    await userEvent.click(link);

    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const RenderItemDisabled: Story = {
  args: {
    disabled: true,
    onClick: fn(),
    renderItem: ({
      children,
      disabled: _disabled,
      onClick,
      type: _type,
      ...props
    }) => (
      <a href="#render-item" {...props} onClick={withoutNavigation(onClick)}>
        {children}
      </a>
    ),
  },
  play: async ({ args, canvas, userEvent }) => {
    const link = canvas.getByRole('link');

    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).toHaveClass('cursor-not-allowed');

    await userEvent.click(link);

    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

const RenderItemButtonRender = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [tagName, setTagName] = useState('');
  return (
    <>
      <Button
        name="action"
        onClick={() => {
          setTagName(ref.current?.tagName ?? '');
        }}
        ref={ref}
        renderItem={(props) => <button {...props} type="button" />}
        value="save"
      >
        ボタン
      </Button>
      <p>{tagName}</p>
    </>
  );
};

/** `<button>` に描画するなら props をそのまま展開でき、ref も届く。 */
export const RenderItemButton: Story = {
  render: () => <RenderItemButtonRender />,
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button');

    await expect(button).toHaveAttribute('name', 'action');
    await expect(button).toHaveAttribute('value', 'save');
    await expect(button).toHaveAttribute('type', 'button');

    await userEvent.click(button);

    await expect(canvas.getByRole('paragraph')).toHaveTextContent('BUTTON');
  },
};
