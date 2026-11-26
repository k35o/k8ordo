import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FC, MouseEvent, MouseEventHandler } from 'react';
import { useRef, useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { afterRenderingUpdate } from '../../../../.storybook/rendering';
import { tokenColor } from '../../../../.storybook/tokens';
import { CopyIcon } from '../../icons/copy';
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
    await expect(
      getComputedStyle(canvas.getByRole('button')).backgroundColor,
    ).toBe(tokenColor('--color-bg-subtle'));
  },
};

export const OutlineBase: Story = {
  args: {
    color: 'base',
    variant: 'outline',
  },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByRole('button')).borderColor).toBe(
      tokenColor('--color-border-base'),
    );
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

    try {
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
    } finally {
      // 終わらない非同期の transition は、同じ React の後続の transition を
      // すべて待たせる。途中で落ちても後のストーリーを巻き込まないよう片付ける
      finishAction();
    }
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
  (onClick: MouseEventHandler<HTMLAnchorElement> | undefined) =>
  (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    event.preventDefault();
  };

const linkClick = fn();

/**
 * `href` があれば `<a>` を描く。ボタンと同じ見た目で、残りの属性は `<a>` に渡る。
 */
export const Link: Story = {
  render: () => (
    <Button
      href="#link"
      id="button-link"
      onClick={(event) => {
        linkClick();
        event.preventDefault();
      }}
    >
      リンク
    </Button>
  ),
  play: async ({ canvas, userEvent }) => {
    linkClick.mockClear();
    const link = canvas.getByRole('link', { name: 'リンク' });

    await expect(link).toHaveAttribute('href', '#link');
    await expect(link).toHaveAttribute('id', 'button-link');
    await expect(link).not.toHaveAttribute('type');
    await expect(link).not.toHaveAttribute('aria-disabled');
    // ボタンと同じクラスで、ボタンの枠線で描かれる
    await expect(link).toHaveStyle({ borderTopWidth: '2px' });

    await userEvent.click(link);

    await expect(linkClick).toHaveBeenCalledOnce();
  },
};

const disabledLinkClick = fn();

/**
 * `<a>` には `disabled` が無いので、`aria-disabled` を付け、押しても遷移させない。
 */
export const LinkDisabled: Story = {
  render: () => (
    <Button disabled href="#disabled-link" onClick={disabledLinkClick}>
      リンク
    </Button>
  ),
  play: async ({ canvas, userEvent }) => {
    disabledLinkClick.mockClear();
    const link = canvas.getByRole('link', { name: 'リンク' });

    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).toHaveStyle({ cursor: 'not-allowed' });

    await userEvent.click(link);

    await expect(disabledLinkClick).not.toHaveBeenCalled();
    await expect(window.location.hash).not.toBe('#disabled-link');
  },
};

const renderedClick = fn();

/**
 * `renderAnchor` は `<a>` に渡るのと同じ props を受け取る。Next.js の `Link` の
 * ようなリンク部品に、そのまま展開できる。
 */
export const RenderAnchor: Story = {
  render: () => (
    <Button
      href="#render-anchor"
      onClick={renderedClick}
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
      variant="outline"
    >
      リンク
    </Button>
  ),
  play: async ({ canvas, userEvent }) => {
    renderedClick.mockClear();
    const link = canvas.getByRole('link', { name: 'リンク' });

    await expect(link).toHaveAttribute('data-rendered');
    await expect(link).toHaveAttribute('href', '#render-anchor');
    await expect(link).toHaveStyle({ borderTopWidth: '2px' });

    await userEvent.click(link);

    await expect(renderedClick).toHaveBeenCalledOnce();
  },
};

/**
 * `type="reset"` は属するフォームを既定値に戻す。送信ではないので、フォームの
 * 送信中も保留にならない。
 */
export const Reset: Story = {
  render: () => (
    <form>
      <input aria-label="名前" defaultValue="初期値" name="name" />
      <Button type="reset" variant="outline">
        戻す
      </Button>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: '名前' });
    const button = canvas.getByRole('button', { name: '戻す' });

    await expect(button).toHaveAttribute('type', 'reset');
    await userEvent.clear(input);
    await userEvent.type(input, '書き換え');
    await userEvent.click(button);

    await expect(input).toHaveValue('初期値');
  },
};

const resetWhileSubmitting = fn(actionUntilFinished);

const ResetWhileSubmittingRender: FC = () => (
  <form action={resetWhileSubmitting}>
    <Button type="submit">送信</Button>
    <Button type="reset" variant="outline">
      戻す
    </Button>
  </form>
);

export const ResetWhileSubmitting: Story = {
  render: () => <ResetWhileSubmittingRender />,
  play: async ({ canvas, userEvent }) => {
    const submit = canvas.getByRole('button', { name: '送信' });
    const reset = canvas.getByRole('button', { name: '戻す' });

    try {
      await userEvent.click(submit);
      await waitFor(() => {
        expect(submit).toHaveAttribute('aria-busy', 'true');
      });
      await expect(reset).not.toHaveAttribute('aria-busy');
      await expect(reset).not.toHaveAttribute('aria-disabled');
    } finally {
      // 終わらない非同期の transition は、同じ React の後続の transition を
      // すべて待たせる。途中で落ちても後のストーリーを巻き込まないよう片付ける
      finishAction();
    }
    await waitFor(() => {
      expect(submit).not.toHaveAttribute('aria-busy');
    });
  },
};
