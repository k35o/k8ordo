import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MouseEvent, MouseEventHandler } from 'react';
import { useRef, useState } from 'react';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { CopyIcon } from '../../icons';
import { IconButton } from './icon-button';

const meta: Meta<typeof IconButton> = {
  title: 'components/buttons/icon-button',
  component: IconButton,
  args: {
    label: 'コピー',
    children: <CopyIcon />,
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

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
    await expect(canvas.getByRole('button', { name: 'コピー' })).toBeDisabled();
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
    const button = canvas.getByRole('button', { name: 'コピー' });

    try {
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
    } finally {
      // 終わらない非同期の transition は、同じ React の後続の transition を
      // すべて待たせる。途中で落ちても後のストーリーを巻き込まないよう片付ける
      finishAction();
    }
    await waitFor(() => {
      expect(button).not.toHaveAttribute('aria-busy');
    });
    await expect(button).toHaveFocus();
  },
};

export const ColorBase: Story = {
  args: {
    color: 'base',
  },
};

export const ColorPrimary: Story = {
  args: {
    color: 'primary',
  },
};

export const ColorSecondary: Story = {
  args: {
    color: 'secondary',
  },
};

const NativeAttributesRender = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [tagName, setTagName] = useState('');
  return (
    <>
      <IconButton
        label="コピー"
        name="action"
        onClick={() => {
          setTagName(ref.current?.tagName ?? '');
        }}
        ref={ref}
        tooltipDisabled
        value="copy"
      >
        <CopyIcon />
      </IconButton>
      <p>{tagName}</p>
    </>
  );
};

export const NativeAttributes: Story = {
  render: () => <NativeAttributesRender />,
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'コピー' });
    await expect(button).toHaveAttribute('name', 'action');
    await expect(button).toHaveAttribute('value', 'copy');
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
 * `renderItem` は既定の `<button>` に渡るのと同じ props を受け取り、tooltip の
 * 配線だけが `triggerProps` に入る。`<a>` を描画するときは `<button>` 専用の
 * `disabled` / `type` を外し、残りと `triggerProps` の両方を展開する。
 */
export const RenderItemLink: Story = {
  args: {
    onClick: fn(),
    onMouseEnter: fn(),
    renderItem: ({
      children,
      disabled: _disabled,
      triggerProps,
      type: _type,
      ...props
    }) => (
      <a
        href="#render-item"
        {...props}
        {...triggerProps}
        onClick={withoutNavigation(props.onClick)}
      >
        {children}
      </a>
    ),
  },
  play: async ({ args, canvas, userEvent }) => {
    const link = canvas.getByRole('link', { name: 'コピー' });

    await userEvent.hover(link);

    // triggerProps を展開したので tooltip が開き、利用者のハンドラも連結される。
    await expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'コピー',
    );
    await expect(args.onMouseEnter).toHaveBeenCalled();

    await userEvent.click(link);

    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const RenderItemDisabled: Story = {
  args: {
    disabled: true,
    tooltipDisabled: true,
    onClick: fn(),
    renderItem: ({
      children,
      disabled: _disabled,
      triggerProps,
      type: _type,
      ...props
    }) => (
      <a
        href="#render-item"
        {...props}
        {...triggerProps}
        onClick={withoutNavigation(props.onClick)}
      >
        {children}
      </a>
    ),
  },
  play: async ({ args, canvas, userEvent }) => {
    const link = canvas.getByRole('link', { name: 'コピー' });

    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).toHaveClass('cursor-not-allowed');

    await userEvent.click(link);

    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
