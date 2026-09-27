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

// Chromium は、フォーカスを持った要素が無効になっても、その場では外さず、
// 描画の更新の終わりで外す。rAF のコールバックはそれより前に走るので、
// 1 フレーム待っただけでは外れたかどうかがまだ分からない
const waitTwoFrames = async () => {
  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);
};

// play が片付けるまで保留が続く。二度呼ばれても同じ Promise を待たせ、
// 片付け 1 回で済むようにする
let action = Promise.resolve();
let finishAction = () => {};

export const FocusWhilePending: Story = {
  args: {
    tooltipDisabled: true,
    onAction: fn(() => action),
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'コピー' });
    action = new Promise<void>((resolve) => {
      finishAction = resolve;
    });
    try {
      await userEvent.tab();
      await userEvent.keyboard('{Enter}');
      await waitTwoFrames();

      // 保留中も、押したボタンはフォーカスを持ったまま、二度目を受け付けない
      await expect(button).toHaveAttribute('aria-busy', 'true');
      await expect(button).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await expect(args.onAction).toHaveBeenCalledOnce();
    } finally {
      // 終わらない非同期の transition は、同じ React の後続の transition を
      // すべて待たせる。途中で落ちても後のストーリーを巻き込まないよう片付ける
      finishAction();
    }

    await waitFor(() => expect(button).not.toHaveAttribute('aria-busy'));
    await expect(button).toHaveFocus();
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
