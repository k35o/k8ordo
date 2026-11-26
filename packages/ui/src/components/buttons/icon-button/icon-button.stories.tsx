import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MouseEvent, MouseEventHandler } from 'react';
import { useRef, useState } from 'react';
import { expect, fn, screen, waitFor } from 'storybook/test';

import { afterRenderingUpdate } from '../../../../.storybook/rendering';
import { CopyIcon } from '../../icons/copy';
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

/**
 * `action` の保留中も、押したボタンはフォーカスを持ち続ける。押せないことは
 * `aria-disabled` で伝え、もう一度押しても `action` は走らない。
 */
export const PendingKeepsFocus: Story = {
  args: {
    action: fn(actionUntilFinished),
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
      await expect(args.action).toHaveBeenCalledOnce();
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
  (onClick: MouseEventHandler<HTMLAnchorElement> | undefined) =>
  (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    event.preventDefault();
  };

const linkClick = fn();
const linkMouseEnter = fn();

/**
 * `href` があれば `<a>` を描く。`label` は `<a>` の名前になり、tooltip も付く。
 */
export const Link: Story = {
  render: () => (
    <IconButton
      href="#icon-link"
      label="コピー"
      onClick={withoutNavigation(linkClick)}
      onMouseEnter={linkMouseEnter}
    >
      <CopyIcon />
    </IconButton>
  ),
  play: async ({ canvas, userEvent }) => {
    linkClick.mockClear();
    linkMouseEnter.mockClear();
    const link = canvas.getByRole('link', { name: 'コピー' });

    await expect(link).toHaveAttribute('href', '#icon-link');

    await userEvent.hover(link);

    await expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'コピー',
    );
    await expect(linkMouseEnter).toHaveBeenCalled();

    await userEvent.click(link);

    await expect(linkClick).toHaveBeenCalled();
  },
};

const disabledLinkClick = fn();

export const LinkDisabled: Story = {
  render: () => (
    <IconButton
      disabled
      href="#disabled-icon-link"
      label="コピー"
      onClick={disabledLinkClick}
      tooltipDisabled
    >
      <CopyIcon />
    </IconButton>
  ),
  play: async ({ canvas, userEvent }) => {
    disabledLinkClick.mockClear();
    const link = canvas.getByRole('link', { name: 'コピー' });

    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).toHaveStyle({ cursor: 'not-allowed' });

    await userEvent.click(link);

    await expect(disabledLinkClick).not.toHaveBeenCalled();
    await expect(window.location.hash).not.toBe('#disabled-icon-link');
  },
};

/**
 * `renderAnchor` は tooltip の配線ごと `<a>` に渡る props を受け取る。
 * 展開すれば、リンク部品にも tooltip が付く。
 */
export const RenderAnchor: Story = {
  render: () => (
    <IconButton
      href="#render-anchor"
      label="コピー"
      renderAnchor={({ children, href, onClick, ...props }) => (
        <a
          {...props}
          data-rendered=""
          href={href}
          onClick={withoutNavigation(onClick)}
        >
          {children}
        </a>
      )}
    >
      <CopyIcon />
    </IconButton>
  ),
  play: async ({ canvas, userEvent }) => {
    const link = canvas.getByRole('link', { name: 'コピー' });

    await expect(link).toHaveAttribute('data-rendered');

    await userEvent.hover(link);

    await expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'コピー',
    );
  },
};
