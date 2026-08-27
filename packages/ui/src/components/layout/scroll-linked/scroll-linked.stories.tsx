import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect, waitFor, within } from 'storybook/test';

import { ScrollLinked } from './scroll-linked';

const meta: Meta<typeof ScrollLinked> = {
  title: 'components/layout/scroll-linked',
  component: ScrollLinked,
};

export default meta;
type Story = StoryObj<typeof ScrollLinked>;

export const NoScroll: Story = {
  // With no scroll the screenshot is a blank page (the bar rests at scale 0).
  parameters: { vrt: { skip: true } },
};

export const Scroll: Story = {
  decorators: [
    (Story) => (
      <div className="h-lvh overflow-y-scroll">
        <Story />
      </div>
    ),
  ],
  // キャプチャが撮影時のルートスクロール位置に依存して非決定的にならないよう、
  // ページ末尾まで進めてバーが伸び切った状態に固定する
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector<HTMLElement>(
      'div[aria-hidden="true"]',
    );
    if (!bar) {
      throw new Error('progress bar not found');
    }
    const root = document.scrollingElement;
    if (!root) {
      throw new Error('scrolling element not found');
    }
    root.scrollTop = root.scrollHeight;
    await waitFor(() => {
      // eslint-disable-next-line unicorn/prefer-number-coercion -- scale は "0.5 1" の2成分値になり得るので先頭(X)成分だけを読む
      expect(Number.parseFloat(getComputedStyle(bar).scale)).toBeCloseTo(1, 2);
    });
  },
};

export const WithContainer: Story = {
  decorators: [
    (Story) => {
      const containerRef = useRef<HTMLDivElement>(null);
      return (
        <div>
          <section
            aria-label="スクロールコンテナの例"
            className="border-border-mute relative h-96 overflow-y-scroll rounded-lg border"
            ref={containerRef}
            // キーボードでもスクロールできるよう section にフォーカスを許可
            // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
          >
            <Story args={{ container: containerRef }} />
            <div className="h-[200vh] p-4">
              <h2 className="mb-4 text-xl font-bold">
                コンテナ内スクロールの例
              </h2>
              <p className="mb-4">
                このコンテナ内をスクロールすると、上部にプログレスバーが表示されます。
              </p>
              <p className="mb-4">
                プログレスバーはウィンドウではなく、このコンテナのスクロール位置を追跡します。
              </p>
              <div className="mt-8 space-y-4">
                {Array.from({ length: 20 }, (_, i) => (
                  <p className="bg-bg-mute rounded-lg p-4" key={`content-${i}`}>
                    コンテンツブロック {i + 1}
                  </p>
                ))}
              </div>
            </div>
          </section>
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByLabelText('スクロールコンテナの例');
    const bar = canvasElement.querySelector<HTMLElement>(
      'div[aria-hidden="true"]',
    );
    if (!bar) {
      throw new Error('progress bar not found');
    }
    // コンテナのスクロールに追従する
    scroller.scrollTop = (scroller.scrollHeight - scroller.clientHeight) / 2;
    await waitFor(() => {
      // eslint-disable-next-line unicorn/prefer-number-coercion -- scale は "0.5 1" の2成分値なので先頭(X)成分だけを読む
      expect(Number.parseFloat(bar.style.scale)).toBeCloseTo(0.5, 1);
    });
    // スクロールせずコンテンツの高さが変わっても ResizeObserver 経由で
    // 進捗率が再計算される（コンテンツ倍増でおよそ半分の進捗率に下がる）
    const content = scroller.querySelector<HTMLElement>('.h-\\[200vh\\]');
    if (!content) {
      throw new Error('content not found');
    }
    content.style.height = '400vh';
    await waitFor(() => {
      // eslint-disable-next-line unicorn/prefer-number-coercion -- scale は "0.5 1" の2成分値なので先頭(X)成分だけを読む
      expect(Number.parseFloat(bar.style.scale)).toBeLessThan(0.35);
    });
  },
};
