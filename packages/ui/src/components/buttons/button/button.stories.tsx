import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MouseEvent, MouseEventHandler } from 'react';
import { useRef, useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { TextField } from '../../form/text-field';
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
    onAction: fn(() => action),
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'ボタン' });
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

let submission = Promise.resolve();
let finishSubmission = () => {};
const submit = fn(() => submission);

// テキスト欄の Enter による暗黙の送信は、既定のボタンへの click として届く。
// 送信中のボタンはネイティブの disabled ではないので、その click を自分で断る
export const EnterWhileSubmitting: Story = {
  render: () => (
    <form action={submit} className="flex items-center gap-2">
      <TextField aria-label="名前" name="name" />
      <Button type="submit">送信</Button>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    submit.mockClear();
    const button = canvas.getByRole('button', { name: '送信' });
    submission = new Promise<void>((resolve) => {
      finishSubmission = resolve;
    });
    try {
      await userEvent.click(canvas.getByRole('textbox', { name: '名前' }));
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(button).toHaveAttribute('aria-busy', 'true'));

      await userEvent.keyboard('{Enter}');

      await expect(submit).toHaveBeenCalledOnce();
    } finally {
      finishSubmission();
    }

    await waitFor(() => expect(button).not.toHaveAttribute('aria-busy'));
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
