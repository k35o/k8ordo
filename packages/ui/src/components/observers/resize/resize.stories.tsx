import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FC } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { Resize } from '.';

const meta: Meta<typeof Resize> = {
  title: 'components/observers/resize',
  component: Resize,
  // 自分では何も描かないので、スクリーンショットで確かめられることが無い
  parameters: { vrt: { skip: true } },
};

export default meta;
type Story = StoryObj<typeof Resize>;

// ResizeObserver の通知はレンダリング更新のあとのタスクで届く。
// 回数を確かめる前に 2 フレーム待ち、届くはずの通知を出し切らせる。
const settle = async (): Promise<void> => {
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

const Growable: FC<{ onChange: () => void }> = ({ onChange }) => {
  const [isWide, setIsWide] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        onClick={() => {
          setIsWide(true);
        }}
        type="button"
      >
        広げる
      </button>
      <Resize onChange={onChange}>
        <div style={{ height: 40, width: isWide ? 320 : 160 }}>対象</div>
      </Resize>
    </div>
  );
};

export const Default: Story = {
  args: { onChange: fn() },
  render: ({ onChange }) => <Growable onChange={onChange} />,
  play: async ({ args, canvas, userEvent }) => {
    // ResizeObserver は観測を始めた時点で 1 回通知する
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledTimes(1);
    });
    await settle();
    await expect(args.onChange).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByRole('button', { name: '広げる' }));
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledTimes(2);
    });
  },
};

const Added: FC<{ onChange: () => void }> = ({ onChange }) => {
  const [isShown, setIsShown] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        onClick={() => {
          setIsShown(true);
        }}
        type="button"
      >
        表示する
      </button>
      <Resize onChange={onChange}>
        {isShown ? <div style={{ height: 40, width: 160 }}>対象</div> : null}
      </Resize>
    </div>
  );
};

// 後からマウントされた子も、張り直しなしで観測される。
export const AddedLater: Story = {
  args: { onChange: fn() },
  render: ({ onChange }) => <Added onChange={onChange} />,
  play: async ({ args, canvas, userEvent }) => {
    await settle();
    await expect(args.onChange).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('button', { name: '表示する' }));
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledTimes(1);
    });
  },
};
