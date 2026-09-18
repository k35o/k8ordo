import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FC } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import { InView } from '.';

const meta: Meta<typeof InView> = {
  title: 'components/observers/in-view',
  component: InView,
  // 自分では何も描かないので、スクリーンショットで確かめられることが無い
  parameters: { vrt: { skip: true } },
};

export default meta;
type Story = StoryObj<typeof InView>;

// IntersectionObserver の通知はレンダリング更新のあとのタスクで届く。
// 「呼ばれないこと」を確かめる前に 2 フレーム待ち、届くはずの通知を出し切らせる。
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

// 高さ 160px のスクロール領域。上下に 400px の余白を置き、対象を
// scrollTop で出し入れする。ページのビューポートに左右されないよう root に渡す。
const VIEWPORT = 160;
const SPACER = 400;
const BOX = 40;

const Single: FC<{
  onChange: (isInView: boolean) => void;
  once?: boolean;
}> = ({ onChange, once }) => {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  return (
    <section
      aria-label="スクロール領域"
      data-testid="scroller"
      ref={setRoot}
      style={{ height: VIEWPORT, overflowY: 'auto' }}
      // キーボードでもスクロールできるよう section にフォーカスを許可
      // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <div style={{ height: SPACER }} />
      <InView once={once} onChange={onChange} root={root}>
        <div style={{ height: BOX }}>対象</div>
      </InView>
      <div style={{ height: SPACER }} />
    </section>
  );
};

export const Default: Story = {
  args: { onChange: fn() },
  render: ({ onChange }) => <Single onChange={onChange} />,
  play: async ({ args, canvas }) => {
    const scroller = canvas.getByTestId('scroller');
    // 観測を始めた時点の状態を、変化を待たずに 1 回報告する。root が null から
    // 要素へ変わって張り直しても、同じ値を重ねて報告しない。
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(false);
    });
    await settle();
    await expect(args.onChange).toHaveBeenCalledTimes(1);

    scroller.scrollTop = SPACER - BOX;
    await waitFor(() => {
      expect(args.onChange).toHaveBeenLastCalledWith(true);
    });

    scroller.scrollTop = 0;
    await waitFor(() => {
      expect(args.onChange).toHaveBeenLastCalledWith(false);
    });
    await expect(args.onChange).toHaveBeenCalledTimes(3);
  },
};

// once: 一度見えたら観測をやめ、外れても false を報告しない。
export const Once: Story = {
  args: { onChange: fn() },
  render: ({ onChange }) => <Single once onChange={onChange} />,
  play: async ({ args, canvas }) => {
    const scroller = canvas.getByTestId('scroller');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(false);
    });

    // 初回の false のあと、見えた時点の true で観測をやめる
    scroller.scrollTop = SPACER - BOX;
    await waitFor(() => {
      expect(args.onChange).toHaveBeenLastCalledWith(true);
    });
    await expect(args.onChange).toHaveBeenCalledTimes(2);

    scroller.scrollTop = 0;
    await settle();
    await expect(args.onChange).toHaveBeenCalledTimes(2);
  },
};

const Remargined: FC<{
  onChange: (isInView: boolean) => void;
}> = ({ onChange }) => {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [rootMargin, setRootMargin] = useState('0px');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        onClick={() => {
          setRootMargin('8px');
        }}
        type="button"
      >
        余白を広げる
      </button>
      <section
        aria-label="スクロール領域"
        data-testid="scroller"
        ref={setRoot}
        style={{ height: VIEWPORT, overflowY: 'auto' }}
        // キーボードでもスクロールできるよう section にフォーカスを許可
        // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <div style={{ height: SPACER }} />
        <InView onChange={onChange} root={root} rootMargin={rootMargin}>
          <div style={{ height: BOX }}>対象</div>
        </InView>
        <div style={{ height: SPACER }} />
      </section>
    </div>
  );
};

// 見えている間に observer を張り直しても、外れたとは報告しない。
export const ReobservedWhileInView: Story = {
  args: { onChange: fn() },
  render: ({ onChange }) => <Remargined onChange={onChange} />,
  play: async ({ args, canvas, userEvent }) => {
    const scroller = canvas.getByTestId('scroller');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(false);
    });

    scroller.scrollTop = SPACER - BOX;
    await waitFor(() => {
      expect(args.onChange).toHaveBeenLastCalledWith(true);
    });

    await userEvent.click(canvas.getByRole('button', { name: '余白を広げる' }));
    await settle();
    await expect(args.onChange).toHaveBeenCalledTimes(2);
  },
};

const Pair: FC<{
  onChange: (isInView: boolean) => void;
}> = ({ onChange }) => {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [hasA, setHasA] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        onClick={() => {
          setHasA(false);
        }}
        type="button"
      >
        A を外す
      </button>
      <section
        aria-label="スクロール領域"
        data-testid="scroller"
        ref={setRoot}
        style={{ height: VIEWPORT, overflowY: 'auto' }}
        // キーボードでもスクロールできるよう section にフォーカスを許可
        // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <div style={{ height: SPACER }} />
        <InView onChange={onChange} root={root}>
          {hasA ? <div style={{ height: BOX }}>A</div> : null}
          {/* 余白を margin で作るのは、間に要素を挟むとそれも観測対象になるため */}
          <div style={{ height: BOX, marginTop: SPACER }}>B</div>
        </InView>
        <div style={{ height: SPACER }} />
      </section>
    </div>
  );
};

// 子が複数あるときは、どれか 1 つが見えていれば true。
export const Some: Story = {
  args: { onChange: fn() },
  render: ({ onChange }) => <Pair onChange={onChange} />,
  play: async ({ args, canvas }) => {
    const scroller = canvas.getByTestId('scroller');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(false);
    });

    // A だけが見えていて、B は SPACER だけ下にある
    scroller.scrollTop = SPACER;
    await waitFor(() => {
      expect(args.onChange).toHaveBeenLastCalledWith(true);
    });
  },
};

// 見えていた子が外れて、残りがどれも見えていなければ false に戻る。
export const SomeAfterRemoval: Story = {
  args: { onChange: fn() },
  render: ({ onChange }) => <Pair onChange={onChange} />,
  play: async ({ args, canvas, userEvent }) => {
    const scroller = canvas.getByTestId('scroller');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(false);
    });

    scroller.scrollTop = SPACER;
    await waitFor(() => {
      expect(args.onChange).toHaveBeenLastCalledWith(true);
    });

    await userEvent.click(canvas.getByRole('button', { name: 'A を外す' }));
    await waitFor(() => {
      expect(args.onChange).toHaveBeenLastCalledWith(false);
    });
  },
};

// 外れた子が「交差していない」と通知されないままでも false に戻る。
export const SomeAfterUnreportedRemoval: Story = {
  args: { onChange: fn() },
  // React は外れた子の unobserve をペイント後まで遅らせるが、負荷が高いと交差の
  // 計算より先に走り、その子の最後の通知が失われる。タイミングでは再現できない
  // ので、外れた子への通知を落とす IntersectionObserver に差し替えて毎回そうする。
  beforeEach: () => {
    const Native = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = class extends Native {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        super((entries, observer) => {
          const delivered = entries.filter((entry) => entry.target.isConnected);
          if (delivered.length > 0) {
            callback(delivered, observer);
          }
        }, options);
      }
    };
    return () => {
      globalThis.IntersectionObserver = Native;
    };
  },
  render: ({ onChange }) => <Pair onChange={onChange} />,
  play: async ({ args, canvas, userEvent }) => {
    const scroller = canvas.getByTestId('scroller');
    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalledWith(false);
    });

    scroller.scrollTop = SPACER;
    await waitFor(() => {
      expect(args.onChange).toHaveBeenLastCalledWith(true);
    });

    await userEvent.click(canvas.getByRole('button', { name: 'A を外す' }));
    await waitFor(() => {
      expect(args.onChange).toHaveBeenLastCalledWith(false);
    });
  },
};

// 観測する host ノードが無い間は、空集合を「全部見えている」とみなさない。
export const Empty: Story = {
  args: { onChange: fn() },
  render: ({ onChange }) => <InView onChange={onChange}>{null}</InView>,
  play: async ({ args }) => {
    await settle();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

const Added: FC<{
  onChange: (isInView: boolean) => void;
}> = ({ onChange }) => {
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
      <InView onChange={onChange}>
        {isShown ? <div style={{ height: BOX }}>対象</div> : null}
      </InView>
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
      expect(args.onChange).toHaveBeenLastCalledWith(true);
    });
  },
};
